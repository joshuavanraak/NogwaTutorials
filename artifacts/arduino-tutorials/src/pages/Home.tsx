import { Link } from "wouter";
import { tutorials } from "../data/tutorials";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-8 md:px-12 md:py-12 relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Arduino Lab
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h2 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 leading-[1.1] mb-6">
            Leer programmeren met <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">hardware.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
            Praktische, stap-voor-stap tutorials om te leren werken met Arduino, sensoren en LEDs. Perfect voor in de klas.
          </p>
        </motion.div>
      </header>

      {/* Tutorial List */}
      <main className="flex-1 w-full px-6 pb-20 md:px-12 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, idx) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
            >
              <Link
                href={`/tutorial/${tutorial.id}`}
                className="group block h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {tutorial.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <Clock className="w-3.5 h-3.5" />
                      {tutorial.durationWeeks} Weken
                    </span>
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
          ))}
        </div>
      </main>
    </div>
  );
}
