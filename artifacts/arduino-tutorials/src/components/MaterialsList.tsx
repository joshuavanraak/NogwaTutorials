import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Printer, BookOpen, AlertTriangle, Plus, Minus } from "lucide-react";
import { parseMaterials } from "../lib/parseMaterials";
import { cn } from "../lib/utils";

type Props = {
  tutorialId: string;
  tutorialTitle: string;
  materials: string;
  inBasket: boolean;
  onToggleBasket: () => void;
};

const STORAGE_KEY = "arduino-tutorials:materials-checks:v1";

function loadChecks(): Record<string, Record<string, boolean>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveChecks(all: Record<string, Record<string, boolean>>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

function buildPlainText(
  title: string,
  items: Array<{ qtyText: string; name: string }>,
  notes: string[],
): string {
  const lines: string[] = [];
  lines.push(`Onderdelenlijst — ${title}`);
  lines.push("".padEnd(`Onderdelenlijst — ${title}`.length, "="));
  lines.push("");
  for (const item of items) {
    lines.push(`[ ] ${item.qtyText} ${item.name}`);
  }
  if (notes.length > 0) {
    lines.push("");
    lines.push("Aandachtspunten:");
    for (const n of notes) lines.push(`- ${n}`);
  }
  return lines.join("\n");
}

function openPrintWindow(html: string) {
  const w = window.open("", "_blank", "width=720,height=900");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  // Give it a tick for layout, then trigger print.
  w.onload = () => {
    setTimeout(() => {
      w.focus();
      w.print();
    }, 200);
  };
}

function buildPrintHtml(
  title: string,
  items: Array<{ qtyText: string; name: string }>,
  notes: string[],
): string {
  const itemsHtml = items
    .map(
      (i) =>
        `<li><span class="box"></span><span class="qty">${escapeHtml(i.qtyText)}</span> ${escapeHtml(i.name)}</li>`,
    )
    .join("");
  const notesHtml = notes.length
    ? `<h2>Aandachtspunten</h2><ul class="notes">${notes
        .map((n) => `<li>${escapeHtml(n)}</li>`)
        .join("")}</ul>`
    : "";
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8">
<title>Onderdelenlijst — ${escapeHtml(title)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color:#0f172a; max-width: 640px; margin: 2em auto; padding: 0 1em; }
  h1 { font-size: 1.6em; margin: 0 0 0.25em; }
  .sub { color:#64748b; margin: 0 0 1.5em; font-size: 0.95em; }
  ul.parts { list-style:none; padding:0; margin:0 0 1em; }
  ul.parts li { padding: 0.55em 0; border-bottom: 1px solid #e2e8f0; display:flex; align-items:center; gap:0.75em; font-size:1.05em; }
  ul.parts .box { display:inline-block; width:1.1em; height:1.1em; border:1.5px solid #475569; border-radius:3px; flex:0 0 auto; }
  ul.parts .qty { font-weight:700; color:#0a84ff; min-width:2.5em; }
  h2 { margin-top:1.5em; font-size:1.05em; color:#475569; text-transform: uppercase; letter-spacing:0.05em; }
  ul.notes { padding-left:1.2em; color:#334155; }
  ul.notes li { margin-bottom:0.4em; }
  @media print { body { margin: 1cm; } .sub { color: #555; } }
</style></head><body>
<h1>Onderdelenlijst</h1>
<p class="sub">${escapeHtml(title)}</p>
<ul class="parts">${itemsHtml}</ul>
${notesHtml}
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function MaterialsList({ tutorialId, tutorialTitle, materials, inBasket, onToggleBasket }: Props) {
  const parsed = useMemo(() => parseMaterials(materials), [materials]);

  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const all = loadChecks();
    setChecks(all[tutorialId] ?? {});
  }, [tutorialId]);

  const updateCheck = (key: string, value: boolean) => {
    const next = { ...checks, [key]: value };
    setChecks(next);
    const all = loadChecks();
    all[tutorialId] = next;
    saveChecks(all);
  };

  const resetChecks = () => {
    setChecks({});
    const all = loadChecks();
    delete all[tutorialId];
    saveChecks(all);
  };

  const checkedCount = parsed.items.filter((_, i) => checks[String(i)]).length;

  const handleCopy = async () => {
    const text = buildPlainText(tutorialTitle, parsed.items, parsed.notes);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: select-and-copy via temp textarea
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
        // last resort: do nothing
      }
      document.body.removeChild(ta);
    }
  };

  const handlePrint = () => {
    openPrintWindow(buildPrintHtml(tutorialTitle, parsed.items, parsed.notes));
  };

  if (parsed.items.length === 0 && parsed.notes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
          <h3 className="font-semibold text-slate-800 text-sm">
            Benodigdheden
          </h3>
          {parsed.items.length > 0 && (
            <span className="text-xs text-slate-500 shrink-0">
              · {checkedCount}/{parsed.items.length} aangevinkt
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button
            type="button"
            onClick={onToggleBasket}
            aria-pressed={inBasket}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer",
              inBasket
                ? "bg-primary text-white border-primary hover:bg-primary/90"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
            )}
            title={inBasket ? "Uit klassenlijst halen" : "Toevoegen aan klassenlijst"}
          >
            {inBasket ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {inBasket ? "In klassenlijst" : "Klassenlijst"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-700 border-slate-200 hover:border-slate-400 transition cursor-pointer"
            title="Kopieer als platte tekst"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Gekopieerd" : "Kopieer"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-700 border-slate-200 hover:border-slate-400 transition cursor-pointer"
            title="Print of opslaan als PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {parsed.items.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {parsed.items.map((item, i) => {
            const key = String(i);
            const isChecked = !!checks[key];
            return (
              <li key={key}>
                <label className="flex items-center gap-3 px-5 py-2.5 cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => updateCheck(key, e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/40 cursor-pointer accent-primary"
                  />
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-[2rem] px-1.5 py-0.5 rounded-md text-xs font-bold tabular-nums whitespace-nowrap",
                      isChecked
                        ? "bg-slate-100 text-slate-400"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {item.qtyText}
                  </span>
                  <span
                    className={cn(
                      "text-sm leading-snug flex-1",
                      isChecked ? "line-through text-slate-400" : "text-slate-700"
                    )}
                  >
                    {item.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {parsed.notes.length > 0 && (
        <div className="px-5 py-3 bg-amber-50/40 border-t border-amber-100 space-y-1.5">
          {parsed.notes.map((n, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-amber-900/90 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{n}</span>
            </div>
          ))}
        </div>
      )}

      {checkedCount > 0 && (
        <div className="px-5 py-2 border-t border-slate-100 bg-white flex justify-end">
          <button
            type="button"
            onClick={resetChecks}
            className="text-xs text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            Wis vinkjes
          </button>
        </div>
      )}
    </div>
  );
}
