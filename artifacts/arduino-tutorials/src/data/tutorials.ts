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

export type Week = {
  id: string;
  title: string;
  learningGoal: string;
  materials: string;
  steps: TutorialStep[];
};

export type Tutorial = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationWeeks: number;
  weeks: Week[];
  bonusCode?: string;
  bonusTitle?: string;
  bonusDesc?: string;
};

// Reusable accumulated code blocks to make the progressive reveal natural
const week1CodeStep1 = `#include <Adafruit_NeoPixel.h> // library toevoegen aan Arduino

int ledAantal = 10;      // totaal aantal leds
int dataPin = 6;         // datapin voor neopixel strip

Adafruit_NeoPixel strip = Adafruit_NeoPixel(ledAantal, dataPin, NEO_GRB + NEO_KHZ800);`;

const week1CodeStep2 = `${week1CodeStep1}

void setup() {
  strip.begin();         // strip starten
  strip.show();          // alle leds uit
}`;

const week1CodeStep3 = `${week1CodeStep2}

void loop() {
  int rood = 100;        // waarde aanpasbaar (0–255)
  int groen = 20;
  int blauw = 200;

  strip.setPixelColor(0, strip.Color(rood, groen, blauw)); // pixel 0 instellen
  strip.show();      // kleuren uitvoeren
}`;

const week2CodeStep1 = `#include <Adafruit_NeoPixel.h>

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

  for (int i = 0; i < ledAantal; i++) {         // herhaal voor elke led
    strip.setPixelColor(i, strip.Color(rood, groen, blauw));
  }

  strip.show();
}`;

const week3CodeStep1 = `#include <Adafruit_NeoPixel.h>
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
}`;

const week3CodeStep2 = `${week3CodeStep1}

void loop() {
  for(int i = 0; i < NUM_LEDS; i++) {
    uint16_t hue = (kleurShift + i * (65535 / segmenten)) % 65536;
    strip.setPixelColor(volgorde[i], strip.ColorHSV(hue, 255, 25));
  }

  strip.show();
  kleurShift += 256;
  delay(snelheid);
}`;

const bonusPongCode = `#include <FastLED.h>
#define NUM_LEDS 10
#define DATA_PIN 6
#define BUTTON_LEFT 2
#define BUTTON_RIGHT 4

CRGB leds[NUM_LEDS];

int position = 0;
int direction = 0;
int speedDelay = 200;

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

  if (position > 9) {
    FastLED.clear();
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CRGB::Blue;
    }
    FastLED.show();
    while (true);
  }

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
    id: "neopixel-pong",
    title: "NeoPixel Pong Game",
    description: "Bouw stap voor stap een interactieve Pong game met een NeoPixel LED strip en een Arduino. Leer werken met loops, arrays en bibliotheken.",
    difficulty: "Beginner",
    durationWeeks: 3,
    bonusTitle: "Einddoel: De Pong Game",
    bonusDesc: "Nu je alle basisprincipes kent, kun je de volledige code voor de Pong game bestuderen en op je Arduino zetten. Sluit twee knoppen aan (op pin 2 en 4) en speel!",
    bonusCode: bonusPongCode,
    weeks: [
      {
        id: "week-1",
        title: "Week 1: Intro NeoPixel & Basis Aansturing",
        learningGoal: "Sluit een WS2812B strip aan en leer hoe je per LED een kleur kunt instellen.",
        materials: "Arduino Uno, WS2812B strip (10 leds), 5V power supply, 330Ω weerstand, jumper draden.",
        steps: [
          {
            id: "w1-s1",
            title: "Hardware Aansluiten & Bibliotheek",
            content: "Voordat we kunnen programmeren, moeten we de componenten aansluiten en de juiste software gereedschappen inladen. We gebruiken de Adafruit_NeoPixel bibliotheek om gemakkelijk met de LEDs te praten.",
            diagram: true,
            code: week1CodeStep1,
            legend: [
              { term: "Adafruit_NeoPixel", desc: "De bibliotheek met alle functies voor het aansturen van WS2812B LED's." }
            ]
          },
          {
            id: "w1-s2",
            title: "De Setup Functie",
            content: "De Arduino voert de `setup()` functie één keer uit als hij opstart. Hier starten we de LED strip en zorgen we dat alle LEDs standaard uit staan, zodat we met een schone lei beginnen.",
            code: week1CodeStep2
          },
          {
            id: "w1-s3",
            title: "Je Eerste LED Aanzetten",
            content: "In de `loop()` functie, die oneindig herhaald wordt, gaan we één specifieke LED (nummer 0) een kleur geven. Kleuren mix je met Rood, Groen en Blauw (RGB) waarden van 0 tot 255.",
            code: week1CodeStep3,
            legend: [
              { term: "setPixelColor()", desc: "Stel de kleur in voor een specifieke pixel. Deze wordt nog niet direct zichtbaar." },
              { term: "show()", desc: "Stuurt alle ingestelde waardes tegelijk naar de LED strip zodat ze zichtbaar worden." },
              { term: "strip.Color(r, g, b)", desc: "Maakt een kleurcode aan vanuit Rood, Groen en Blauw waarden." }
            ],
            assignment: "Zet LED 0, LED 5 en LED 9 in verschillende kleuren tegelijk aan.",
            challenge: "Maak een variabele kleur (bijv. int rood, int groen) en verander de waardes. Wat gebeurt er als je alles op 255 zet?",
            reflection: "Waarom werkt een WS2812B LED strip anders dan een gewone standaard LED?"
          }
        ]
      },
      {
        id: "week-2",
        title: "Week 2: For-Loops & Alle Pixels Aansturen",
        learningGoal: "Stuur meerdere pixels tegelijk aan met behulp van een for-loop.",
        materials: "Arduino Uno, Aangesloten NeoPixel setup van Week 1.",
        steps: [
          {
            id: "w2-s1",
            title: "De Kracht van Herhaling",
            content: "Als we 10 LEDs dezelfde kleur willen geven, is het zonde om 10 keer `setPixelColor` te typen. Een `for`-loop is hier de perfecte oplossing voor. Deze herhaalt een stukje code zo vaak als wij willen.",
            code: week2CodeStep1,
            legend: [
              { term: "for (int i = 0; i < ledAantal; i++)", desc: "Een herhalingslus. Start bij 0, en verhoog 'i' zolang deze kleiner is dan het aantal LEDs." },
              { term: "i % 2 == 0", desc: "(Tip voor de challenge) Modulus operator. Is 'True' bij even getallen: 0, 2, 4, 6... Hiermee kun je om-en-om patronen maken." }
            ],
            assignment: "Laat elke LED in volgorde aangaan door de for-loop een `delay(100)` te geven, zet deze ín de for-loop.",
            challenge: "Gebruik een modulus (%) in een if-statement zodat alleen elke tweede LED aangaat: `if (i % 2 == 0) { ... }`",
            reflection: "Waarom is een loop handig bij langere LED-strips (bijv. met 100 LEDs)?"
          }
        ]
      },
      {
        id: "week-3",
        title: "Week 3: Arrays & Dynamische Kleurovergangen",
        learningGoal: "Gebruik arrays om de pixelvolgorde te bepalen en maak soepele kleurovergangen.",
        materials: "Arduino Uno, Aangesloten NeoPixel setup van Week 1.",
        steps: [
          {
            id: "w3-s1",
            title: "Arrays en Instellingen",
            content: "Een Array is een lijst met variabelen. In dit geval een lijst met de volgorde van onze LEDs. Ook introduceren we variabelen voor een soepele kleuren-animatie.",
            code: week3CodeStep1,
            legend: [
              { term: "int naamInt[]", desc: "De blokhaken [] geven aan dat het een array is (een lijst van waardes)." },
            ]
          },
          {
            id: "w3-s2",
            title: "Soepele Animatie met HSV",
            content: "In plaats van RGB gebruiken we nu HSV (Hue, Saturation, Value) om door het kleurenwiel te schuiven. De berekening zorgt ervoor dat elke LED net een iets andere kleur heeft dan zijn buurman.",
            code: week3CodeStep2,
            legend: [
              { term: "strip.ColorHSV(hue, 255, 25)", desc: "Kleuren instellen via het kleurenwiel. 1e = Hue (kleur), 2e = Saturatie, 3e = Helderheid." },
              { term: "65535 / segmenten", desc: "Bepaalt hoe groot het kleurverschil is per LED. Het hele kleurenwiel is verdeeld in 65536 stappen." },
              { term: "kleurShift += 256;", desc: "Hoogt elke loop de kleurShift variabele op, waardoor de animatie beweegt." }
            ],
            assignment: "Verander de array `volgorde[]` zodat de animatie een compleet andere route volgt. Bijvoorbeeld: `{9,8,7,6,5,4,3,2,1,0}`.",
            challenge: "Vouw de led strip dubbel en probeer de ledstrip aan beide kanten gelijke kleuren te geven (met verloop), alsof de animatie vanuit het midden start.",
            reflection: "Welke toepassingen bestaan er in de echte wereld voor dit soort dynamische kleuranimaties?"
          }
        ]
      }
    ]
  }
];
