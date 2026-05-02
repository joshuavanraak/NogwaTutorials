import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, X, Copy, Printer, Check, Trash2, AlertTriangle, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { tutorials } from "../data/tutorials";
import { aggregateMaterials } from "../lib/parseMaterials";
import { cn } from "../lib/utils";

const STORAGE_KEY = "arduino-tutorials:parts-basket:v1";

function loadBasket(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveBasket(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function useBasket() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(loadBasket());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(loadBasket());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const set = (next: string[]) => {
    setIds(next);
    saveBasket(next);
  };

  return {
    ids,
    hydrated,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) =>
      set(ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]),
    add: (id: string) => set(ids.includes(id) ? ids : [...ids, id]),
    remove: (id: string) => set(ids.filter(x => x !== id)),
    clear: () => set([]),
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildAggregatedPlainText(
  selectedTitles: string[],
  items: Array<{ displayName: string; totalQty: number; variants: Array<{ tutorialTitle: string; qty: number; qtyText: string }> }>,
  notes: Array<{ tutorialTitle: string; note: string }>,
): string {
  const lines: string[] = [];
  lines.push("Geaggregeerde onderdelenlijst");
  lines.push("=============================");
  lines.push("");
  lines.push(`Voor ${selectedTitles.length} tutorial${selectedTitles.length === 1 ? "" : "s"}:`);
  for (const t of selectedTitles) lines.push(`  · ${t}`);
  lines.push("");
  lines.push("Onderdelen:");
  for (const item of items) {
    lines.push(`[ ] ${item.totalQty}× ${item.displayName}`);
    if (item.variants.length > 1) {
      const breakdown = item.variants.map(v => `${v.qtyText} ${v.tutorialTitle}`).join(", ");
      lines.push(`     (${item.variants.length} tutorials: ${breakdown})`);
    }
  }
  if (notes.length > 0) {
    lines.push("");
    lines.push("Aandachtspunten:");
    for (const n of notes) lines.push(`- [${n.tutorialTitle}] ${n.note}`);
  }
  return lines.join("\n");
}

function buildAggregatedHtml(
  selectedTitles: string[],
  items: Array<{ displayName: string; totalQty: number; variants: Array<{ tutorialTitle: string; qty: number; qtyText: string }> }>,
  notes: Array<{ tutorialTitle: string; note: string }>,
): string {
  const tutorialsHtml = selectedTitles.map(t => `<li>${escapeHtml(t)}</li>`).join("");
  const itemsHtml = items
    .map(
      (i) => `<li>
      <span class="box"></span>
      <span class="qty">${i.totalQty}×</span>
      <span class="name">${escapeHtml(i.displayName)}</span>
      ${i.variants.length > 1 ? `<span class="meta">${i.variants.length} tutorials</span>` : ""}
    </li>`,
    )
    .join("");
  const notesHtml = notes.length
    ? `<h2>Aandachtspunten</h2><ul class="notes">${notes
        .map(n => `<li><strong>${escapeHtml(n.tutorialTitle)}:</strong> ${escapeHtml(n.note)}</li>`)
        .join("")}</ul>`
    : "";
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8">
<title>Geaggregeerde onderdelenlijst</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color:#0f172a; max-width: 720px; margin: 2em auto; padding: 0 1em; }
  h1 { font-size: 1.7em; margin: 0 0 0.25em; }
  .sub { color:#64748b; margin: 0 0 1em; font-size: 0.95em; }
  .tutorials { font-size: 0.9em; color:#475569; padding-left:1.2em; margin-bottom:1.5em; }
  ul.parts { list-style:none; padding:0; margin:0 0 1em; }
  ul.parts li { padding: 0.6em 0; border-bottom: 1px solid #e2e8f0; display:flex; align-items:center; gap:0.75em; font-size:1.05em; }
  ul.parts .box { display:inline-block; width:1.1em; height:1.1em; border:1.5px solid #475569; border-radius:3px; flex:0 0 auto; }
  ul.parts .qty { font-weight:700; color:#0a84ff; min-width:2.8em; text-align:right; }
  ul.parts .name { flex:1; }
  ul.parts .meta { font-size:0.75em; color:#94a3b8; padding: 0.15em 0.5em; background:#f1f5f9; border-radius:0.6em; }
  h2 { margin-top:1.5em; font-size:1.05em; color:#475569; text-transform: uppercase; letter-spacing:0.05em; }
  ul.notes { padding-left:1.2em; color:#334155; font-size:0.95em; }
  ul.notes li { margin-bottom:0.4em; }
  @media print { body { margin: 1cm; } }
</style></head><body>
<h1>Geaggregeerde onderdelenlijst</h1>
<p class="sub">Bestellijst voor ${selectedTitles.length} tutorial${selectedTitles.length === 1 ? "" : "s"}</p>
<ul class="tutorials">${tutorialsHtml}</ul>
<ul class="parts">${itemsHtml}</ul>
${notesHtml}
</body></html>`;
}

function openPrintWindow(html: string) {
  const w = window.open("", "_blank", "width=720,height=900");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.onload = () => {
    setTimeout(() => {
      w.focus();
      w.print();
    }, 200);
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function PartsBasketModal({ open, onClose, selectedIds, onRemove, onClear }: Props) {
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => selectedIds.map(id => tutorials.find(t => t.id === id)).filter((t): t is (typeof tutorials)[number] => !!t),
    [selectedIds],
  );

  const aggregated = useMemo(() => aggregateMaterials(selected), [selected]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const titles = selected.map(t => t.title);

  const handleCopy = async () => {
    const text = buildAggregatedPlainText(titles, aggregated.items, aggregated.notes);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // noop
      }
      document.body.removeChild(ta);
    }
  };

  const handlePrint = () => {
    openPrintWindow(buildAggregatedHtml(titles, aggregated.items, aggregated.notes));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Geaggregeerde onderdelenlijst"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full md:max-w-2xl md:max-h-[85vh] max-h-[92vh] md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-slate-900 text-lg leading-tight">
                Klassenlijst
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {selected.length === 0
                  ? "Nog geen tutorials geselecteerd"
                  : `${selected.length} tutorial${selected.length === 1 ? "" : "s"} · ${aggregated.items.length} unieke onderdelen`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {selected.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-900 mb-1">Je klassenlijst is leeg</p>
            <p className="text-sm text-slate-500 max-w-sm">
              Open een tutorial en klik op <span className="font-semibold">Klassenlijst</span> om de
              benodigdheden samen te voegen voor een bulk-bestelling.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              <section className="px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Geselecteerde tutorials
                </h3>
                <ul className="space-y-1.5">
                  {selected.map(t => (
                    <li key={t.id} className="flex items-center gap-2">
                      <Link
                        href={`/tutorial/${t.id}`}
                        onClick={onClose}
                        className="flex-1 text-sm text-slate-700 hover:text-primary truncate transition flex items-center gap-2"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{t.title}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onRemove(t.id)}
                        aria-label={`${t.title} verwijderen uit klassenlijst`}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bestellijst ({aggregated.items.length})
                  </h3>
                </div>
                <ul className="space-y-1">
                  {aggregated.items.map(item => (
                    <li
                      key={item.key}
                      className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                    >
                      <span className="inline-flex items-center justify-center min-w-[2.75rem] h-7 px-2 rounded-md text-sm font-bold tabular-nums bg-primary/10 text-primary shrink-0">
                        {item.totalQty}×
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-800 leading-snug">{item.displayName}</div>
                        {item.variants.length > 1 && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            Gebruikt in {item.variants.length} tutorials:{" "}
                            {item.variants.map(v => `${v.qtyText} in ${v.tutorialTitle}`).join(" · ")}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {aggregated.notes.length > 0 && (
                <section className="px-6 py-4 bg-amber-50/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Aandachtspunten
                  </h3>
                  <ul className="space-y-1.5">
                    {aggregated.notes.map((n, i) => (
                      <li key={i} className="text-xs text-amber-900/90 leading-relaxed">
                        <span className="font-semibold">{n.tutorialTitle}:</span> {n.note}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Lijst leegmaken
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border bg-white text-slate-700 border-slate-200 hover:border-slate-400 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Gekopieerd" : "Kopieer"}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print bestellijst
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type FloatingProps = {
  count: number;
  onClick: () => void;
};

export function PartsBasketFAB({ count, onClick }: FloatingProps) {
  if (count === 0) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open klassenlijst (${count} tutorials)`}
      className={cn(
        "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-5 py-3 rounded-full",
        "bg-slate-900 text-white shadow-xl shadow-slate-900/30 hover:bg-slate-700",
        "transition cursor-pointer font-semibold text-sm"
      )}
    >
      <ShoppingBag className="w-4 h-4" />
      Klassenlijst
      <span className="inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded-full bg-primary text-white text-xs font-bold">
        {count}
      </span>
    </button>
  );
}
