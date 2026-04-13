import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { tutorials } from "../data/tutorials";
import { CodeBlock } from "../components/CodeBlock";
import { WiringDiagram } from "../components/WiringDiagram";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronRight, Code2, Lightbulb, PlayCircle, Sparkles, Terminal, Zap } from "lucide-react";
import { cn } from "../lib/utils";

function isNew(dateAdded?: string): boolean {
  if (!dateAdded) return false;
  const added = new Date(dateAdded);
  const now = new Date();
  const diffDays = (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < 14;
}

export default function TutorialView() {
  const [, params] = useRoute("/tutorial/:id");
  const tutorial = tutorials.find(t => t.id === params?.id);

  const [activeStepId, setActiveStepId] = useState<string>("");
  const [currentCode, setCurrentCode] = useState<string>("");

  const stepRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const rightPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tutorial || tutorial.steps.length === 0) return;

    setActiveStepId(tutorial.steps[0].id);
    setCurrentCode(tutorial.steps[0].code);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute("data-step-id");
            if (stepId) {
              setActiveStepId(stepId);
              const stepData = tutorial.steps.find(s => s.id === stepId);
              if (stepData) {
                setCurrentCode(stepData.code);
              }
            }
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    Object.values(stepRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tutorial]);

  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Tutorial niet gevonden</h2>
          <Link href="/" className="text-primary hover:underline mt-4 inline-block">
            Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  const activeIndex = tutorial.steps.findIndex(s => s.id === activeStepId);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">

      {/* MOBILE NAV */}
      <div className="md:hidden bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <span className="font-semibold text-sm truncate max-w-[200px]">{tutorial.title}</span>
      </div>

      {/* LEFT PANEL: CODE (Sticky) */}
      <div className="w-full md:w-1/2 h-[45vh] md:h-screen md:sticky top-0 sticky z-40 bg-[#0d1117] flex flex-col shadow-2xl overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
        {/* Code header bar */}
        <div className="bg-[#161b22] px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold tracking-wider">main.ino</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
        </div>

        {/* Step progress indicators */}
        <div className="bg-[#0d1117] px-4 py-2 flex gap-1.5 shrink-0 border-b border-white/5">
          {tutorial.steps.map((step, idx) => (
            <div
              key={step.id}
              className={cn(
                "h-1 rounded-full flex-1 transition-all duration-300",
                idx < activeIndex
                  ? "bg-green-500"
                  : idx === activeIndex
                  ? "bg-primary"
                  : "bg-white/10"
              )}
            />
          ))}
        </div>

        {/* Code content */}
        <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <CodeBlock code={currentCode} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL: CONTENT (Scrollable) */}
      <div
        ref={rightPanelRef}
        className="w-full md:w-1/2 min-h-screen bg-slate-50 overflow-y-auto"
      >
        {/* Sticky breadcrumb */}
        <div className="hidden md:block sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-8 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Overzicht
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span className="font-medium text-slate-700">{tutorial.title}</span>
          </div>
        </div>

        {/* Tutorial intro header */}
        <div className="px-8 pt-12 pb-8 md:px-12 max-w-2xl">
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
              tutorial.difficulty === "Beginner"  && "bg-green-50 text-green-700 border-green-100",
              tutorial.difficulty === "Gemiddeld" && "bg-blue-50 text-blue-700 border-blue-100",
              tutorial.difficulty === "Gevorderd" && "bg-amber-50 text-amber-700 border-amber-100",
              tutorial.difficulty === "Expert"    && "bg-red-50 text-red-700 border-red-100",
            )}>
              {tutorial.difficulty}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {tutorial.steps.length} stappen
            </span>
            {isNew(tutorial.dateAdded) && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm shadow-violet-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Nieuw toegevoegd
              </motion.span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-4 leading-tight">
            {tutorial.title}
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed mb-6">{tutorial.description}</p>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl" />
            <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2 text-sm">
              <TargetIcon /> Leerdoel
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{tutorial.learningGoal}</p>
          </div>

          <div className="bg-slate-100 rounded-xl px-5 py-3 border border-slate-200 text-sm">
            <strong className="text-slate-700">Benodigdheden: </strong>
            <span className="text-slate-600">{tutorial.materials}</span>
          </div>
        </div>

        {/* Steps */}
        <div className="px-8 pb-48 md:px-12 max-w-2xl space-y-28">
          {tutorial.steps.map((step, idx) => (
            <div
              key={step.id}
              id={step.id}
              data-step-id={step.id}
              ref={(el) => (stepRefs.current[step.id] = el)}
              className="scroll-mt-24"
            >
              {/* Step heading */}
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 transition-all duration-300",
                  activeStepId === step.id
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : activeIndex > idx
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-500"
                )}>
                  {activeIndex > idx ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </span>
                {step.title}
              </h2>

              {/* Step explanation */}
              <p className="text-slate-600 leading-relaxed mb-6">{step.content}</p>

              {/* Wiring diagram */}
              {step.diagram && <WiringDiagram code={step.code} />}

              {/* Legend */}
              {step.legend && step.legend.length > 0 && (
                <div className="mt-6 mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-400" /> Code uitleg
                    </h4>
                  </div>
                  {step.legend.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        "p-4 flex flex-col md:flex-row gap-2 md:gap-4",
                        i !== step.legend!.length - 1 && "border-b border-slate-100"
                      )}
                    >
                      <div className="font-mono text-xs font-semibold text-primary bg-primary/5 px-2 py-1 rounded w-fit h-fit whitespace-nowrap shrink-0">
                        {item.term}
                      </div>
                      <div className="text-sm text-slate-600 flex-1 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Code */}
              {step.optionalCode && (
                <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 shadow-sm mt-6">
                  <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2 text-sm">
                    <Code2 className="w-4 h-4 text-indigo-500" />
                    {step.optionalCodeTitle || "Optionele code"}
                  </h4>
                  <p className="text-indigo-800/80 text-xs mb-3">Experimenteer met deze optionele uitbreiding door het hieronder in je loop() in te voegen.</p>
                  <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-xs text-slate-200 overflow-x-auto">
                    <pre className="leading-relaxed whitespace-pre-wrap break-words">{step.optionalCode}</pre>
                  </div>
                </div>
              )}

              {/* Assignment / Challenge / Reflection */}
              <div className="space-y-3 mt-6">
                {step.assignment && (
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2 text-sm">
                      <PlayCircle className="w-4 h-4 text-blue-500" /> Opdracht
                    </h4>
                    <p className="text-blue-800/80 text-sm leading-relaxed">{step.assignment}</p>
                  </div>
                )}
                {step.challenge && (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-amber-500" /> Uitdaging
                    </h4>
                    <p className="text-amber-800/80 text-sm leading-relaxed">{step.challenge}</p>
                  </div>
                )}
                {step.reflection && (
                  <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-purple-900 mb-1 flex items-center gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-purple-500" /> Reflectie
                    </h4>
                    <p className="text-purple-800/80 text-sm leading-relaxed italic">{step.reflection}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* End of tutorial */}
          <div className="pt-12 border-t border-slate-200 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tutorial voltooid!</h3>
            <p className="text-slate-500 text-sm mb-6">Kopieer de volledige code uit het linker paneel en upload hem naar je Arduino.</p>
            <Link href="/">
              <button className="bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm">
                Terug naar overzicht
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
