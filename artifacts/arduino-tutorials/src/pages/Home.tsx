import { useState } from "react";
import { Link } from "wouter";
import { tutorials } from "../data/tutorials";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, ListChecks, Sparkles, Zap } from "lucide-react";

function isNew(dateAdded?: string): boolean {
  if (!dateAdded) return false;
  const added = new Date(dateAdded);
  const now = new Date();
  const diffDays = (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < 14;
}

type Difficulty = "Alle" | "Beginner" | "Gemiddeld" | "Gevorderd" | "Expert";

const difficultyConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Beginner:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
  Gemiddeld: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  Gevorderd: { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  Expert:    { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Difficulty>("Alle");

  const filters: Difficulty[] = ["Alle", "Beginner", "Gemiddeld", "Gevorderd", "Expert"];

  const filtered = activeFilter === "Alle"
    ? tutorials
    : tutorials.filter(t => t.difficulty === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 md:py-12 relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Nogwa arduino tutorials
          </h1>
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

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                activeFilter === f
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              {f === "Alle" ? (
                `Alle (${tutorials.length})`
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${difficultyConfig[f]?.dot ?? "bg-slate-400"}`} />
                  {f}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">Geen tutorials gevonden voor dit niveau.</p>
          </div>
        )}

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((tutorial, idx) => {
              const dc = difficultyConfig[tutorial.difficulty] ?? difficultyConfig.Beginner;
              return (
                <motion.div
                  key={tutorial.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/tutorial/${tutorial.id}`}
                    className="group block h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex gap-2 mb-6 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${dc.bg} ${dc.text} ${dc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dc.dot}`} />
                          {tutorial.difficulty}
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
    </div>
  );
}
