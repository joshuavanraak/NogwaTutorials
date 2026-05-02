import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Zap } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import { tutorials } from "../data/tutorials";

type PatternLink = {
  id: string;
};

type Pattern = {
  id: string;
  title: string;
  intro: string;
  why: string;
  code: string;
  links: PatternLink[];
};

const patterns: Pattern[] = [
  {
    id: "millis-timing",
    title: "millis() — non-blocking timing",
    intro:
      "Gebruik millis() in plaats van delay() om iets om de zoveel tijd te doen. Zo kan de Arduino ondertussen ook nog naar knoppen of sensoren luisteren.",
    why:
      "delay() blokkeert alles. Met millis() onthou je wanneer je iets de vorige keer deed en vergelijk je dat met nu.",
    code: `unsigned long vorigeTijd = 0;
const unsigned long interval = 500; // ms

void loop() {
  unsigned long nu = millis();
  if (nu - vorigeTijd >= interval) {
    vorigeTijd = nu;
    // doe hier iets om de 500 ms
  }

  // hier kan ondertussen knoppen lezen, sensoren uitlezen, ...
}`,
    links: [
      { id: "reactietijd-tester" },
      { id: "schaakklok" },
    ],
  },
  {
    id: "edge-detectie",
    title: "Edge-detectie op knoppen",
    intro:
      "Reageer alleen op het moment dat een knop wordt ingedrukt — niet zolang hij ingedrukt blijft. Zo telt één druk maar één keer.",
    why:
      "Zonder edge-detectie blijft je code triggeren in elke loop()-doorgang waarin de knop ingedrukt is.",
    code: `int knopPin = 2;
int vorigeStand = HIGH;

void setup() {
  pinMode(knopPin, INPUT_PULLUP);
}

void loop() {
  int huidigeStand = digitalRead(knopPin);

  // Detecteer overgang HIGH -> LOW (knop net ingedrukt)
  if (vorigeStand == HIGH && huidigeStand == LOW) {
    // doe iets — exact één keer per druk
  }

  vorigeStand = huidigeStand;
}`,
    links: [
      { id: "drukknop-teller" },
      { id: "knop-led" },
    ],
  },
  {
    id: "debounce",
    title: "Debounce — knop ontprellen",
    intro:
      "Knoppen 'stuiteren' kort wanneer je ze indrukt. Dat geeft meerdere valse triggers. Met een debounce-timer negeer je signalen die te snel achter elkaar komen.",
    why:
      "Zonder debounce telt één druk soms als 2, 3 of 5. Combineer dit gerust met edge-detectie hierboven.",
    code: `const int knopPin = 2;
int vorigeStand = HIGH;
unsigned long laatsteWissel = 0;
const unsigned long debounceTijd = 50; // ms

void loop() {
  int huidigeStand = digitalRead(knopPin);

  if (huidigeStand != vorigeStand) {
    if (millis() - laatsteWissel > debounceTijd) {
      laatsteWissel = millis();

      if (huidigeStand == LOW) {
        // knop is écht ingedrukt
      }
    }
  }

  vorigeStand = huidigeStand;
}`,
    links: [
      { id: "drukknop-teller" },
      { id: "simon-says" },
    ],
  },
  {
    id: "input-pullup",
    title: "INPUT_PULLUP — knoppen zonder weerstand",
    intro:
      "Met INPUT_PULLUP zet je de interne pull-up weerstand van de Arduino aan. Zo heb je geen losse 10kΩ weerstand nodig op je breadboard.",
    why:
      "De pin is dan standaard HIGH. Verbind de knop tussen de pin en GND: ingedrukt = LOW, niet ingedrukt = HIGH.",
    code: `void setup() {
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  // Let op: omgekeerde logica!
  // LOW = ingedrukt, HIGH = niet ingedrukt
  if (digitalRead(2) == LOW) {
    // knop is ingedrukt
  }
}`,
    links: [
      { id: "knop-led" },
      { id: "whack-a-mole" },
    ],
  },
  {
    id: "random-seed",
    title: "randomSeed(analogRead(A0))",
    intro:
      "random() geeft elke keer dat je de Arduino opstart dezelfde reeks getallen — tenzij je een 'seed' meegeeft. Een losse, niet-aangesloten analoge pin geeft willekeurige ruis.",
    why:
      "Belangrijk voor spelletjes (dobbelstenen, kaarten) en alles waar verrassing telt.",
    code: `void setup() {
  // A0 mag NIET aangesloten zijn — dan vangt hij ruis op
  randomSeed(analogRead(A0));
}

void loop() {
  int worp = random(1, 7); // 1 t/m 6
  // ...
}`,
    links: [
      { id: "dobbelsteen-roller" },
      { id: "simon-says" },
    ],
  },
  {
    id: "unsigned-overflow",
    title: "unsigned long aftrekken (zonder overflow)",
    intro:
      "millis() gebruikt unsigned long en loopt na ~49 dagen over. Toch werkt nu - vorig altijd correct, óók precies op het moment dat de teller overloopt.",
    why:
      "Sla tijden altijd op in unsigned long en vergelijk met nu - vorig >= interval. Vergelijk nooit met nu >= vorig + interval — dan klopt het bij overflow niet.",
    code: `unsigned long vorig = 0;
const unsigned long interval = 1000;

void loop() {
  unsigned long nu = millis();

  // Goed — werkt ook bij overflow:
  if (nu - vorig >= interval) {
    vorig = nu;
    // ...
  }

  // FOUT — kan stuk gaan na ~49 dagen:
  // if (nu >= vorig + interval) { ... }
}`,
    links: [
      { id: "reactietijd-tester" },
      { id: "plantenwater-systeem" },
    ],
  },
  {
    id: "map-functie",
    title: "map() — waardes herschalen",
    intro:
      "Een potmeter levert 0–1023, maar je wilt vaak 0–255 (PWM), 0–180 (servo), of 0–100 (procent). map() rekent dat in één lijn om.",
    why:
      "Veel netter dan zelf met * en / rekenen, en werkt ook met negatieve ranges.",
    code: `int ruwe = analogRead(A0);     // 0..1023
int pwm  = map(ruwe, 0, 1023, 0, 255);   // voor analogWrite
int hoek = map(ruwe, 0, 1023, 0, 180);   // voor servo

// Belangrijk: map() klemt niet vast! Gebruik constrain() bij twijfel:
hoek = constrain(hoek, 0, 180);`,
    links: [
      { id: "potmeter-led" },
      { id: "servo-motor" },
    ],
  },
  {
    id: "serial-debug",
    title: "Serial.print — kijken wat je code doet",
    intro:
      "Open de Seriële Monitor (vergrootglas-icoon rechtsboven in de Arduino IDE) en print waardes. De allereerste reflex bij 'het werkt niet zoals verwacht'.",
    why:
      "Zet Serial.begin() in setup(), en print sensorwaardes of stappen in je code. Zo zie je live wat er gebeurt.",
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int waarde = analogRead(A0);

  Serial.print("Sensor: ");
  Serial.println(waarde);

  delay(200);
}`,
    links: [
      { id: "ldr-sensor" },
      { id: "potmeter-led" },
    ],
  },
];

function lookupTutorial(id: string) {
  return tutorials.find((t) => t.id === id);
}

export default function Cheatsheet() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="w-full px-6 py-8 md:px-12 md:py-12 relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar overzicht
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-display font-bold text-slate-900 hidden sm:inline">
              Nogwa arduino tutorials
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Cheatsheet
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 leading-[1.1] mb-5">
            Patronen die{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              telkens terugkomen.
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Korte naslagkaart met de Arduino-trucs die je in bijna elke tutorial ziet opduiken.
            Handig om bij de hand te hebben tijdens de les.
          </p>
        </motion.div>
      </header>

      <main className="flex-1 w-full px-6 pb-24 md:px-12 relative z-10 max-w-5xl mx-auto">
        {/* Quick jump nav */}
        <nav
          aria-label="Patronen overzicht"
          className="bg-white border border-slate-200 rounded-2xl p-5 mb-10 shadow-sm"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Inhoud
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {patterns.map((p, idx) => (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  className="text-sm text-slate-700 hover:text-primary transition-colors flex items-baseline gap-2"
                >
                  <span className="font-mono text-xs text-slate-400">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{p.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Patterns */}
        <div className="space-y-12">
          {patterns.map((pattern, idx) => (
            <motion.section
              key={pattern.id}
              id={pattern.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
              className="scroll-mt-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-6 md:px-8 md:py-7 border-b border-slate-100">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                    {pattern.title}
                  </h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-3">{pattern.intro}</p>
                <p className="text-slate-500 text-sm leading-relaxed italic">{pattern.why}</p>
              </div>

              {/* Code snippet — same look as tutorial code blocks */}
              <div className="bg-[#0d1117]">
                <div className="bg-[#161b22] px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                  <span className="text-xs font-mono font-semibold tracking-wider text-slate-400">
                    snippet.ino
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                </div>
                <div className="max-h-[420px] overflow-auto">
                  <CodeBlock code={pattern.code} />
                </div>
              </div>

              {/* Links to tutorials */}
              <div className="px-6 py-5 md:px-8 bg-slate-50/60">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Toegepast in
                </p>
                <div className="flex flex-wrap gap-2">
                  {pattern.links.map((link) => {
                    const t = lookupTutorial(link.id);
                    if (!t) return null;
                    return (
                      <Link
                        key={link.id}
                        href={`/tutorial/${t.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {t.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        <div className="text-center pt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar tutorials
          </Link>
        </div>
      </main>
    </div>
  );
}
