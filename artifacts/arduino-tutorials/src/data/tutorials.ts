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
  dateAdded?: string;
};

// ─────────────────────────────────────────────
// TUTORIAL 12: I2C LCD Display (16x2 met PCF8574 backpack)
// ─────────────────────────────────────────────

const lcd_s1 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Adres 0x27 is het meest voorkomend; soms 0x3F.
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Hallo wereld!");
}

void loop() {
  // Voor nu doet de loop niks - de tekst blijft staan.
}`;

const lcd_s2 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int teller = 0;

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Teller:");
}

void loop() {
  lcd.setCursor(0, 1);    // ga naar kolom 0, rij 1 (tweede regel)
  lcd.print("        ");  // wis de oude waarde
  lcd.setCursor(0, 1);
  lcd.print(teller);

  teller++;
  delay(1000);
}`;

const lcd_s3 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int potPin = A0;

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Potmeter:");
}

void loop() {
  int waarde = analogRead(potPin);

  lcd.setCursor(0, 1);
  lcd.print("                ");   // wis hele regel (16 tekens)
  lcd.setCursor(0, 1);
  lcd.print(waarde);
  lcd.print(" / 1023");

  delay(100);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 9: Stappenmotor Basis (A4988 / DRV8825)
// ─────────────────────────────────────────────

const stepper_s1 = `int stepPin = 3;
int dirPin = 4;

void setup() {
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
}`;

const stepper_s2 = `int stepPin = 3;
int dirPin = 4;

int stappenPerOmwenteling = 200;

void setup() {
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
}

void loop() {
  // Met de klok mee
  digitalWrite(dirPin, HIGH);

  for (int i = 0; i < stappenPerOmwenteling; i++) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(800);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(800);
  }

  delay(1000);
}`;

const stepper_s3 = `int stepPin = 3;
int dirPin = 4;

int stappenPerOmwenteling = 200;

void setup() {
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
}

void doeOmwenteling(int richting) {
  digitalWrite(dirPin, richting);
  for (int i = 0; i < stappenPerOmwenteling; i++) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(800);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(800);
  }
}

void loop() {
  doeOmwenteling(HIGH);   // met de klok mee
  delay(500);

  doeOmwenteling(LOW);    // tegen de klok in
  delay(500);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 10: Stappenmotor + Rotary Encoder
// ─────────────────────────────────────────────

const enc_s1 = `int clkPin = 2;
int dtPin = 3;

int laatsteCLK;
int positie = 0;

void setup() {
  pinMode(clkPin, INPUT_PULLUP);
  pinMode(dtPin, INPUT_PULLUP);
  Serial.begin(9600);

  laatsteCLK = digitalRead(clkPin);
}

void loop() {
  int huidigeCLK = digitalRead(clkPin);

  if (huidigeCLK != laatsteCLK && huidigeCLK == LOW) {
    if (digitalRead(dtPin) != huidigeCLK) {
      positie++;
    } else {
      positie--;
    }
    Serial.println(positie);
  }

  laatsteCLK = huidigeCLK;
}`;

const enc_s2 = `int clkPin = 2;
int dtPin = 3;
int stepPin = 5;
int dirPin = 6;

int laatsteCLK;

void setup() {
  pinMode(clkPin, INPUT_PULLUP);
  pinMode(dtPin, INPUT_PULLUP);
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);

  laatsteCLK = digitalRead(clkPin);
}

void doeStap(int richting) {
  digitalWrite(dirPin, richting);
  digitalWrite(stepPin, HIGH);
  delayMicroseconds(800);
  digitalWrite(stepPin, LOW);
  delayMicroseconds(800);
}

void loop() {
  int huidigeCLK = digitalRead(clkPin);

  if (huidigeCLK != laatsteCLK && huidigeCLK == LOW) {
    if (digitalRead(dtPin) != huidigeCLK) {
      doeStap(HIGH);   // met de klok mee
    } else {
      doeStap(LOW);    // tegen de klok in
    }
  }

  laatsteCLK = huidigeCLK;
}`;

const enc_s3 = `int clkPin = 2;
int dtPin = 3;
int stepPin = 5;
int dirPin = 6;

int laatsteCLK;
int stappenPerKlik = 10;

void setup() {
  pinMode(clkPin, INPUT_PULLUP);
  pinMode(dtPin, INPUT_PULLUP);
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);

  laatsteCLK = digitalRead(clkPin);
}

void doeStappen(int richting, int aantal) {
  digitalWrite(dirPin, richting);
  for (int i = 0; i < aantal; i++) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(800);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(800);
  }
}

void loop() {
  int huidigeCLK = digitalRead(clkPin);

  if (huidigeCLK != laatsteCLK && huidigeCLK == LOW) {
    if (digitalRead(dtPin) != huidigeCLK) {
      doeStappen(HIGH, stappenPerKlik);
    } else {
      doeStappen(LOW, stappenPerKlik);
    }
  }

  laatsteCLK = huidigeCLK;
}`;

// ─────────────────────────────────────────────
// TUTORIAL 11: G-Code Plotter / 3D-Printer (theorie)
// ─────────────────────────────────────────────

const gcode_s1 = `// X- en Y-as motor (A4988 / DRV8825 drivers)
int stepPinX = 2;
int dirPinX = 3;

int stepPinY = 4;
int dirPinY = 5;

float huidigeX = 0;
float huidigeY = 0;

float stappenPerMm = 80;  // afhankelijk van de spindel / tandriem

void setup() {
  pinMode(stepPinX, OUTPUT);
  pinMode(dirPinX, OUTPUT);
  pinMode(stepPinY, OUTPUT);
  pinMode(dirPinY, OUTPUT);

  Serial.begin(9600);
  Serial.println("Klaar - stuur G-code via Serial Monitor");
}

void loop() {
  // wordt later ingevuld
}`;

const gcode_s2 = `int stepPinX = 2;
int dirPinX = 3;
int stepPinY = 4;
int dirPinY = 5;

float huidigeX = 0;
float huidigeY = 0;
float stappenPerMm = 80;

void doeStappen(int stepPin, int dirPin, long aantal, int richting) {
  digitalWrite(dirPin, richting);
  for (long i = 0; i < aantal; i++) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(500);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(500);
  }
}

void beweegNaar(float doelX, float doelY) {
  long stappenX = (doelX - huidigeX) * stappenPerMm;
  long stappenY = (doelY - huidigeY) * stappenPerMm;

  doeStappen(stepPinX, dirPinX, abs(stappenX), stappenX > 0 ? HIGH : LOW);
  doeStappen(stepPinY, dirPinY, abs(stappenY), stappenY > 0 ? HIGH : LOW);

  huidigeX = doelX;
  huidigeY = doelY;
}

void setup() {
  pinMode(stepPinX, OUTPUT);
  pinMode(dirPinX, OUTPUT);
  pinMode(stepPinY, OUTPUT);
  pinMode(dirPinY, OUTPUT);
}

void loop() {
  beweegNaar(50, 50);
  delay(2000);
  beweegNaar(0, 0);
  delay(2000);
}`;

const gcode_s3 = `int stepPinX = 2;
int dirPinX = 3;
int stepPinY = 4;
int dirPinY = 5;

float huidigeX = 0;
float huidigeY = 0;
float stappenPerMm = 80;

String invoer = "";

void doeStappen(int stepPin, int dirPin, long aantal, int richting) {
  digitalWrite(dirPin, richting);
  for (long i = 0; i < aantal; i++) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(500);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(500);
  }
}

void beweegNaar(float doelX, float doelY) {
  long stappenX = (doelX - huidigeX) * stappenPerMm;
  long stappenY = (doelY - huidigeY) * stappenPerMm;

  doeStappen(stepPinX, dirPinX, abs(stappenX), stappenX > 0 ? HIGH : LOW);
  doeStappen(stepPinY, dirPinY, abs(stappenY), stappenY > 0 ? HIGH : LOW);

  huidigeX = doelX;
  huidigeY = doelY;
}

void parseGCode(String regel) {
  // Voorbeeld: G1 X10 Y20
  if (!regel.startsWith("G1") && !regel.startsWith("G0")) return;

  float x = huidigeX;
  float y = huidigeY;

  int xIndex = regel.indexOf('X');
  if (xIndex >= 0) x = regel.substring(xIndex + 1).toFloat();

  int yIndex = regel.indexOf('Y');
  if (yIndex >= 0) y = regel.substring(yIndex + 1).toFloat();

  beweegNaar(x, y);
  Serial.print("OK X=");
  Serial.print(x);
  Serial.print(" Y=");
  Serial.println(y);
}

void setup() {
  pinMode(stepPinX, OUTPUT);
  pinMode(dirPinX, OUTPUT);
  pinMode(stepPinY, OUTPUT);
  pinMode(dirPinY, OUTPUT);
  Serial.begin(9600);
  Serial.println("Klaar - stuur G-code via Serial Monitor");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\\n') {
      parseGCode(invoer);
      invoer = "";
    } else {
      invoer += c;
    }
  }
}`;

const gcode_s4 = `int stepPinX = 2;
int dirPinX = 3;
int stepPinY = 4;
int dirPinY = 5;
int stepPinZ = 6;
int dirPinZ = 7;

float huidigeX = 0;
float huidigeY = 0;
float huidigeZ = 0;
float stappenPerMm = 80;

String invoer = "";

void doeStappen(int stepPin, int dirPin, long aantal, int richting) {
  digitalWrite(dirPin, richting);
  for (long i = 0; i < aantal; i++) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(500);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(500);
  }
}

void beweegNaar(float doelX, float doelY, float doelZ) {
  long stappenX = (doelX - huidigeX) * stappenPerMm;
  long stappenY = (doelY - huidigeY) * stappenPerMm;
  long stappenZ = (doelZ - huidigeZ) * stappenPerMm;

  doeStappen(stepPinX, dirPinX, abs(stappenX), stappenX > 0 ? HIGH : LOW);
  doeStappen(stepPinY, dirPinY, abs(stappenY), stappenY > 0 ? HIGH : LOW);
  doeStappen(stepPinZ, dirPinZ, abs(stappenZ), stappenZ > 0 ? HIGH : LOW);

  huidigeX = doelX;
  huidigeY = doelY;
  huidigeZ = doelZ;
}

void parseGCode(String regel) {
  // G28 = home (terug naar 0,0,0)
  if (regel.startsWith("G28")) {
    beweegNaar(0, 0, 0);
    Serial.println("OK home");
    return;
  }

  if (!regel.startsWith("G1") && !regel.startsWith("G0")) return;

  float x = huidigeX;
  float y = huidigeY;
  float z = huidigeZ;

  int xIndex = regel.indexOf('X');
  if (xIndex >= 0) x = regel.substring(xIndex + 1).toFloat();

  int yIndex = regel.indexOf('Y');
  if (yIndex >= 0) y = regel.substring(yIndex + 1).toFloat();

  int zIndex = regel.indexOf('Z');
  if (zIndex >= 0) z = regel.substring(zIndex + 1).toFloat();

  beweegNaar(x, y, z);
  Serial.print("OK X=");
  Serial.print(x);
  Serial.print(" Y=");
  Serial.print(y);
  Serial.print(" Z=");
  Serial.println(z);
}

void setup() {
  pinMode(stepPinX, OUTPUT);
  pinMode(dirPinX, OUTPUT);
  pinMode(stepPinY, OUTPUT);
  pinMode(dirPinY, OUTPUT);
  pinMode(stepPinZ, OUTPUT);
  pinMode(dirPinZ, OUTPUT);
  Serial.begin(9600);
  Serial.println("3D-Printer simulator - stuur G-code");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\\n') {
      parseGCode(invoer);
      invoer = "";
    } else {
      invoer += c;
    }
  }
}`;

// ─────────────────────────────────────────────
// TUTORIAL 8: Servo Motor
// ─────────────────────────────────────────────

const servo_s1 = `#include <Servo.h>

Servo servo1;

void setup() {
  servo1.attach(9);
}

void loop() {
  // Van 0 naar 180 graden
  for (int pos = 0; pos <= 180; pos++) {
    servo1.write(pos);
    delay(10);
  }

  // Van 180 naar 0 graden
  for (int pos = 180; pos >= 0; pos--) {
    servo1.write(pos);
    delay(10);
  }
}`;

const servo_s2 = `#include <Servo.h>

Servo servo1;

int joystickX = A0;

void setup() {
  servo1.attach(9);
}

void loop() {
  int waarde = analogRead(joystickX);

  // Omzetten naar graden (0–180)
  int hoek = map(waarde, 0, 1023, 0, 180);

  servo1.write(hoek);

  delay(15);
}`;

const servo_s3 = `#include <Servo.h>

Servo servo1;
Servo servo2;

int joystickX = A0;
int joystickY = A1;

void setup() {
  servo1.attach(9);
  servo2.attach(10);
}

void loop() {
  int x = analogRead(joystickX);
  int y = analogRead(joystickY);

  int hoekX = map(x, 0, 1023, 0, 180);
  int hoekY = map(y, 0, 1023, 0, 180);

  servo1.write(hoekX);
  servo2.write(hoekY);

  delay(15);
}`;

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
  },
  {
    id: "servo-motor",
    title: "Servo Motor",
    description: "Leer een servomotor aansturen: eerst automatisch heen en weer, daarna met een joystick. Als uitbreiding stuur je twee servo's tegelijk aan met beide assen van de joystick.",
    difficulty: "Gemiddeld",
    learningGoal: "Ik kan een servomotor aansturen met code én met een joystick, en begrijp hoe ik een analoge waarde omzet naar een hoek.",
    materials: "Arduino Uno, servomotor (SG90 of vergelijkbaar), joystick module, breadboard, draden.",
    dateAdded: "2026-04-13",
    steps: [
      {
        id: "servo-s1",
        title: "Servo aansluiten & sweep test",
        content: "Een servomotor draait naar een specifieke hoek (0–180°) op basis van een signaal. De Servo-bibliotheek is al ingebouwd in de Arduino IDE — je hoeft niks te installeren. Met attach() koppel je de servo aan een pin. De for-lus laat de servo automatisch heen en weer bewegen: dit noem je een 'sweep'. Een mooie eerste test: je ziet direct beweging zonder extra input.",
        diagram: true,
        code: servo_s1,
        legend: [
          { term: "#include <Servo.h>", desc: "Laad de ingebouwde Servo-bibliotheek. Geen installatie nodig." },
          { term: "Servo servo1", desc: "Maak een servo-object aan. Via dit object stuur je de motor aan." },
          { term: "servo1.attach(9)", desc: "Koppel de servo aan pin 9 (het oranje signaaldraadje)." },
          { term: "for (int pos = 0; pos <= 180; pos++)", desc: "Verhoog de hoek stap voor stap van 0 naar 180 graden." },
          { term: "servo1.write(pos)", desc: "Stuur de servo naar de opgegeven hoek in graden." },
          { term: "delay(10)", desc: "Wacht 10ms tussen elke stap zodat de motor kan bijhouden." },
        ],
        assignment: "Upload de code en kijk hoe de servo heen en weer draait. Verander delay(10) naar delay(50) — wat valt je op?",
        reflection: "Hoe gebruik je een servo in een echt project? Denk aan een robotarm of een automatisch raam."
      },
      {
        id: "servo-s2",
        title: "Servo besturen met joystick",
        content: "Nu voegen we interactie toe: de X-as van de joystick bepaalt de hoek van de servo. Een joystick geeft een analoge waarde (0–1023) terug. Met de map()-functie vertalen we die naar graden (0–180). Zo kun je de servo precies sturen door de joystick te bewegen.",
        diagram: true,
        code: servo_s2,
        legend: [
          { term: "int joystickX = A0", desc: "De X-as van de joystick is aangesloten op analoge pin A0." },
          { term: "analogRead(joystickX)", desc: "Leest de positie van de joystick: 0 = volledig links, 1023 = volledig rechts." },
          { term: "map(waarde, 0, 1023, 0, 180)", desc: "Zet de joystickwaarde (0–1023) om naar een hoek (0–180). map() schaalt automatisch." },
          { term: "servo1.write(hoek)", desc: "Stuur de servo naar de berekende hoek." },
          { term: "delay(15)", desc: "Korte pauze om de servo de tijd te geven de positie te bereiken." },
        ],
        assignment: "Beweeg de joystick langzaam van links naar rechts. Volgt de servo mee?",
        challenge: "Verander de map()-waarden zodat de servo alleen tussen 30° en 150° beweegt (dus niet meer naar de uiterste posities).",
        reflection: "Waarom gebruiken we map() in plaats van de waarde direct aan servo1.write() te geven?"
      },
      {
        id: "servo-s3",
        title: "Uitbreiding: twee servo's met beide assen",
        content: "Voor leerlingen die sneller gaan: voeg een tweede servo toe op pin 10 en gebruik ook de Y-as van de joystick (A1). Zo kan elke as van de joystick een eigen servo aansturen — de basis van een 2D-robotarm of pan-tilt systeem. Sluit de tweede servo aan met hetzelfde patroon: oranje naar pin 10, rood naar 5V, bruin naar GND.",
        diagram: true,
        code: servo_s3,
        legend: [
          { term: "Servo servo2", desc: "Tweede servo-object voor de extra motor." },
          { term: "int joystickY = A1", desc: "De Y-as van de joystick op analoge pin A1." },
          { term: "servo2.attach(10)", desc: "Koppel de tweede servo aan pin 10." },
          { term: "int y = analogRead(joystickY)", desc: "Lees de Y-positie van de joystick uit." },
          { term: "servo2.write(hoekY)", desc: "Stuur de tweede servo op basis van de Y-as." },
        ],
        assignment: "Sluit de tweede servo aan en test of elke joystick-as een eigen servo aanstuurt.",
        challenge: "Voeg een knop toe die beide servo's tegelijk terugzet naar 90° (middenpositie).",
        reflection: "Welk project kun je bouwen met twee servo's die je via een joystick bestuurt? Denk aan een camera-mount of speelgoedrobot.",
        optionalCodeTitle: "Snippet: alleen de toevoegingen voor servo 2",
        optionalCode: `// Bovenaan toevoegen:
Servo servo2;
int joystickY = A1;

// In setup() toevoegen:
servo2.attach(10);

// In loop() toevoegen:
int y = analogRead(joystickY);
int hoekY = map(y, 0, 1023, 0, 180);
servo2.write(hoekY);`
      }
    ]
  },
  {
    id: "stepper-basis",
    title: "Stappenmotor Basis (A4988 / DRV8825)",
    description: "Leer een stappenmotor aansturen via een A4988 of DRV8825 driver. Eerst draait de motor in één richting, daarna heen en terug in een loop. De basis voor elk preciesie-project zoals een plotter of CNC.",
    difficulty: "Gemiddeld",
    learningGoal: "Ik kan een stappenmotor aansturen met een driver (A4988 / DRV8825) via STEP- en DIR-pinnen.",
    materials: "Arduino Uno, NEMA 17 stappenmotor, A4988 of DRV8825 driver, externe 12V voeding (8–35V), 100µF condensator, breadboard, draden.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "stepper-s1",
        title: "Driver aansluiten & pinnen instellen",
        content: "Een stappenmotor draait niet vrij rond zoals een gewone DC-motor: hij beweegt in vaste 'stappen' (meestal 200 per omwenteling = 1.8° per stap). Een driver zoals de A4988 of DRV8825 vertaalt twee simpele signalen — STEP (puls) en DIR (richting) — naar de spoel-stromen die de motor exact één stap verzetten. BELANGRIJK: sluit nooit een stappenmotor direct aan op de Arduino. Hij heeft 12V (of vergelijkbaar) externe voeding nodig via de VMOT-pin van de driver. Plaats een 100µF condensator over VMOT/GND om spanningspieken op te vangen.",
        diagram: true,
        code: stepper_s1,
        legend: [
          { term: "int stepPin = 3", desc: "STEP-pin van de driver. Elke HIGH-puls = 1 stap van de motor." },
          { term: "int dirPin = 4", desc: "DIR-pin van de driver. HIGH = met de klok mee, LOW = tegen de klok in." },
          { term: "pinMode(stepPin, OUTPUT)", desc: "Stel de STEP-pin in als uitgang." },
          { term: "pinMode(dirPin, OUTPUT)", desc: "Stel de DIR-pin in als uitgang." },
        ],
        assignment: "Sluit de driver correct aan: VMOT + GND op je 12V voeding, VDD + GND op de Arduino, STEP op pin 3, DIR op pin 4. Verbind ook nSLEEP en nRESET met elkaar (anders slaapt de driver). De motor-spoelen sluit je aan op 1A/1B en 2A/2B.",
        reflection: "Waarom heeft een stappenmotor een aparte voeding nodig en kan een servo wel rechtstreeks op de 5V van de Arduino?"
      },
      {
        id: "stepper-s2",
        title: "Eén volledige omwenteling",
        content: "Om de motor één volledige omwenteling te laten maken, moeten we 200 keer een korte HIGH-puls naar de STEP-pin sturen (bij een standaard NEMA 17 zonder microstepping). De delayMicroseconds() bepaalt de snelheid: hoe korter de pauze, hoe sneller de motor draait. Te kort en de motor 'mist' stappen — probeer waarden tussen 500 en 2000 µs.",
        code: stepper_s2,
        legend: [
          { term: "int stappenPerOmwenteling = 200", desc: "Een NEMA 17 doet 200 stappen per volledige omwenteling (1.8° per stap). Bij microstepping vermenigvuldig je dit." },
          { term: "digitalWrite(dirPin, HIGH)", desc: "Bepaal de draairichting voordat je begint met stappen." },
          { term: "digitalWrite(stepPin, HIGH)", desc: "Start een puls op de STEP-pin." },
          { term: "delayMicroseconds(800)", desc: "Wacht 800 microseconden (0.8 ms). Dit bepaalt de snelheid van de motor." },
          { term: "digitalWrite(stepPin, LOW)", desc: "Beëindig de puls. Eén HIGH→LOW cyclus = 1 stap." },
        ],
        assignment: "Upload de code en kijk of de motor één omwenteling per seconde maakt. Verander delayMicroseconds(800) naar 400 — wat gebeurt er?",
        challenge: "Probeer delayMicroseconds(200). Op een gegeven moment slaat de motor over (mist hij stappen). Wat is bij jou de minimale waarde?",
        reflection: "Waarom heeft een stappenmotor 'stappen' en geen vloeiende beweging zoals een DC-motor? Wat is hier het voordeel van?"
      },
      {
        id: "stepper-s3",
        title: "Heen en terug in een loop",
        content: "Nu maken we de code netter door de stap-logica in een aparte functie doeOmwenteling() te zetten. Die functie krijgt een parameter mee: HIGH (met de klok mee) of LOW (tegen de klok in). In de loop() roepen we hem twee keer aan met verschillende richtingen — dit is precies de basis die je later gebruikt voor een plotter of 3D-printer.",
        code: stepper_s3,
        legend: [
          { term: "void doeOmwenteling(int richting)", desc: "Eigen functie die één omwenteling doet in de opgegeven richting." },
          { term: "doeOmwenteling(HIGH)", desc: "Roep de functie aan met richting HIGH = met de klok mee." },
          { term: "doeOmwenteling(LOW)", desc: "Tegen de klok in." },
          { term: "delay(500)", desc: "Korte pauze tussen de richtingswisselingen zodat je het verschil ziet." },
        ],
        assignment: "Upload de code. Draait de motor netjes heen en terug?",
        challenge: "Voeg een derde aanroep toe die slechts een halve omwenteling doet (100 stappen). Of: laat hem 5 keer een halve draai doen voor hij terugdraait.",
        reflection: "Hoe zou je dit gebruiken voor een echt project? Denk aan een automatische zonwering of een rolluik."
      }
    ]
  },
  {
    id: "stepper-encoder",
    title: "Stappenmotor + Rotary Encoder",
    description: "Combineer een stappenmotor met een rotary encoder. Door de encoder-knop te draaien, beweegt de motor mee — handig voor handmatige bediening van een CNC, plotter of focus-mechanisme.",
    difficulty: "Gevorderd",
    learningGoal: "Ik kan een rotary encoder uitlezen en de waarde gebruiken om een stappenmotor mee aan te sturen.",
    materials: "Arduino Uno, NEMA 17 stappenmotor, A4988/DRV8825 driver, KY-040 rotary encoder, externe 12V voeding, breadboard, draden.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "enc-s1",
        title: "Rotary encoder uitlezen",
        content: "Een rotary encoder is een knop die je in beide richtingen kunt blijven draaien. Hij heeft twee uitgangs-pinnen (CLK en DT) die verschoven HIGH/LOW signalen geven als je hem draait. Door te kijken welke pin als eerste verandert, kun je bepalen of er met de klok mee of tegen de klok in wordt gedraaid. We gebruiken een variabele 'positie' die op- of aftelt en printen die naar de Serial Monitor.",
        diagram: true,
        code: enc_s1,
        legend: [
          { term: "int clkPin = 2", desc: "CLK-pin van de encoder op pin 2. Dit is het 'klok'-signaal." },
          { term: "int dtPin = 3", desc: "DT-pin van de encoder op pin 3. Dit is het 'data'-signaal." },
          { term: "laatsteCLK = digitalRead(clkPin)", desc: "Onthoud de vorige stand van CLK om verandering te kunnen detecteren." },
          { term: "if (huidigeCLK != laatsteCLK && huidigeCLK == LOW)", desc: "Detecteer een overgang van HIGH naar LOW — dit is één 'klik' van de encoder." },
          { term: "if (digitalRead(dtPin) != huidigeCLK)", desc: "Vergelijk DT met CLK om de richting te bepalen." },
          { term: "Serial.println(positie)", desc: "Stuur de huidige positie naar de Serial Monitor zodat je kunt controleren of het werkt." },
        ],
        assignment: "Sluit de encoder aan en open de Serial Monitor (9600 baud). Draai de knop langzaam — de waarde moet op- en aftellen.",
        reflection: "Waarom heeft een encoder TWEE signalen (CLK en DT) nodig om de richting te bepalen, en niet maar één?"
      },
      {
        id: "enc-s2",
        title: "Stepper koppelen aan de encoder",
        content: "Nu koppelen we de encoder aan de stappenmotor. In plaats van een variabele op te tellen, sturen we direct één stap naar de motor zodra de encoder klikt. We hergebruiken de doeStap()-functie uit de basis-tutorial. Belangrijk: omdat we elke klik direct vertalen naar één stap, draait de motor maar heel langzaam — daar lossen we straks iets aan op.",
        diagram: true,
        code: enc_s2,
        legend: [
          { term: "int stepPin = 5", desc: "STEP-pin van de driver. We kiezen pin 5 zodat 2 en 3 vrij zijn voor de encoder." },
          { term: "int dirPin = 6", desc: "DIR-pin van de driver." },
          { term: "void doeStap(int richting)", desc: "Functie die één enkele stap doet in de gegeven richting." },
          { term: "doeStap(HIGH)", desc: "Eén stap met de klok mee — gekoppeld aan een klik rechtsom." },
          { term: "doeStap(LOW)", desc: "Eén stap tegen de klok in — gekoppeld aan een klik linksom." },
        ],
        assignment: "Upload de code. Draai aan de encoder en kijk of de motor mee beweegt.",
        challenge: "De motor beweegt maar heel weinig per klik (1 stap = 1.8°). Hoe los je dat in de volgende stap op?",
        reflection: "Waarom is het slim om de stap-logica in een aparte functie te zetten in plaats van alles in loop()?"
      },
      {
        id: "enc-s3",
        title: "Versnellen: meerdere stappen per klik",
        content: "Nu maken we de motor sneller door bij elke encoder-klik niet 1, maar 10 stappen tegelijk te doen. We veranderen doeStap() naar doeStappen() met een parameter 'aantal'. Met 10 stappen per klik (= 18° per klik) voelt het meteen veel responsiever. Probeer ook eens 50 of 100 — dan heb je een echte 'jog'-functie zoals op een CNC.",
        code: enc_s3,
        legend: [
          { term: "int stappenPerKlik = 10", desc: "Hoeveel stappen de motor per encoder-klik doet. Verhoog voor snellere beweging." },
          { term: "void doeStappen(int richting, int aantal)", desc: "Aangepaste functie die meerdere stappen per aanroep doet." },
          { term: "for (int i = 0; i < aantal; i++)", desc: "Lus die het opgegeven aantal stappen uitvoert." },
          { term: "doeStappen(HIGH, stappenPerKlik)", desc: "Doe stappenPerKlik stappen met de klok mee." },
        ],
        assignment: "Test met stappenPerKlik = 10, dan = 50, dan = 200 (een hele omwenteling per klik). Welk getal voelt het natuurlijkst?",
        challenge: "Voeg een drukknop toe die 'stappenPerKlik' wisselt tussen 1 (precisie) en 50 (snel). Zo heb je een fijn-instelling én een grof-instelling.",
        reflection: "Bedenk een toepassing waar deze constructie nuttig is: handmatig de Z-as van een 3D-printer instellen? Een microscoop scherpstellen? Een telescoop richten?"
      }
    ]
  },
  {
    id: "gcode-plotter",
    title: "G-Code Plotter / 3D-Printer (theorie)",
    description: "Bouw zelf de basis van een plotter of 3D-printer: een G-code parser die meerdere stappenmotoren coördineert. Deze tutorial laat zien HOE een 3D-printer werkt — perfect voor de theorie.",
    difficulty: "Expert",
    learningGoal: "Ik begrijp hoe een 3D-printer of plotter G-code interpreteert en die vertaalt naar gecoördineerde bewegingen van meerdere stappenmotoren.",
    materials: "Arduino Uno (of Mega voor 3 motoren), 2–3x A4988/DRV8825 drivers, 2–3x NEMA 17 stappenmotoren, externe 12V voeding (5A+), condensatoren, breadboard, veel draden. Optioneel: complete CNC-shield.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "gcode-s1",
        title: "Twee assen aansluiten (X & Y)",
        content: "Een plotter beweegt over twee assen: X (links/rechts) en Y (voor/achter). Elke as heeft een eigen stappenmotor met een eigen driver. We definiëren per as een STEP- en DIR-pin. Daarnaast houden we 'huidigeX' en 'huidigeY' bij — de positie in millimeters waar de plotter nu staat. De variabele 'stappenPerMm' bepaalt hoeveel motorstappen er nodig zijn voor 1 mm beweging — dit hangt af van de mechanica (tandriem of leadscrew).",
        diagram: true,
        code: gcode_s1,
        legend: [
          { term: "int stepPinX = 2", desc: "STEP-pin voor de X-as motor." },
          { term: "int dirPinX = 3", desc: "DIR-pin voor de X-as motor." },
          { term: "int stepPinY = 4", desc: "STEP-pin voor de Y-as motor." },
          { term: "int dirPinY = 5", desc: "DIR-pin voor de Y-as motor." },
          { term: "float huidigeX = 0", desc: "Houdt bij waar de plotter NU staat op de X-as (in mm)." },
          { term: "float stappenPerMm = 80", desc: "Conversie: hoeveel motorstappen = 1 mm beweging. Hangt af van je tandriem (GT2 = 80) of leadscrew." },
        ],
        assignment: "Sluit twee complete drivers aan zoals in de stepper-basis tutorial — alleen nu twee tegelijk, op verschillende pinnen. Zorg voor een sterke voeding (5A+).",
        reflection: "Waarom is het zo belangrijk om 'huidigeX' en 'huidigeY' bij te houden? Wat zou er gebeuren als je dat niet doet?"
      },
      {
        id: "gcode-s2",
        title: "Een beweegNaar(x, y) functie",
        content: "Het hart van elke plotter is een functie die zegt: 'ga van waar je nu bent naar coördinaat (X, Y)'. Onze beweegNaar() berekent het verschil tussen waar we zijn en waar we naartoe moeten, vermenigvuldigt met stappenPerMm, en stuurt dat aantal stappen naar de juiste motor. Let op: in deze versie bewegen X en Y na elkaar, niet tegelijk — een echte plotter doet dat wel via 'Bresenham' of 'linear interpolation', maar dat is een latere uitbreiding.",
        code: gcode_s2,
        legend: [
          { term: "void doeStappen(int stepPin, int dirPin, long aantal, int richting)", desc: "Generieke stap-functie die op WELKE motor dan ook werkt — we geven gewoon de pinnen mee." },
          { term: "long stappenX = (doelX - huidigeX) * stappenPerMm", desc: "Bereken hoeveel stappen we moeten doen: verschil in mm × stappen-per-mm." },
          { term: "stappenX > 0 ? HIGH : LOW", desc: "Als het doel verder is dan waar we zijn → vooruit. Anders achteruit." },
          { term: "abs(stappenX)", desc: "Het AANTAL stappen is altijd positief; de richting bepalen we apart met HIGH/LOW." },
          { term: "huidigeX = doelX", desc: "Update onze positie. Cruciaal! Zonder dit is de volgende beweging fout." },
        ],
        assignment: "Upload de code en kijk of de motoren naar (50, 50) bewegen en weer terug naar (0, 0). Houd de motoren los of zet er een marker op.",
        challenge: "Voeg een derde aanroep toe: beweegNaar(100, 0). Welke route volgt de pen nu?",
        reflection: "Waarom bewegen X en Y in deze versie ná elkaar in plaats van tegelijk? Wat zou je zien op papier als je een diagonaal probeert te tekenen?"
      },
      {
        id: "gcode-s3",
        title: "G-Code parser bouwen",
        content: "G-code is de internationale taal van CNC's en 3D-printers. Een regel ziet er bijvoorbeeld zo uit: 'G1 X10 Y20'. G1 = beweeg, X10 = ga naar X = 10 mm, Y20 = ga naar Y = 20 mm. We schrijven een parseGCode() functie die een tekstregel uit elkaar haalt: zoek 'X' en 'Y' in de string en lees de getallen die erna staan. Vervolgens roept hij beweegNaar() aan. We lezen regels van de Serial Monitor, waardoor je via de pc commando's naar je plotter kunt sturen.",
        code: gcode_s3,
        legend: [
          { term: "String invoer = \"\"", desc: "Buffer waarin we karakter-voor-karakter de binnenkomende G-code regel opbouwen." },
          { term: "regel.startsWith(\"G1\")", desc: "Controleer of de regel begint met G1 (lineaire beweging). Andere commando's negeren we hier." },
          { term: "regel.indexOf('X')", desc: "Zoek de positie van het karakter 'X' in de regel. Geeft -1 als het niet gevonden is." },
          { term: "regel.substring(xIndex + 1).toFloat()", desc: "Pak alles na de 'X' en zet het om naar een float. 'X10 Y20' → 10.00." },
          { term: "if (c == '\\n')", desc: "Newline = einde van een commando. Tijd om te parsen en uit te voeren." },
          { term: "Serial.println(\"OK ...\")", desc: "Bevestig dat het commando is uitgevoerd — 3D-printers gebruiken dit om te weten of ze de volgende regel mogen sturen." },
        ],
        assignment: "Upload, open Serial Monitor (zet 'Newline' aan onderin), en typ: 'G1 X20 Y20'. De motoren moeten bewegen. Probeer dan 'G1 X0 Y0' om terug te gaan.",
        challenge: "Schrijf een korte 'tekening' uit als G-code en plak hem in de Serial Monitor (regel voor regel): bijvoorbeeld een vierkant van 4 hoeken.",
        reflection: "Echte slicer-software (zoals Cura of PrusaSlicer) genereert duizenden regels G-code voor één 3D-print. Hoe zou jij die hier in stromen via Serial?"
      },
      {
        id: "gcode-s4",
        title: "Z-as toevoegen — een echte 3D-printer in concept",
        content: "Een 3D-printer voegt een derde as toe: Z (omhoog/omlaag). We breiden de pin-definities, beweegNaar() en de parser uit met Z. Ook implementeren we G28 (home) — dat brengt alle assen terug naar (0, 0, 0). Dit is conceptueel een complete 3D-printer firmware: lees G-code via Serial → parse → coördineer 3 motoren. Wat ontbreekt voor een ÉCHTE printer? Een hot-end (E-as voor extrusie), end-stop sensoren voor homing, temperatuur-controle, en interpolatie zodat assen tegelijk bewegen. Maar het principe is identiek aan dat van een Marlin-firmware.",
        code: gcode_s4,
        legend: [
          { term: "int stepPinZ = 6 / int dirPinZ = 7", desc: "STEP en DIR voor de derde motor (Z-as)." },
          { term: "float huidigeZ = 0", desc: "Houdt de Z-positie bij." },
          { term: "regel.startsWith(\"G28\")", desc: "G28 = Home All Axes. Beweeg naar (0, 0, 0). In een echte printer zou je hier endstop-sensoren gebruiken." },
          { term: "beweegNaar(0, 0, 0)", desc: "Naar de oorsprong. Pure software-home zonder sensoren." },
          { term: "void beweegNaar(float doelX, float doelY, float doelZ)", desc: "Uitgebreide versie die nu ook Z meeneemt." },
          { term: "Serial.println(\"OK X=...\")", desc: "Bevestig met de huidige positie zodat de host-software synchroon blijft." },
        ],
        assignment: "Test met: 'G1 X10 Y10 Z5' en daarna 'G28'. Werken alle 3 motoren correct?",
        challenge: "Voeg een M3 / M5 commando toe (pen-omlaag / pen-omhoog) door een servo aan te sturen — dan heb je een complete pen-plotter. Voor 3D-printen zou je een vierde 'E-as' toevoegen voor de extruder.",
        reflection: "Welke 4 dingen ontbreken er nog om dit een ECHTE 3D-printer te maken? En welk onderdeel van het bovenstaande systeem zou je het meest verbazen dat het in elke 3D-printer ter wereld op deze manier werkt?",
        optionalCodeTitle: "Theorie: hoe Bresenham diagonalen vloeiend maakt",
        optionalCode: `// In een ECHTE printer bewegen X en Y TEGELIJK voor een diagonaal.
// Dat doe je met het Bresenham algoritme. Pseudo-code:

void beweegLineair(long stappenX, long stappenY) {
  long max = max(abs(stappenX), abs(stappenY));
  long error = 0;

  for (long i = 0; i < max; i++) {
    // Doe altijd een stap op de 'lange' as
    digitalWrite(stepPinX, HIGH);
    delayMicroseconds(500);
    digitalWrite(stepPinX, LOW);

    // Op de 'korte' as: stap alleen als de error groot genoeg is
    error += abs(stappenY);
    if (error >= max) {
      digitalWrite(stepPinY, HIGH);
      delayMicroseconds(500);
      digitalWrite(stepPinY, LOW);
      error -= max;
    }

    delayMicroseconds(500);
  }
}

// Hierdoor lijkt de beweging van afstand een rechte diagonaal,
// terwijl de motoren in werkelijkheid getrapte stapjes maken.`
      }
    ]
  },
  {
    id: "i2c-lcd",
    title: "I2C LCD Display (16x2)",
    description: "Toon tekst, getallen en sensorwaarden op een 16x2 LCD-display met I2C-backpack. Slechts 4 draadjes en je hebt een volwaardig scherm voor elk Arduino-project.",
    difficulty: "Gemiddeld",
    learningGoal: "Ik kan een I2C LCD-display aansturen, de cursor verplaatsen en live sensorwaarden tonen op het scherm.",
    materials: "Arduino Uno, 16x2 LCD-display met I2C-backpack (PCF8574, vaak adres 0x27 of 0x3F), 4 draadjes, breadboard, potmeter (voor stap 3). Bibliotheek: LiquidCrystal_I2C (te installeren via de Library Manager).",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "lcd-s1",
        title: "Hallo wereld op het scherm",
        content: "Een gewone 16x2 LCD heeft 16 pinnen — een hoop bedrading. Met de I2C-backpack (een klein groen printplaatje achterop) wordt dat teruggebracht tot 4 draadjes: VCC, GND, SDA en SCL. SDA en SCL zijn de twee 'I2C-bus'-lijnen. Op een Arduino Uno zitten deze altijd op A4 (SDA) en A5 (SCL) — dat is een vaste afspraak van de hardware. We gebruiken de bibliotheek 'LiquidCrystal_I2C' (installeer via Schets → Bibliotheek beheren). Het adres is meestal 0x27, soms 0x3F — als je niets ziet, probeer dan 0x3F.",
        diagram: true,
        code: lcd_s1,
        legend: [
          { term: "#include <Wire.h>", desc: "Standaard Arduino-bibliotheek voor I2C-communicatie." },
          { term: "#include <LiquidCrystal_I2C.h>", desc: "Bibliotheek die de LCD-commando's vertaalt naar I2C-signalen." },
          { term: "LiquidCrystal_I2C lcd(0x27, 16, 2)", desc: "Maak een LCD-object op adres 0x27, met 16 kolommen en 2 rijen." },
          { term: "lcd.init()", desc: "Initialiseer de LCD. Dit moet altijd in setup()." },
          { term: "lcd.backlight()", desc: "Zet de achtergrondverlichting aan zodat je de tekst kunt zien." },
          { term: "lcd.print(\"Hallo wereld!\")", desc: "Schrijf tekst op de huidige cursor-positie (standaard linksboven)." },
        ],
        assignment: "Sluit het scherm aan (4 draadjes), upload de code en kijk of je 'Hallo wereld!' ziet. Als je alleen blokjes ziet → draai aan de blauwe potmeter op de I2C-backpack om het contrast in te stellen.",
        challenge: "Werkt 0x27 niet? Probeer 0x3F. Werkt geen van beide? Upload een 'I2C scanner'-schets (te vinden online) — die print het juiste adres in de Serial Monitor.",
        reflection: "Waarom is het zo handig dat I2C maar 2 datalijnen gebruikt, ook als je meerdere apparaten aansluit?"
      },
      {
        id: "lcd-s2",
        title: "Een teller die elke seconde vernieuwt",
        content: "Nu maken we het scherm dynamisch. We gebruiken setCursor(kolom, rij) om naar een specifieke positie te springen — bijvoorbeeld kolom 0 op de tweede rij. BELANGRIJK: lcd.print() overschrijft tekens NIET netjes — als je eerst '999' schrijft en daarna '5', zie je '599'. De truc: schrijf eerst een rij spaties op die plek om de oude waarde te wissen, en daarna pas het nieuwe getal.",
        diagram: true,
        code: lcd_s2,
        legend: [
          { term: "int teller = 0", desc: "Variabele die we elke loop met 1 verhogen." },
          { term: "lcd.setCursor(0, 1)", desc: "Spring naar kolom 0 (helemaal links), rij 1 (de tweede regel — getallen beginnen vanaf 0)." },
          { term: "lcd.print(\"        \")", desc: "Schrijf 8 spaties om de oude waarde te wissen. Anders blijven oude cijfers staan." },
          { term: "lcd.print(teller)", desc: "Print de huidige tellerwaarde op het scherm." },
          { term: "teller++", desc: "Verhoog de teller met 1." },
          { term: "delay(1000)", desc: "Wacht 1 seconde voor de volgende update." },
        ],
        assignment: "Upload en kijk of je teller per seconde omhoog telt op de tweede regel.",
        challenge: "Verander de teller zo dat hij na 100 weer terug naar 0 gaat. Tip: gebruik een if-statement of de modulo-operator (%).",
        reflection: "Waarom moet je eerst spaties schrijven om de oude waarde te wissen? Wat zou er gebeuren als je dat niet doet en de teller van 100 naar 99 gaat?"
      },
      {
        id: "lcd-s3",
        title: "Toon een sensorwaarde live op het scherm",
        content: "Tijd voor de echte kracht van een display: live sensorwaarden tonen zonder Serial Monitor. We sluiten een potmeter aan (zoals in de Potmeter & LED tutorial) en tonen de waarde 0–1023 op het scherm. De delay is nu maar 100 ms zodat het scherm soepel meebeweegt als je aan de potmeter draait. Dit is precies wat je nodig hebt voor een eigen meter, thermostaat, of CNC-controlpaneel.",
        diagram: true,
        code: lcd_s3,
        legend: [
          { term: "int potPin = A0", desc: "Analoge pin waar de potmeter (midden-pootje) op zit." },
          { term: "int waarde = analogRead(potPin)", desc: "Lees de potmeter — geeft een getal tussen 0 en 1023." },
          { term: "lcd.print(waarde)", desc: "Toon de waarde op het scherm." },
          { term: "lcd.print(\" / 1023\")", desc: "Print extra tekst op dezelfde regel achter het getal." },
          { term: "delay(100)", desc: "Vernieuw 10x per seconde — voelt soepel zonder dat het scherm flikkert." },
        ],
        assignment: "Sluit de potmeter aan zoals in de aansluitschema. Draai eraan en kijk of de waarde op het scherm verandert van 0 tot 1023.",
        challenge: "Vervang de potmeter door een LDR (uit de LDR-tutorial) of een DHT11 (uit de temperatuur-tutorial) en toon de echte sensorwaarde — bijvoorbeeld de temperatuur in graden.",
        reflection: "Bedenk een project waar dit display essentieel zou zijn: een mini-weerstation, een eigen game-score, een instelmenu voor je 3D-printer? Wat zou jij maken?",
        optionalCodeTitle: "Snippet: een vaste tekst + dynamische waarde naast elkaar",
        optionalCode: `// Voorbeeld: "Temp: 23 C" — vaste tekst + dynamisch getal
lcd.setCursor(0, 0);
lcd.print("Temp: ");
lcd.print(temperatuur);
lcd.print(" C");

// De vaste tekst "Temp: " hoef je niet elke loop opnieuw te schrijven —
// die kun je ook één keer in setup() printen, en dan in loop()
// alleen de positie van het getal updaten met setCursor(6, 0).`
      }
    ]
  }
];
