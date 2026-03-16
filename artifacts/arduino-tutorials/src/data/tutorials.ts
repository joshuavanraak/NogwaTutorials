export type LegendItem = {
  term: string;
  desc: string;
};

export type TutorialStep = {
  id: string;
  title: string;
  content: string;
  code: string;
  diagram?: boolean;
  legend?: LegendItem[];
  assignment?: string;
  challenge?: string;
  reflection?: string;
};

export type Tutorial = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Gevorderd" | "Expert";
  materials: string;
  learningGoal: string;
  steps: TutorialStep[];
};

// ─────────────────────────────────────────────
// TUTORIAL 1: NeoPixel Basis
// ─────────────────────────────────────────────

const np_s1 = `#include <Adafruit_NeoPixel.h>

int ledAantal = 10;
int dataPin = 6;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(ledAantal, dataPin, NEO_GRB + NEO_KHZ800);`;

const np_s2 = `${np_s1}

void setup() {
  strip.begin();
  strip.show();
}`;

const np_s3 = `${np_s2}

void loop() {
  int rood = 100;
  int groen = 20;
  int blauw = 200;

  strip.setPixelColor(0, strip.Color(rood, groen, blauw));
  strip.show();
}`;

const np_s4 = `#include <Adafruit_NeoPixel.h>

int ledAantal = 10;
int dataPin = 6;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(ledAantal, dataPin, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.show();
}

void loop() {
  int rood = 0;
  int groen = 150;
  int blauw = 50;

  for (int i = 0; i < ledAantal; i++) {
    strip.setPixelColor(i, strip.Color(rood, groen, blauw));
  }

  strip.show();
}`;

const np_s5 = `#include <Adafruit_NeoPixel.h>
#define NUM_LEDS 10
#define DATA_PIN 6

Adafruit_NeoPixel strip(NUM_LEDS, DATA_PIN, NEO_GRB + NEO_KHZ800);

uint16_t kleurShift = 20;
int segmenten = 20;
int snelheid = 20;
int volgorde[NUM_LEDS] = {0,1,2,3,4,5,6,7,8,9};

void setup() {
  strip.begin();
  strip.show();
}

void loop() {
  for (int i = 0; i < NUM_LEDS; i++) {
    uint16_t hue = (kleurShift + i * (65535 / segmenten)) % 65536;
    strip.setPixelColor(volgorde[i], strip.ColorHSV(hue, 255, 25));
  }

  strip.show();
  kleurShift += 256;
  delay(snelheid);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 2: NeoPixel Pong Game
// ─────────────────────────────────────────────

const pong_s1 = `#include <FastLED.h>

#define NUM_LEDS 10
#define DATA_PIN 6

CRGB leds[NUM_LEDS];`;

const pong_s2 = `${pong_s1}

void setup() {
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
}`;

const pong_s3 = `#include <FastLED.h>

#define NUM_LEDS 10
#define DATA_PIN 6

CRGB leds[NUM_LEDS];

int position = 0;

void setup() {
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
}

void loop() {
  FastLED.clear();
  leds[position] = CRGB::Red;
  FastLED.show();
}`;

const pong_s4 = `#include <FastLED.h>

#define NUM_LEDS 10
#define DATA_PIN 6
#define BUTTON_LEFT 2
#define BUTTON_RIGHT 4

CRGB leds[NUM_LEDS];

int position = 0;

void setup() {
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
  pinMode(BUTTON_LEFT, INPUT_PULLUP);
  pinMode(BUTTON_RIGHT, INPUT_PULLUP);
}

void loop() {
  FastLED.clear();
  leds[position] = CRGB::Red;
  FastLED.show();
}`;

const pong_s5 = `#include <FastLED.h>

#define NUM_LEDS 10
#define DATA_PIN 6
#define BUTTON_LEFT 2
#define BUTTON_RIGHT 4

CRGB leds[NUM_LEDS];

int position = 0;
int direction = 0;

void setup() {
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
  pinMode(BUTTON_LEFT, INPUT_PULLUP);
  pinMode(BUTTON_RIGHT, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(BUTTON_RIGHT) == LOW) {
    direction = 1;
  }
  if (digitalRead(BUTTON_LEFT) == LOW) {
    direction = -1;
  }

  position = position + direction;

  FastLED.clear();
  leds[position] = CRGB::Red;
  FastLED.show();
}`;

const pong_s6 = `#include <FastLED.h>

#define NUM_LEDS 10
#define DATA_PIN 6
#define BUTTON_LEFT 2
#define BUTTON_RIGHT 4

CRGB leds[NUM_LEDS];

int position = 0;
int direction = 0;

void setup() {
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
  pinMode(BUTTON_LEFT, INPUT_PULLUP);
  pinMode(BUTTON_RIGHT, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(BUTTON_RIGHT) == LOW) {
    direction = 1;
  }
  if (digitalRead(BUTTON_LEFT) == LOW) {
    direction = -1;
  }

  position = position + direction;

  // Speler 1 wint (rechts)
  if (position > 9) {
    FastLED.clear();
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CRGB::Blue;
    }
    FastLED.show();
    while (true);
  }

  // Speler 2 wint (links)
  if (position < 0) {
    FastLED.clear();
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CRGB::Green;
    }
    FastLED.show();
    while (true);
  }

  FastLED.clear();
  leds[position] = CRGB::Red;
  FastLED.show();
}`;

const pong_s7 = `#include <FastLED.h>

// ---------- DEFINITIES ----------
#define NUM_LEDS 10
#define DATA_PIN 6
#define BUTTON_LEFT 2
#define BUTTON_RIGHT 4

// ---------- LED ARRAY ----------
CRGB leds[NUM_LEDS];

// ---------- VARIABELEN ----------
int position = 0;
int direction = 0;
int speedDelay = 200;

// ---------- SETUP ----------
void setup() {
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
  pinMode(BUTTON_LEFT, INPUT_PULLUP);
  pinMode(BUTTON_RIGHT, INPUT_PULLUP);
}

// ---------- LOOP ----------
void loop() {
  if (digitalRead(BUTTON_RIGHT) == LOW) {
    direction = 1;
  }
  if (digitalRead(BUTTON_LEFT) == LOW) {
    direction = -1;
  }

  position = position + direction;

  // Speler 1 wint
  if (position > 9) {
    FastLED.clear();
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CRGB::Blue;
    }
    FastLED.show();
    while (true);
  }

  // Speler 2 wint
  if (position < 0) {
    FastLED.clear();
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CRGB::Green;
    }
    FastLED.show();
    while (true);
  }

  FastLED.clear();
  leds[position] = CRGB::Red;
  FastLED.show();
  delay(speedDelay);
}`;

export const tutorials: Tutorial[] = [
  {
    id: "neopixel-basis",
    title: "NeoPixel Basis",
    description: "Leer stap voor stap hoe je een WS2812B LED strip aanstuurt met een Arduino. Van één LED aansturen tot soepele kleuranimaties.",
    difficulty: "Beginner",
    learningGoal: "Ik kan een WS2812B-strip aansluiten en LEDs aansturen met loops, kleuren en animaties.",
    materials: "Arduino Uno, WS2812B strip (10 leds), 5V voeding, 330Ω weerstand, jumper draden.",
    steps: [
      {
        id: "np-s1",
        title: "De bibliotheek & variabelen",
        content: "We beginnen met het laden van de Adafruit_NeoPixel bibliotheek. Een bibliotheek is een verzameling kant-en-klare functies die je kunt gebruiken. Zonder deze bibliotheek zou je zelf de communicatieprotocollen moeten schrijven — dat is veel werk. We definiëren ook hoeveel LEDs er zijn en op welke pin de data-kabel aangesloten zit.",
        diagram: true,
        code: np_s1,
        legend: [
          { term: "#include <Adafruit_NeoPixel.h>", desc: "Laad de NeoPixel bibliotheek in. Dit geeft je toegang tot alle LED-functies." },
          { term: "int ledAantal = 10", desc: "Sla het aantal LEDs op in een variabele. Zo hoef je dit getal maar op één plek te veranderen." },
          { term: "int dataPin = 6", desc: "De pin waarop de data-kabel van de LED strip is aangesloten." },
          { term: "Adafruit_NeoPixel strip = ...", desc: "Maak een strip-object aan. Dit is de verbinding tussen je code en de hardware." },
        ]
      },
      {
        id: "np-s2",
        title: "De setup() functie",
        content: "De setup() functie wordt één keer uitgevoerd als de Arduino opstart. Hier initialiseren we de LED strip en zetten we alle LEDs direct uit. Dit zorgt voor een voorspelbare startsituatie — je weet zeker dat er geen 'oude' kleuren meer actief zijn.",
        code: np_s2,
        legend: [
          { term: "void setup()", desc: "Dit blok code wordt precies één keer uitgevoerd bij het opstarten van de Arduino." },
          { term: "strip.begin()", desc: "Initialiseert de bibliotheek en bereidt de datapin voor." },
          { term: "strip.show()", desc: "Stuurt de huidige LED-waardes naar de strip. Omdat we niets hebben ingesteld, gaan alle LEDs uit." },
        ]
      },
      {
        id: "np-s3",
        title: "Je eerste LED aanzetten",
        content: "Nu voegen we de loop() functie toe. Deze wordt oneindig herhaald. We geven LED 0 een specifieke kleur met drie waarden: rood, groen en blauw (RGB). Elke waarde gaat van 0 (uit) tot 255 (volledig aan). Door deze drie waarden te combineren kun je elke kleur maken. Probeer de getallen aan te passen en kijk wat er gebeurt!",
        code: np_s3,
        legend: [
          { term: "void loop()", desc: "Dit blok code herhaalt zichzelf oneindig — dit is het hart van je programma." },
          { term: "strip.setPixelColor(0, ...)", desc: "Stel de kleur in van LED nummer 0. De LED wordt nog niet zichtbaar verlicht." },
          { term: "strip.Color(rood, groen, blauw)", desc: "Maak een kleur aan uit RGB-waarden (0–255). Bijv. Color(255, 0, 0) = volledig rood." },
          { term: "strip.show()", desc: "Pas nu worden alle ingestelde kleuren tegelijk zichtbaar op de strip." },
        ],
        assignment: "Zet LED 0, LED 5 en LED 9 tegelijk aan in drie verschillende kleuren.",
        challenge: "Wat gebeurt er als je rood, groen en blauw allemaal op 255 zet? En als je ze allemaal op 0 zet?",
        reflection: "Waarom werkt een WS2812B anders dan een gewone LED?"
      },
      {
        id: "np-s4",
        title: "Alle LEDs aansturen met een for-loop",
        content: "Als we 10 LEDs dezelfde kleur willen geven, is het zonde om setPixelColor() tien keer te typen. Met een for-loop herhalen we een stuk code automatisch. De variabele i loopt van 0 tot het aantal LEDs, zodat elke LED netjes wordt ingesteld.",
        code: np_s4,
        legend: [
          { term: "for (int i = 0; i < ledAantal; i++)", desc: "Herhaal de code erin voor elke waarde van i. Start bij 0, stop als i gelijk is aan ledAantal." },
          { term: "i++", desc: "Verhoog i met 1 na elke herhaling. Kort voor: i = i + 1." },
          { term: "leds[i]", desc: "Gebruik i als index zodat elke LED één keer aan de beurt komt." },
        ],
        assignment: "Voeg een delay(100) toe binnenin de for-loop. Wat zie je nu op de strip?",
        challenge: "Gebruik een if-statement met modulus: if (i % 2 == 0) — dan brandt alleen elke tweede LED.",
        reflection: "Waarom is een for-loop zo handig als je 100 of 1000 LEDs hebt?"
      },
      {
        id: "np-s5",
        title: "Kleuranimatie met arrays en HSV",
        content: "Nu maken we een vloeiende kleuranimatie. We schakelen over naar HSV (Hue, Saturation, Value) — daarmee kun je eenvoudig door het kleurenwiel scrollen. De array volgorde[] bepaalt de volgorde waarin de LEDs worden aangesproken. Door kleurShift elke loop op te hogen verschuift de hele animatie.",
        code: np_s5,
        legend: [
          { term: "int volgorde[NUM_LEDS] = {...}", desc: "Een array is een lijst van waarden. Hier staat de volgorde waarin de LEDs worden gekleurd." },
          { term: "strip.ColorHSV(hue, 255, 25)", desc: "Kleur via het kleurenwiel. 1e = tint (0–65535), 2e = saturatie (255 = vol), 3e = helderheid." },
          { term: "65535 / segmenten", desc: "Verdeelt het kleurenwiel over de LEDs. Hoe kleiner segmenten, hoe groter het kleurverschil per LED." },
          { term: "kleurShift += 256", desc: "Verhoog kleurShift elke loop met 256. Dit laat de animatie vloeiend bewegen." },
        ],
        assignment: "Verander de array volgorde[] naar {9,8,7,6,5,4,3,2,1,0}. Wat verandert er?",
        challenge: "Probeer de helderheid (3e getal bij ColorHSV) te verhogen. Wat is het maximum?",
        reflection: "Welke echte producten gebruiken dit soort LED-animaties?"
      }
    ]
  },
  {
    id: "neopixel-pong",
    title: "NeoPixel Pong Game",
    description: "Bouw een twee-speler Pong game op een LED strip. Sluit knoppen aan en bepaal wie de bal het verst laat komen. Leer werken met FastLED, invoer en spellogica.",
    difficulty: "Gevorderd",
    learningGoal: "Ik kan een interactief spel bouwen met knoppen, een LED strip en win-condities.",
    materials: "Arduino Uno, WS2812B strip (10 leds), 2 drukknopjes, 330Ω weerstand, jumper draden.",
    steps: [
      {
        id: "pong-s1",
        title: "FastLED bibliotheek & definities",
        content: "We gebruiken de FastLED bibliotheek — een krachtig alternatief voor Adafruit_NeoPixel. Met #define leg je constante waarden vast. Het verschil met int: defines worden voor het compileren vervangen door hun waarde en gebruiken geen geheugen. We maken ook het leds-array aan: een lijst met een kleurwaarde voor elke LED.",
        diagram: true,
        code: pong_s1,
        legend: [
          { term: "#include <FastLED.h>", desc: "Laad de FastLED bibliotheek. Biedt geavanceerde functies voor het aansturen van LED strips." },
          { term: "#define NUM_LEDS 10", desc: "Stel het aantal LEDs vast als een constante. #define-waarden gebruiken geen geheugen op de Arduino." },
          { term: "#define DATA_PIN 6", desc: "De pin waarop de data-kabel van de LED strip is aangesloten." },
          { term: "CRGB leds[NUM_LEDS]", desc: "Een array (lijst) van kleurobjecten. Elk item vertegenwoordigt één LED op de strip." },
        ]
      },
      {
        id: "pong-s2",
        title: "Setup: LEDs initialiseren",
        content: "In de setup() verbinden we de FastLED bibliotheek met onze hardware. We vertellen welk type LED-strip we hebben (WS2812), op welke pin hij zit en in welke kleurvolgorde (GRB — bij deze strips zit Groen als eerste, dan Rood, dan Blauw).",
        code: pong_s2,
        legend: [
          { term: "FastLED.addLeds<WS2812, DATA_PIN, GRB>", desc: "Registreer de LED strip. WS2812 = type chip, DATA_PIN = aansluitpin, GRB = kleurvolgorde." },
          { term: "leds, NUM_LEDS", desc: "Koppel het leds-array aan de bibliotheek en geef het aantal LEDs op." },
        ]
      },
      {
        id: "pong-s3",
        title: "De bal: één LED als positie",
        content: "We voegen een variabele position toe om bij te houden welke LED de 'bal' is. In de loop() wissen we eerst alle LEDs (FastLED.clear()), dan kleuren we alleen de LED op de huidige positie rood, en sturen we de update naar de strip. Upload dit en je ziet een rode LED op positie 0.",
        code: pong_s3,
        legend: [
          { term: "int position = 0", desc: "Bijhouden welke LED de bal is. Begint bij 0 (de eerste LED aan de linkerkant)." },
          { term: "FastLED.clear()", desc: "Zet alle LEDs in het geheugen op zwart (uit). De strip is nog niet bijgewerkt." },
          { term: "leds[position] = CRGB::Red", desc: "Geef de LED op de huidige positie de kleur rood." },
          { term: "FastLED.show()", desc: "Stuur alle kleurwaarden naar de strip zodat ze zichtbaar worden." },
        ],
        assignment: "Verander CRGB::Red naar CRGB::White of CRGB(100, 0, 255). Wat zie je?"
      },
      {
        id: "pong-s4",
        title: "Knoppen aansluiten & configureren",
        content: "We voegen twee knoppen toe — één voor elke speler. Met #define geven we de pinnummers namen. In de setup() stellen we de pinnen in als INPUT_PULLUP: de pin leest standaard HIGH (1). Als de knop ingedrukt is, wordt de pin verbonden met GND en leest LOW (0). Dit is betrouwbaarder dan een externe weerstand gebruiken.",
        code: pong_s4,
        diagram: false,
        legend: [
          { term: "#define BUTTON_LEFT 2", desc: "Geef pin 2 de naam BUTTON_LEFT. Sluit hier de linker knop op aan." },
          { term: "#define BUTTON_RIGHT 4", desc: "Geef pin 4 de naam BUTTON_RIGHT. Sluit hier de rechter knop op aan." },
          { term: "pinMode(BUTTON_LEFT, INPUT_PULLUP)", desc: "Stel de pin in als ingang met interne pull-up weerstand. Standaard HIGH, LOW bij knopdruk." },
        ],
        assignment: "Sluit de knoppen aan en test of ze reageren via de Serial Monitor met Serial.println(digitalRead(BUTTON_LEFT))."
      },
      {
        id: "pong-s5",
        title: "Beweging: richting & knopuitlezing",
        content: "Nu maken we de bal bewegelijk. We voegen een direction variabele toe (1 = rechts, -1 = links, 0 = stilstand). Elke loop lezen we de knoppen uit: als een knop ingedrukt is (LOW), passen we direction aan. Dan verhogen of verlagen we position met direction. De bal beweegt nu, maar kan nog buiten de strip lopen — dat lossen we hierna op.",
        code: pong_s5,
        legend: [
          { term: "int direction = 0", desc: "Bijhouden in welke richting de bal beweegt. 0 = stil, 1 = rechts, -1 = links." },
          { term: "digitalRead(BUTTON_RIGHT) == LOW", desc: "Lees de knop uit. LOW betekent dat de knop ingedrukt is (omdat we INPUT_PULLUP gebruiken)." },
          { term: "position = position + direction", desc: "Beweeg de bal. Als direction = 1 gaat de bal één stap naar rechts. Als -1, naar links." },
        ],
        challenge: "Voeg een delay(speedDelay) toe aan het einde van loop(). Wat doet dit met de snelheid?"
      },
      {
        id: "pong-s6",
        title: "Win-condities toevoegen",
        content: "Als de bal positie 9 (rechts) of -1 (links) bereikt, heeft een speler gewonnen. We controleren dit met if-statements. Bij winst vullen we de hele strip met één kleur: blauw voor speler 1 (rechts), groen voor speler 2 (links). Daarna stopt het programma met while(true) — een oneindige lege lus die alles bevriest.",
        code: pong_s6,
        legend: [
          { term: "if (position > 9)", desc: "Controleer of de bal voorbij de rechterkant is. Speler rechts heeft gewonnen." },
          { term: "if (position < 0)", desc: "Controleer of de bal voorbij de linkerkant is. Speler links heeft gewonnen." },
          { term: "leds[i] = CRGB::Blue", desc: "Kleur alle LEDs blauw om de overwinning van speler 1 aan te geven." },
          { term: "while (true)", desc: "Een oneindige lus die niets doet. Stopt het programma op die plek — de Arduino blijft bevroren." },
        ],
        assignment: "Verander de winkleuren naar jouw eigen kleuren. Probeer ook de winnende animatie anders te maken.",
        reflection: "Wat zou er gebeuren als je while(true) weglaat?"
      },
      {
        id: "pong-s7",
        title: "Vertraging toevoegen & complete code",
        content: "Als laatste voegen we speedDelay toe — een vertraging in milliseconden tussen elke loop-iteratie. Dit bepaalt hoe snel de bal beweegt. De volledige code is nu klaar: kopieer hem naar de Arduino IDE, upload en speel! Tip: verander speedDelay om het spel makkelijker of moeilijker te maken.",
        code: pong_s7,
        legend: [
          { term: "int speedDelay = 200", desc: "Bepaalt de snelheid van het spel. 200ms = vrij langzaam. Probeer 50 voor snel, 500 voor heel traag." },
          { term: "delay(speedDelay)", desc: "Pauzeer het programma voor het opgegeven aantal milliseconden voordat loop() opnieuw begint." },
        ],
        assignment: "Verander speedDelay naar 100. En naar 50. Wat is de grens waarbij het spel nog speelbaar is?",
        challenge: "Kun je de snelheid laten toenemen naarmate de bal vaker teruggekaatst is? Je hebt daarvoor een teller-variabele nodig.",
        reflection: "Hoe zou je het spel kunnen uitbreiden? Denk aan geluid, een reset-knop of een scoreteller."
      }
    ]
  }
];
