import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { tutorials } from "../data/tutorials";
import { CodeBlock } from "../components/CodeBlock";
import { WiringDiagram } from "../components/WiringDiagram";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Code2, Lightbulb, PlayCircle, Star, Terminal, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export default function TutorialView() {
  const [, params] = useRoute("/tutorial/:id");
  const tutorial = tutorials.find(t => t.id === params?.id);
  
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeStepId, setActiveStepId] = useState<string>("");
  const [currentCode, setCurrentCode] = useState<string>("");

  // Create refs for intersection observer
  const stepRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!tutorial) return;

    const currentWeekData = tutorial.weeks[activeWeek];
    
    // Set initial code to first step
    if (currentWeekData.steps.length > 0 && !activeStepId) {
      setActiveStepId(currentWeekData.steps[0].id);
      setCurrentCode(currentWeekData.steps[0].code);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute("data-step-id");
            if (stepId) {
              setActiveStepId(stepId);
              // Find the code for this step
              const stepData = currentWeekData.steps.find(s => s.id === stepId);
              if (stepData) {
                setCurrentCode(stepData.code);
              } else if (stepId === "bonus-step") {
                setCurrentCode(tutorial.bonusCode || "");
              }
            }
          }
        });
      },
      // Trigger when element crosses the upper middle of the screen
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    // Observe all steps
    Object.values(stepRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tutorial, activeWeek]);

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

  const currentWeekData = tutorial.weeks[activeWeek];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      
      {/* MOBILE NAV (Visible only on small screens) */}
      <div className="md:hidden bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <span className="font-display font-semibold text-sm truncate max-w-[200px]">{tutorial.title}</span>
      </div>

      {/* LEFT PANEL: CODE (Sticky) */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-screen md:sticky top-0 md:top-0 sticky z-40 bg-[#0d1117] flex flex-col shadow-2xl overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
        <div className="bg-[#161b22] px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-sm shrink-0">
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
        
        <div className="flex-1 relative overflow-hidden bg-[#0d1117]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <CodeBlock code={currentCode} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL: CONTENT (Scrollable) */}
      <div className="w-full md:w-1/2 min-h-screen bg-slate-50 relative overflow-y-auto custom-scrollbar">
        
        {/* Header / Week Navigation */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 md:px-12 shadow-sm">
          <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm mb-4">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Overzicht
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="font-medium text-slate-700">{tutorial.title}</span>
          </div>
          
          <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 -mb-2">
            {tutorial.weeks.map((week, idx) => (
              <button
                key={week.id}
                onClick={() => {
                  setActiveWeek(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                  activeWeek === idx 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {activeWeek > idx && <CheckCircle2 className="w-4 h-4" />}
                Week {idx + 1}
              </button>
            ))}
            {tutorial.bonusCode && (
               <button
                 onClick={() => {
                   setActiveWeek(tutorial.weeks.length); // Render bonus as last "week"
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                 }}
                 className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                  activeWeek === tutorial.weeks.length 
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20" 
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                )}
               >
                 <Star className="w-4 h-4" />
                 Bonus
               </button>
            )}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="px-6 py-12 md:px-12 max-w-2xl mx-auto pb-48">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWeek}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* NORMAL WEEKS */}
              {activeWeek < tutorial.weeks.length ? (
                <>
                  <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
                      {currentWeekData.title}
                    </h1>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                       <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                         <TargetIcon /> Leerdoel
                       </h3>
                       <p className="text-slate-600 leading-relaxed">{currentWeekData.learningGoal}</p>
                    </div>
                    <div className="bg-slate-100 rounded-xl p-5 border border-slate-200 text-sm">
                      <strong className="text-slate-700">Benodigdheden: </strong> 
                      <span className="text-slate-600">{currentWeekData.materials}</span>
                    </div>
                  </div>

                  <div className="space-y-24">
                    {currentWeekData.steps.map((step) => (
                      <div 
                        key={step.id} 
                        id={step.id}
                        data-step-id={step.id}
                        ref={(el) => (stepRefs.current[step.id] = el)}
                        className={cn(
                          "transition-all duration-500 scroll-mt-32",
                          activeStepId === step.id ? "opacity-100" : "opacity-40"
                        )}
                      >
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-4 flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                             {currentWeekData.steps.indexOf(step) + 1}
                          </span>
                          {step.title}
                        </h2>
                        
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-6">
                          <p>{step.content}</p>
                        </div>

                        {step.diagram && <WiringDiagram />}

                        {/* Legend/Explanation of code terms */}
                        {step.legend && step.legend.length > 0 && (
                          <div className="mt-8 mb-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                              <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-slate-500" /> Code Verklaring
                              </h4>
                            </div>
                            <div className="p-0">
                              {step.legend.map((item, i) => (
                                <div key={i} className={cn(
                                  "p-4 flex flex-col md:flex-row gap-2 md:gap-6",
                                  i !== step.legend!.length - 1 && "border-b border-slate-100"
                                )}>
                                  <div className="font-mono text-xs font-semibold text-primary bg-primary/5 px-2 py-1 rounded w-fit h-fit whitespace-nowrap">
                                    {item.term}
                                  </div>
                                  <div className="text-sm text-slate-600 flex-1">
                                    {item.desc}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Cards (Assignment, Challenge, Reflection) */}
                        <div className="space-y-4 mt-8">
                          {step.assignment && (
                            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 shadow-sm">
                               <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                 <PlayCircle className="w-5 h-5 text-blue-500" />
                                 Opdracht
                               </h4>
                               <p className="text-blue-800/80 text-sm leading-relaxed">{step.assignment}</p>
                            </div>
                          )}
                          
                          {step.challenge && (
                            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 shadow-sm">
                               <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                 <Zap className="w-5 h-5 text-amber-500" />
                                 Uitdaging
                               </h4>
                               <p className="text-amber-800/80 text-sm leading-relaxed">{step.challenge}</p>
                            </div>
                          )}

                          {step.reflection && (
                            <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-5 shadow-sm">
                               <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                 <Lightbulb className="w-5 h-5 text-purple-500" />
                                 Reflectie
                               </h4>
                               <p className="text-purple-800/80 text-sm leading-relaxed italic">{step.reflection}</p>
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                  
                  {/* Next Week Button */}
                  {activeWeek < tutorial.weeks.length - 1 && (
                    <div className="mt-24 pt-12 border-t border-slate-200 flex justify-end">
                      <button 
                        onClick={() => {
                          setActiveWeek(curr => curr + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-slate-900 hover:bg-primary text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:-translate-y-1"
                      >
                        Ga naar Week {activeWeek + 2}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {activeWeek === tutorial.weeks.length - 1 && tutorial.bonusCode && (
                    <div className="mt-24 pt-12 border-t border-slate-200 flex justify-end">
                      <button 
                        onClick={() => {
                          setActiveWeek(curr => curr + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:-translate-y-1"
                      >
                        Bekijk het Einddoel
                        <Star className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* BONUS SECTION */
                <div 
                  id="bonus-step"
                  data-step-id="bonus-step"
                  ref={(el) => (stepRefs.current["bonus-step"] = el)}
                  className="mb-16 scroll-mt-32"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-bold text-sm mb-6 border border-purple-200">
                    <Star className="w-4 h-4" /> Bonus Level
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
                    {tutorial.bonusTitle}
                  </h1>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-12 text-lg">
                    <p>{tutorial.bonusDesc}</p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Tutorial Voltooid!</h3>
                    <p className="text-slate-500 mb-8">Kopieer de volledige code uit het linker paneel en upload het naar je Arduino.</p>
                    <Link href="/">
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-all">
                        Terug naar overzicht
                      </button>
                    </Link>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

// Icon helper
function TargetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  )
}
