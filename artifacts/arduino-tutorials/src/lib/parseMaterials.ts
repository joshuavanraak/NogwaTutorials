export type ParsedMaterialItem = {
  qty: number;
  qtyText: string;
  name: string;
  raw: string;
};

export type ParsedMaterials = {
  items: ParsedMaterialItem[];
  notes: string[];
};

const NOTE_PREFIXES = [
  "bibliotheek",
  "bibliotheken",
  "library",
  "libraries",
  "veiligheid",
  "optioneel",
  "optional",
  "alternatief",
];

// Matches a quantity prefix: "1×", "2x", "2-3×", "2–3x", "2 a 3×".
// Captures: 1 = min number, 2 = max number (optional).
const QTY_RE = /^\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*[×x]\s+/i;

function splitSentences(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const out: string[] = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);

    current += ch;

    if (ch === "." && depth === 0) {
      const next = trimmed[i + 1];
      const after = trimmed[i + 2];
      const isEnd = next === undefined;
      const isBoundary =
        next === " " &&
        after !== undefined &&
        // Treat as boundary if next non-space char looks like a sentence start
        // (uppercase letter, ** for bold, or digit followed by ×).
        (/[A-Z*]/.test(after) || (after === "*" && trimmed[i + 3] === "*"));
      if (isEnd || isBoundary) {
        out.push(current.trim());
        current = "";
        if (next === " ") i++;
      }
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

function splitItems(sentence: string): string[] {
  const out: string[] = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < sentence.length; i++) {
    const ch = sentence[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);

    if (ch === "," && depth === 0) {
      if (current.trim()) out.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

function isNoteSentence(sentence: string): boolean {
  const lower = sentence.toLowerCase().trim();
  if (lower.startsWith("**")) return true;
  // Check for "Word: ..." pattern at the start.
  const colonIdx = sentence.indexOf(":");
  if (colonIdx > 0 && colonIdx <= 25) {
    const prefix = lower.slice(0, colonIdx).trim();
    if (NOTE_PREFIXES.some(p => prefix === p || prefix.startsWith(p))) {
      return true;
    }
  }
  return false;
}

function stripCategoryPrefix(sentence: string): string {
  // e.g. "Voor de toepassingen: potmeter (stap 3), ..."
  // Drop a short "Word(s):" prefix so the tail can be parsed as items.
  const colonIdx = sentence.indexOf(":");
  if (colonIdx > 0 && colonIdx <= 30) {
    const before = sentence.slice(0, colonIdx);
    // Don't strip if the prefix itself looks like an item (contains ×, digits, or commas)
    if (!/[,×x\d]/i.test(before)) {
      return sentence.slice(colonIdx + 1).trim();
    }
  }
  return sentence;
}

function cleanItem(raw: string): ParsedMaterialItem {
  let s = raw.trim();
  // Strip trailing punctuation
  s = s.replace(/[.;]+$/, "").trim();

  let qty = 1;
  let qtyText = "1×";
  const m = s.match(QTY_RE);
  if (m) {
    const min = parseInt(m[1], 10);
    const max = m[2] ? parseInt(m[2], 10) : min;
    // Use the upper bound for ordering totals — safer for bulk purchases.
    qty = Math.max(min, max);
    qtyText = m[2] ? `${min}–${max}×` : `${min}×`;
    s = s.slice(m[0].length).trim();
  }

  return { qty, qtyText, name: s, raw: raw.trim() };
}

export function parseMaterials(materials: string): ParsedMaterials {
  const items: ParsedMaterialItem[] = [];
  const notes: string[] = [];

  const sentences = splitSentences(materials);
  for (const sentence of sentences) {
    if (isNoteSentence(sentence)) {
      notes.push(sentence.replace(/^\*\*|\*\*$/g, "").trim());
      continue;
    }
    const stripped = stripCategoryPrefix(sentence);
    const itemStrs = splitItems(stripped.replace(/\.$/, ""));
    for (const itemStr of itemStrs) {
      if (!itemStr) continue;
      const item = cleanItem(itemStr);
      if (item.name) items.push(item);
    }
  }

  return { items, notes };
}

// Normalize a name for aggregation: lowercase, strip parentheticals,
// collapse whitespace, drop trailing punctuation. Used as the dedup key.
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[*_`]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "")
    .trim();
}

export type AggregatedItem = {
  key: string;
  displayName: string;
  totalQty: number;
  variants: Array<{ tutorialId: string; tutorialTitle: string; qty: number; qtyText: string; name: string }>;
};

export function aggregateMaterials(
  tutorials: Array<{ id: string; title: string; materials: string }>,
): { items: AggregatedItem[]; notes: Array<{ tutorialId: string; tutorialTitle: string; note: string }> } {
  const byKey = new Map<string, AggregatedItem>();
  const allNotes: Array<{ tutorialId: string; tutorialTitle: string; note: string }> = [];

  for (const t of tutorials) {
    const parsed = parseMaterials(t.materials);
    for (const item of parsed.items) {
      const key = normalizeName(item.name);
      if (!key) continue;
      const existing = byKey.get(key);
      if (existing) {
        existing.totalQty += item.qty;
        existing.variants.push({
          tutorialId: t.id,
          tutorialTitle: t.title,
          qty: item.qty,
          qtyText: item.qtyText,
          name: item.name,
        });
        // Keep the longest display name (usually the most descriptive).
        if (item.name.length > existing.displayName.length) {
          existing.displayName = item.name;
        }
      } else {
        byKey.set(key, {
          key,
          displayName: item.name,
          totalQty: item.qty,
          variants: [
            { tutorialId: t.id, tutorialTitle: t.title, qty: item.qty, qtyText: item.qtyText, name: item.name },
          ],
        });
      }
    }
    for (const note of parsed.notes) {
      allNotes.push({ tutorialId: t.id, tutorialTitle: t.title, note });
    }
  }

  const items = Array.from(byKey.values()).sort((a, b) => {
    // Sort by tutorial-count desc, then by qty desc, then alphabetical.
    if (b.variants.length !== a.variants.length) return b.variants.length - a.variants.length;
    if (b.totalQty !== a.totalQty) return b.totalQty - a.totalQty;
    return a.displayName.localeCompare(b.displayName);
  });

  return { items, notes: allNotes };
}
