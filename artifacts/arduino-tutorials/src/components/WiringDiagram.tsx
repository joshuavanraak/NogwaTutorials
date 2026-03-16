import { ArrowRight, Zap, CircuitBoard, Cpu } from "lucide-react";

export function WiringDiagram() {
  return (
    <div className="my-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-100/50 px-4 py-3 border-b border-slate-200">
        <h4 className="font-display font-semibold text-sm text-slate-700 flex items-center gap-2">
          <CircuitBoard className="w-4 h-4 text-primary" />
          Aansluitschema
        </h4>
      </div>
      
      <div className="p-5 flex flex-col gap-4">
        {/* Data Line */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 flex items-center justify-between sm:justify-start gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 font-mono text-sm text-teal-700 bg-teal-50 px-3 py-1.5 rounded-md">
              <Cpu className="w-4 h-4" />
              <span>Arduino Pin 6</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
            <div className="flex items-center gap-2 font-mono text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md">
              <span>330Ω Weerstand</span>
            </div>
          </div>
          <div className="flex justify-center sm:block">
             <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
          </div>
          <div className="flex-1 bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex justify-center sm:justify-start">
             <div className="font-mono text-sm text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md w-full text-center">
               NeoPixel Din (Data In)
             </div>
          </div>
        </div>

        {/* 5V Power */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2 font-mono text-sm text-rose-700 bg-rose-50 px-3 py-1.5 rounded-md">
              <Zap className="w-4 h-4" />
              <span>Arduino 5V</span>
            </div>
          </div>
          <div className="flex justify-center sm:block">
             <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
          </div>
          <div className="flex-1 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
            <div className="font-mono text-sm text-rose-700 bg-rose-50 px-3 py-1.5 rounded-md text-center">
               NeoPixel 5V
             </div>
          </div>
        </div>

        {/* GND */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2 font-mono text-sm text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md">
              <span>Arduino GND</span>
            </div>
          </div>
          <div className="flex justify-center sm:block">
             <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
          </div>
          <div className="flex-1 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
            <div className="font-mono text-sm text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md text-center">
               NeoPixel GND
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
