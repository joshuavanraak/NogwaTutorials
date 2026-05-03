import { useMemo, useState } from "react";
import { Link } from "wouter";
import { tutorials } from "../data/tutorials";
import type { Board, TutorialTag } from "../data/tutorials";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, ListChecks, Search, Sparkles, X, Zap, Check, Plus, FileCode2 } from "lucide-react";
import { PartsBasketFAB, PartsBasketModal, useBasket } from "../components/PartsBasket";
import { cn } from "../lib/utils";

function isNew(dateAdded?: string): boolean {
  if (!dateAdded) return false;
  const added = new Date(dateAdded);
  const now = new Date();
  const diffDays = (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < 14;
}

// Strip diacritics + lowercase for accent-insensitive search.
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

type Difficulty = "Alle" | "Beginner" | "Gemiddeld" | "Gevorderd" | "Expert";
type BoardFilter = "Alle" | Board;
type ThemeFilter = "Alle" | TutorialTag;

const difficultyConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Beginner:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
  Gemiddeld: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  Gevorderd: { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  Expert:    { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
};

const boardConfig: Record<Board, { label: string; dot: string }> = {
  arduino: { label: "Arduino", dot: "bg-red-500" },
  esp32:   { label: "ESP32",   dot: "bg-blue-500" },
};

const themeConfig: Record<TutorialTag, { label: string }> = {
  basis:    { label: "Basis" },
  sensor:   { label: "Sensor" },
  display:  { label: "Display" },
  motor:    { label: "Motor" },
  game:     { label: "Game" },
  domotica: { label: "Domotica" },
  internet: { label: "Internet" },
};

const difficultyFilters: Difficulty[] = ["Alle", "Beginner", "Gemiddeld", "Gevorderd", "Expert"];
const boardFilters: BoardFilter[] = ["Alle", "arduino", "esp32"];
const themeFilters: ThemeFilter[] = ["Alle", "basis", "sensor", "display", "motor", "game", "domotica", "internet"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>("Alle");
  const [activeBoard, setActiveBoard] = useState<BoardFilter>("Alle");
  const [activeTheme, setActiveTheme] = useState<ThemeFilter>("Alle");
  const [basketOpen, setBasketOpen] = useState(false);
  const basket = useBasket();

  const trimmedSearch = search.trim();
  const normalizedSearch = normalize(trimmedSearch);

  const filtered = useMemo(() => {
    return tutorials.filter(t => {
      if (activeDifficulty !== "Alle" && t.difficulty !== activeDifficulty) return false;

      const board: Board = t.board ?? "arduino";
      if (activeBoard !== "Alle" && board !== activeBoard) return false;

      if (activeTheme !== "Alle") {
        const tags = t.tags ?? [];
        if (!tags.includes(activeTheme)) return false;
      }

      if (normalizedSearch.length > 0) {
        const haystack = normalize(`${t.title} ${t.description}`);
        if (!haystack.includes(normalizedSearch)) return false;
      }

      return true;
    });
  }, [activeDifficulty, activeBoard, activeTheme, normalizedSearch]);

  const hasActiveFilters =
    trimmedSearch.length > 0 ||
    activeDifficulty !== "Alle" ||
    activeBoard !== "Alle" ||
    activeTheme !== "Alle";

  const resetFilters = () => {
    setSearch("");
    setActiveDifficulty("Alle");
    setActiveBoard("Alle");
    setActiveTheme("Alle");
  };

  // Reusable filter-pill className builder
  const pillClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
      active
        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 md:py-12 relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Nogwa arduino tutorials
            </h1>
          </div>
          <Link
            href="/cheatsheet"
            aria-label="Open cheatsheet met herbruikbare Arduino-patronen"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-primary/40 hover:text-primary shadow-sm transition-colors"
          >
            <FileCode2 className="w-4 h-4" />
            <span className="hidden sm:inline">Cheatsheet</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h2 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 leading-[1.1] mb-6">
            Leer programmeren met{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              hardware.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
            Praktische, stap-voor-stap tutorials om te leren werken met Arduino, sensoren en LEDs. Perfect voor in de klas.
          </p>
        </motion.div>
      </header>

      {/* Filter + Grid */}
      <main className="flex-1 w-full px-6 pb-20 md:px-12 relative z-10 max-w-7xl mx-auto">

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6"
        >
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek op titel of omschrijving…"
              aria-label="Zoek tutorials op titel of omschrijving"
              className="w-full pl-12 pr-12 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
            />
            {search.length > 0 && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Wis zoekveld"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter rows */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          {/* Difficulty */}
          <div className="flex gap-2 overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap pb-1">
            {difficultyFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveDifficulty(f)}
                aria-pressed={activeDifficulty === f}
                className={pillClass(activeDifficulty === f)}
              >
                {f === "Alle" ? (
                  "Alle niveaus"
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${difficultyConfig[f]?.dot ?? "bg-slate-400"}`} />
                    {f}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Board */}
          <div className="flex gap-2 overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap pb-1">
            {boardFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveBoard(f)}
                aria-pressed={activeBoard === f}
                className={pillClass(activeBoard === f)}
              >
                {f === "Alle" ? (
                  "Alle borden"
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${boardConfig[f].dot}`} />
                    {boardConfig[f].label}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Theme */}
          <div className="flex gap-2 overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap pb-1">
            {themeFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveTheme(f)}
                aria-pressed={activeTheme === f}
                className={pillClass(activeTheme === f)}
              >
                {f === "Alle" ? (
                  "Alle thema's"
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    {themeConfig[f].label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count + reset */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{filtered.length}</span>
            {" "}van{" "}
            <span className="font-semibold text-slate-900">{tutorials.length}</span>
            {" "}tutorials
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              Reset filters
            </button>
          )}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl">
            <p className="text-lg font-semibold text-slate-900 mb-2">Geen tutorials gevonden</p>
            <p className="text-slate-600 mb-4">
              Geen resultaten voor de actieve filters:
            </p>
            <ul className="inline-flex flex-wrap justify-center gap-2 mb-6">
              {trimmedSearch.length > 0 && (
                <li className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Zoekterm: "{trimmedSearch}"
                </li>
              )}
              {activeDifficulty !== "Alle" && (
                <li className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Niveau: {activeDifficulty}
                </li>
              )}
              {activeBoard !== "Alle" && (
                <li className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Bord: {boardConfig[activeBoard].label}
                </li>
              )}
              {activeTheme !== "Alle" && (
                <li className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Thema: {themeConfig[activeTheme].label}
                </li>
              )}
            </ul>
            <div>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                Reset filters
              </button>
            </div>
          </div>
        )}

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((tutorial, idx) => {
              const dc = difficultyConfig[tutorial.difficulty] ?? difficultyConfig.Beginner;
              const board: Board = tutorial.board ?? "arduino";
              const bc = boardConfig[board];
              return (
                <motion.div
                  key={tutorial.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      basket.toggle(tutorial.id);
                    }}
                    aria-pressed={basket.has(tutorial.id)}
                    aria-label={
                      basket.has(tutorial.id)
                        ? `${tutorial.title} uit klassenlijst halen`
                        : `${tutorial.title} aan klassenlijst toevoegen`
                    }
                    title={basket.has(tutorial.id) ? "In klassenlijst" : "Toevoegen aan klassenlijst"}
                    className={cn(
                      "absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer border shadow-sm",
                      basket.has(tutorial.id)
                        ? "bg-primary text-white border-primary hover:bg-primary/90"
                        : "bg-white/95 text-slate-500 border-slate-200 hover:text-primary hover:border-primary/40 backdrop-blur"
                    )}
                  >
                    {basket.has(tutorial.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    href={`/tutorial/${tutorial.id}`}
                    className="group block h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex gap-2 mb-6 flex-wrap pr-12">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${dc.bg} ${dc.text} ${dc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dc.dot}`} />
                          {tutorial.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          <span className={`w-1.5 h-1.5 rounded-full ${bc.dot}`} />
                          {bc.label}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          <ListChecks className="w-3.5 h-3.5" />
                          {tutorial.steps.length} stappen
                        </span>
                        {isNew(tutorial.dateAdded) && (
                          <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm shadow-violet-200"
                          >
                            <Sparkles className="w-3 h-3" />
                            Nieuw
                          </motion.span>
                        )}
                        {(tutorial.tags ?? []).map((tag) => {
                          const tc = themeConfig[tag];
                          if (!tc) return null;
                          const isActive = activeTheme === tag;
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveTheme(isActive ? "Alle" : tag);
                              }}
                              aria-pressed={isActive}
                              aria-label={
                                isActive
                                  ? `Verwijder thema-filter ${tc.label}`
                                  : `Filter op thema ${tc.label}`
                              }
                              title={
                                isActive
                                  ? `Verwijder thema-filter ${tc.label}`
                                  : `Filter op thema ${tc.label}`
                              }
                              className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer",
                                isActive
                                  ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-700"
                                  : "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300"
                              )}
                            >
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  isActive ? "bg-white" : "bg-violet-500"
                                )}
                              />
                              {tc.label}
                            </button>
                          );
                        })}
                      </div>

                      <h3 className="text-2xl font-display font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </h3>
                      <p className="text-slate-600 mb-8 line-clamp-3">
                        {tutorial.description}
                      </p>

                      <div className="flex items-center text-primary font-semibold text-sm">
                        <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                          <BookOpen className="w-4 h-4" />
                          Start Tutorial
                        </span>
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      <PartsBasketFAB count={basket.ids.length} onClick={() => setBasketOpen(true)} />
      <PartsBasketModal
        open={basketOpen}
        onClose={() => setBasketOpen(false)}
        selectedIds={basket.ids}
        onRemove={basket.remove}
        onClear={basket.clear}
      />
    </div>
  );
}
