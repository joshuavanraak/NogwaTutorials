import type { ReactNode } from "react";
import { ArrowRight, CircuitBoard } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ComponentType =
  | "neopixel"
  | "led"
  | "potmeter"
  | "pir"
  | "ldr"
  | "dht"
  | "buzzer"
  | "button";

type ColorKey = "teal" | "yellow" | "amber" | "blue" | "rose" | "violet" | "orange" | "slate" | "green";

type WiringRow = {
  from: string;
  to: string;
  resistance?: string;
  color: ColorKey;
  direction?: "in" | "out"; // in = sensor → arduino, out = arduino → component
};

type PowerRow = {
  arduinoPin: string;
  componentPin: string;
  color: ColorKey;
};

// ─── Color map ────────────────────────────────────────────────────────────────

const colors: Record<ColorKey, { bg: string; text: string; border: string }> = {
  teal:   { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200"   },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200"   },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  slate:  { bg: "bg-slate-100", text: "text-slate-700",  border: "border-slate-200"  },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
};

// ─── Parser ───────────────────────────────────────────────────────────────────

type ParsedPin = { name: string; pin: string };

function parsePins(code: string): ParsedPin[] {
  const result: ParsedPin[] = [];
  const seen = new Set<string>();

  // int vars: only match if name contains "pin" (avoids ledAantal, kleurShift, snelheid etc.)
  const intPattern = /int\s+(\w+)\s*=\s*(A?\d+)\s*;/g;
  // #define: match pure numeric / A+numeric values
  const definePattern = /#define\s+(\w+)\s+(A?\d+)\b/g;

  let m: RegExpExecArray | null;
  while ((m = intPattern.exec(code)) !== null) {
    const name = m[1];
    if (name.toLowerCase().includes("pin") && !seen.has(name)) {
      seen.add(name);
      result.push({ name, pin: m[2] });
    }
  }
  while ((m = definePattern.exec(code)) !== null) {
    const name = m[1];
    const n = name.toLowerCase();
    // Include if name signals a pin or a button
    if ((n.includes("pin") || n.includes("button") || n.includes("btn")) && !seen.has(name)) {
      seen.add(name);
      result.push({ name, pin: m[2] });
    }
  }
  return result;
}

function classifyName(name: string): ComponentType | null {
  const n = name.toLowerCase();
  if (n === "data_pin" || n.startsWith("datapin") || n === "data") return "neopixel";
  if (n.includes("led")) return "led";
  if (n.includes("pot")) return "potmeter";
  if (n.includes("pir")) return "pir";
  if (n.includes("ldr")) return "ldr";
  if (n === "dhtpin" || n.includes("dht")) return "dht";
  if (n.includes("buzz")) return "buzzer";
  if (n.includes("button") || n.includes("btn")) return "button";
  return null;
}

// ─── Build wiring rows from parsed pins ───────────────────────────────────────

type DiagramData = {
  signalRows: WiringRow[];
  powerRows: PowerRow[];
  gndRows: PowerRow[];
};

function buildDiagram(code: string): DiagramData {
  const pins = parsePins(code);
  const signalRows: WiringRow[] = [];
  const detectedComponents = new Set<ComponentType>();

  for (const { name, pin } of pins) {
    const type = classifyName(name);
    if (!type) continue;
    detectedComponents.add(type);

    const pinLabel = pin.startsWith("A") ? `Analoge pin ${pin}` : `Pin ${pin}`;

    switch (type) {
      case "neopixel":
        signalRows.push({ from: pinLabel, resistance: "330Ω", to: "NeoPixel Din (Data In)", color: "teal", direction: "out" });
        break;
      case "led":
        signalRows.push({ from: pinLabel, resistance: "220Ω", to: "LED + (anode)", color: "yellow", direction: "out" });
        break;
      case "potmeter":
        signalRows.push({ from: pinLabel, to: "Potmeter (midden-aansluiting)", color: "violet", direction: "in" });
        break;
      case "pir":
        signalRows.push({ from: pinLabel, to: "PIR sensor OUT-pin", color: "orange", direction: "in" });
        break;
      case "ldr":
        signalRows.push({ from: pinLabel, to: "LDR + 10kΩ spanningsdeler", color: "amber", direction: "in" });
        break;
      case "dht":
        signalRows.push({ from: pinLabel, resistance: "10kΩ", to: "DHT11 DATA-pin", color: "blue", direction: "in" });
        break;
      case "buzzer":
        signalRows.push({ from: pinLabel, to: "Buzzer + (positief)", color: "rose", direction: "out" });
        break;
      case "button": {
        const label = name.toLowerCase().includes("left")
          ? "Knop links (andere pin → GND)"
          : name.toLowerCase().includes("right")
          ? "Knop rechts (andere pin → GND)"
          : "Knop (andere pin → GND)";
        signalRows.push({ from: pinLabel, to: label, color: "slate", direction: "in" });
        break;
      }
    }
  }

  // Power rows per component type (deduped)
  const powerRows: PowerRow[] = [];
  const gndRows: PowerRow[] = [];
  const addedPower = new Set<string>();

  for (const type of detectedComponents) {
    if (addedPower.has(type)) continue;
    addedPower.add(type);

    switch (type) {
      case "neopixel":
        powerRows.push({ arduinoPin: "5V", componentPin: "NeoPixel 5V", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "NeoPixel GND", color: "slate" });
        break;
      case "led":
        gndRows.push({ arduinoPin: "GND", componentPin: "LED − (kathode)", color: "slate" });
        break;
      case "potmeter":
        powerRows.push({ arduinoPin: "5V", componentPin: "Potmeter links", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Potmeter rechts", color: "slate" });
        break;
      case "pir":
        powerRows.push({ arduinoPin: "5V", componentPin: "PIR VCC", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "PIR GND", color: "slate" });
        break;
      case "ldr":
        powerRows.push({ arduinoPin: "5V", componentPin: "LDR (via weerstand naar A0)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "10kΩ naar GND", color: "slate" });
        break;
      case "dht":
        powerRows.push({ arduinoPin: "3.3V / 5V", componentPin: "DHT11 VCC", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "DHT11 GND", color: "slate" });
        break;
      case "buzzer":
        gndRows.push({ arduinoPin: "GND", componentPin: "Buzzer − (negatief)", color: "slate" });
        break;
    }
  }

  return { signalRows, powerRows, gndRows };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChipBadge({ label, color }: { label: string; color: ColorKey }) {
  const c = colors[color];
  return (
    <div className={`font-mono text-xs font-semibold px-3 py-1.5 rounded-md border ${c.bg} ${c.text} ${c.border}`}>
      {label}
    </div>
  );
}

function Row({ left, middle, right }: { left: ReactNode; middle?: ReactNode; right: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm p-3 flex items-center gap-2">
        {left}
      </div>
      <div className="shrink-0 flex items-center gap-1">
        {middle ? (
          <>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <div className="font-mono text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md">{middle}</div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        ) : (
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>
      <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm p-3 flex items-center gap-2">
        {right}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WiringDiagram({ code }: { code: string }) {
  const { signalRows, powerRows, gndRows } = buildDiagram(code);

  if (signalRows.length === 0) return null;

  const allRows = [...signalRows, ...powerRows, ...gndRows];

  return (
    <div className="my-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-100/50 px-4 py-3 border-b border-slate-200">
        <h4 className="font-display font-semibold text-sm text-slate-700 flex items-center gap-2">
          <CircuitBoard className="w-4 h-4 text-primary" />
          Aansluitschema
        </h4>
      </div>

      <div className="p-5 flex flex-col gap-3">
        {/* Section: signal rows */}
        {signalRows.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Data / signaal</p>
        )}
        {signalRows.map((row, i) => (
          <Row
            key={i}
            left={<ChipBadge label={`Arduino  ${row.from}`} color={row.color} />}
            middle={row.resistance}
            right={<ChipBadge label={row.to} color={row.color} />}
          />
        ))}

        {/* Section: power rows */}
        {powerRows.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-2">Voeding</p>
        )}
        {powerRows.map((row, i) => (
          <Row
            key={i}
            left={<ChipBadge label={`Arduino  ${row.arduinoPin}`} color="rose" />}
            right={<ChipBadge label={row.componentPin} color="rose" />}
          />
        ))}

        {/* Section: GND rows */}
        {gndRows.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-2">Aarde (GND)</p>
        )}
        {gndRows.map((row, i) => (
          <Row
            key={i}
            left={<ChipBadge label={`Arduino  ${row.arduinoPin}`} color="slate" />}
            right={<ChipBadge label={row.componentPin} color="slate" />}
          />
        ))}
      </div>
    </div>
  );
}
