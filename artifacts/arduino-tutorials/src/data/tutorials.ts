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
  optionalCode?: string;
  optionalCodeTitle?: string;
};

export type Tutorial = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Gemiddeld" | "Gevorderd" | "Expert";
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

// ─────────────────────────────────────────────
// TUTORIAL 3: Potmeter & LED
// ─────────────────────────────────────────────

const pot_s1 = `int potPin = A0;  // De analoge pin voor de potmeter
int ledPin = 9;   // De pin voor de LED

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}`;

const pot_s2 = `int potPin = A0;  // De analoge pin voor de potmeter
int ledPin = 9;   // De pin voor de LED

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int waarde = analogRead(potPin);              // Uitlezen van analoge pin (0–1023)
  int helderheid = map(waarde, 0, 1023, 0, 255); // Omzetten naar 0–255

  analogWrite(ledPin, helderheid); // Helderheid op de LED instellen
  Serial.println(waarde);          // Waarde zichtbaar maken in Serial Monitor
}`;

// ─────────────────────────────────────────────
// TUTORIAL 4: PIR Sensor
// ─────────────────────────────────────────────

const pir_s1 = `int pirPin = 2;   // PIR sensor pin
int ledPin = 13;  // LED pin

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
}`;

const pir_s2 = `int pirPin = 2;   // PIR sensor pin
int ledPin = 13;  // LED pin

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int beweging = digitalRead(pirPin); // Lees de sensorwaarde (HIGH of LOW)

  if (beweging == HIGH) {      // Als er beweging is...
    digitalWrite(ledPin, HIGH); // ...LED aan
  } else {                     // Anders...
    digitalWrite(ledPin, LOW);  // ...LED uit
  }
}`;

// ─────────────────────────────────────────────
// TUTORIAL 5: LDR Sensor
// ─────────────────────────────────────────────

const ldr_s1 = `int ldrPin = A0; // LDR op analoge pin A0
int ledPin = 9;  // LED op pin 9

void setup() {
  pinMode(ledPin, OUTPUT);
}`;

const ldr_s2 = `int ldrPin = A0; // LDR op analoge pin A0
int ledPin = 9;  // LED op pin 9

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int licht = analogRead(ldrPin); // Lees lichtwaarde (0 = donker, 1023 = fel)

  if (licht < 500) {              // Als het donker is...
    digitalWrite(ledPin, HIGH);   // ...LED aan
  } else {                        // Als er voldoende licht is...
    digitalWrite(ledPin, LOW);    // ...LED uit
  }
}`;

// ─────────────────────────────────────────────
// TUTORIAL 6: DHT11 Sensor
// ─────────────────────────────────────────────

const dht_s1 = `#include "DHT.h"          // DHT bibliotheek
#define DHTPIN 2          // De pin van de sensor
#define DHTTYPE DHT11     // Type sensor: DHT11

DHT dht(DHTPIN, DHTTYPE); // Maak een DHT-object aan

void setup() {
  Serial.begin(9600);
  dht.begin(); // Start de sensor
}`;

const dht_s2 = `#include "DHT.h"          // DHT bibliotheek
#define DHTPIN 2          // De pin van de sensor
#define DHTTYPE DHT11     // Type sensor: DHT11

DHT dht(DHTPIN, DHTTYPE); // Maak een DHT-object aan

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float t = dht.readTemperature(); // Lees temperatuur (°C)
  float h = dht.readHumidity();    // Lees luchtvochtigheid (%)

  Serial.print("Temp: ");
  Serial.print(t);
  Serial.print(" °C  Vocht: ");
  Serial.println(h);

  delay(2000); // Wacht 2 seconden tussen metingen
}`;

// ─────────────────────────────────────────────
// TUTORIAL 7: Creatief Project – PIR + Buzzer
// ─────────────────────────────────────────────

const buzz_s1 = `int pirPin = 2;     // PIR sensor op pin 2
int buzzerPin = 8;  // Buzzer op pin 8

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
}`;

const buzz_s2 = `int pirPin = 2;     // PIR sensor op pin 2
int buzzerPin = 8;  // Buzzer op pin 8

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  int beweging = digitalRead(pirPin);

  if (beweging == HIGH) {        // Beweging gedetecteerd?
    tone(buzzerPin, 1000);       // Buzzer aan (1000 Hz)
  } else {                       // Geen beweging?
    noTone(buzzerPin);           // Buzzer uit
  }
}`;

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────

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
        diagram: true,
        code: pong_s4,
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
        reflection: "Hoe zou je het spel kunnen uitbreiden? Denk aan geluid, een reset-knop of een scoreteller.",
        optionalCodeTitle: "Optioneel: Reflectie-mechanica",
        optionalCode: `// LINKS (bal komt naar links)
if (digitalRead(BUTTON_LEFT) == LOW && direction == -1) {
  if (position <= 3) { // je mag slaan
    direction = 1;
    if (position <= 2) { // laatste 3 pixels (0,1,2)
      speedDelay -= 20; // sneller
    }
  }
}

// RECHTS (bal komt naar rechts)
if (digitalRead(BUTTON_RIGHT) == LOW && direction == 1) {
  if (position >= 6) { // je mag slaan
    direction = -1;
    if (position >= 7) { // laatste 3 pixels (7,8,9)
      speedDelay -= 20; // sneller
    }
  }
}`
      }
    ]
  },
  {
    id: "potmeter-led",
    title: "Potmeter & LED",
    description: "Gebruik een potmeter om de helderheid van een LED te regelen. Leer hoe je een analoge sensor uitleest en de waarde omzet naar een bruikbaar bereik.",
    difficulty: "Beginner",
    learningGoal: "Ik kan een eenvoudige sensor uitlezen en een LED aansturen.",
    materials: "Arduino Uno, breadboard, potmeter, LED, 220Ω weerstand, draden.",
    steps: [
      {
        id: "pot-s1",
        title: "Pinnen instellen & Serial starten",
        content: "We beginnen met het vastleggen van de pinnummers in variabelen. Door namen te gebruiken (potPin, ledPin) hoef je het nummer maar op één plek te veranderen als je de bedrading aanpast. In setup() openen we de Serial Monitor zodat we straks de sensorwaarden kunnen zien, en we stellen de LED-pin in als uitgang.",
        diagram: true,
        code: pot_s1,
        legend: [
          { term: "int potPin = A0", desc: "De potmeter is aangesloten op analoge pin A0. Analoge pinnen kunnen waarden meten van 0 tot 1023." },
          { term: "int ledPin = 9", desc: "De LED zit op pin 9. Dit is een PWM-pin (~), waardoor je de helderheid kunt regelen." },
          { term: "Serial.begin(9600)", desc: "Start de verbinding met de computer op 9600 baud. Hiermee kun je waarden zien in de Serial Monitor." },
          { term: "pinMode(ledPin, OUTPUT)", desc: "Zet pin 9 als uitgang — de Arduino stuurt hier stroom naar toe." },
        ]
      },
      {
        id: "pot-s2",
        title: "Uitlezen, omzetten & aansturen",
        content: "In de loop() lezen we de potmeterwaarde uit (0–1023) en zetten we deze om naar een LED-helderheid (0–255) met de map()-functie. Daarna schrijven we die waarde naar de LED met analogWrite(). Draai de potmeter en kijk hoe de helderheid mee verandert. De Serial Monitor laat live zien welke waarde de sensor teruggeeft.",
        code: pot_s2,
        legend: [
          { term: "analogRead(potPin)", desc: "Leest de spanning op pin A0. Geeft een waarde tussen 0 (0V) en 1023 (5V)." },
          { term: "map(waarde, 0, 1023, 0, 255)", desc: "Rekent de waarde lineair om van het bereik 0–1023 naar 0–255." },
          { term: "analogWrite(ledPin, helderheid)", desc: "Stuurt een PWM-signaal naar de LED. 0 = uit, 255 = volledig aan." },
          { term: "Serial.println(waarde)", desc: "Schrijft de ruwe sensorwaarde naar de Serial Monitor, inclusief een nieuwe regel." },
        ],
        assignment: "Draai de potmeter volledig links en rechts. Wat zijn de minimum en maximum waarden in de Serial Monitor?",
        challenge: "Pas de code aan zodat de LED pas gaat branden als de potmeter verder dan de helft is gedraaid (waarde > 511).",
        reflection: "Waar in het dagelijks leven werkt iets vergelijkbaars met een potmeter?"
      }
    ]
  },
  {
    id: "pir-sensor",
    title: "PIR Bewegingssensor",
    description: "Sluit een PIR-sensor aan en laat een LED oplichten bij beweging. Leer het verschil tussen digitale en analoge invoer, en ontdek hoe de sensor werkt.",
    difficulty: "Beginner",
    learningGoal: "Ik kan een digitale sensor uitlezen en een LED aansturen op basis van beweging.",
    materials: "Arduino Uno, PIR sensor, LED, 220Ω weerstand, breadboard, draden.",
    steps: [
      {
        id: "pir-s1",
        title: "Pinnen instellen",
        content: "Een PIR-sensor (Passieve Infrarood) detecteert warmtestraling van mensen en dieren. Hij geeft als uitvoer simpelweg HIGH (beweging) of LOW (geen beweging) — dit noemen we een digitaal signaal. We stellen de PIR-pin in als INPUT en de LED-pin als OUTPUT.",
        diagram: true,
        code: pir_s1,
        legend: [
          { term: "int pirPin = 2", desc: "De PIR sensor is aangesloten op digitale pin 2." },
          { term: "int ledPin = 13", desc: "Pin 13 heeft een ingebouwde LED op de Arduino Uno — handig voor testen." },
          { term: "pinMode(pirPin, INPUT)", desc: "Stel pin 2 in als ingang. De Arduino leest hier een waarde van de sensor." },
          { term: "pinMode(ledPin, OUTPUT)", desc: "Stel pin 13 in als uitgang. De Arduino stuurt hier de LED mee aan." },
        ]
      },
      {
        id: "pir-s2",
        title: "Beweging detecteren met if/else",
        content: "We lezen elke loop de PIR-sensor uit met digitalRead(). De waarde is altijd HIGH of LOW. Met een if/else-statement reageren we op de twee mogelijke situaties: beweging gedetecteerd → LED aan, geen beweging → LED uit. Dit patroon — een sensor uitlezen en er iets mee doen — is de basis van de meeste Arduino-projecten.",
        code: pir_s2,
        legend: [
          { term: "digitalRead(pirPin)", desc: "Lees de digitale waarde van de PIR-pin. Geeft HIGH (1) of LOW (0)." },
          { term: "if (beweging == HIGH)", desc: "Als er beweging is (waarde is HIGH), voer dan het volgende blok uit." },
          { term: "digitalWrite(ledPin, HIGH)", desc: "Stuur stroom naar de LED-pin zodat de LED aangaat." },
          { term: "else { ... }", desc: "Als de conditie NIET waar is, voer dan dit alternatieve blok uit." },
        ],
        assignment: "Beweeg je hand voor de sensor en kijk of de LED reageert. Hoe lang blijft de LED nog aan na de beweging?",
        challenge: "Pas de drempelgevoeligheid aan op de sensor zelf (er zit een draaiknopje op). Wat verandert er?",
        reflection: "Waar zie jij PIR-sensoren terug in het dagelijks leven?"
      }
    ]
  },
  {
    id: "ldr-sensor",
    title: "LDR Lichtsensor",
    description: "Laat een LED automatisch aan en uit gaan op basis van de lichtsterkte in de ruimte. Leer hoe een LDR werkt en hoe je een drempelwaarde instelt.",
    difficulty: "Beginner",
    learningGoal: "Ik kan een analoge lichtsensor uitlezen en een LED aansturen op basis van de lichtwaarde.",
    materials: "Arduino Uno, LDR, LED, 10kΩ weerstand, 220Ω weerstand, breadboard, draden.",
    steps: [
      {
        id: "ldr-s1",
        title: "Pinnen instellen",
        content: "Een LDR (Light Dependent Resistor) is een weerstand die verandert met de hoeveelheid licht. Meer licht → lagere weerstand → hogere spanning op de analoge pin → hogere waarde. We lezen hem uit via een analoge pin, net als de potmeter. De LED stuurt we aan via een digitale outputpin.",
        diagram: true,
        code: ldr_s1,
        legend: [
          { term: "int ldrPin = A0", desc: "De LDR is aangesloten op analoge pin A0 via een spanningsdeler met een 10kΩ weerstand." },
          { term: "int ledPin = 9", desc: "De LED zit op pin 9." },
          { term: "pinMode(ledPin, OUTPUT)", desc: "Stel de LED-pin in als uitgang." },
        ]
      },
      {
        id: "ldr-s2",
        title: "LED aansturen op basis van licht",
        content: "We lezen de lichtwaarde elke loop. Als de waarde onder 500 valt (het is donker), gaat de LED aan. Is de waarde 500 of hoger, dan gaat de LED uit. De waarde 500 is onze drempel — die kun je aanpassen aan de ruimte waar je werkt. Probeer eens je hand over de LDR te houden en kijk wat er gebeurt.",
        code: ldr_s2,
        legend: [
          { term: "analogRead(ldrPin)", desc: "Leest de spanning op de LDR-pin. 0 = volledig donker, 1023 = vol licht." },
          { term: "if (licht < 500)", desc: "Als de gemeten lichtwaarde kleiner is dan 500, is het donker genoeg om de LED aan te zetten." },
          { term: "digitalWrite(ledPin, HIGH)", desc: "Stuur stroom naar de LED → LED gaat aan." },
          { term: "digitalWrite(ledPin, LOW)", desc: "Stop stroom naar de LED → LED gaat uit." },
        ],
        assignment: "Houd je hand boven de LDR en kijk wanneer de LED aangaat. Wat is de grenswaarde in jouw ruimte?",
        challenge: "Verander de drempel van 500 naar een waarde die beter past bij de lichtomstandigheden in jouw klas.",
        reflection: "Waar zie jij automatische verlichting op basis van licht in het dagelijks leven?"
      }
    ]
  },
  {
    id: "dht11-sensor",
    title: "DHT11 Temperatuur & Vocht",
    description: "Meet de temperatuur en luchtvochtigheid met een DHT11 sensor en lees de waarden uit via de Serial Monitor. Leer werken met een externe bibliotheek.",
    difficulty: "Gemiddeld",
    learningGoal: "Ik kan een DHT11 sensor uitlezen en de meetwaarden weergeven via de Serial Monitor.",
    materials: "Arduino Uno, DHT11 sensor, 10kΩ weerstand, breadboard, draden.",
    steps: [
      {
        id: "dht-s1",
        title: "Bibliotheek & sensor instellen",
        content: "De DHT11 meet zowel temperatuur als luchtvochtigheid via één datapin. Om hem te gebruiken, moeten we eerst de DHT-bibliotheek installeren in de Arduino IDE. Via Sketch → Include Library → Manage Libraries zoek je op 'DHT sensor library' van Adafruit en installeer je deze. Met #define stellen we de pin en het sensortype in. Dan maken we een dht-object aan dat we straks gebruiken om de sensor aan te sturen.",
        diagram: true,
        code: dht_s1,
        legend: [
          { term: '#include "DHT.h"', desc: "Laad de DHT bibliotheek. Hiermee kun je de sensor aansturen zonder zelf het protocol te coderen." },
          { term: "#define DHTPIN 2", desc: "De datapin van de sensor is aangesloten op pin 2." },
          { term: "#define DHTTYPE DHT11", desc: "Geef aan welk type sensor je gebruikt. Er zijn ook DHT21 en DHT22 varianten." },
          { term: "DHT dht(DHTPIN, DHTTYPE)", desc: "Maak een dht-object aan. Dit is de instantie waarmee je functies zoals readTemperature() aanroept." },
          { term: "dht.begin()", desc: "Initialiseer de sensor zodat hij klaar is voor gebruik." },
        ]
      },
      {
        id: "dht-s2",
        title: "Temperatuur en vocht uitlezen",
        content: "In de loop() lezen we elke 2 seconden de temperatuur en luchtvochtigheid uit. We gebruiken float in plaats van int, omdat de sensor decimalen teruggeeft (bijv. 21.5°C). Met Serial.print() bouwen we een nette zin op in de Serial Monitor. Let op het verschil tussen print() (geen nieuwe regel) en println() (wél nieuwe regel aan het einde).",
        code: dht_s2,
        legend: [
          { term: "float t = dht.readTemperature()", desc: "Lees de temperatuur in graden Celsius. float = een getal met decimalen." },
          { term: "float h = dht.readHumidity()", desc: "Lees de luchtvochtigheid in procenten (0–100)." },
          { term: "Serial.print()", desc: "Stuur tekst of een waarde naar de Serial Monitor, zonder nieuwe regel." },
          { term: "Serial.println()", desc: "Stuur tekst of een waarde naar de Serial Monitor, mét nieuwe regel aan het einde." },
          { term: "delay(2000)", desc: "Wacht 2000 milliseconden (= 2 seconden) voor de volgende meting. De DHT11 kan niet sneller dan 1x per seconde meten." },
        ],
        assignment: "Blaas zachtjes over de sensor. Wat zie je veranderen in de Serial Monitor?",
        challenge: "Voeg een if-statement toe: als de temperatuur boven 25°C is, stuur dan een bericht 'Warm!' naar de Serial Monitor.",
        reflection: "In welke toepassingen wordt temperatuur én vochtigheid tegelijk gemeten?"
      }
    ]
  },
  {
    id: "pir-buzzer",
    title: "Creatief Project: PIR + Buzzer",
    description: "Combineer een PIR bewegingssensor met een buzzer. Als er beweging wordt gedetecteerd, gaat er een alarm af. De basis voor een zelfgemaakt beveiligingssysteem.",
    difficulty: "Gemiddeld",
    learningGoal: "Ik kan een toepassing bedenken en bouwen met een sensor en een output-component.",
    materials: "Arduino Uno, PIR sensor, buzzer, breadboard, draden.",
    steps: [
      {
        id: "buzz-s1",
        title: "Pinnen instellen",
        content: "We combineren twee componenten die we al kennen: de PIR sensor als invoer en een buzzer als uitvoer. Een buzzer maakt een geluid als je er een wisselend signaal naartoe stuurt — dit doet de tone()-functie voor ons. We stellen opnieuw de pinmodes in: de PIR als INPUT en de buzzer als OUTPUT.",
        diagram: true,
        code: buzz_s1,
        legend: [
          { term: "int pirPin = 2", desc: "PIR sensor aangesloten op digitale pin 2." },
          { term: "int buzzerPin = 8", desc: "De buzzer is aangesloten op pin 8." },
          { term: "pinMode(pirPin, INPUT)", desc: "Stel de PIR-pin in als ingang." },
          { term: "pinMode(buzzerPin, OUTPUT)", desc: "Stel de buzzer-pin in als uitgang." },
        ]
      },
      {
        id: "buzz-s2",
        title: "Alarm activeren bij beweging",
        content: "De logica is dezelfde als bij de PIR + LED: we lezen de sensor uit en reageren met een if/else. Alleen sturen we nu geen LED aan, maar een buzzer. De tone()-functie stuurt een toon van een bepaalde frequentie naar de buzzer (1000 = 1000 Hz, een vrij hoge pieptoon). noTone() schakelt het geluid weer uit.",
        code: buzz_s2,
        legend: [
          { term: "digitalRead(pirPin)", desc: "Lees de sensorwaarde: HIGH bij beweging, LOW bij rust." },
          { term: "tone(buzzerPin, 1000)", desc: "Laat de buzzer piepen op 1000 Hz. Hoe hoger het getal, hoe hoger de toon." },
          { term: "noTone(buzzerPin)", desc: "Stop het geluid van de buzzer." },
        ],
        assignment: "Upload de code en loop langs de sensor. Hoor je de buzzer afgaan?",
        challenge: "Voeg een LED toe die ook aangaat bij beweging. Combineer de PIR + LED code met de buzzer-code.",
        reflection: "Welke aanpassingen zou je maken om dit een echt bruikbaar alarmsysteem te maken?"
      }
    ]
  }
];
