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

export type Board = "arduino" | "esp32";

export type TutorialTag =
  | "basis"
  | "sensor"
  | "display"
  | "motor"
  | "game"
  | "domotica"
  | "internet";

export type Tutorial = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Gemiddeld" | "Gevorderd" | "Expert";
  materials: string;
  learningGoal: string;
  steps: TutorialStep[];
  dateAdded?: string;
  board?: Board;
  tags?: TutorialTag[];
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

const lcd_s4 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int ldrPin = A0;

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Lichtmeter");
}

void loop() {
  int waarde = analogRead(ldrPin);

  // Bepaal een vriendelijk label op basis van de waarde
  String label;
  if (waarde < 300)      label = "DONKER";
  else if (waarde < 700) label = "SCHEMER";
  else                   label = "FEL LICHT";

  lcd.setCursor(0, 1);
  lcd.print("                ");   // wis hele regel
  lcd.setCursor(0, 1);
  lcd.print(waarde);
  lcd.print(" ");
  lcd.print(label);

  delay(200);
}`;

const lcd_s5 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int dht11Pin = 2;
DHT dht(dht11Pin, DHT11);

void setup() {
  lcd.init();
  lcd.backlight();
  dht.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float vocht = dht.readHumidity();

  // Soms mislukt een meting (vooral bij opstart) en geeft NaN terug.
  // Vang dat netjes af zodat er geen "nan" op het scherm verschijnt.
  if (isnan(temp) || isnan(vocht)) {
    lcd.setCursor(0, 0);
    lcd.print("Sensor fout!    ");
    lcd.setCursor(0, 1);
    lcd.print("Probeer opnieuw ");
    delay(2000);
    return;
  }

  // Eerste regel: temperatuur
  lcd.setCursor(0, 0);
  lcd.print("Temp:  ");
  lcd.print(temp, 1);   // 1 cijfer achter de komma
  lcd.print((char)223); // graden-symbool
  lcd.print("C  ");

  // Tweede regel: luchtvochtigheid
  lcd.setCursor(0, 1);
  lcd.print("Vocht: ");
  lcd.print(vocht, 1);
  lcd.print(" %    ");

  delay(2000);  // DHT11 mag maar elke ~2 sec uitgelezen worden
}`;

const lcd_s6 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int buttonPin = 7;
int teller = 0;
int vorigeStaat = HIGH;

void setup() {
  lcd.init();
  lcd.backlight();
  pinMode(buttonPin, INPUT_PULLUP);
  lcd.print("Druk op de knop:");
}

void loop() {
  int huidig = digitalRead(buttonPin);

  // Detecteer alleen de OVERGANG van los → ingedrukt
  if (huidig == LOW && vorigeStaat == HIGH) {
    teller++;
  }
  vorigeStaat = huidig;

  lcd.setCursor(0, 1);
  lcd.print("                ");
  lcd.setCursor(0, 1);
  lcd.print(teller);
  lcd.print(" keer ingedrukt");

  delay(20);  // simpele debounce
}`;

// ─────────────────────────────────────────────
// TUTORIAL 13: ESP32 Web Dashboard met live grafiek
// ─────────────────────────────────────────────

const dash_s1 = `#include <WiFi.h>

// Vul jouw WiFi-gegevens in:
const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

void connectWifi() {
  Serial.print("Verbinden met ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Verbonden! IP-adres: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  connectWifi();
}

void loop() {
  // Open de Serial Monitor (115200 baud) en kijk welk IP je krijgt.
}`;

const dash_s2 = `#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

WebServer server(80);   // luister op poort 80 (standaard webpoort)

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Open in je browser: http://");
  Serial.println(WiFi.localIP());
}

void handleRoot() {
  server.send(200, "text/html",
    "<h1>Hallo vanuit ESP32!</h1>"
    "<p>Deze pagina komt rechtstreeks van jouw chip.</p>");
}

void setup() {
  Serial.begin(115200);
  connectWifi();
  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
}`;

const dash_s3 = `#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

int potPin = 34;        // ESP32: GPIO 34 is alleen-input + analoog

WebServer server(80);

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Open: http://");
  Serial.println(WiFi.localIP());
}

void handleRoot() {
  server.send(200, "text/html",
    "<h1>Dashboard</h1>"
    "<p>Bekijk de live data op <a href='/data'>/data</a></p>");
}

void handleData() {
  int waarde = analogRead(potPin);   // 0..4095 op ESP32
  // R"(...)" = raw string in C++, geen escapes nodig.
  String json = R"({"waarde":)" + String(waarde) + "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  connectWifi();
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
}

void loop() {
  server.handleClient();
}`;

const dash_s4 = `#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

int potPin = 34;
WebServer server(80);

const char index_html[] PROGMEM = R"HTML(
<!DOCTYPE html><html><head><meta charset="utf-8">
<title>ESP32 Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  body{font-family:sans-serif;max-width:600px;margin:2em auto;padding:1em}
  h1{color:#0a84ff} canvas{background:#fff;border-radius:8px;padding:1em}
</style></head><body>
<h1>ESP32 Live Dashboard</h1>
<p>Sensor: <strong id="val">-</strong></p>
<canvas id="c" width="600" height="300"></canvas>
<script>
const labels=[],data=[];
const ch=new Chart(document.getElementById('c'),{
  type:'line',
  data:{labels,datasets:[{label:'Sensor',data,borderColor:'#0a84ff',tension:0.2}]},
  options:{animation:false,scales:{y:{min:0,max:4095}}}
});
async function tick(){
  const r=await fetch('/data');
  const j=await r.json();
  document.getElementById('val').textContent=j.waarde;
  labels.push(new Date().toLocaleTimeString());
  data.push(j.waarde);
  if(labels.length>30){labels.shift();data.shift();}
  ch.update();
}
setInterval(tick,1000);tick();
</script></body></html>
)HTML";

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Open: http://");
  Serial.println(WiFi.localIP());
}

void handleRoot() { server.send_P(200, "text/html", index_html); }

void handleData() {
  int waarde = analogRead(potPin);
  String json = R"({"waarde":)" + String(waarde) + "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  pinMode(potPin, INPUT);
  connectWifi();
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
}

void loop() { server.handleClient(); }`;

// ─────────────────────────────────────────────
// TUTORIAL 14: ESP32 Smart Switch
// ─────────────────────────────────────────────

const sw_s1 = `#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

int ledPin = 2;          // GPIO 2 = ingebouwde LED op de meeste ESP32-boards
bool ledAan = false;
WebServer server(80);

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Open: http://");
  Serial.println(WiFi.localIP());
}

void schrijfLed() {
  digitalWrite(ledPin, ledAan ? HIGH : LOW);
}

void handleRoot() {
  String status = ledAan ? "AAN" : "UIT";
  server.send(200, "text/html",
    "<h1>Smart Switch</h1><p>LED is nu: " + status + "</p>"
    "<p><a href='/aan'>AAN</a> | <a href='/uit'>UIT</a></p>");
}

void handleAan() {
  ledAan = true; schrijfLed();
  server.sendHeader("Location", "/");   // terug naar hoofdpagina
  server.send(303);
}

void handleUit() {
  ledAan = false; schrijfLed();
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  schrijfLed();
  connectWifi();
  server.on("/", handleRoot);
  server.on("/aan", handleAan);
  server.on("/uit", handleUit);
  server.begin();
}

void loop() {
  server.handleClient();
}`;

const sw_s2 = `#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

int ledPin = 2;
bool ledAan = false;
WebServer server(80);

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Open: http://");
  Serial.println(WiFi.localIP());
}

void schrijfLed() { digitalWrite(ledPin, ledAan ? HIGH : LOW); }

void handleRoot() {
  String status = ledAan ? "AAN" : "UIT";
  String label  = ledAan ? "Zet UIT" : "Zet AAN";
  server.send(200, "text/html",
    "<h1>Smart Switch</h1><p>Status: " + status + "</p>"
    "<p><a href='/toggle'>" + label + "</a></p>");
}

void handleToggle() {
  ledAan = !ledAan;        // wissel
  schrijfLed();
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  schrijfLed();
  connectWifi();
  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
}

void loop() { server.handleClient(); }`;

const sw_s3 = `#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

int ledPin = 2;
bool ledAan = false;
WebServer server(80);

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Open: http://");
  Serial.println(WiFi.localIP());
}

void schrijfLed() { digitalWrite(ledPin, ledAan ? HIGH : LOW); }

String maakPagina() {
  String html = "<!DOCTYPE html><html><head><meta charset='utf-8'>";
  html += "<meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<title>Smart Switch</title>";
  html += "<style>body{font-family:sans-serif;text-align:center;padding:3em;background:#f1f5f9}";
  html += ".card{background:#fff;padding:2em;border-radius:1em;max-width:300px;margin:auto;";
  html += "box-shadow:0 4px 16px #0001}";
  html += ".dot{width:80px;height:80px;border-radius:50%;margin:1em auto}";
  html += ".aan{background:#22c55e}.uit{background:#94a3b8}";
  html += ".btn{display:inline-block;padding:1em 2em;background:#0a84ff;color:#fff;";
  html += "border-radius:0.5em;text-decoration:none;font-weight:bold}";
  html += "</style></head><body><div class='card'><h1>Smart Switch</h1>";

  if (ledAan) {
    html += "<div class='dot aan'></div><p>Status: <strong>AAN</strong></p>";
  } else {
    html += "<div class='dot uit'></div><p>Status: <strong>UIT</strong></p>";
  }
  html += "<a class='btn' href='/toggle'>Wissel</a>";
  html += "</div></body></html>";
  return html;
}

void handleRoot() { server.send(200, "text/html", maakPagina()); }
void handleToggle() {
  ledAan = !ledAan; schrijfLed();
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT); schrijfLed();
  connectWifi();
  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
}

void loop() { server.handleClient(); }`;

// ─────────────────────────────────────────────
// TUTORIAL 15: ESP32 Discord-melding bij beweging
// ─────────────────────────────────────────────

const ds_s1 = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

// Plak hier je webhook URL (Discord -> kanaal-instellingen -> Integraties -> Webhooks)
const char* webhookUrl = "https://discord.com/api/webhooks/JOUW_ID/JOUW_TOKEN";

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Verbonden! IP: ");
  Serial.println(WiFi.localIP());
}

void stuurDiscord(String bericht) {
  HTTPClient http;
  http.begin(webhookUrl);
  http.addHeader("Content-Type", "application/json");

  String json = R"({"content":")" + bericht + R"("})";
  int code = http.POST(json);

  Serial.print("HTTP-status: ");
  Serial.println(code);   // 204 = succes (No Content)
  http.end();
}

void setup() {
  Serial.begin(115200);
  connectWifi();
  stuurDiscord("Hallo vanuit ESP32!");
}

void loop() {
  // niks - dit was een eenmalig test-bericht
}`;

const ds_s2 = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";
const char* webhookUrl = "https://discord.com/api/webhooks/JOUW_ID/JOUW_TOKEN";

int pirPin = 13;

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Verbonden! IP: ");
  Serial.println(WiFi.localIP());
}

void stuurDiscord(String bericht) {
  HTTPClient http;
  http.begin(webhookUrl);
  http.addHeader("Content-Type", "application/json");
  String json = R"({"content":")" + bericht + R"("})";
  http.POST(json);
  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(pirPin, INPUT);
  connectWifi();
}

void loop() {
  if (digitalRead(pirPin) == HIGH) {
    Serial.println("Beweging gedetecteerd!");
    stuurDiscord("Er was net iemand in mijn kamer.");
    delay(3000);   // korte rust om spam te voorkomen
  }
}`;

const ds_s3 = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";
const char* webhookUrl = "https://discord.com/api/webhooks/JOUW_ID/JOUW_TOKEN";

int pirPin = 13;

unsigned long laatsteMelding = 0;
const unsigned long cooldownMs = 60UL * 1000UL;   // 1 minuut

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Verbonden! IP: ");
  Serial.println(WiFi.localIP());
}

void stuurDiscord(String bericht) {
  HTTPClient http;
  http.begin(webhookUrl);
  http.addHeader("Content-Type", "application/json");
  String json = R"({"content":")" + bericht + R"("})";
  http.POST(json);
  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(pirPin, INPUT);
  connectWifi();
}

void loop() {
  if (digitalRead(pirPin) == HIGH) {
    unsigned long nu = millis();
    if (nu - laatsteMelding >= cooldownMs) {
      laatsteMelding = nu;
      Serial.println("Beweging - melding verstuurd");
      stuurDiscord("Er was net iemand in mijn kamer.");
    } else {
      Serial.println("Beweging - cooldown actief, geen melding");
    }
  }
  delay(100);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 16: ESP32 Crypto-ticker
// ─────────────────────────────────────────────

const cr_s1 = `#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

const char* coinUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur";

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

String haalKoers() {
  WiFiClientSecure client;
  client.setInsecure();   // sla certificaat-check over (oké voor leerproject)

  HTTPClient http;
  http.begin(client, coinUrl);
  int code = http.GET();
  String body = (code == 200) ? http.getString() : "";
  http.end();
  return body;
}

void setup() {
  Serial.begin(115200);
  connectWifi();
  String body = haalKoers();
  Serial.println("Antwoord van CoinGecko:");
  Serial.println(body);
}

void loop() {}`;

const cr_s2 = `#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

const char* coinUrl = "https://api.coingecko.com/api/v3/simple/price"
                      "?ids=bitcoin&vs_currencies=eur&include_24hr_change=true";

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void haalEnToon() {
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.begin(client, coinUrl);

  if (http.GET() == 200) {
    StaticJsonDocument<256> doc;
    deserializeJson(doc, http.getStream());

    float prijs  = doc["bitcoin"]["eur"];
    float change = doc["bitcoin"]["eur_24h_change"];

    Serial.print("BTC: EUR ");
    Serial.println(prijs, 2);
    Serial.print("24u: ");
    Serial.print(change, 2);
    Serial.println(" %");
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  connectWifi();
}

void loop() {
  haalEnToon();
  delay(60000);   // elke minuut verversen
}`;

const cr_s3 = `#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

const char* coinUrl = "https://api.coingecko.com/api/v3/simple/price"
                      "?ids=bitcoin&vs_currencies=eur&include_24hr_change=true";

LiquidCrystal_I2C lcd(0x27, 16, 2);

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void toon(float prijs, float change) {
  // Pijl-symbool: kies op basis van richting
  char pijl = (change > 0) ? '^' : (change < 0 ? 'v' : '-');

  lcd.setCursor(0, 0);
  lcd.print("BTC EUR ");
  lcd.print(prijs, 0);
  lcd.print("        ");

  lcd.setCursor(0, 1);
  lcd.print(pijl);
  lcd.print(" ");
  lcd.print(change, 2);
  lcd.print(" %         ");
}

void haalEnToon() {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  http.begin(client, coinUrl);

  if (http.GET() == 200) {
    StaticJsonDocument<256> doc;
    deserializeJson(doc, http.getStream());
    float prijs  = doc["bitcoin"]["eur"];
    float change = doc["bitcoin"]["eur_24h_change"];
    toon(prijs, change);
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.print("Verbinden...");
  connectWifi();
  lcd.clear();
}

void loop() {
  haalEnToon();
  delay(60000);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 17: ESP32 NS-vertrektijden display
// ─────────────────────────────────────────────

const ns_s1 = `#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

// Maak een gratis dev-key op apiportal.ns.nl en plak hem hier
const char* nsApiKey = "JOUW_API_SLEUTEL";
const char* station  = "UT";   // Utrecht Centraal (zoek je eigen stationcode)

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void haalVertrektijden() {
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  String url = String("https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=") + station;
  http.begin(client, url);
  http.addHeader("Ocp-Apim-Subscription-Key", nsApiKey);

  int code = http.GET();
  Serial.print("Status: ");
  Serial.println(code);
  if (code == 200) {
    Serial.println("Eerste 500 tekens van de respons:");
    Serial.println(http.getString().substring(0, 500));
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  connectWifi();
  haalVertrektijden();
}

void loop() {}`;

const ns_s2 = `#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";
const char* nsApiKey = "JOUW_API_SLEUTEL";
const char* station  = "UT";

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void haalEnPrint() {
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  String url = String("https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=") + station;
  http.begin(client, url);
  http.addHeader("Ocp-Apim-Subscription-Key", nsApiKey);

  if (http.GET() == 200) {
    DynamicJsonDocument doc(8192);
    deserializeJson(doc, http.getStream());

    JsonArray departures = doc["payload"]["departures"];
    int n = min((int)departures.size(), 3);

    for (int i = 0; i < n; i++) {
      const char* tijd     = departures[i]["plannedDateTime"];   // ISO-string
      const char* richting = departures[i]["direction"];
      const char* spoor    = departures[i]["plannedTrack"];
      Serial.print(String(tijd).substring(11, 16));   // HH:MM
      Serial.print(" -> ");
      Serial.print(richting);
      Serial.print(" (spoor ");
      Serial.print(spoor);
      Serial.println(")");
    }
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  connectWifi();
}

void loop() {
  haalEnPrint();
  delay(60000);
}`;

const ns_s3 = `#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";
const char* nsApiKey = "JOUW_API_SLEUTEL";
const char* station  = "UT";

LiquidCrystal_I2C lcd(0x27, 16, 2);

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void toonEersteVertrek() {
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  String url = String("https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=") + station;
  http.begin(client, url);
  http.addHeader("Ocp-Apim-Subscription-Key", nsApiKey);

  if (http.GET() == 200) {
    DynamicJsonDocument doc(8192);
    deserializeJson(doc, http.getStream());

    JsonObject eerste = doc["payload"]["departures"][0];
    String tijd     = String((const char*)eerste["plannedDateTime"]).substring(11, 16);
    String richting = (const char*)eerste["direction"];

    if (richting.length() > 16) richting = richting.substring(0, 16);

    lcd.setCursor(0, 0);
    lcd.print(tijd);
    lcd.print(" naar       ");
    lcd.setCursor(0, 1);
    lcd.print(richting);
    for (int i = richting.length(); i < 16; i++) lcd.print(' ');
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  lcd.init(); lcd.backlight();
  lcd.print("Verbinden...");
  connectWifi();
  lcd.clear();
}

void loop() {
  toonEersteVertrek();
  delay(60000);
}`;

const ns_s4 = `#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";
const char* nsApiKey = "JOUW_API_SLEUTEL";
const char* station  = "UT";

LiquidCrystal_I2C lcd(0x27, 16, 2);

struct Vertrek {
  String tijd;
  String richting;
};

Vertrek vertrekken[3];
int aantal = 0;

unsigned long laatsteFetch  = 0;
unsigned long laatsteWissel = 0;
int huidigeIdx = 0;

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void haalVertrekken() {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  String url = String("https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=") + station;
  http.begin(client, url);
  http.addHeader("Ocp-Apim-Subscription-Key", nsApiKey);

  if (http.GET() == 200) {
    DynamicJsonDocument doc(8192);
    deserializeJson(doc, http.getStream());
    JsonArray dep = doc["payload"]["departures"];
    aantal = min((int)dep.size(), 3);
    for (int i = 0; i < aantal; i++) {
      vertrekken[i].tijd     = String((const char*)dep[i]["plannedDateTime"]).substring(11, 16);
      vertrekken[i].richting = (const char*)dep[i]["direction"];
      if (vertrekken[i].richting.length() > 16) {
        vertrekken[i].richting = vertrekken[i].richting.substring(0, 16);
      }
    }
  }
  http.end();
}

void toon(int idx) {
  lcd.clear();
  if (idx >= aantal) return;
  lcd.setCursor(0, 0);
  lcd.print(vertrekken[idx].tijd);
  lcd.print(" -> ");
  lcd.setCursor(0, 1);
  lcd.print(vertrekken[idx].richting);
}

void setup() {
  Serial.begin(115200);
  lcd.init(); lcd.backlight();
  lcd.print("Verbinden...");
  connectWifi();
  lcd.clear();
  haalVertrekken();
  toon(0);
}

void loop() {
  unsigned long nu = millis();
  if (nu - laatsteFetch > 60000UL) {           // elke 60 sec opnieuw ophalen
    laatsteFetch = nu;
    haalVertrekken();
  }
  if (nu - laatsteWissel > 5000UL && aantal > 0) {   // elke 5 sec wisselen
    laatsteWissel = nu;
    huidigeIdx = (huidigeIdx + 1) % aantal;
    toon(huidigeIdx);
  }
}`;

// ─────────────────────────────────────────────
// TUTORIAL 18: Buienradar-strook met NeoPixels (Batch 2)
// ─────────────────────────────────────────────

const br_s1 = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

// Pas lat/lon aan naar jouw locatie. Voorbeeld: Utrecht.
const char* buienradarUrl =
  "http://gpsgadget.buienradar.nl/data/raintext?lat=52.09&lon=5.12";

void connectWifi() {
  Serial.print("Verbinden met ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Verbonden!");
}

void haalRegen() {
  HTTPClient http;
  http.begin(buienradarUrl);
  int code = http.GET();
  Serial.print("Status: ");
  Serial.println(code);
  if (code == 200) {
    Serial.println("Ruwe respons:");
    Serial.println(http.getString());
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  connectWifi();
  haalRegen();
}

void loop() {}`;

const br_s2 = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";
const char* buienradarUrl =
  "http://gpsgadget.buienradar.nl/data/raintext?lat=52.09&lon=5.12";

int regenWaarden[24];   // 24 metingen = 2 uur (één per 5 min)

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void parseRegen(String body) {
  // Formaat per regel: "127|14:35"
  // Eerste getal = regen-intensiteit (0 = droog, 255 = stortregen).
  int idx = 0;
  int start = 0;
  while (idx < 24 && start < (int)body.length()) {
    int eind = body.indexOf('\\n', start);
    if (eind < 0) eind = body.length();

    String regel = body.substring(start, eind);
    int pipe = regel.indexOf('|');
    if (pipe > 0) {
      regenWaarden[idx] = regel.substring(0, pipe).toInt();
      Serial.print(regenWaarden[idx]);
      Serial.print(' ');
      idx++;
    }
    start = eind + 1;
  }
  Serial.println();
}

void haalRegen() {
  HTTPClient http;
  http.begin(buienradarUrl);
  if (http.GET() == 200) {
    parseRegen(http.getString());
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  connectWifi();
  haalRegen();
}

void loop() {}`;

const br_s3 = `#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_NeoPixel.h>

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";
const char* buienradarUrl =
  "http://gpsgadget.buienradar.nl/data/raintext?lat=52.09&lon=5.12";

int dataPin = 5;            // GPIO 5 op de ESP32
int aantalLeds = 24;        // 24 LEDs = 2 uur vooruit

Adafruit_NeoPixel strip(aantalLeds, dataPin, NEO_GRB + NEO_KHZ800);

unsigned long laatsteFetch = 0;

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

uint32_t kleurVoor(int waarde) {
  // Kleur-mapping: droog -> regen
  if (waarde < 30)  return strip.Color(  0,  40,   0); // zacht groen
  if (waarde < 80)  return strip.Color(120, 120,   0); // geel
  if (waarde < 140) return strip.Color(180,  60,   0); // oranje
  return                strip.Color(200,   0,   0);    // rood
}

void updateLeds() {
  HTTPClient http;
  http.begin(buienradarUrl);
  if (http.GET() != 200) { http.end(); return; }
  String body = http.getString();
  http.end();

  int idx = 0;
  int start = 0;
  while (idx < aantalLeds && start < (int)body.length()) {
    int eind = body.indexOf('\\n', start);
    if (eind < 0) eind = body.length();
    String regel = body.substring(start, eind);
    int pipe = regel.indexOf('|');
    if (pipe > 0) {
      int waarde = regel.substring(0, pipe).toInt();
      strip.setPixelColor(idx, kleurVoor(waarde));
      idx++;
    }
    start = eind + 1;
  }
  strip.show();
}

void setup() {
  Serial.begin(115200);
  strip.begin();
  strip.setBrightness(40);   // beperkt totale stroom (24 LEDs!)
  strip.show();
  connectWifi();
  updateLeds();
  laatsteFetch = millis();
}

void loop() {
  unsigned long nu = millis();
  if (nu - laatsteFetch > 5UL * 60UL * 1000UL) {  // elke 5 min opnieuw
    laatsteFetch = nu;
    updateLeds();
  }
}`;

// ─────────────────────────────────────────────
// TUTORIAL 19: ESP32-CAM webcam + bewegingsdetectie (Batch 2)
// ─────────────────────────────────────────────

const cam_s1 = `// ESP32-CAM eerste sketch.
// Doel: bewijzen dat het bord upload + draait. We gebruiken esp_camera nog niet,
// maar laden de header al om te checken dat de Arduino IDE correct is ingesteld.
//
// In Arduino IDE: Tools -> Board -> "AI Thinker ESP32-CAM"
//                 Tools -> Partition Scheme -> "Huge APP (3MB No OTA / 1MB SPIFFS)"

#include "esp_camera.h"   // alleen om te bewijzen dat de library aanwezig is

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println();
  Serial.println("ESP32-CAM is gestart!");
  Serial.println("Volgende stap: esp_camera_init() configureren.");
}

void loop() {
  Serial.println("Nog steeds aan...");
  delay(2000);
}`;

// Gedeelde AI-Thinker ESP32-CAM bouwstenen. Eén bron van waarheid voor de
// pin-mapping en de initCamera()-helper, geïnjecteerd in elke sketch hieronder
// zodat elke stap nog steeds standalone te kopiëren en te compileren is.
const camPinDefines = `// AI Thinker ESP32-CAM pin-mapping (vaste hardware-bedrading van het bord)
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22`;

const camInitFunction = `void initCamera() {
  camera_config_t cfg = {};
  cfg.ledc_channel = LEDC_CHANNEL_0;
  cfg.ledc_timer   = LEDC_TIMER_0;
  cfg.pin_d0       = Y2_GPIO_NUM;
  cfg.pin_d1       = Y3_GPIO_NUM;
  cfg.pin_d2       = Y4_GPIO_NUM;
  cfg.pin_d3       = Y5_GPIO_NUM;
  cfg.pin_d4       = Y6_GPIO_NUM;
  cfg.pin_d5       = Y7_GPIO_NUM;
  cfg.pin_d6       = Y8_GPIO_NUM;
  cfg.pin_d7       = Y9_GPIO_NUM;
  cfg.pin_xclk     = XCLK_GPIO_NUM;
  cfg.pin_pclk     = PCLK_GPIO_NUM;
  cfg.pin_vsync    = VSYNC_GPIO_NUM;
  cfg.pin_href     = HREF_GPIO_NUM;
  cfg.pin_sscb_sda = SIOD_GPIO_NUM;
  cfg.pin_sscb_scl = SIOC_GPIO_NUM;
  cfg.pin_pwdn     = PWDN_GPIO_NUM;
  cfg.pin_reset    = RESET_GPIO_NUM;
  cfg.xclk_freq_hz = 20000000;
  cfg.pixel_format = PIXFORMAT_JPEG;
  cfg.frame_size   = FRAMESIZE_VGA;   // 640x480
  cfg.jpeg_quality = 12;              // 10-15 is een goede range
  cfg.fb_count     = 1;

  esp_err_t err = esp_camera_init(&cfg);
  if (err != ESP_OK) {
    Serial.printf("Camera init mislukt: 0x%x\\n", err);
    return;
  }
  Serial.println("Camera klaar!");
}`;

const cam_s2 = `#include "esp_camera.h"

${camPinDefines}

${camInitFunction}

void setup() {
  Serial.begin(115200);
  initCamera();
}

void loop() {
  // Maak één foto en print alleen de bestandsgrootte (de bytes zelf
  // willen we niet door de Serial Monitor pompen).
  camera_fb_t* fb = esp_camera_fb_get();
  if (fb) {
    Serial.printf("Foto ok - %u bytes\\n", fb->len);
    esp_camera_fb_return(fb);     // ALTIJD teruggeven anders raakt het geheugen op
  }
  delay(2000);
}`;

const cam_s3 = `#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>

${camPinDefines}

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

WebServer server(80);

${camInitFunction}

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Open in je browser: http://");
  Serial.print(WiFi.localIP());
  Serial.println("/stream");
}

void handleStream() {
  WiFiClient client = server.client();
  // MJPEG = een eindeloze stroom JPEG-frames met een 'boundary' ertussen.
  client.print(
    "HTTP/1.1 200 OK\\r\\n"
    "Content-Type: multipart/x-mixed-replace; boundary=frame\\r\\n\\r\\n");

  while (client.connected()) {
    camera_fb_t* fb = esp_camera_fb_get();
    if (!fb) break;
    client.printf(
      "--frame\\r\\nContent-Type: image/jpeg\\r\\nContent-Length: %u\\r\\n\\r\\n",
      fb->len);
    client.write(fb->buf, fb->len);
    client.print("\\r\\n");
    esp_camera_fb_return(fb);
    delay(50);   // ~20 fps
  }
}

void setup() {
  Serial.begin(115200);
  initCamera();
  connectWifi();
  server.on("/stream", handleStream);
  server.begin();
}

void loop() {
  server.handleClient();
}`;

const cam_s4 = `#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>

${camPinDefines}

const char* ssid     = "JouwWiFiNaam";
const char* password = "JouwWiFiWachtwoord";

WebServer server(80);

int pirPin = 13;            // PIR-sensor OUT op GPIO 13
bool laatstePir = false;
unsigned long laatsteMelding = 0;

${camInitFunction}

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Snapshot: http://");
  Serial.print(WiFi.localIP());
  Serial.println("/snapshot");
}

void handleSnapshot() {
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    server.send(500, "text/plain", "Camera fout");
    return;
  }
  WiFiClient client = server.client();
  client.printf(
    "HTTP/1.1 200 OK\\r\\nContent-Type: image/jpeg\\r\\nContent-Length: %u\\r\\n\\r\\n",
    fb->len);
  client.write(fb->buf, fb->len);
  esp_camera_fb_return(fb);
}

void setup() {
  Serial.begin(115200);
  pinMode(pirPin, INPUT);
  initCamera();
  connectWifi();
  server.on("/snapshot", handleSnapshot);
  server.begin();
}

void loop() {
  server.handleClient();

  bool nu = digitalRead(pirPin);
  unsigned long t = millis();
  // Edge: van LOW naar HIGH = nieuwe beweging gedetecteerd
  if (nu && !laatstePir && t - laatsteMelding > 10000UL) {
    laatsteMelding = t;
    Serial.println("Beweging! Open /snapshot om de foto te zien.");
  }
  laatstePir = nu;
}`;

// ─────────────────────────────────────────────
// TUTORIAL 20: Bluetooth-toetsenbord emulator (Batch 2)
// ─────────────────────────────────────────────

const ble_s1 = `// Installeer de bibliotheek 'ESP32 BLE Keyboard' van T-vK via:
// Sketch -> Include Library -> Manage Libraries -> zoek 'ble keyboard'.
#include <BleKeyboard.h>

BleKeyboard kb("ESP32 Knop", "Nogwa", 100);   // naam, fabrikant, batterij%

void setup() {
  Serial.begin(115200);
  Serial.println("Start BLE-toetsenbord, koppel via Bluetooth-instellingen...");
  kb.begin();
}

void loop() {
  if (kb.isConnected()) {
    Serial.println("Verbonden! Tik 'Hallo!'");
    kb.print("Hallo!");
    delay(5000);
  }
  delay(100);
}`;

const ble_s2 = `#include <BleKeyboard.h>

BleKeyboard kb("ESP32 Knop", "Nogwa", 100);

int buttonPin = 4;        // knop tussen GPIO 4 en GND
int vorigeStaat = HIGH;

void setup() {
  Serial.begin(115200);
  pinMode(buttonPin, INPUT_PULLUP);
  kb.begin();
  Serial.println("Wacht op verbinding...");
}

void loop() {
  int huidig = digitalRead(buttonPin);

  // Edge-detectie: alleen reageren op overgang HIGH -> LOW (= net ingedrukt)
  if (vorigeStaat == HIGH && huidig == LOW) {
    if (kb.isConnected()) {
      kb.print("Mijn-Wachtwoord-123");
      Serial.println("Tekst getypt.");
    } else {
      Serial.println("Niet verbonden, knop genegeerd.");
    }
  }

  vorigeStaat = huidig;
  delay(20);   // simpele debounce
}`;

const ble_s3 = `#include <BleKeyboard.h>

BleKeyboard kb("ESP32 Media", "Nogwa", 100);

int buttonPin = 4;
int vorigeStaat = HIGH;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  kb.begin();
}

void loop() {
  int huidig = digitalRead(buttonPin);

  if (vorigeStaat == HIGH && huidig == LOW) {
    if (kb.isConnected()) {
      // Stuur een 'play/pauze' media-toets (werkt op Spotify, YouTube, ...).
      kb.write(KEY_MEDIA_PLAY_PAUSE);
    }
  }

  vorigeStaat = huidig;
  delay(20);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 21: Pakketmelder voor de brievenbus (Batch 2)
// ─────────────────────────────────────────────

const pak_s1 = `int reedPin = 4;          // reed-schakelaar tussen GPIO 4 en GND
int vorigeStaat = HIGH;

void setup() {
  Serial.begin(115200);
  pinMode(reedPin, INPUT_PULLUP);
  Serial.println("Beweeg de magneet langs de reed-schakelaar...");
}

void loop() {
  int huidig = digitalRead(reedPin);

  if (huidig != vorigeStaat) {
    if (huidig == LOW) {
      Serial.println("GESLOTEN  (magneet aanwezig - klepje dicht)");
    } else {
      Serial.println("OPEN      (magneet weg - klepje is geopend)");
    }
    vorigeStaat = huidig;
  }
  delay(20);
}`;

const pak_s2 = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid       = "JouwWiFiNaam";
const char* password   = "JouwWiFiWachtwoord";
// Maak de webhook in Discord (zie tutorial 'Discord-melding bij beweging').
const char* webhookUrl = "https://discord.com/api/webhooks/JOUW_ID/JOUW_TOKEN";

int reedPin = 4;
int vorigeStaat = HIGH;

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void stuurDiscord(String bericht) {
  HTTPClient http;
  http.begin(webhookUrl);
  http.addHeader("Content-Type", "application/json");
  String json = String(R"({"content":")") + bericht + R"("})";
  int code = http.POST(json);
  Serial.print("Discord status: ");
  Serial.println(code);
  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(reedPin, INPUT_PULLUP);
  connectWifi();
}

void loop() {
  int huidig = digitalRead(reedPin);

  // Edge LOW -> HIGH = klepje net opengegaan = post!
  if (vorigeStaat == LOW && huidig == HIGH) {
    stuurDiscord("Post is er!");
  }
  vorigeStaat = huidig;
  delay(20);
}`;

const pak_s3 = `#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid       = "JouwWiFiNaam";
const char* password   = "JouwWiFiWachtwoord";
const char* webhookUrl = "https://discord.com/api/webhooks/JOUW_ID/JOUW_TOKEN";

// We gebruiken GPIO_NUM_4 (de typed variant) zodat esp_sleep hem accepteert.
#define REED_GPIO GPIO_NUM_4

void connectWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
}

void stuurDiscord(String bericht) {
  HTTPClient http;
  http.begin(webhookUrl);
  http.addHeader("Content-Type", "application/json");
  String json = String(R"({"content":")") + bericht + R"("})";
  http.POST(json);
  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println("Wakker geworden!");

  // Waarom werd ik wakker? (Eerste keer = power-on, daarna = de klep)
  esp_sleep_wakeup_cause_t reden = esp_sleep_get_wakeup_cause();
  if (reden == ESP_SLEEP_WAKEUP_EXT0) {
    Serial.println("Reed-schakelaar triggerde de wake-up -> melding sturen.");
    connectWifi();
    stuurDiscord("Post is er!");
    delay(500);   // kleine buffer zodat de POST helemaal vertrokken is
  } else {
    Serial.println("Eerste opstart, geen melding nodig.");
  }

  // Configureer de pin als wake-up bron: wakker bij HIGH (klepje open).
  pinMode(REED_GPIO, INPUT_PULLUP);
  esp_sleep_enable_ext0_wakeup(REED_GPIO, 1);   // 1 = wek bij HIGH

  Serial.println("Slapen tot de volgende post...");
  delay(100);
  esp_deep_sleep_start();
}

void loop() {
  // Onbereikbaar - na deep sleep start setup() opnieuw.
}`;

// ─────────────────────────────────────────────
// TUTORIAL 22: Reactietijd-tester (Batch 2 - Beginner)
// ─────────────────────────────────────────────

const rt_s1 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int ledPin = 9;             // LED op pin 9 (PWM-pin, met 220 ohm)
int buttonPin = 7;          // knop tussen pin 7 en GND

void setup() {
  lcd.init();
  lcd.backlight();
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);

  lcd.setCursor(0, 0);
  lcd.print("Reactietijd!");
  lcd.setCursor(0, 1);
  lcd.print("Druk knop start");
}

void loop() {
  // Test: LED brandt zolang de knop ingedrukt is.
  if (digitalRead(buttonPin) == LOW) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}`;

const rt_s2 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int ledPin = 9;
int buttonPin = 7;

void wachtTotIngedrukt() {
  while (digitalRead(buttonPin) == HIGH) { delay(10); }
}

void wachtTotLosgelaten() {
  while (digitalRead(buttonPin) == LOW)  { delay(10); }
}

void setup() {
  lcd.init();
  lcd.backlight();
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  randomSeed(analogRead(A0));    // ruis op A0 = goede zaad-bron
}

void loop() {
  lcd.clear();
  lcd.print("Druk om te");
  lcd.setCursor(0, 1);
  lcd.print("starten...");

  wachtTotIngedrukt();
  wachtTotLosgelaten();

  lcd.clear();
  lcd.print("Wacht op licht..");

  long wacht = random(1500, 4000);    // 1,5 - 4 sec willekeurig
  delay(wacht);

  digitalWrite(ledPin, HIGH);
  unsigned long start = millis();

  wachtTotIngedrukt();
  unsigned long reactie = millis() - start;

  digitalWrite(ledPin, LOW);

  lcd.clear();
  lcd.print("Reactietijd:");
  lcd.setCursor(0, 1);
  lcd.print(reactie);
  lcd.print(" ms");

  wachtTotLosgelaten();
  delay(2000);
}`;

const rt_s3 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int ledPin = 9;
int buttonPin = 7;

unsigned long besteTijd = 0;        // 0 = nog geen score

void wachtTotIngedrukt() {
  while (digitalRead(buttonPin) == HIGH) { delay(10); }
}
void wachtTotLosgelaten() {
  while (digitalRead(buttonPin) == LOW)  { delay(10); }
}

void toonStartscherm() {
  lcd.clear();
  lcd.print("Best: ");
  if (besteTijd == 0) lcd.print("- ms");
  else { lcd.print(besteTijd); lcd.print(" ms"); }
  lcd.setCursor(0, 1);
  lcd.print("Druk om start");
}

void setup() {
  lcd.init(); lcd.backlight();
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  randomSeed(analogRead(A0));
}

void loop() {
  toonStartscherm();
  wachtTotIngedrukt();
  wachtTotLosgelaten();

  lcd.clear();
  lcd.print("Wacht op licht..");
  long wacht = random(1500, 4000);

  // Te-vroeg-detectie: tijdens de wachttijd mag je NIET drukken.
  unsigned long deadline = millis() + wacht;
  bool teVroeg = false;
  while (millis() < deadline) {
    if (digitalRead(buttonPin) == LOW) { teVroeg = true; break; }
    delay(5);
  }

  if (teVroeg) {
    lcd.clear();
    lcd.print("Te vroeg! :(");
    wachtTotLosgelaten();
    delay(2000);
    return;
  }

  digitalWrite(ledPin, HIGH);
  unsigned long start = millis();
  wachtTotIngedrukt();
  unsigned long reactie = millis() - start;
  digitalWrite(ledPin, LOW);

  lcd.clear();
  lcd.print("Tijd: ");
  lcd.print(reactie);
  lcd.print(" ms");

  if (besteTijd == 0 || reactie < besteTijd) {
    besteTijd = reactie;
    lcd.setCursor(0, 1);
    lcd.print("NIEUW RECORD!");
  }

  wachtTotLosgelaten();
  delay(2500);
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
// TUTORIAL 23: Simon Says
// ─────────────────────────────────────────────

const sim_s1 = `// 4 LEDs op pin 8..11, 4 knoppen op pin 2..5, buzzer op pin 12.
int ledRood   = 8;
int ledGroen  = 9;
int ledBlauw  = 10;
int ledGeel   = 11;

int knopRood  = 2;
int knopGroen = 3;
int knopBlauw = 4;
int knopGeel  = 5;

int buzzerPin = 12;

void setup() {
  pinMode(ledRood,  OUTPUT);
  pinMode(ledGroen, OUTPUT);
  pinMode(ledBlauw, OUTPUT);
  pinMode(ledGeel,  OUTPUT);

  pinMode(knopRood,  INPUT_PULLUP);
  pinMode(knopGroen, INPUT_PULLUP);
  pinMode(knopBlauw, INPUT_PULLUP);
  pinMode(knopGeel,  INPUT_PULLUP);

  pinMode(buzzerPin, OUTPUT);

  // Korte test: alle LEDs even aan zodat je weet dat alles werkt.
  digitalWrite(ledRood,  HIGH);
  digitalWrite(ledGroen, HIGH);
  digitalWrite(ledBlauw, HIGH);
  digitalWrite(ledGeel,  HIGH);
  delay(500);
  digitalWrite(ledRood,  LOW);
  digitalWrite(ledGroen, LOW);
  digitalWrite(ledBlauw, LOW);
  digitalWrite(ledGeel,  LOW);
}

void loop() {
  // Volgende stappen vullen dit aan.
}`;

const sim_s2 = `int ledRood = 8, ledGroen = 9, ledBlauw = 10, ledGeel = 11;
int knopRood = 2, knopGroen = 3, knopBlauw = 4, knopGeel = 5;
int buzzerPin = 12;

// Maximale lengte van de reeks die we ooit zullen onthouden.
const int MAX_REEKS = 50;

// De reeks slaat per stap een kleur op: 0=rood, 1=groen, 2=blauw, 3=geel.
int reeks[MAX_REEKS];
int reeksLengte = 0;   // hoeveel stappen zitten er nu in de reeks

void setup() {
  pinMode(ledRood, OUTPUT); pinMode(ledGroen, OUTPUT);
  pinMode(ledBlauw, OUTPUT); pinMode(ledGeel, OUTPUT);
  pinMode(knopRood, INPUT_PULLUP); pinMode(knopGroen, INPUT_PULLUP);
  pinMode(knopBlauw, INPUT_PULLUP); pinMode(knopGeel, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);

  // Belangrijk: zaai de random-generator met ruis op een open analoge pin.
  // Zonder dit krijg je elke keer dezelfde "willekeurige" reeks.
  randomSeed(analogRead(A0));

  Serial.begin(9600);
}

void volgendeKleurToevoegen() {
  // Voeg één willekeurige nieuwe kleur (0..3) toe aan de reeks.
  reeks[reeksLengte] = random(0, 4);
  reeksLengte++;
  Serial.print("Reeks is nu ");
  Serial.print(reeksLengte);
  Serial.println(" stappen lang.");
}

void loop() {
  volgendeKleurToevoegen();
  delay(1000);   // even pauzeren zodat we de Serial Monitor kunnen lezen
}`;

const sim_s3 = `int ledRood = 8, ledGroen = 9, ledBlauw = 10, ledGeel = 11;
int knopRood = 2, knopGroen = 3, knopBlauw = 4, knopGeel = 5;
int buzzerPin = 12;

const int MAX_REEKS = 50;
int reeks[MAX_REEKS];
int reeksLengte = 0;

// Per kleur (0..3): de bijbehorende LED-pin en de toonhoogte voor de buzzer.
int ledVan(int kleur) {
  if (kleur == 0) return ledRood;
  if (kleur == 1) return ledGroen;
  if (kleur == 2) return ledBlauw;
  return ledGeel;
}
int toonVan(int kleur) {
  // Vier verschillende toonhoogtes - net zoals bij de échte Simon Says.
  if (kleur == 0) return 262;   // C
  if (kleur == 1) return 330;   // E
  if (kleur == 2) return 392;   // G
  return 523;                   // C (octaaf hoger)
}

void speelKleur(int kleur, int duur) {
  digitalWrite(ledVan(kleur), HIGH);
  tone(buzzerPin, toonVan(kleur), duur);
  delay(duur);
  digitalWrite(ledVan(kleur), LOW);
  delay(100);   // korte pauze tussen kleuren zodat ze duidelijk te onderscheiden zijn
}

void speelReeksAf() {
  // Tempo wordt iets sneller naarmate de reeks groeit (max ~150ms).
  int duur = max(150, 500 - reeksLengte * 20);
  for (int i = 0; i < reeksLengte; i++) {
    speelKleur(reeks[i], duur);
  }
}

void setup() {
  pinMode(ledRood, OUTPUT); pinMode(ledGroen, OUTPUT);
  pinMode(ledBlauw, OUTPUT); pinMode(ledGeel, OUTPUT);
  pinMode(knopRood, INPUT_PULLUP); pinMode(knopGroen, INPUT_PULLUP);
  pinMode(knopBlauw, INPUT_PULLUP); pinMode(knopGeel, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
  randomSeed(analogRead(A0));
}

void loop() {
  // Voeg een kleur toe en speel de hele reeks af.
  reeks[reeksLengte] = random(0, 4);
  reeksLengte++;
  speelReeksAf();
  delay(800);
}`;

const sim_s4 = `int ledRood = 8, ledGroen = 9, ledBlauw = 10, ledGeel = 11;
int knopRood = 2, knopGroen = 3, knopBlauw = 4, knopGeel = 5;
int buzzerPin = 12;

const int MAX_REEKS = 50;
int reeks[MAX_REEKS];
int reeksLengte = 0;

int ledVan(int kleur) {
  if (kleur == 0) return ledRood;
  if (kleur == 1) return ledGroen;
  if (kleur == 2) return ledBlauw;
  return ledGeel;
}
int toonVan(int kleur) {
  if (kleur == 0) return 262;
  if (kleur == 1) return 330;
  if (kleur == 2) return 392;
  return 523;
}

void speelKleur(int kleur, int duur) {
  digitalWrite(ledVan(kleur), HIGH);
  tone(buzzerPin, toonVan(kleur), duur);
  delay(duur);
  digitalWrite(ledVan(kleur), LOW);
  delay(100);
}

void speelReeksAf() {
  int duur = max(150, 500 - reeksLengte * 20);
  for (int i = 0; i < reeksLengte; i++) {
    speelKleur(reeks[i], duur);
  }
}

// Wacht (blokkerend) op een knopdruk en geef terug welke kleur (0..3) of -1 bij time-out.
int wachtOpKnop(unsigned long timeoutMs) {
  unsigned long start = millis();
  while (millis() - start < timeoutMs) {
    if (digitalRead(knopRood)  == LOW) { while (digitalRead(knopRood)  == LOW); delay(20); return 0; }
    if (digitalRead(knopGroen) == LOW) { while (digitalRead(knopGroen) == LOW); delay(20); return 1; }
    if (digitalRead(knopBlauw) == LOW) { while (digitalRead(knopBlauw) == LOW); delay(20); return 2; }
    if (digitalRead(knopGeel)  == LOW) { while (digitalRead(knopGeel)  == LOW); delay(20); return 3; }
  }
  return -1;
}

void gameOver() {
  // Trieste toon + alle LEDs even knipperen.
  tone(buzzerPin, 110, 600);
  for (int n = 0; n < 3; n++) {
    digitalWrite(ledRood,  HIGH); digitalWrite(ledGroen, HIGH);
    digitalWrite(ledBlauw, HIGH); digitalWrite(ledGeel,  HIGH);
    delay(200);
    digitalWrite(ledRood,  LOW);  digitalWrite(ledGroen, LOW);
    digitalWrite(ledBlauw, LOW);  digitalWrite(ledGeel,  LOW);
    delay(200);
  }
  reeksLengte = 0;   // start opnieuw vanaf 0
  delay(1000);
}

void setup() {
  pinMode(ledRood, OUTPUT); pinMode(ledGroen, OUTPUT);
  pinMode(ledBlauw, OUTPUT); pinMode(ledGeel, OUTPUT);
  pinMode(knopRood, INPUT_PULLUP); pinMode(knopGroen, INPUT_PULLUP);
  pinMode(knopBlauw, INPUT_PULLUP); pinMode(knopGeel, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
  randomSeed(analogRead(A0));
}

void loop() {
  // 1. Voeg een nieuwe kleur toe en toon de hele reeks.
  reeks[reeksLengte] = random(0, 4);
  reeksLengte++;
  speelReeksAf();

  // 2. Laat de speler de reeks naspelen.
  for (int i = 0; i < reeksLengte; i++) {
    int gedrukt = wachtOpKnop(5000);   // 5 sec bedenktijd per kleur
    if (gedrukt != reeks[i]) {
      gameOver();
      return;
    }
    // Korte feedback bij correcte druk.
    speelKleur(gedrukt, 150);
  }

  // 3. Hele reeks goed → korte juich-toon en volgende ronde.
  tone(buzzerPin, 880, 100); delay(120);
  tone(buzzerPin, 1320, 150);
  delay(800);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 24: Whack-a-mole
// ─────────────────────────────────────────────

const wam_s1 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

// 5 LEDs (de "molshopen") en 5 knoppen ernaast.
int ledPin1 = 8;
int ledPin2 = 9;
int ledPin3 = 10;
int ledPin4 = 11;
int ledPin5 = 12;

int knopPin1 = 2;
int knopPin2 = 3;
int knopPin3 = 4;
int knopPin4 = 5;
int knopPin5 = 6;

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Whack-a-mole!");

  pinMode(ledPin1, OUTPUT); pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT); pinMode(ledPin4, OUTPUT);
  pinMode(ledPin5, OUTPUT);

  pinMode(knopPin1, INPUT_PULLUP); pinMode(knopPin2, INPUT_PULLUP);
  pinMode(knopPin3, INPUT_PULLUP); pinMode(knopPin4, INPUT_PULLUP);
  pinMode(knopPin5, INPUT_PULLUP);

  // Sanity-check: knoppen sturen direct hun LED aan.
}

void loop() {
  digitalWrite(ledPin1, digitalRead(knopPin1) == LOW ? HIGH : LOW);
  digitalWrite(ledPin2, digitalRead(knopPin2) == LOW ? HIGH : LOW);
  digitalWrite(ledPin3, digitalRead(knopPin3) == LOW ? HIGH : LOW);
  digitalWrite(ledPin4, digitalRead(knopPin4) == LOW ? HIGH : LOW);
  digitalWrite(ledPin5, digitalRead(knopPin5) == LOW ? HIGH : LOW);
}`;

const wam_s2 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int ledPin1 = 8, ledPin2 = 9, ledPin3 = 10, ledPin4 = 11, ledPin5 = 12;
int knopPin1 = 2, knopPin2 = 3, knopPin3 = 4, knopPin4 = 5, knopPin5 = 6;

// Handig: arrays gebruiken om met "mol-nummer" 0..4 in plaats van losse pins te werken.
int leds[5];
int knoppen[5];

int actieveMol = -1;            // welke LED brandt nu (-1 = geen)
unsigned long molTotMillis = 0; // tijdstip waarop de mol weer onderduikt
int molDuurMs = 1000;           // hoe lang een mol blijft staan

void zetAlleLedsUit() {
  for (int i = 0; i < 5; i++) digitalWrite(leds[i], LOW);
}

void nieuweMol() {
  zetAlleLedsUit();
  actieveMol = random(0, 5);                 // kies een random LED
  digitalWrite(leds[actieveMol], HIGH);
  molTotMillis = millis() + molDuurMs;       // deadline
}

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Klaar...");

  leds[0] = ledPin1; leds[1] = ledPin2; leds[2] = ledPin3;
  leds[3] = ledPin4; leds[4] = ledPin5;
  knoppen[0] = knopPin1; knoppen[1] = knopPin2; knoppen[2] = knopPin3;
  knoppen[3] = knopPin4; knoppen[4] = knopPin5;

  for (int i = 0; i < 5; i++) {
    pinMode(leds[i], OUTPUT);
    pinMode(knoppen[i], INPUT_PULLUP);
  }

  randomSeed(analogRead(A0));
  delay(1500);
  lcd.clear();
  lcd.print("Mep de mol!");
  nieuweMol();
}

void loop() {
  // Non-blocking: als de tijd voor deze mol om is, kies een nieuwe.
  if (millis() >= molTotMillis) {
    nieuweMol();
  }
}`;

const wam_s3 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int ledPin1 = 8, ledPin2 = 9, ledPin3 = 10, ledPin4 = 11, ledPin5 = 12;
int knopPin1 = 2, knopPin2 = 3, knopPin3 = 4, knopPin4 = 5, knopPin5 = 6;

int leds[5], knoppen[5];

int actieveMol = -1;
unsigned long molTotMillis = 0;
int molDuurMs = 1000;

int score = 0;
int gemist = 0;

// Onthoud per knop de vorige stand, voor edge-detectie.
int vorigeKnop[5] = {HIGH, HIGH, HIGH, HIGH, HIGH};

void toonScore() {
  lcd.setCursor(0, 1);
  lcd.print("Punt:");
  lcd.print(score);
  lcd.print(" Mis:");
  lcd.print(gemist);
  lcd.print("   ");   // overschrijft eventuele oude tekens
}

void zetAlleLedsUit() {
  for (int i = 0; i < 5; i++) digitalWrite(leds[i], LOW);
}

void nieuweMol() {
  zetAlleLedsUit();
  actieveMol = random(0, 5);
  digitalWrite(leds[actieveMol], HIGH);
  molTotMillis = millis() + molDuurMs;
}

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Mep de mol!");
  toonScore();

  leds[0] = ledPin1; leds[1] = ledPin2; leds[2] = ledPin3;
  leds[3] = ledPin4; leds[4] = ledPin5;
  knoppen[0] = knopPin1; knoppen[1] = knopPin2; knoppen[2] = knopPin3;
  knoppen[3] = knopPin4; knoppen[4] = knopPin5;
  for (int i = 0; i < 5; i++) {
    pinMode(leds[i], OUTPUT);
    pinMode(knoppen[i], INPUT_PULLUP);
  }

  randomSeed(analogRead(A0));
  nieuweMol();
}

void loop() {
  // 1. Te laat? Telt als gemist.
  if (millis() >= molTotMillis) {
    gemist++;
    toonScore();
    nieuweMol();
  }

  // 2. Lees alle knoppen, edge-detectie (HIGH→LOW = nieuwe druk).
  for (int i = 0; i < 5; i++) {
    int huidig = digitalRead(knoppen[i]);
    if (vorigeKnop[i] == HIGH && huidig == LOW) {
      if (i == actieveMol) {
        score++;            // juiste knop → punt!
        nieuweMol();        // direct volgende ronde
      } else {
        gemist++;           // verkeerde knop telt als miss
      }
      toonScore();
    }
    vorigeKnop[i] = huidig;
  }
}`;

const wam_s4 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int ledPin1 = 8, ledPin2 = 9, ledPin3 = 10, ledPin4 = 11, ledPin5 = 12;
int knopPin1 = 2, knopPin2 = 3, knopPin3 = 4, knopPin4 = 5, knopPin5 = 6;

int leds[5], knoppen[5];

int actieveMol = -1;
unsigned long molTotMillis = 0;
int molDuurMs = 1200;          // start-duur (per ronde 5 punten 100ms sneller)
const int MIN_DUUR = 250;      // hieronder wordt het bijna onspeelbaar

int score = 0;
int gemist = 0;
const int MAX_GEMIST = 5;       // game over na 5 missers
int vorigeKnop[5] = {HIGH, HIGH, HIGH, HIGH, HIGH};

void toonScore() {
  lcd.setCursor(0, 1);
  lcd.print("Punt:");
  lcd.print(score);
  lcd.print(" Mis:");
  lcd.print(gemist);
  lcd.print("   ");
}

void zetAlleLedsUit() {
  for (int i = 0; i < 5; i++) digitalWrite(leds[i], LOW);
}

void nieuweMol() {
  zetAlleLedsUit();
  actieveMol = random(0, 5);
  digitalWrite(leds[actieveMol], HIGH);
  molTotMillis = millis() + molDuurMs;
}

void pasTempoAan() {
  // Per 5 punten: 100ms sneller (tot een ondergrens).
  molDuurMs = max(MIN_DUUR, 1200 - (score / 5) * 100);
}

void gameOver() {
  zetAlleLedsUit();
  lcd.clear();
  lcd.print("GAME OVER");
  lcd.setCursor(0, 1);
  lcd.print("Score: ");
  lcd.print(score);
  while (true) {
    // Knipper alle LEDs als eindstand.
    for (int i = 0; i < 5; i++) digitalWrite(leds[i], HIGH);
    delay(300);
    zetAlleLedsUit();
    delay(300);
  }
}

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Mep de mol!");

  leds[0] = ledPin1; leds[1] = ledPin2; leds[2] = ledPin3;
  leds[3] = ledPin4; leds[4] = ledPin5;
  knoppen[0] = knopPin1; knoppen[1] = knopPin2; knoppen[2] = knopPin3;
  knoppen[3] = knopPin4; knoppen[4] = knopPin5;
  for (int i = 0; i < 5; i++) {
    pinMode(leds[i], OUTPUT);
    pinMode(knoppen[i], INPUT_PULLUP);
  }
  toonScore();
  randomSeed(analogRead(A0));
  nieuweMol();
}

void loop() {
  if (gemist >= MAX_GEMIST) gameOver();

  if (millis() >= molTotMillis) {
    gemist++;
    toonScore();
    nieuweMol();
  }

  for (int i = 0; i < 5; i++) {
    int huidig = digitalRead(knoppen[i]);
    if (vorigeKnop[i] == HIGH && huidig == LOW) {
      if (i == actieveMol) {
        score++;
        pasTempoAan();
        nieuweMol();
      } else {
        gemist++;
      }
      toonScore();
    }
    vorigeKnop[i] = huidig;
  }
}`;

// ─────────────────────────────────────────────
// TUTORIAL 25: Elektronische dobbelsteen-roller
// ─────────────────────────────────────────────

const dice_s1 = `// 7 LEDs in dobbelsteen-patroon:
//   1 . 2
//   3 7 4    (LED 7 = midden)
//   5 . 6
int ledPin1 = 2;   // links-boven
int ledPin2 = 3;   // rechts-boven
int ledPin3 = 4;   // links-midden
int ledPin4 = 5;   // rechts-midden
int ledPin5 = 6;   // links-onder
int ledPin6 = 7;   // rechts-onder
int ledPin7 = 8;   // midden

int leds[7];

void zetAlleLedsUit() {
  for (int i = 0; i < 7; i++) digitalWrite(leds[i], LOW);
}

// Welke LEDs branden bij worp 1..6 (true = aan).
// LED-index 0..6 komt overeen met ledPin1..ledPin7.
bool patroon[7][7] = {
  // L1 L2 L3 L4 L5 L6 L7
  {  0, 0, 0, 0, 0, 0, 1 },   // 1: alleen midden
  {  1, 0, 0, 0, 0, 1, 0 },   // 2: linksboven + rechtsonder
  {  1, 0, 0, 0, 0, 1, 1 },   // 3: 2 + midden
  {  1, 1, 0, 0, 1, 1, 0 },   // 4: 4 hoeken
  {  1, 1, 0, 0, 1, 1, 1 },   // 5: 4 hoeken + midden
  {  1, 1, 1, 1, 1, 1, 0 },   // 6: alles behalve midden
  {  1, 1, 1, 1, 1, 1, 1 }    // index 6: testpatroon - alles aan
};

void toonGetal(int n) {
  // n = 1..6, of 7 voor "alles aan" (test).
  int rij = n - 1;
  zetAlleLedsUit();
  for (int i = 0; i < 7; i++) {
    if (patroon[rij][i]) digitalWrite(leds[i], HIGH);
  }
}

void setup() {
  leds[0] = ledPin1; leds[1] = ledPin2; leds[2] = ledPin3;
  leds[3] = ledPin4; leds[4] = ledPin5; leds[5] = ledPin6;
  leds[6] = ledPin7;
  for (int i = 0; i < 7; i++) pinMode(leds[i], OUTPUT);

  // Loop alle 6 worpen 1x langs, zodat je de patronen kunt herkennen.
}

void loop() {
  for (int n = 1; n <= 6; n++) {
    toonGetal(n);
    delay(800);
  }
}`;

const dice_s2 = `int ledPin1 = 2, ledPin2 = 3, ledPin3 = 4, ledPin4 = 5;
int ledPin5 = 6, ledPin6 = 7, ledPin7 = 8;
int knopPin = 9;

int leds[7];

bool patroon[7][7] = {
  { 0, 0, 0, 0, 0, 0, 1 },
  { 1, 0, 0, 0, 0, 1, 0 },
  { 1, 0, 0, 0, 0, 1, 1 },
  { 1, 1, 0, 0, 1, 1, 0 },
  { 1, 1, 0, 0, 1, 1, 1 },
  { 1, 1, 1, 1, 1, 1, 0 },
  { 1, 1, 1, 1, 1, 1, 1 }
};

void toonGetal(int n) {
  int rij = n - 1;
  for (int i = 0; i < 7; i++) {
    digitalWrite(leds[i], patroon[rij][i] ? HIGH : LOW);
  }
}

int vorigeKnop = HIGH;

void setup() {
  leds[0] = ledPin1; leds[1] = ledPin2; leds[2] = ledPin3;
  leds[3] = ledPin4; leds[4] = ledPin5; leds[5] = ledPin6;
  leds[6] = ledPin7;
  for (int i = 0; i < 7; i++) pinMode(leds[i], OUTPUT);

  pinMode(knopPin, INPUT_PULLUP);
  randomSeed(analogRead(A0));
  toonGetal(1);   // begin met 1 op het scherm
}

void loop() {
  int huidig = digitalRead(knopPin);

  // Edge-detectie: alleen op het exacte moment van indrukken.
  if (vorigeKnop == HIGH && huidig == LOW) {
    int worp = random(1, 7);   // 1..6 (7 is exclusief)
    toonGetal(worp);
  }
  vorigeKnop = huidig;

  delay(20);   // simpele debounce
}`;

const dice_s3 = `int ledPin1 = 2, ledPin2 = 3, ledPin3 = 4, ledPin4 = 5;
int ledPin5 = 6, ledPin6 = 7, ledPin7 = 8;
int knopPin = 9;

int leds[7];

bool patroon[7][7] = {
  { 0, 0, 0, 0, 0, 0, 1 },
  { 1, 0, 0, 0, 0, 1, 0 },
  { 1, 0, 0, 0, 0, 1, 1 },
  { 1, 1, 0, 0, 1, 1, 0 },
  { 1, 1, 0, 0, 1, 1, 1 },
  { 1, 1, 1, 1, 1, 1, 0 },
  { 1, 1, 1, 1, 1, 1, 1 }
};

void toonGetal(int n) {
  int rij = n - 1;
  for (int i = 0; i < 7; i++) {
    digitalWrite(leds[i], patroon[rij][i] ? HIGH : LOW);
  }
}

void shuffleAnimatie(int totaalMs) {
  // Toon een snel wisselend getal voor totaalMs milliseconden.
  unsigned long stop = millis() + totaalMs;
  while (millis() < stop) {
    toonGetal(random(1, 7));
    delay(60);
  }
}

int vorigeKnop = HIGH;

void setup() {
  leds[0] = ledPin1; leds[1] = ledPin2; leds[2] = ledPin3;
  leds[3] = ledPin4; leds[4] = ledPin5; leds[5] = ledPin6;
  leds[6] = ledPin7;
  for (int i = 0; i < 7; i++) pinMode(leds[i], OUTPUT);
  pinMode(knopPin, INPUT_PULLUP);
  randomSeed(analogRead(A0));
  toonGetal(1);
}

void loop() {
  int huidig = digitalRead(knopPin);
  if (vorigeKnop == HIGH && huidig == LOW) {
    shuffleAnimatie(500);          // 0,5 sec "rollen"
    int worp = random(1, 7);
    toonGetal(worp);               // toon de echte worp
  }
  vorigeKnop = huidig;
  delay(20);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 26: Schaakklok
// ─────────────────────────────────────────────

const chess_s1 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int knopSpeler1 = 2;
int knopSpeler2 = 3;
int buzzerPin   = 8;

void setup() {
  lcd.init();
  lcd.backlight();

  pinMode(knopSpeler1, INPUT_PULLUP);
  pinMode(knopSpeler2, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);

  // Toon 5 minuten voor beide spelers als startwaarde.
  lcd.setCursor(0, 0);
  lcd.print("Speler 1: 05:00");
  lcd.setCursor(0, 1);
  lcd.print("Speler 2: 05:00");
}

void loop() {
  // Volgende stappen vullen dit aan.
}`;

const chess_s2 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int knopSpeler1 = 2;
int knopSpeler2 = 3;
int buzzerPin   = 8;

// Resterende tijd per speler in milliseconden. Start bij 5 min = 300000 ms.
unsigned long tijd1 = 5UL * 60UL * 1000UL;
unsigned long tijd2 = 5UL * 60UL * 1000UL;

// Welke speler is aan zet? 0 = stopped, 1 = speler1, 2 = speler2.
int actieveSpeler = 0;

// Tijdstip van de laatste loop-iteratie, om delta-tijd te berekenen.
unsigned long vorigeMillis = 0;

void toonTijd(int rij, const char* label, unsigned long ms) {
  // Reken ms om naar minuten:seconden.
  unsigned long sec = ms / 1000UL;
  unsigned int minuten = sec / 60;
  unsigned int seconden = sec % 60;

  lcd.setCursor(0, rij);
  lcd.print(label);

  // mm:ss met voorloop-nul indien nodig.
  if (minuten < 10) lcd.print('0');
  lcd.print(minuten);
  lcd.print(':');
  if (seconden < 10) lcd.print('0');
  lcd.print(seconden);
  lcd.print(' ');
}

void setup() {
  lcd.init();
  lcd.backlight();
  pinMode(knopSpeler1, INPUT_PULLUP);
  pinMode(knopSpeler2, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
  vorigeMillis = millis();
}

void loop() {
  unsigned long nu = millis();
  unsigned long delta = nu - vorigeMillis;
  vorigeMillis = nu;

  // Trek de verstreken tijd af van de actieve speler.
  if (actieveSpeler == 1) {
    if (tijd1 > delta) tijd1 -= delta; else tijd1 = 0;
  } else if (actieveSpeler == 2) {
    if (tijd2 > delta) tijd2 -= delta; else tijd2 = 0;
  }

  toonTijd(0, "S1: ", tijd1);
  toonTijd(1, "S2: ", tijd2);

  delay(50);   // voldoende vaak om mm:ss soepel bij te werken
}`;

const chess_s3 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int knopSpeler1 = 2;
int knopSpeler2 = 3;
int buzzerPin   = 8;

unsigned long tijd1 = 5UL * 60UL * 1000UL;
unsigned long tijd2 = 5UL * 60UL * 1000UL;

int actieveSpeler = 0;
unsigned long vorigeMillis = 0;

int vorigeKnop1 = HIGH;
int vorigeKnop2 = HIGH;

void toonTijd(int rij, const char* label, unsigned long ms) {
  unsigned long sec = ms / 1000UL;
  unsigned int minuten = sec / 60;
  unsigned int seconden = sec % 60;
  lcd.setCursor(0, rij);
  lcd.print(label);
  if (minuten < 10) lcd.print('0');
  lcd.print(minuten);
  lcd.print(':');
  if (seconden < 10) lcd.print('0');
  lcd.print(seconden);
  lcd.print(' ');
}

void setup() {
  lcd.init();
  lcd.backlight();
  pinMode(knopSpeler1, INPUT_PULLUP);
  pinMode(knopSpeler2, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
  vorigeMillis = millis();
  lcd.setCursor(0, 0); lcd.print("Klaar - druk!");
}

void loop() {
  unsigned long nu = millis();
  unsigned long delta = nu - vorigeMillis;
  vorigeMillis = nu;

  if (actieveSpeler == 1 && tijd1 > delta) tijd1 -= delta;
  else if (actieveSpeler == 1) tijd1 = 0;
  if (actieveSpeler == 2 && tijd2 > delta) tijd2 -= delta;
  else if (actieveSpeler == 2) tijd2 = 0;

  // Knop speler 1: jouw eigen knop indrukken stopt jouw klok en start de tegenstander.
  int huidig1 = digitalRead(knopSpeler1);
  if (vorigeKnop1 == HIGH && huidig1 == LOW) {
    if (actieveSpeler == 0)      actieveSpeler = 2;   // start de tegenstander
    else if (actieveSpeler == 1) actieveSpeler = 2;   // wissel
    tone(buzzerPin, 1200, 50);
  }
  vorigeKnop1 = huidig1;

  int huidig2 = digitalRead(knopSpeler2);
  if (vorigeKnop2 == HIGH && huidig2 == LOW) {
    if (actieveSpeler == 0)      actieveSpeler = 1;
    else if (actieveSpeler == 2) actieveSpeler = 1;
    tone(buzzerPin, 1200, 50);
  }
  vorigeKnop2 = huidig2;

  toonTijd(0, "S1: ", tijd1);
  toonTijd(1, "S2: ", tijd2);

  delay(50);
}`;

const chess_s4 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int knopSpeler1 = 2;
int knopSpeler2 = 3;
int knopReset   = 4;          // 3e knop om de wedstrijd te resetten
int buzzerPin   = 8;

const unsigned long START_TIJD = 5UL * 60UL * 1000UL;   // 5 min per speler

unsigned long tijd1 = START_TIJD;
unsigned long tijd2 = START_TIJD;
int actieveSpeler = 0;        // 0 = stopped, 1 = speler1, 2 = speler2
bool gameOver = false;        // klok is op 0 → alarm
unsigned long vorigeMillis = 0;

int vorigeKnop1 = HIGH, vorigeKnop2 = HIGH, vorigeReset = HIGH;

void toonTijd(int rij, const char* label, unsigned long ms, bool actief) {
  unsigned long sec = ms / 1000UL;
  unsigned int minuten = sec / 60;
  unsigned int seconden = sec % 60;
  lcd.setCursor(0, rij);
  lcd.print(actief ? '>' : ' ');   // pijltje voor de actieve speler
  lcd.print(label);
  if (minuten < 10) lcd.print('0');
  lcd.print(minuten);
  lcd.print(':');
  if (seconden < 10) lcd.print('0');
  lcd.print(seconden);
  lcd.print("    ");
}

void resetGame() {
  tijd1 = START_TIJD;
  tijd2 = START_TIJD;
  actieveSpeler = 0;
  gameOver = false;
  noTone(buzzerPin);
}

void setup() {
  lcd.init();
  lcd.backlight();
  pinMode(knopSpeler1, INPUT_PULLUP);
  pinMode(knopSpeler2, INPUT_PULLUP);
  pinMode(knopReset,   INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
  vorigeMillis = millis();
}

void loop() {
  unsigned long nu = millis();
  unsigned long delta = nu - vorigeMillis;
  vorigeMillis = nu;

  // 1. Klok van de actieve speler aftellen.
  if (!gameOver) {
    if (actieveSpeler == 1) {
      if (tijd1 > delta) tijd1 -= delta; else { tijd1 = 0; gameOver = true; }
    } else if (actieveSpeler == 2) {
      if (tijd2 > delta) tijd2 -= delta; else { tijd2 = 0; gameOver = true; }
    }
  }

  // 2. Speler-knoppen (alleen wisselen tijdens een lopende partij).
  int h1 = digitalRead(knopSpeler1);
  if (vorigeKnop1 == HIGH && h1 == LOW && !gameOver) {
    if (actieveSpeler != 2) { actieveSpeler = 2; tone(buzzerPin, 1200, 40); }
  }
  vorigeKnop1 = h1;

  int h2 = digitalRead(knopSpeler2);
  if (vorigeKnop2 == HIGH && h2 == LOW && !gameOver) {
    if (actieveSpeler != 1) { actieveSpeler = 1; tone(buzzerPin, 1200, 40); }
  }
  vorigeKnop2 = h2;

  // 3. Reset-knop werkt altijd.
  int hR = digitalRead(knopReset);
  if (vorigeReset == HIGH && hR == LOW) resetGame();
  vorigeReset = hR;

  // 4. Display + alarm.
  toonTijd(0, "S1 ", tijd1, actieveSpeler == 1);
  toonTijd(1, "S2 ", tijd2, actieveSpeler == 2);

  if (gameOver) {
    // Lange pieptoon: speler met 0:00 heeft verloren op tijd.
    tone(buzzerPin, 880);
  }

  delay(50);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 27: Battleship op 8x8 LED-matrix
// ─────────────────────────────────────────────

const bs_s1 = `#include <LedControl.h>

// LedControl(DIN, CLK, CS, aantal_modules).
// DIN = pin 12, CLK = pin 11, CS = pin 10, 1 matrix.
LedControl matrix = LedControl(12, 11, 10, 1);

void setup() {
  // De MAX7219 start in spaarstand → wakker maken, helderheid laag, scherm leeg.
  matrix.shutdown(0, false);
  matrix.setIntensity(0, 4);   // 0 (zwak) .. 15 (max). 4 = comfortabel voor de ogen.
  matrix.clearDisplay(0);
}

void loop() {
  // Loop diagonaal van linksboven naar rechtsonder, dan weer terug.
  for (int i = 0; i < 8; i++) {
    matrix.setLed(0, i, i, true);   // (matrix-index, rij, kolom, aan/uit)
    delay(80);
  }
  delay(300);
  matrix.clearDisplay(0);
  delay(300);
}`;

const bs_s2 = `#include <LedControl.h>

LedControl matrix = LedControl(12, 11, 10, 1);

const int VELD = 8;           // 8x8 grid
const int AANTAL_SCHEPEN = 4; // 4 losse cellen als "schepen"

// Speel-data: per cel of er een schip ligt en of er al op geschoten is.
bool schip[VELD][VELD];
bool getroffen[VELD][VELD];

void plaatsSchepen() {
  // Maak alles leeg.
  for (int r = 0; r < VELD; r++) {
    for (int k = 0; k < VELD; k++) {
      schip[r][k] = false;
      getroffen[r][k] = false;
    }
  }
  // Plaats AANTAL_SCHEPEN cellen op willekeurige posities (geen overlap).
  int geplaatst = 0;
  while (geplaatst < AANTAL_SCHEPEN) {
    int r = random(0, VELD);
    int k = random(0, VELD);
    if (!schip[r][k]) {
      schip[r][k] = true;
      geplaatst++;
    }
  }
}

void tekenVeld() {
  // Toon alleen de getroffen schepen (HIT). De overige cellen blijven uit
  // - de speler ziet de schepen pas als hij raak schiet.
  for (int r = 0; r < VELD; r++) {
    for (int k = 0; k < VELD; k++) {
      bool aan = (schip[r][k] && getroffen[r][k]);
      matrix.setLed(0, r, k, aan);
    }
  }
}

void setup() {
  matrix.shutdown(0, false);
  matrix.setIntensity(0, 4);
  matrix.clearDisplay(0);

  randomSeed(analogRead(A2));    // A2 = ongebruikte pin → ruis voor random
  plaatsSchepen();

  // Maak voor de uitleg zichtbaar waar ze liggen door alles op "geraakt" te zetten.
  for (int r = 0; r < VELD; r++)
    for (int k = 0; k < VELD; k++)
      getroffen[r][k] = true;

  tekenVeld();
}

void loop() {
  // Volgende stappen voegen joystick + schiet-knop toe.
}`;

const bs_s3 = `#include <LedControl.h>

LedControl matrix = LedControl(12, 11, 10, 1);

const int VELD = 8;
const int AANTAL_SCHEPEN = 4;

bool schip[VELD][VELD];
bool getroffen[VELD][VELD];

// Joystick: VRX op A0, VRY op A1.
int joystickX = A0;
int joystickY = A1;

// Cursor-positie waar de speler "richt".
int cursorRij = 0;
int cursorKol = 0;

void plaatsSchepen() {
  for (int r = 0; r < VELD; r++)
    for (int k = 0; k < VELD; k++) { schip[r][k] = false; getroffen[r][k] = false; }
  int geplaatst = 0;
  while (geplaatst < AANTAL_SCHEPEN) {
    int r = random(0, VELD), k = random(0, VELD);
    if (!schip[r][k]) { schip[r][k] = true; geplaatst++; }
  }
}

void tekenVeld(bool cursorAan) {
  for (int r = 0; r < VELD; r++) {
    for (int k = 0; k < VELD; k++) {
      bool aan = (schip[r][k] && getroffen[r][k]);
      matrix.setLed(0, r, k, aan);
    }
  }
  // Knipperende cursor: tekent over de inhoud heen.
  matrix.setLed(0, cursorRij, cursorKol, cursorAan);
}

unsigned long laatsteBeweging = 0;
const int BEWEEG_DELAY = 200;   // hoe vaak de cursor maximaal verspringt

void leesJoystick() {
  // Niet vaker dan elke BEWEEG_DELAY ms verspringen, anders schiet je voorbij.
  if (millis() - laatsteBeweging < BEWEEG_DELAY) return;

  int x = analogRead(joystickX);    // 0..1023, midden ~512
  int y = analogRead(joystickY);

  bool bewogen = false;
  if (x < 300 && cursorKol > 0)         { cursorKol--; bewogen = true; }
  else if (x > 700 && cursorKol < VELD - 1) { cursorKol++; bewogen = true; }
  if (y < 300 && cursorRij > 0)         { cursorRij--; bewogen = true; }
  else if (y > 700 && cursorRij < VELD - 1) { cursorRij++; bewogen = true; }

  if (bewogen) laatsteBeweging = millis();
}

unsigned long laatsteKnipper = 0;
bool cursorZichtbaar = true;

void setup() {
  matrix.shutdown(0, false);
  matrix.setIntensity(0, 4);
  matrix.clearDisplay(0);
  randomSeed(analogRead(A2));
  plaatsSchepen();
}

void loop() {
  leesJoystick();

  // Laat de cursor 2x per seconde knipperen.
  if (millis() - laatsteKnipper > 250) {
    cursorZichtbaar = !cursorZichtbaar;
    laatsteKnipper = millis();
  }
  tekenVeld(cursorZichtbaar);
}`;

const bs_s4 = `#include <LedControl.h>

LedControl matrix = LedControl(12, 11, 10, 1);

const int VELD = 8;
const int AANTAL_SCHEPEN = 4;

bool schip[VELD][VELD];
bool getroffen[VELD][VELD];
bool beschoten[VELD][VELD];   // welke cellen al een schot kregen (raak of mis)

int joystickX = A0;
int joystickY = A1;
int knopVuur  = 4;

int cursorRij = 0, cursorKol = 0;
int vorigeKnop = HIGH;
int treffers = 0;

void plaatsSchepen() {
  for (int r = 0; r < VELD; r++)
    for (int k = 0; k < VELD; k++) {
      schip[r][k] = false; getroffen[r][k] = false; beschoten[r][k] = false;
    }
  int geplaatst = 0;
  while (geplaatst < AANTAL_SCHEPEN) {
    int r = random(0, VELD), k = random(0, VELD);
    if (!schip[r][k]) { schip[r][k] = true; geplaatst++; }
  }
}

void tekenVeld(bool cursorAan) {
  for (int r = 0; r < VELD; r++) {
    for (int k = 0; k < VELD; k++) {
      // Een raak schot blijft permanent zichtbaar; missen tonen we niet.
      bool aan = (schip[r][k] && getroffen[r][k]);
      matrix.setLed(0, r, k, aan);
    }
  }
  matrix.setLed(0, cursorRij, cursorKol, cursorAan);
}

unsigned long laatsteBeweging = 0;
const int BEWEEG_DELAY = 200;

void leesJoystick() {
  if (millis() - laatsteBeweging < BEWEEG_DELAY) return;
  int x = analogRead(joystickX);
  int y = analogRead(joystickY);
  bool bewogen = false;
  if      (x < 300 && cursorKol > 0)            { cursorKol--; bewogen = true; }
  else if (x > 700 && cursorKol < VELD - 1)     { cursorKol++; bewogen = true; }
  if      (y < 300 && cursorRij > 0)            { cursorRij--; bewogen = true; }
  else if (y > 700 && cursorRij < VELD - 1)     { cursorRij++; bewogen = true; }
  if (bewogen) laatsteBeweging = millis();
}

void hitFeedback() {
  // 3x snel knipperen: alle LEDs op die cel knipperen.
  for (int n = 0; n < 3; n++) {
    matrix.setLed(0, cursorRij, cursorKol, true);  delay(120);
    matrix.setLed(0, cursorRij, cursorKol, false); delay(120);
  }
  matrix.setLed(0, cursorRij, cursorKol, true);    // raak = blijft aan
}

void missFeedback() {
  // Twee korte knipperen op de hele rij om "plons" aan te geven.
  for (int n = 0; n < 2; n++) {
    for (int k = 0; k < VELD; k++) matrix.setLed(0, cursorRij, k, true);
    delay(80);
    for (int k = 0; k < VELD; k++) matrix.setLed(0, cursorRij, k, false);
    delay(80);
  }
}

void schiet() {
  if (beschoten[cursorRij][cursorKol]) return;     // niet 2x op dezelfde cel
  beschoten[cursorRij][cursorKol] = true;
  if (schip[cursorRij][cursorKol]) {
    getroffen[cursorRij][cursorKol] = true;
    treffers++;
    hitFeedback();
  } else {
    missFeedback();
  }
}

unsigned long laatsteKnipper = 0;
bool cursorZichtbaar = true;

void setup() {
  matrix.shutdown(0, false);
  matrix.setIntensity(0, 4);
  matrix.clearDisplay(0);

  pinMode(knopVuur, INPUT_PULLUP);
  randomSeed(analogRead(A2));
  plaatsSchepen();
}

void loop() {
  leesJoystick();

  // Vuur-knop met edge-detectie.
  int huidig = digitalRead(knopVuur);
  if (vorigeKnop == HIGH && huidig == LOW) schiet();
  vorigeKnop = huidig;

  if (millis() - laatsteKnipper > 250) {
    cursorZichtbaar = !cursorZichtbaar;
    laatsteKnipper = millis();
  }
  tekenVeld(cursorZichtbaar);
}`;

const bs_s5 = `#include <LedControl.h>

LedControl matrix = LedControl(12, 11, 10, 1);

const int VELD = 8;
const int AANTAL_SCHEPEN = 4;

bool schip[VELD][VELD];
bool getroffen[VELD][VELD];
bool beschoten[VELD][VELD];

int joystickX = A0, joystickY = A1, knopVuur = 4;

int cursorRij = 0, cursorKol = 0;
int vorigeKnop = HIGH;
int treffers = 0;
int schoten  = 0;
bool gewonnen = false;

void plaatsSchepen() {
  for (int r = 0; r < VELD; r++)
    for (int k = 0; k < VELD; k++) {
      schip[r][k] = false; getroffen[r][k] = false; beschoten[r][k] = false;
    }
  int geplaatst = 0;
  while (geplaatst < AANTAL_SCHEPEN) {
    int r = random(0, VELD), k = random(0, VELD);
    if (!schip[r][k]) { schip[r][k] = true; geplaatst++; }
  }
}

void tekenVeld(bool cursorAan) {
  for (int r = 0; r < VELD; r++) {
    for (int k = 0; k < VELD; k++) {
      matrix.setLed(0, r, k, schip[r][k] && getroffen[r][k]);
    }
  }
  if (!gewonnen) matrix.setLed(0, cursorRij, cursorKol, cursorAan);
}

unsigned long laatsteBeweging = 0;
const int BEWEEG_DELAY = 200;

void leesJoystick() {
  if (millis() - laatsteBeweging < BEWEEG_DELAY) return;
  int x = analogRead(joystickX), y = analogRead(joystickY);
  bool bewogen = false;
  if      (x < 300 && cursorKol > 0)        { cursorKol--; bewogen = true; }
  else if (x > 700 && cursorKol < VELD - 1) { cursorKol++; bewogen = true; }
  if      (y < 300 && cursorRij > 0)        { cursorRij--; bewogen = true; }
  else if (y > 700 && cursorRij < VELD - 1) { cursorRij++; bewogen = true; }
  if (bewogen) laatsteBeweging = millis();
}

void hitFeedback() {
  for (int n = 0; n < 3; n++) {
    matrix.setLed(0, cursorRij, cursorKol, true);  delay(120);
    matrix.setLed(0, cursorRij, cursorKol, false); delay(120);
  }
  matrix.setLed(0, cursorRij, cursorKol, true);
}

void missFeedback() {
  for (int n = 0; n < 2; n++) {
    for (int k = 0; k < VELD; k++) matrix.setLed(0, cursorRij, k, true);
    delay(80);
    for (int k = 0; k < VELD; k++) matrix.setLed(0, cursorRij, k, false);
    delay(80);
  }
}

void winAnimatie() {
  // Vul het scherm spiraalsgewijs vanuit het midden naar buiten.
  for (int n = 0; n < 8; n++) {
    for (int r = 0; r < VELD; r++)
      for (int k = 0; k < VELD; k++)
        matrix.setLed(0, r, k, ((r + k + n) % 2) == 0);
    delay(150);
  }
  matrix.clearDisplay(0);
  delay(200);
  // Toon alle schepen aan het einde.
  for (int r = 0; r < VELD; r++)
    for (int k = 0; k < VELD; k++)
      matrix.setLed(0, r, k, schip[r][k]);
}

void schiet() {
  if (beschoten[cursorRij][cursorKol]) return;
  beschoten[cursorRij][cursorKol] = true;
  schoten++;
  if (schip[cursorRij][cursorKol]) {
    getroffen[cursorRij][cursorKol] = true;
    treffers++;
    hitFeedback();
    if (treffers == AANTAL_SCHEPEN) {
      gewonnen = true;
      winAnimatie();
    }
  } else {
    missFeedback();
  }
}

unsigned long laatsteKnipper = 0;
bool cursorZichtbaar = true;

void setup() {
  matrix.shutdown(0, false);
  matrix.setIntensity(0, 4);
  matrix.clearDisplay(0);
  pinMode(knopVuur, INPUT_PULLUP);
  randomSeed(analogRead(A2));
  plaatsSchepen();
  Serial.begin(9600);
}

void loop() {
  if (gewonnen) {
    // Wacht stil tot de speler RESET drukt - of laat winAnimatie blijven branden.
    return;
  }
  leesJoystick();
  int huidig = digitalRead(knopVuur);
  if (vorigeKnop == HIGH && huidig == LOW) schiet();
  vorigeKnop = huidig;
  if (millis() - laatsteKnipper > 250) {
    cursorZichtbaar = !cursorZichtbaar;
    laatsteKnipper = millis();
  }
  tekenVeld(cursorZichtbaar);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 28: Magic 8-Ball met servo (Beginner)
// ─────────────────────────────────────────────

const m8_s1 = `#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo servo1;
int knopPin = 7;     // drukknop (andere kant naar GND)

void setup() {
  lcd.init();
  lcd.backlight();
  servo1.attach(9);    // signaal-draadje van de servo op pin 9
  pinMode(knopPin, INPUT_PULLUP);

  servo1.write(90);    // middenstand
  lcd.setCursor(0, 0); lcd.print("Magic 8-Ball");
  lcd.setCursor(0, 1); lcd.print("Druk de knop...");
}

void loop() {
  // Hardware-test: druk je de knop, dan wiebelt de servo.
  if (digitalRead(knopPin) == LOW) {
    servo1.write(60);  delay(150);
    servo1.write(120); delay(150);
    servo1.write(90);
  }
}`;

const m8_s2 = `#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo servo1;
int knopPin = 7;

// 8 antwoorden — een echte Magic 8-Ball heeft er 20, maar voor de demo is 8 prima.
const int AANTAL_ANTW = 8;
String antwoorden[AANTAL_ANTW] = {
  "Zeker weten!",
  "Beter van niet",
  "Vraag later",
  "Dat klopt!",
  "Hmm... nee",
  "Heel waarschijnlijk",
  "Twijfelachtig",
  "Onmogelijk"
};

void toonAntwoord(int i) {
  lcd.clear();
  lcd.setCursor(0, 0); lcd.print("De 8-Ball zegt:");
  lcd.setCursor(0, 1); lcd.print(antwoorden[i]);
}

void setup() {
  lcd.init();
  lcd.backlight();
  servo1.attach(9);
  pinMode(knopPin, INPUT_PULLUP);
  servo1.write(90);
  randomSeed(analogRead(A0));   // ruis als zaadje, anders elke keer hetzelfde
  lcd.print("Stel een vraag!");
}

void loop() {
  if (digitalRead(knopPin) == LOW) {
    int keuze = random(0, AANTAL_ANTW);   // 0..7
    toonAntwoord(keuze);
    delay(2000);   // even laten staan
  }
}`;

const m8_s3 = `#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo servo1;
int knopPin = 7;

const int AANTAL_ANTW = 8;
String antwoorden[AANTAL_ANTW] = {
  "Zeker weten!", "Beter van niet", "Vraag later", "Dat klopt!",
  "Hmm... nee", "Heel waarschijnlijk", "Twijfelachtig", "Onmogelijk"
};

int vorigeKnop = HIGH;

void rollen() {
  // Drie keer heen-en-weer = "schudden" van de bal
  for (int i = 0; i < 3; i++) {
    servo1.write(45);  delay(120);
    servo1.write(135); delay(120);
  }
  servo1.write(90);    // weer netjes in midden
}

void toonAntwoord(int i) {
  lcd.clear();
  lcd.setCursor(0, 0); lcd.print("De 8-Ball zegt:");
  lcd.setCursor(0, 1); lcd.print(antwoorden[i]);
}

void setup() {
  lcd.init();
  lcd.backlight();
  servo1.attach(9);
  pinMode(knopPin, INPUT_PULLUP);
  servo1.write(90);
  randomSeed(analogRead(A0));
  lcd.print("Stel een vraag!");
}

void loop() {
  int huidig = digitalRead(knopPin);
  // Edge: alleen op het MOMENT dat de knop wordt ingedrukt
  if (vorigeKnop == HIGH && huidig == LOW) {
    rollen();
    int keuze = random(0, AANTAL_ANTW);
    toonAntwoord(keuze);
  }
  vorigeKnop = huidig;
  delay(20);   // simpele debounce
}`;

// ─────────────────────────────────────────────
// TUTORIAL 29: Slim plantenwater-systeem (Gemiddeld)
// ─────────────────────────────────────────────

const plant_s1 = `int soilPin = A0;     // bodemvocht-sensor (analoge uitgang AOUT)

void setup() {
  Serial.begin(9600);
  Serial.println("Bodemvocht-kalibratie. Houd de sensor in de lucht (=droog),");
  Serial.println("en daarna in een glas water (=nat). Noteer de waardes!");
}

void loop() {
  int ruw = analogRead(soilPin);
  Serial.print("Sensor: ");
  Serial.println(ruw);
  delay(500);
}`;

const plant_s2 = `int soilPin = A0;

// Vul hier in wat JIJ in stap 1 hebt gemeten:
const int DROOG = 880;   // sensor in lucht
const int NAT   = 380;   // sensor in glas water

void setup() {
  Serial.begin(9600);
}

void loop() {
  int ruw = analogRead(soilPin);
  // map(): hoe hoger de waarde, hoe droger. We willen 0% (droog) .. 100% (nat).
  int procent = map(ruw, DROOG, NAT, 0, 100);
  procent = constrain(procent, 0, 100);   // klem tussen 0 en 100

  Serial.print("Ruw: "); Serial.print(ruw);
  Serial.print("  Vocht: "); Serial.print(procent);
  Serial.println(" %");

  if (procent < 30) Serial.println(" -> TE DROOG, water geven!");
  delay(1000);
}`;

const plant_s3 = `int soilPin = A0;
int pompPin = 7;     // stuurt het 5V-relais aan dat de pomp schakelt

const int DROOG = 880;
const int NAT   = 380;
const int DREMPEL_PROCENT = 30;            // onder dit percentage: water geven

const unsigned long POMP_MAX_MS  = 3000UL; // VEILIGHEID: pomp NOOIT langer dan 3 sec aan
const unsigned long COOLDOWN_MS  = 60000UL; // 1 min wachten voor de volgende beurt

unsigned long laatstePompTijd = 0;
bool pompHeeftGedraaid = false;

void pompAan()  { digitalWrite(pompPin, LOW);  }   // de meeste hobby-relais zijn ACTIVE-LOW
void pompUit()  { digitalWrite(pompPin, HIGH); }

void setup() {
  Serial.begin(9600);
  // Volgorde is CRUCIAAL bij active-LOW relais:
  // 1) Eerst HIGH 'voorinstellen' (activeert interne pull-up zolang pin nog INPUT is),
  // 2) Pas DAARNA pinMode(OUTPUT). Zo komt de pin direct als HIGH uit de switch.
  // Andere volgorde = korte LOW-glitch tijdens elke reset = pomp tikt aan.
  digitalWrite(pompPin, HIGH);
  pinMode(pompPin, OUTPUT);
}

void loop() {
  int ruw = analogRead(soilPin);
  int procent = constrain(map(ruw, DROOG, NAT, 0, 100), 0, 100);
  unsigned long nu = millis();

  bool tijdGenoegGewacht = (nu - laatstePompTijd) > COOLDOWN_MS;

  if (procent < DREMPEL_PROCENT && tijdGenoegGewacht) {
    Serial.println("Te droog -> pomp 3 sec aan");
    pompAan();
    delay(POMP_MAX_MS);       // hard begrensde max-runtime
    pompUit();
    laatstePompTijd = nu;
    pompHeeftGedraaid = true;
  }

  delay(1000);
}`;

const plant_s4 = `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

int soilPin = A0;
int pompPin = 7;

const int DROOG = 880;
const int NAT   = 380;
const int DREMPEL_PROCENT = 30;

const unsigned long POMP_MAX_MS  = 3000UL;
const unsigned long COOLDOWN_MS  = 60000UL;

unsigned long laatstePompTijd = 0;
String laatsteActie = "Geen";   // wat zag de plant het laatst?

void pompAan() { digitalWrite(pompPin, LOW); }
void pompUit() { digitalWrite(pompPin, HIGH); }

void setup() {
  Serial.begin(9600);
  // Active-LOW relais: HIGH voorinstellen VOOR pinMode(OUTPUT)
  // anders korte LOW-glitch tijdens reset = pomp tikt aan.
  digitalWrite(pompPin, HIGH);
  pinMode(pompPin, OUTPUT);
  lcd.init();
  lcd.backlight();
  lcd.print("Plantenwater 1.0");
  delay(1000);
}

void toonStatus(int procent) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Vocht: ");
  lcd.print(procent);
  lcd.print(" %");

  lcd.setCursor(0, 1);
  lcd.print(laatsteActie);
}

void loop() {
  int ruw = analogRead(soilPin);
  int procent = constrain(map(ruw, DROOG, NAT, 0, 100), 0, 100);
  unsigned long nu = millis();

  if (procent < DREMPEL_PROCENT && (nu - laatstePompTijd) > COOLDOWN_MS) {
    pompAan();
    delay(POMP_MAX_MS);
    pompUit();
    laatstePompTijd = nu;
    laatsteActie = "Net water gehad";
  } else if (procent < DREMPEL_PROCENT) {
    laatsteActie = "Cooldown actief";
  } else {
    laatsteActie = "Nat genoeg :)";
  }

  toonStatus(procent);
  delay(2000);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 30: CO₂-meter voor het klaslokaal (Gemiddeld)
// ─────────────────────────────────────────────

const co2_s1 = `int mqPin = A0;     // MQ-135 AOUT

void setup() {
  Serial.begin(9600);
  Serial.println("MQ-135 opwarmen... wacht ~2 minuten voor stabiele waardes.");
}

void loop() {
  int ruw = analogRead(mqPin);
  Serial.print("MQ-135 ruw: ");
  Serial.println(ruw);
  delay(1000);
}`;

const co2_s2 = `int mqPin = A0;

// Heel ruwe schatting: bij verse buitenlucht (~400 ppm) lees je iets als 100..200,
// bij slechte lucht (>1500 ppm) eerder 500+. Voor exacte ppm heb je een SCD30 nodig
// (échte NDIR-sensor). Voor school-context is dit prima om "te slecht" aan te geven.
int co2Schatting(int ruw) {
  // map(ruw 100..900 -> 400..2000 ppm)  (klem voor veiligheid)
  int ppm = map(ruw, 100, 900, 400, 2000);
  if (ppm < 400)  ppm = 400;
  if (ppm > 5000) ppm = 5000;
  return ppm;
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  int ruw = analogRead(mqPin);
  int ppm = co2Schatting(ruw);

  Serial.print("Ruw: "); Serial.print(ruw);
  Serial.print("  ~ppm: "); Serial.println(ppm);
  delay(1000);
}`;

const co2_s3 = `#include <Adafruit_NeoPixel.h>

int mqPin = A0;
int dataPin = 6;
const int LEDS = 8;
Adafruit_NeoPixel strip(LEDS, dataPin, NEO_GRB + NEO_KHZ800);

int co2Schatting(int ruw) {
  int ppm = map(ruw, 100, 900, 400, 2000);
  if (ppm < 400)  ppm = 400;
  if (ppm > 5000) ppm = 5000;
  return ppm;
}

uint32_t kleurZone(int ppm) {
  if (ppm < 800)  return strip.Color(0, 80, 0);     // groen
  if (ppm < 1200) return strip.Color(120, 60, 0);   // oranje
  return strip.Color(120, 0, 0);                    // rood
}

void setup() {
  Serial.begin(9600);
  strip.begin();
  strip.show();
}

void loop() {
  int ruw = analogRead(mqPin);
  int ppm = co2Schatting(ruw);
  uint32_t kleur = kleurZone(ppm);

  // vul alle LEDs met dezelfde kleur — een soort "stoplicht-strip"
  for (int i = 0; i < LEDS; i++) strip.setPixelColor(i, kleur);
  strip.show();

  Serial.print("ppm: "); Serial.println(ppm);
  delay(1000);
}`;

const co2_s4 = `#include <Adafruit_NeoPixel.h>

int mqPin = A0;
int dataPin = 6;
int buzzerPin = 8;
int snoozeKnopPin = 4;     // knop tegen GND, INPUT_PULLUP

const int LEDS = 8;
Adafruit_NeoPixel strip(LEDS, dataPin, NEO_GRB + NEO_KHZ800);

const unsigned long SNOOZE_MS = 5UL * 60UL * 1000UL;  // 5 min stil na druk
unsigned long snoozeTotMillis = 0;
int vorigeKnop = HIGH;

int co2Schatting(int ruw) {
  int ppm = map(ruw, 100, 900, 400, 2000);
  if (ppm < 400)  ppm = 400;
  if (ppm > 5000) ppm = 5000;
  return ppm;
}

uint32_t kleurZone(int ppm) {
  if (ppm < 800)  return strip.Color(0, 80, 0);
  if (ppm < 1200) return strip.Color(120, 60, 0);
  return strip.Color(120, 0, 0);
}

void setup() {
  Serial.begin(9600);
  pinMode(buzzerPin, OUTPUT);
  pinMode(snoozeKnopPin, INPUT_PULLUP);
  strip.begin();
  strip.show();
}

void loop() {
  int ruw = analogRead(mqPin);
  int ppm = co2Schatting(ruw);

  for (int i = 0; i < LEDS; i++) strip.setPixelColor(i, kleurZone(ppm));
  strip.show();

  // Snooze-knop: bij druk 5 min geen alarm meer
  int huidig = digitalRead(snoozeKnopPin);
  if (vorigeKnop == HIGH && huidig == LOW) {
    snoozeTotMillis = millis() + SNOOZE_MS;
    Serial.println("Snooze: 5 min stil");
  }
  vorigeKnop = huidig;

  bool inSnooze = millis() < snoozeTotMillis;

  if (ppm > 1200 && !inSnooze) {
    // korte piepjes — niet hard genoeg om af te leiden, wel hoorbaar
    tone(buzzerPin, 1200, 80);
  } else {
    noTone(buzzerPin);
  }

  delay(1000);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 31: Slim slot met RFID-pas (Gemiddeld)
// ─────────────────────────────────────────────

const rfid_s1 = `// Bibliotheken: SPI is standaard. Installeer 'MFRC522' van GithubCommunity
// via Schets -> Bibliotheek beheren -> zoek "MFRC522".
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN  10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Houd een pas/tag voor de lezer...");
}

void loop() {
  // Geen kaart aanwezig? Niets doen.
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial())   return;

  Serial.println("Kaart gedetecteerd!");
  rfid.PICC_HaltA();
}`;

const rfid_s2 = `#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN  10
#define RST_PIN 9
MFRC522 rfid(SS_PIN, RST_PIN);

// Print de UID als reeks van bytes in HEX. Dit is wat we straks vergelijken.
void printUID(byte *uid, byte len) {
  for (byte i = 0; i < len; i++) {
    if (uid[i] < 0x10) Serial.print("0");
    Serial.print(uid[i], HEX);
    if (i < len - 1) Serial.print(" ");
  }
  Serial.println();
}

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Houd jouw pas voor de lezer en noteer de UID:");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial())   return;

  Serial.print("UID: ");
  printUID(rfid.uid.uidByte, rfid.uid.size);
  rfid.PICC_HaltA();
  delay(800);   // anti-dubbel-lezen van dezelfde kaart
}`;

const rfid_s3 = `#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN  10
#define RST_PIN 9
MFRC522 rfid(SS_PIN, RST_PIN);

// VUL HIER JOUW UIDs IN (uit stap 2). Elke pas = 4 bytes (vaak) of 7 bytes.
// Voorbeeld voor een 4-byte tag:
const int AANTAL_PASSEN = 2;
const int UID_LEN = 4;
byte toegestaan[AANTAL_PASSEN][UID_LEN] = {
  { 0xDE, 0xAD, 0xBE, 0xEF },   // pas van de leraar
  { 0x12, 0x34, 0x56, 0x78 }    // pas van de leerling
};

bool zelfdeUID(byte *gelezen, byte len, byte *kandidaat) {
  if (len != UID_LEN) return false;
  for (byte i = 0; i < UID_LEN; i++) {
    if (gelezen[i] != kandidaat[i]) return false;
  }
  return true;
}

bool isToegestaan(byte *gelezen, byte len) {
  for (int i = 0; i < AANTAL_PASSEN; i++) {
    if (zelfdeUID(gelezen, len, toegestaan[i])) return true;
  }
  return false;
}

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial())   return;

  if (isToegestaan(rfid.uid.uidByte, rfid.uid.size)) {
    Serial.println("TOEGANG OK");
  } else {
    Serial.println("TOEGANG GEWEIGERD");
  }
  rfid.PICC_HaltA();
  delay(800);
}`;

const rfid_s4 = `#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

#define SS_PIN  10
#define RST_PIN 9
MFRC522 rfid(SS_PIN, RST_PIN);

Servo servo1;
int groenLedPin = 6;
int rodeLedPin  = 7;

const int AANTAL_PASSEN = 2;
const int UID_LEN = 4;
byte toegestaan[AANTAL_PASSEN][UID_LEN] = {
  { 0xDE, 0xAD, 0xBE, 0xEF },
  { 0x12, 0x34, 0x56, 0x78 }
};

bool zelfdeUID(byte *a, byte len, byte *b) {
  if (len != UID_LEN) return false;
  for (byte i = 0; i < UID_LEN; i++) if (a[i] != b[i]) return false;
  return true;
}

bool isToegestaan(byte *uid, byte len) {
  for (int i = 0; i < AANTAL_PASSEN; i++)
    if (zelfdeUID(uid, len, toegestaan[i])) return true;
  return false;
}

void slotOpen() {
  servo1.write(180);   // 180° = "open" stand
  digitalWrite(groenLedPin, HIGH);
  delay(5000);         // 5 sec open
  digitalWrite(groenLedPin, LOW);
  servo1.write(0);     // weer dicht
}

void afgewezen() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(rodeLedPin, HIGH); delay(150);
    digitalWrite(rodeLedPin, LOW);  delay(150);
  }
}

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  servo1.attach(3);
  servo1.write(0);     // start: dicht
  pinMode(groenLedPin, OUTPUT);
  pinMode(rodeLedPin,  OUTPUT);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial())   return;

  if (isToegestaan(rfid.uid.uidByte, rfid.uid.size)) {
    Serial.println("OK -> open");
    slotOpen();
  } else {
    Serial.println("GEWEIGERD");
    afgewezen();
  }
  rfid.PICC_HaltA();
  delay(500);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 32: Aanwezigheidssensor met auto-licht (Beginner)
// ─────────────────────────────────────────────

const auto_s1 = `int pirPin    = 2;    // PIR sensor OUT
int relaisPin = 7;    // 5V-relais module IN

void relaisAan()  { digitalWrite(relaisPin, LOW);  }   // active-LOW relais
void relaisUit()  { digitalWrite(relaisPin, HIGH); }

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  // CRUCIAAL bij active-LOW relais: HIGH voorinstellen VOOR pinMode(OUTPUT),
  // anders korte LOW-glitch bij reset = lamp ploft kort aan.
  digitalWrite(relaisPin, HIGH);
  pinMode(relaisPin, OUTPUT);
}

void loop() {
  int beweging = digitalRead(pirPin);
  if (beweging == HIGH) {
    relaisAan();
    Serial.println("Beweging -> licht aan");
  } else {
    relaisUit();
  }
  delay(50);
}`;

const auto_s2 = `int pirPin    = 2;
int relaisPin = 7;

const unsigned long NA_LICHT_AAN_MS = 30UL * 1000UL;   // 30 sec stil = uit
unsigned long laatsteBewegingMs = 0;
bool lichtAan = false;

void relaisAan() { digitalWrite(relaisPin, LOW);  lichtAan = true;  }
void relaisUit() { digitalWrite(relaisPin, HIGH); lichtAan = false; }

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  // Active-LOW relais: HIGH VOOR pinMode(OUTPUT) (anti-reset-glitch).
  digitalWrite(relaisPin, HIGH);
  pinMode(relaisPin, OUTPUT);
}

void loop() {
  if (digitalRead(pirPin) == HIGH) {
    laatsteBewegingMs = millis();
    if (!lichtAan) {
      relaisAan();
      Serial.println("Beweging -> aan");
    }
  }

  // Geen beweging meer voor 30 sec? -> uit
  if (lichtAan && (millis() - laatsteBewegingMs) > NA_LICHT_AAN_MS) {
    relaisUit();
    Serial.println("Stil -> uit");
  }

  delay(50);
}`;

const auto_s3 = `int pirPin    = 2;
int relaisPin = 7;
int ldrPin    = A0;            // LDR via spanningsdeler met 10kΩ -> GND

const unsigned long NA_LICHT_AAN_MS = 30UL * 1000UL;
const int DAGLICHT_DREMPEL = 600;     // boven dit getal: het is overdag licht genoeg

unsigned long laatsteBewegingMs = 0;
bool lichtAan = false;

void relaisAan() { digitalWrite(relaisPin, LOW);  lichtAan = true;  }
void relaisUit() { digitalWrite(relaisPin, HIGH); lichtAan = false; }

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  // Active-LOW relais: HIGH VOOR pinMode(OUTPUT) (anti-reset-glitch).
  digitalWrite(relaisPin, HIGH);
  pinMode(relaisPin, OUTPUT);
}

void loop() {
  int licht = analogRead(ldrPin);
  bool overdag = (licht > DAGLICHT_DREMPEL);

  if (digitalRead(pirPin) == HIGH && !overdag) {
    laatsteBewegingMs = millis();
    if (!lichtAan) relaisAan();
  }

  if (lichtAan && (millis() - laatsteBewegingMs) > NA_LICHT_AAN_MS) {
    relaisUit();
  }

  // Als het overdag licht wordt terwijl het kunstlicht aanstaat -> direct uit
  if (lichtAan && overdag) relaisUit();

  delay(100);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 33: OLED-grafieken & mini-oscilloscoop
// ─────────────────────────────────────────────

const oled_s1 = `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define BREEDTE 128
#define HOOGTE  64

// -1 = geen reset-pin, &Wire = standaard I2C-bus.
Adafruit_SSD1306 display(BREEDTE, HOOGTE, &Wire, -1);

void setup() {
  Serial.begin(9600);

  // 0x3C is het meest voorkomende I2C-adres voor 128x64 SSD1306.
  // Sommige modules zijn 0x3D — als 'OLED niet gevonden' verschijnt: probeer 0x3D.
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED niet gevonden! Check VCC/GND/SDA/SCL en het adres.");
    while (true) {}   // stop hier — verder gaan heeft geen zin
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print("Hallo OLED!");
  display.display();   // PAS NU komt de tekst echt op het scherm
}

void loop() {
  // Niks — de tekst blijft staan.
}`;

const oled_s2 = `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define BREEDTE 128
#define HOOGTE  64
Adafruit_SSD1306 display(BREEDTE, HOOGTE, &Wire, -1);

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  // Titel bovenaan
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("Mini-scope");

  // Y-as: vertikale lijn van (10, 10) naar (10, 63).
  display.drawLine(10, 10, 10, 63, SSD1306_WHITE);
  // X-as: horizontale lijn helemaal onderaan.
  display.drawLine(10, 63, 127, 63, SSD1306_WHITE);

  // Demo-data: een schuine lijn van linksonder naar rechtsboven.
  display.drawLine(10, 60, 127, 12, SSD1306_WHITE);

  // Labeltjes op de assen
  display.setCursor(0, 8);
  display.print("max");
  display.setCursor(0, 56);
  display.print("min");

  display.display();
}

void loop() {}`;

const oled_s3 = `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define BREEDTE 128
#define HOOGTE  64
Adafruit_SSD1306 display(BREEDTE, HOOGTE, &Wire, -1);

int potPin = A0;

// We bewaren precies BREEDTE waarden — één per pixel-kolom.
const int N = BREEDTE;
int buffer[N];
int schrijfIndex = 0;     // waar de VOLGENDE meting komt te staan

void setup() {
  Serial.begin(9600);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);

  // Vul de buffer met nullen zodat de eerste schermen geen 'rommel' tonen.
  for (int i = 0; i < N; i++) buffer[i] = 0;
}

void loop() {
  // 1. Meet en zet op de huidige plek.
  int waarde = analogRead(potPin);
  buffer[schrijfIndex] = waarde;

  // 2. Schuif de pointer één plek door — wrap rond met modulo.
  //    Zo wordt de OUDSTE waarde altijd door de NIEUWSTE overschreven.
  schrijfIndex = (schrijfIndex + 1) % N;

  // Debug: laat zien dat schrijfIndex netjes rondloopt 0..127, 0..127, ...
  Serial.print("Index: ");
  Serial.print(schrijfIndex);
  Serial.print("   meting: ");
  Serial.println(waarde);

  delay(50);   // ~20 metingen per seconde
}`;

const oled_s4 = `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define BREEDTE 128
#define HOOGTE  64
Adafruit_SSD1306 display(BREEDTE, HOOGTE, &Wire, -1);

int potPin = A0;

const int N = BREEDTE;
int buffer[N];
int schrijfIndex = 0;

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  for (int i = 0; i < N; i++) buffer[i] = 0;
}

void teken() {
  display.clearDisplay();

  // 1. Bereken min/max van wat er nu in de buffer zit (auto-zoom op de Y-as).
  int minW = 1023, maxW = 0;
  for (int i = 0; i < N; i++) {
    if (buffer[i] < minW) minW = buffer[i];
    if (buffer[i] > maxW) maxW = buffer[i];
  }
  if (maxW - minW < 10) maxW = minW + 10;   // voorkom een platte lijn / div-by-zero

  // 2. Teken assen
  display.drawLine(0, 0, 0, 63, SSD1306_WHITE);    // Y-as (links)
  display.drawLine(0, 63, 127, 63, SSD1306_WHITE); // X-as (onder)

  // 3. Loop door de buffer in 'oudste -> nieuwste'-volgorde.
  //    Trick: schrijfIndex wijst naar de OUDSTE waarde (die straks overschreven wordt).
  int vorigeY = 63;
  for (int x = 0; x < N; x++) {
    int idx = (schrijfIndex + x) % N;
    int w = buffer[idx];
    // Hoge waarde -> kleine y (boven). Min..max wordt ge-mapt naar 8..63.
    int y = map(w, minW, maxW, 63, 8);
    if (x == 0) vorigeY = y;
    display.drawLine(x - 1, vorigeY, x, y, SSD1306_WHITE);
    vorigeY = y;
  }

  // 4. Labels rechtsboven: huidige max, min en laatste meting.
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE, SSD1306_BLACK);   // tekst met zwarte achtergrond = leesbaar over de lijn
  display.setCursor(95, 0);
  display.print("max ");
  display.print(maxW);
  display.setCursor(95, 8);
  display.print("min ");
  display.print(minW);

  display.display();
}

void loop() {
  // Meet en sla op
  buffer[schrijfIndex] = analogRead(potPin);
  schrijfIndex = (schrijfIndex + 1) % N;

  // Teken de hele grafiek opnieuw — 30 ms per frame ≈ 33 fps.
  teken();
  delay(30);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 34: Tilt-game met accelerometer (MPU6050 + 8x8 LED-matrix)
// ─────────────────────────────────────────────

const tilt_s1 = `#include <Wire.h>
#include <MPU6050_light.h>

// We gebruiken MPU6050_light (Bibliotheekbeheer -> "MPU6050_light" van rfetick).
// Compactere API dan de officiele MPU6050-bibliotheek, prima voor een tilt-game.
MPU6050 mpu(Wire);

void setup() {
  Serial.begin(9600);
  Wire.begin();

  byte status = mpu.begin();
  Serial.print("MPU6050 status: ");
  Serial.println(status);   // 0 = OK, anders bedrading checken
  while (status != 0) {}    // stop hier bij fout

  // Houd het bord stil + plat tijdens deze ~1 sec. Auto-nul.
  Serial.println("Kalibreren - houd plat...");
  delay(500);
  mpu.calcOffsets();
  Serial.println("Klaar!");
}

void loop() {
  mpu.update();   // niet vergeten - anders krijg je nooit nieuwe waarden

  Serial.print("ax: ");  Serial.print(mpu.getAccX(), 2);
  Serial.print("  ay: "); Serial.print(mpu.getAccY(), 2);
  Serial.print("  az: "); Serial.println(mpu.getAccZ(), 2);

  // Tip: kantel het bord langzaam links/rechts/voor/achter.
  // ax + ay zwaaien tussen ongeveer -1.0 en +1.0 (in g).
  // Drift van ~0.05 is normaal - geen probleem voor een tilt-game.
  delay(100);
}`;

const tilt_s2 = `#include <Wire.h>
#include <MPU6050_light.h>

MPU6050 mpu(Wire);

int balX = 4;   // bal-positie op een 8x8 grid (0..7)
int balY = 4;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  mpu.begin();
  mpu.calcOffsets();
}

// Vertaal een acceleratie (-1.0 .. +1.0 g) naar een grid-coord (0..7).
// We vermenigvuldigen met 8 zodat een halve kanteling al merkbaar is,
// en clampen aan de randen zodat de bal niet 'verdwijnt'.
int mapAccelNaarGrid(float a) {
  int v = (int)(a * 8.0 + 4.0);
  if (v < 0) v = 0;
  if (v > 7) v = 7;
  return v;
}

void loop() {
  mpu.update();
  balX = mapAccelNaarGrid(mpu.getAccX());
  balY = mapAccelNaarGrid(mpu.getAccY());

  Serial.print("Bal op (");
  Serial.print(balX);
  Serial.print(", ");
  Serial.print(balY);
  Serial.println(")");
  delay(80);
}`;

const tilt_s3 = `#include <Wire.h>
#include <MPU6050_light.h>
#include <LedControl.h>

// LedControl(DIN, CLK, CS, aantal_modules)
LedControl matrix = LedControl(12, 11, 10, 1);
MPU6050 mpu(Wire);

int balX = 4, balY = 4;

void setup() {
  Wire.begin();
  mpu.begin();
  mpu.calcOffsets();

  // De MAX7219 start in 'shutdown'-modus — even aanzetten.
  matrix.shutdown(0, false);
  matrix.setIntensity(0, 4);   // 0..15  (4 = comfortabel zonder verblinding)
  matrix.clearDisplay(0);
}

int mapAccelNaarGrid(float a) {
  int v = (int)(a * 8.0 + 4.0);
  if (v < 0) v = 0;
  if (v > 7) v = 7;
  return v;
}

// Render-helper: zet 1 LED aan op (x, y). API is setLed(module, ROW, COL, on).
void tekenBal(int x, int y) {
  matrix.clearDisplay(0);
  matrix.setLed(0, y, x, true);
}

void loop() {
  mpu.update();
  balX = mapAccelNaarGrid(mpu.getAccX());
  balY = mapAccelNaarGrid(mpu.getAccY());

  tekenBal(balX, balY);
  delay(50);
}`;

const tilt_s4 = `#include <Wire.h>
#include <MPU6050_light.h>
#include <LedControl.h>

LedControl matrix = LedControl(12, 11, 10, 1);
MPU6050 mpu(Wire);

int balX = 4, balY = 4;
int doelX = 0, doelY = 0;
int score = 0;

void plaatsDoel() {
  doelX = random(0, 8);
  doelY = random(0, 8);
}

int mapAccelNaarGrid(float a) {
  int v = (int)(a * 8.0 + 4.0);
  if (v < 0) v = 0;
  if (v > 7) v = 7;
  return v;
}

void teken() {
  matrix.clearDisplay(0);

  // Doel altijd aan
  matrix.setLed(0, doelY, doelX, true);

  // Bal knippert (anders zie je het verschil met het doel niet).
  static bool aan = true;
  aan = !aan;
  if (aan || balX != doelX || balY != doelY) {
    matrix.setLed(0, balY, balX, true);
  }
}

void juich() {
  // Hele matrix snel 3x knipperen als 'goal!'-feedback.
  for (int n = 0; n < 3; n++) {
    for (int r = 0; r < 8; r++)
      for (int c = 0; c < 8; c++)
        matrix.setLed(0, r, c, true);
    delay(120);
    matrix.clearDisplay(0);
    delay(120);
  }
}

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(A0));
  Wire.begin();
  mpu.begin();
  mpu.calcOffsets();

  matrix.shutdown(0, false);
  matrix.setIntensity(0, 4);
  matrix.clearDisplay(0);

  plaatsDoel();
}

void loop() {
  mpu.update();
  balX = mapAccelNaarGrid(mpu.getAccX());
  balY = mapAccelNaarGrid(mpu.getAccY());

  // Doel geraakt? Score + nieuw doel.
  if (balX == doelX && balY == doelY) {
    score++;
    Serial.print("Score: ");
    Serial.println(score);
    juich();
    plaatsDoel();
  }

  teken();
  delay(80);
}`;

// ─────────────────────────────────────────────
// TUTORIAL 35: IR-afstandsbediening leren & afspelen
// ─────────────────────────────────────────────

const ir_s1 = `// IRremote v3.x of v4.x (Bibliotheekbeheer -> "IRremote" van shirriff/Arduino-IRremote).
// LET OP: oude v2.x-tutorials gebruiken een andere API (#include <IRremote.h> + IRrecv-objecten).
// Wij gebruiken IRremote.hpp + het globale IrReceiver-object.
#include <IRremote.hpp>

int irRecvPin = 11;   // VS1838B OUT-pin

void setup() {
  Serial.begin(9600);

  // ENABLE_LED_FEEDBACK = de ingebouwde LED op pin 13 knippert mee bij ontvangst.
  // Handig om te zien dat er IR binnenkomt zonder Serial te openen.
  IrReceiver.begin(irRecvPin, ENABLE_LED_FEEDBACK);

  Serial.println("Klaar - richt een TV-afstandsbediening op de sensor en druk op een knop.");
}

void loop() {
  if (IrReceiver.decode()) {
    Serial.println("Signaal ontvangen!");
    IrReceiver.resume();   // PIETLUTTIG: zonder dit krijg je nooit een tweede signaal binnen
  }
}`;

const ir_s2 = `#include <IRremote.hpp>

int irRecvPin = 11;

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(irRecvPin, ENABLE_LED_FEEDBACK);
  Serial.println("Druk op willekeurige knoppen op een afstandsbediening.");
  Serial.println("Noteer adres + commando per knop - die heb je in stap 3 nodig.");
}

void loop() {
  if (IrReceiver.decode()) {
    // Negeer 'herhalingen' (knop ingedrukt houden) - levert leesbaarder log op.
    if (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT) {
      IrReceiver.resume();
      return;
    }

    Serial.print("Protocol: ");
    Serial.print(getProtocolString(IrReceiver.decodedIRData.protocol));
    Serial.print("   adres: 0x");
    Serial.print(IrReceiver.decodedIRData.address, HEX);
    Serial.print("   commando: 0x");
    Serial.println(IrReceiver.decodedIRData.command, HEX);

    IrReceiver.resume();
  }
}`;

const ir_s3 = `#include <IRremote.hpp>

int irRecvPin = 11;

// Onze 'whitelist': elke knop heeft een naam + de 3 velden uit stap 2.
// VERVANG deze voorbeelden door JOUW eigen waarden uit de Serial Monitor!
struct OpgenomenCode {
  const char* naam;
  uint16_t address;
  uint16_t command;
};

OpgenomenCode codes[] = {
  { "TV aan/uit", 0x00FF, 0x40 },
  { "Volume +",   0x00FF, 0x07 },
  { "Volume -",   0x00FF, 0x08 },
  { "Mute",       0x00FF, 0x09 },
};
const int AANTAL = sizeof(codes) / sizeof(codes[0]);

void toonLijst() {
  Serial.println("Bekende knoppen:");
  for (int i = 0; i < AANTAL; i++) {
    Serial.print("  ");
    Serial.print(i + 1);
    Serial.print(". ");
    Serial.println(codes[i].naam);
  }
}

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(irRecvPin, ENABLE_LED_FEEDBACK);
  toonLijst();
}

void loop() {
  if (!IrReceiver.decode()) return;

  if (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT) {
    IrReceiver.resume();
    return;
  }

  uint16_t adr = IrReceiver.decodedIRData.address;
  uint16_t cmd = IrReceiver.decodedIRData.command;

  // Doorzoek de whitelist op een match.
  bool gevonden = false;
  for (int i = 0; i < AANTAL; i++) {
    if (codes[i].address == adr && codes[i].command == cmd) {
      Serial.print("Herkend -> ");
      Serial.println(codes[i].naam);
      gevonden = true;
      break;
    }
  }
  if (!gevonden) {
    Serial.print("Onbekend: 0x");
    Serial.print(adr, HEX);
    Serial.print(" / 0x");
    Serial.println(cmd, HEX);
  }

  IrReceiver.resume();
}`;

const ir_s4 = `#include <IRremote.hpp>

// LET OP: IRremote v3+/v4 gebruikt op de Uno standaard pin 3 als IR-zendpin.
// Pin 3 is namelijk een TIMER2-PWM-pin - daarmee genereert de bibliotheek
// het 38 kHz infrarood-draaggolfsignaal. Andere pinnen werken NIET zonder
// extra config.
int irLedPin = 3;

// 4 knoppen op pin 4..7 (INPUT_PULLUP -> ander uiteinde naar GND).
int knop1Pin = 4;
int knop2Pin = 5;
int knop3Pin = 6;
int knop4Pin = 7;

struct OpgenomenCode {
  const char* naam;
  uint16_t address;
  uint16_t command;
};

// Vul deze in met JOUW codes uit stap 2 — anders stuurt-ie niks zinnigs.
OpgenomenCode codes[4] = {
  { "TV aan/uit", 0x00FF, 0x40 },
  { "Volume +",   0x00FF, 0x07 },
  { "Volume -",   0x00FF, 0x08 },
  { "Mute",       0x00FF, 0x09 },
};

int knoppen[4] = { 4, 5, 6, 7 };
bool wasIngedrukt[4] = { false, false, false, false };

void verstuur(int i) {
  Serial.print("Verzend: ");
  Serial.println(codes[i].naam);
  // sendNEC(adres, commando, herhalingen). 0 herhalingen = 1 puls.
  IrSender.sendNEC(codes[i].address, codes[i].command, 0);
}

void setup() {
  Serial.begin(9600);
  for (int i = 0; i < 4; i++) pinMode(knoppen[i], INPUT_PULLUP);

  IrSender.begin(irLedPin);   // start de 38 kHz-PWM op pin 3
  Serial.println("Druk op een van de 4 knoppen om die code te zenden.");
}

void loop() {
  // Edge-detectie: alleen op de overgang los -> ingedrukt zenden.
  // Anders krijg je 50x per seconde een puls zolang je de knop vasthoudt.
  for (int i = 0; i < 4; i++) {
    bool nu = (digitalRead(knoppen[i]) == LOW);
    if (nu && !wasIngedrukt[i]) verstuur(i);
    wasIngedrukt[i] = nu;
  }
  delay(20);
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
    board: "arduino",
    tags: ["basis"],
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
    board: "arduino",
    tags: ["game"],
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
    board: "arduino",
    tags: ["basis", "sensor"],
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
    board: "arduino",
    tags: ["sensor"],
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
    board: "arduino",
    tags: ["sensor"],
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
    board: "arduino",
    tags: ["sensor"],
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
    board: "arduino",
    tags: ["sensor"],
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
    board: "arduino",
    tags: ["motor"],
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
    board: "arduino",
    tags: ["motor"],
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
    board: "arduino",
    tags: ["motor"],
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
    board: "arduino",
    tags: ["motor"],
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
    description: "Toon tekst, getallen en live sensorwaarden op een 16x2 LCD-display met I2C-backpack. Compleet pakket: van 'Hallo wereld' tot lichtmeter, weerstation en knoppenteller — alles met maar 4 draadjes naar het scherm.",
    difficulty: "Gemiddeld",
    learningGoal: "Ik kan een I2C LCD-display aansturen, de cursor verplaatsen en live sensorwaarden van verschillende sensoren (potmeter, LDR, DHT11) en knop-inputs op het scherm tonen.",
    materials: "Arduino Uno, 16x2 LCD-display met I2C-backpack (PCF8574, vaak adres 0x27 of 0x3F), breadboard en draadjes. Voor de toepassingen: potmeter (stap 3), LDR + 10kΩ weerstand (stap 4), DHT11 temperatuur/vocht-sensor (stap 5), drukknop (stap 6). Bibliotheken: LiquidCrystal_I2C en DHT sensor library (beide via Schets → Bibliotheek beheren).",
    board: "arduino",
    tags: ["display", "sensor"],
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
      },
      {
        id: "lcd-s4",
        title: "Toepassing 1 — Lichtmeter met LDR",
        content: "Tijd voor echte sensorprojecten! We sluiten een LDR (Light Dependent Resistor) aan via een spanningsdeler met een 10kΩ weerstand op pin A0 — precies zoals in de LDR-tutorial. De ruwe waarde (0–1023) is voor leerlingen niet erg betekenisvol, dus tonen we óók een vriendelijk label: DONKER, SCHEMER of FEL LICHT. Dit is een klassiek patroon voor sensor-uitlezing: ruwe meting + interpretatie naast elkaar.",
        diagram: true,
        code: lcd_s4,
        legend: [
          { term: "int ldrPin = A0", desc: "Analoge pin waar de LDR + spanningsdeler op zit." },
          { term: "String label", desc: "Tekstvariabele die we per drempelwaarde een naam geven." },
          { term: "if (waarde < 300)", desc: "Onder de 300 = donker. De drempels stem je af op je eigen LDR." },
          { term: "lcd.print(waarde)", desc: "Print de ruwe meetwaarde (0–1023)." },
          { term: "lcd.print(label)", desc: "Print het bijbehorende woord ernaast — veel leesbaarder dan alleen een getal." },
        ],
        assignment: "Sluit de LDR met spanningsdeler aan, upload de code en bedek de sensor met je hand. Het scherm moet meteen 'DONKER' tonen. Schijn met een lampje en het wordt 'FEL LICHT'.",
        challenge: "Maak een 'lichtbalk' op de tweede regel: een rij # die langer wordt naarmate er meer licht is. Tip: bereken hoeveel #-tekens je wilt tonen met `int balklengte = map(waarde, 0, 1023, 0, 16);` en print dat aantal in een for-loop.",
        reflection: "Waarom zijn de drempels (300 / 700) handig om aan te passen aan jouw eigen LDR? Wat verandert er als je de sensor in een andere kamer gebruikt?"
      },
      {
        id: "lcd-s5",
        title: "Toepassing 2 — Mini-weerstation met DHT11",
        content: "De DHT11 meet zowel temperatuur als luchtvochtigheid en is perfect voor een mini-weerstation. We tonen beide waarden tegelijk: temperatuur op rij 1, vocht op rij 2. Twee dingen om op te letten: (1) de DHT11 is langzaam — niet vaker dan elke 2 seconden uitlezen, anders krijg je 'NaN' (Not a Number), (2) je hebt de bibliotheek 'DHT sensor library' van Adafruit nodig — installeer die via de Library Manager. We gebruiken `(char)223` als trucje om het graden-symbool ° op het scherm te krijgen.",
        diagram: true,
        code: lcd_s5,
        legend: [
          { term: "#include <DHT.h>", desc: "Bibliotheek die de DHT11 communicatie afhandelt." },
          { term: "int dht11Pin = 2", desc: "Digitale pin waar de DATA-pin van de DHT11 op zit." },
          { term: "DHT dht(dht11Pin, DHT11)", desc: "Maak een DHT-object op de juiste pin, type DHT11 (er bestaat ook DHT22)." },
          { term: "dht.readTemperature()", desc: "Geeft de temperatuur in °C als een float (kommagetal)." },
          { term: "dht.readHumidity()", desc: "Geeft de luchtvochtigheid in % als een float." },
          { term: "lcd.print(temp, 1)", desc: "Print het kommagetal met 1 cijfer achter de komma." },
          { term: "lcd.print((char)223)", desc: "Print het ° (graden) symbool — dat zit op tekenpositie 223 in het LCD-tekenset." },
          { term: "isnan(temp)", desc: "Check of de meting mislukte (NaN = 'Not a Number'). Komt vooral voor bij opstart." },
          { term: "delay(2000)", desc: "DHT11 heeft minimaal 2 seconden tussen metingen nodig." },
        ],
        assignment: "Sluit de DHT11 aan (VCC → 5V, DATA → pin 2 met 10kΩ pull-up, GND → GND). Upload en check of beide regels logische waardes tonen (kamertemperatuur ~20°C, vocht ~40–60%).",
        challenge: "Voeg een 'min' en 'max' bij door de hoogste en laagste gemeten temperatuur in twee variabelen op te slaan. Toon ze afwisselend om de 5 seconden in plaats van de huidige meting.",
        reflection: "Waarom is het belangrijk om een sensor met een vertraging uit te lezen? Wat zou er gebeuren als je elke 10 ms zou meten en printen?",
        optionalCodeTitle: "Snippet: alleen updaten als de waarde echt veranderd is",
        optionalCode: `// Onthoud de vorige meting en print alleen bij verandering -
// dat scheelt flikkering en bespaart cycles
float vorigeTemp = -999;

void loop() {
  float temp = dht.readTemperature();

  if (abs(temp - vorigeTemp) >= 0.1) {  // alleen bij verschil ≥ 0.1°C
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(temp, 1);
    lcd.print((char)223);
    lcd.print("C  ");
    vorigeTemp = temp;
  }

  delay(2000);
}`
      },
      {
        id: "lcd-s6",
        title: "Toepassing 3 — Drukknop-teller (digitale input)",
        content: "Tot nu toe lazen we analoge sensoren uit. Nu de andere kant: een digitale input. Een drukknop op pin 7 met `INPUT_PULLUP` (interne pull-up — geen externe weerstand nodig). Het belangrijke patroon hier is **edge-detection**: we willen niet *terwijl* de knop ingedrukt is keer op keer +1 doen (dan telt hij in een fractie van een seconde naar 1000), maar alleen op het exacte moment dat de knop van 'los' naar 'ingedrukt' overgaat. Daarvoor onthouden we de vorige stand in `vorigeStaat`.",
        diagram: true,
        code: lcd_s6,
        legend: [
          { term: "int buttonPin = 7", desc: "Digitale pin waar één pootje van de knop op zit (de andere → GND)." },
          { term: "int vorigeStaat = HIGH", desc: "Onthoud wat de knop in de vorige loop deed. HIGH = los (door pull-up)." },
          { term: "pinMode(buttonPin, INPUT_PULLUP)", desc: "Activeer de interne 20kΩ pull-up: knop los = HIGH, knop ingedrukt = LOW." },
          { term: "if (huidig == LOW && vorigeStaat == HIGH)", desc: "Edge-detection: alleen +1 bij de OVERGANG van los → ingedrukt." },
          { term: "vorigeStaat = huidig", desc: "Sla de huidige stand op voor de volgende loop." },
          { term: "delay(20)", desc: "Simpele debounce — knoppen 'stuiteren' bij indrukken; 20 ms wachten filtert dat weg." },
        ],
        assignment: "Sluit een knop aan tussen pin 7 en GND. Upload, druk een paar keer en kijk of de teller exact even vaak omhoog gaat als jij drukt — niet meer.",
        challenge: "Voeg een tweede knop toe (op pin 8) die de teller weer op 0 zet. Toon ook het huidige aantal op rij 1 als 'Score: 5' en bewaar de hoogste score in een aparte variabele.",
        reflection: "Wat zou er gebeuren zonder de edge-detection (zonder de `vorigeStaat`-check)? Probeer het uit door de check tijdelijk te verwijderen.",
        optionalCodeTitle: "Snippet: combineer een knop met een sensor (start/stop een meting)",
        optionalCode: `// Druk op de knop om een meting te bevriezen of weer door te laten lopen
bool bevroren = false;
int huidig, vorigeStaat = HIGH;

void loop() {
  huidig = digitalRead(buttonPin);
  if (huidig == LOW && vorigeStaat == HIGH) {
    bevroren = !bevroren;   // toggle
  }
  vorigeStaat = huidig;

  if (!bevroren) {
    int waarde = analogRead(A0);
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.setCursor(0, 1);
    lcd.print(waarde);
  }
  // Als bevroren: niks doen → de oude waarde blijft staan
  delay(20);
}`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 13: ESP32 Web Dashboard
  // ─────────────────────────────────────────────
  {
    id: "esp32-dashboard",
    title: "ESP32 Web Dashboard met live grafiek",
    description: "Laat je ESP32 een eigen webpagina serveren met een live grafiek van een sensorwaarde. Geen tussenservers — de chip is zelf de webserver.",
    difficulty: "Gemiddeld",
    materials: "ESP32 DevKit V1 (of NodeMCU-ESP32), USB-kabel, breadboard + jumpers, 1× potmeter (10kΩ).",
    board: "esp32",
    tags: ["internet"],
    learningGoal: "Begrijpen hoe een ESP32 verbinding maakt met WiFi, hoe je routes serveert met de WebServer-bibliotheek, en hoe je een JSON-endpoint koppelt aan een grafiek in de browser.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "dash-s1",
        title: "Verbinding maken met WiFi",
        content: "Een ESP32 is geen Arduino Uno: er zit naast de processor ook een WiFi- en Bluetooth-radio in. Deze eerste stap leert het standaard-patroon dat je in alle ESP32-tutorials terug zult zien: vul je SSID en wachtwoord in, roep `WiFi.begin()` aan en wacht tot `WiFi.status()` `WL_CONNECTED` zegt. **Belangrijk:** kies in de Arduino IDE eerst je bord onder *Tools → Board → ESP32 Dev Module*, anders compileert het niet.",
        diagram: false,
        code: dash_s1,
        legend: [
          { term: "#include <WiFi.h>", desc: "Bibliotheek voor de WiFi-radio van de ESP32 — al meegeleverd bij het ESP32-board-package." },
          { term: "WiFi.begin(ssid, password)", desc: "Start de verbindingspoging met jouw netwerk." },
          { term: "WiFi.status() != WL_CONNECTED", desc: "Blijft loopen tot de chip echt verbonden is. Punten in de Serial Monitor laten zien dat hij bezig is." },
          { term: "WiFi.localIP()", desc: "Het IP-adres dat je router aan de ESP32 heeft toegekend. Dit heb je later nodig in je browser." },
          { term: "Serial.begin(115200)", desc: "ESP32 gebruikt standaard 115200 baud (sneller dan Uno's 9600). Stel de Serial Monitor op hetzelfde in." },
        ],
        assignment: "Vul `ssid` en `password` in, upload, open de Serial Monitor op 115200 baud en noteer het IP-adres dat verschijnt.",
        challenge: "Voeg een teller toe in `loop()` die elke 5 sec de WiFi-signaalsterkte (`WiFi.RSSI()`) print. Hoe verandert de waarde als je de ESP32 verder van je router weglegt?",
        reflection: "Wat zou er gebeuren als je SSID of wachtwoord verkeerd is? Probeer het uit en kijk wat de loop dan doet.",
      },
      {
        id: "dash-s2",
        title: "Een eerste webpagina serveren",
        content: "Nu de WiFi-verbinding staat, gaan we de ESP32 zelf een webpagina laten serveren. We gebruiken de `WebServer`-bibliotheek (ook al ingebouwd) en koppelen een functie aan de wortel-URL `/`. In de browser typ je dan `http://<IP-adres-uit-stap-1>` en je ziet de tekst van de chip.",
        diagram: false,
        code: dash_s2,
        legend: [
          { term: "WebServer server(80)", desc: "Maak een server-object dat luistert op poort 80 (de standaard webpoort)." },
          { term: "server.on(\"/\", handleRoot)", desc: "Koppel de URL `/` aan een functie die het antwoord opbouwt." },
          { term: "server.send(200, \"text/html\", ...)", desc: "Stuur een antwoord met statuscode 200 (OK) en HTML-inhoud terug naar de browser." },
          { term: "server.handleClient()", desc: "**Cruciaal**: roep dit elke loop aan, anders worden binnenkomende requests niet afgehandeld." },
        ],
        assignment: "Upload, open in je browser het IP-adres van de chip en kijk of je de Hallo-pagina ziet.",
        challenge: "Voeg een tweede route toe op `/info` die het IP-adres en de huidige tijd-sinds-opstart (`millis()`) terug geeft.",
        reflection: "Waarom moet `server.handleClient()` zo vaak mogelijk worden aangeroepen? Wat gebeurt er als je een lange `delay(5000)` in de loop zet?",
      },
      {
        id: "dash-s3",
        title: "JSON-endpoint voor sensorwaarde",
        content: "Een dashboard heeft data nodig. We sluiten een potmeter aan op GPIO 34 (de ESP32 leest analoog op pinnen 32–39, met 12-bits resolutie: 0–4095) en maken een tweede route `/data` die de waarde als JSON terug geeft. JSON is hét formaat om data uit te wisselen tussen je chip en een webpagina.",
        diagram: true,
        code: dash_s3,
        legend: [
          { term: "int potPin = 34", desc: "GPIO 34 is een input-only pin met ADC. Werkt perfect voor sensoren." },
          { term: "analogRead(potPin)", desc: "Op ESP32 is dit 0–4095 (12 bits), niet 0–1023 zoals op Uno." },
          { term: "R\"({\"waarde\":)\"", desc: "C++ raw string. Tussen `R\"(` en `)\"` mag je gewoon dubbele quotes en backslashes zetten zonder te escapen." },
          { term: "server.on(\"/data\", handleData)", desc: "Tweede route. Bezoek `http://<IP>/data` in je browser om de JSON te zien." },
        ],
        assignment: "Sluit de potmeter aan (links → 3.3V, rechts → GND, midden → GPIO 34), upload, en bezoek `/data` in je browser. De waarde moet veranderen als je de potmeter draait.",
        challenge: "Voeg een tweede sensor toe (LDR op GPIO 35) en geef beide waardes terug in dezelfde JSON: `{\"pot\":1234,\"licht\":567}`.",
        reflection: "Waarom JSON en niet gewoon platte tekst? Bedenk hoe makkelijk JavaScript later `j.waarde` kan oppikken vergeleken met tekst-parsen.",
      },
      {
        id: "dash-s4",
        title: "Live grafiek met Chart.js",
        content: "De finishing touch: een echte webpagina met een live-update grafiek. We laden Chart.js vanaf een CDN (gratis JavaScript-bibliotheek), polleren elke seconde `/data`, en pushen de waarde in een ringbuffer van 30 punten. Het volledige HTML-blok zit in een C++ raw-string met `R\"HTML(...)HTML\"` zodat we geen quote-hel hebben.",
        diagram: true,
        code: dash_s4,
        legend: [
          { term: "PROGMEM", desc: "Bewaar de HTML-string in flash i.p.v. RAM. Belangrijk omdat de pagina anders veel kostbaar werkgeheugen opslokt." },
          { term: "R\"HTML(...)HTML\"", desc: "Raw string met aangepaste delimiter `HTML`. Handig voor lange teksten met `\"` erin." },
          { term: "server.send_P", desc: "Variant van `server.send()` voor strings die in flash (PROGMEM) staan." },
          { term: "fetch('/data')", desc: "JavaScript haalt de JSON op zonder de pagina te herladen." },
          { term: "setInterval(tick,1000)", desc: "Roep de tick-functie elke 1000 ms aan voor live-update." },
        ],
        assignment: "Upload, open het IP-adres in je browser, en draai aan de potmeter. De grafiek moet meebewegen.",
        challenge: "Verander de grafiek naar een 'gauge' (rond meter-achtig) met chart.js 'doughnut'-type, of voeg een tweede dataset toe voor het gemiddelde van de laatste 10 metingen.",
        reflection: "Stel je voor dat je dit dashboard in een ander land wilt bekijken. Wat moet er dan veranderen aan je netwerk? (Hint: poort openzetten, dynamisch IP, ngrok, ...)",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 14: ESP32 Smart Switch
  // ─────────────────────────────────────────────
  {
    id: "esp32-smart-switch",
    title: "ESP32 Smart Switch met webpagina",
    description: "Schakel een lamp, LED of relais aan en uit vanaf je telefoon — via een mooie webpagina die de ESP32 zelf serveert. De basis voor je eigen domotica.",
    difficulty: "Gemiddeld",
    materials: "ESP32 DevKit V1, USB-kabel, breadboard + jumpers, 1× LED + 220Ω weerstand (of 5V relais-module). Voor tutorial-veiligheid alleen 5V/12V — geen 230V.",
    board: "esp32",
    tags: ["internet", "domotica"],
    learningGoal: "Een ESP32 via een webpagina laten reageren op gebruikers-input. Leer over GET-routes, page redirects (303), en het scheiden van logica (toggle) en weergave (HTML-bouwer).",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "sw-s1",
        title: "Aan- en uit-pagina met aparte routes",
        content: "We beginnen functioneel-maar-lelijk: de wortel-route toont de huidige status, en twee aparte routes `/aan` en `/uit` schakelen de LED. Na elke schakel-actie sturen we de browser via een **HTTP 303-redirect** terug naar `/`, zodat de gebruiker de bijgewerkte pagina ziet. Het patroon hieronder (state-variabele + helper-functie + handlers) zul je in elke ESP32-server-tutorial zien terugkomen.",
        diagram: true,
        code: sw_s1,
        legend: [
          { term: "int ledPin = 2", desc: "GPIO 2 is op de meeste ESP32-boards verbonden met de ingebouwde blauwe LED — handig om eerst zonder breadboard te testen." },
          { term: "bool ledAan = false", desc: "Globale state: onthoudt of de LED nu aan of uit moet zijn." },
          { term: "server.sendHeader(\"Location\", \"/\")", desc: "Vertel de browser dat hij naar `/` moet gaan." },
          { term: "server.send(303)", desc: "Status 303 = 'See Other'. Browser doet automatisch een nieuwe GET naar de Location-URL." },
        ],
        assignment: "Sluit een LED + 220Ω weerstand aan op GPIO 2 (of gebruik de ingebouwde LED). Upload, open het IP, en klik op AAN/UIT. Je moet de LED zien reageren.",
        challenge: "Voeg een derde route `/knipper` toe die 5 keer aan/uit knippert (elke 200 ms) voordat hij terugredirect.",
        reflection: "Waarom is een 303-redirect netter dan gewoon nog een keer dezelfde HTML-pagina terugsturen vanuit `/aan`?",
      },
      {
        id: "sw-s2",
        title: "Eén toggle-route in plaats van twee",
        content: "Twee aparte routes zijn nogal omslachtig. Veel professionelere oplossing: één route `/toggle` die simpelweg de huidige state omdraait met `ledAan = !ledAan`. De pagina zelf laat zien wat de **volgende actie** wordt ('Zet AAN' of 'Zet UIT') — daarvoor gebruiken we de ternary operator `?:`.",
        diagram: true,
        code: sw_s2,
        legend: [
          { term: "ledAan = !ledAan", desc: "De `!` is logische NOT — wisselt true ↔ false." },
          { term: "ledAan ? \"Zet UIT\" : \"Zet AAN\"", desc: "Ternary: als ledAan dan eerste, anders tweede. Compacter dan een hele if/else." },
        ],
        assignment: "Vervang de routes uit stap 1 door deze versie. Klik herhaaldelijk op de link en kijk of het label tussen 'Zet AAN' en 'Zet UIT' wisselt.",
        challenge: "Voeg een tweede LED toe (GPIO 4) met een eigen `/toggle2` route, en toon beide statussen + beide knoppen op één pagina.",
        reflection: "Wat is het voordeel van één toggle-route? Denk aan: minder code, makkelijker om later een derde state ('knipper') toe te voegen.",
      },
      {
        id: "sw-s3",
        title: "Mooie mobiele UI met status-indicator",
        content: "Tijd voor de finishing touch: een echte design-pagina met een ronde indicator die groen of grijs kleurt afhankelijk van de status. We bouwen de HTML op met `String += ...` zodat we eenvoudig if/else kunnen mixen met HTML. De `<meta viewport>`-regel zorgt dat de pagina goed schaalt op je telefoon.",
        diagram: true,
        code: sw_s3,
        legend: [
          { term: "<meta name='viewport' ...>", desc: "Vertelt de telefoon-browser om geen mini-desktop-versie te tonen maar de pagina op je schermbreedte te schalen." },
          { term: "String html = \"...\"; html += \"...\"", desc: "Bouw de HTML-string regel voor regel op. Werkt prima voor pagina's tot een paar kB." },
          { term: "class='dot aan'", desc: "Twee CSS-klassen: 'dot' geeft de cirkel-vorm, 'aan'/'uit' kiest de kleur. Mooie scheiding van structuur en state." },
        ],
        assignment: "Upload, open het IP-adres op je telefoon (zorg dat je telefoon op hetzelfde WiFi-netwerk zit), en gebruik de Wissel-knop. Voelt al echt als een app.",
        challenge: "Voeg AJAX toe: de pagina ververst zichzelf elke 2 sec via `fetch('/status')` zodat je de state ziet veranderen ook als iemand anders schakelt. Dit voorkomt het 'flikker'-effect bij elke klik.",
        reflection: "Wat kan iedereen op jouw netwerk nu met deze pagina? Welke veiligheidsmaatregelen mis je nog (wachtwoord, alleen-lokaal, ...)?",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 15: ESP32 Discord-melding
  // ─────────────────────────────────────────────
  {
    id: "esp32-discord-melder",
    title: "Discord-melding bij beweging (ESP32)",
    description: "Een PIR-sensor en je ESP32 → een push-bericht in je Discord-server zodra er iemand voor de sensor langsloopt. Klassieke 'Internet of Things' in 30 regels code.",
    difficulty: "Gemiddeld",
    materials: "ESP32 DevKit V1, USB-kabel, breadboard + jumpers, 1× PIR bewegingssensor (HC-SR501), Discord-account met een eigen server.",
    board: "esp32",
    tags: ["internet", "sensor"],
    learningGoal: "HTTPS-requests sturen vanaf een ESP32 naar een externe service (Discord-webhook) en die koppelen aan een fysieke trigger (PIR). Plus: het cooldown-patroon dat voorkomt dat je 100 berichten in een seconde stuurt.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "ds-s1",
        title: "Eerste bericht naar Discord sturen",
        content: "Een Discord-webhook is een geheime URL waar je met een POST-request berichten naartoe kunt sturen — geen bot-token, geen authenticatie. **Maken:** in Discord ga je naar het kanaal → Instellingen (tandwiel) → Integraties → Webhooks → Nieuwe Webhook → kopieer de URL. Plak die in `webhookUrl` en upload deze code: er verschijnt direct één test-bericht.",
        diagram: false,
        code: ds_s1,
        legend: [
          { term: "#include <HTTPClient.h>", desc: "Bibliotheek om HTTP/HTTPS-requests te doen vanaf de ESP32." },
          { term: "http.begin(webhookUrl)", desc: "Open een verbinding naar de URL. ESP32's HTTPClient handelt zelf TLS af voor https-URLs." },
          { term: "addHeader(\"Content-Type\", ...)", desc: "Vertel Discord dat we JSON sturen, geen formulier-data." },
          { term: "R\"({\"content\":\")\"", desc: "Raw string met de eerste helft van de JSON. We plakken het bericht en de afsluiting eraan." },
          { term: "http.POST(json)", desc: "Stuur het bericht. Returnt de HTTP-statuscode: 204 = succes, 401 = verkeerde URL." },
        ],
        assignment: "Maak een Discord-webhook (gebruik een test-kanaal!), plak de URL, upload, en kijk of er '*Hallo vanuit ESP32!*' in je kanaal verschijnt.",
        challenge: "Voeg een 'username' veld toe aan de JSON: `{\"username\":\"Mijn ESP32\",\"content\":\"...\"}` zodat de bot een eigen naam krijgt in plaats van de webhook-naam.",
        reflection: "Wat zou er gebeuren als iemand anders je webhook-URL heeft? Waarom is hem geheim houden belangrijk?",
      },
      {
        id: "ds-s2",
        title: "Koppelen aan een PIR-bewegingssensor",
        content: "Nu we kunnen sturen, koppelen we het aan een echte trigger: een PIR-sensor. PIR = Passieve InfraRood: detecteert lichaamswarmte op afstand van een paar meter. Sluit `OUT` aan op GPIO 13 en stem de gevoeligheid af met de potmetertjes op de sensor zelf. Op iedere `HIGH`-puls sturen we een melding.",
        diagram: true,
        code: ds_s2,
        legend: [
          { term: "int pirPin = 13", desc: "GPIO 13 is een veilige general-purpose pin op ESP32." },
          { term: "pinMode(pirPin, INPUT)", desc: "PIR-sensor heeft eigen 5V→3.3V output, geen interne pull-up nodig." },
          { term: "digitalRead(pirPin) == HIGH", desc: "Sensor pulst HIGH zolang hij beweging detecteert (instelbaar met de tweede potmeter)." },
          { term: "delay(3000)", desc: "Korte rust om te voorkomen dat één voorbij-loopactie 30 berichten triggert." },
        ],
        assignment: "Sluit de PIR aan (VCC → 5V, GND → GND, OUT → GPIO 13), upload, en loop voor de sensor. Je moet meldingen in Discord zien én 'Beweging gedetecteerd!' in de Serial Monitor.",
        challenge: "Voeg het tijdstip toe aan het bericht: gebruik de `time()`-functie of haal NTP-tijd op met `configTime()`.",
        reflection: "Waarom is een delay van 3 seconden niet genoeg om spam helemaal te voorkomen? (Hint: wat als jouw kat 10 keer per uur door de gang loopt?)",
      },
      {
        id: "ds-s3",
        title: "Cooldown-patroon: maximaal 1 melding per minuut",
        content: "`delay(3000)` is te grof — het blokkeert de hele loop, dus we missen ook nuttige sensorwaarden in die tijd. Beter is het **cooldown-patroon** met `millis()`: we onthouden het tijdstip van de vorige melding en sturen alleen een nieuwe als er minstens 60 seconden verstreken zijn. De loop blijft snel draaien, alleen de melding wordt gefilterd.",
        diagram: true,
        code: ds_s3,
        legend: [
          { term: "unsigned long laatsteMelding", desc: "Tijdstip (in ms sinds opstart) van de vorige melding. `unsigned long` zodat overflow pas na ~50 dagen optreedt." },
          { term: "const unsigned long cooldownMs = 60UL * 1000UL", desc: "60 sec * 1000 = 60.000 ms. `UL` = unsigned long literal, voorkomt overflow bij vermenigvuldiging." },
          { term: "nu - laatsteMelding >= cooldownMs", desc: "Vergelijk verschil, niet absolute waarde. Werkt zelfs door de overflow heen." },
          { term: "delay(100)", desc: "Korte sleep om de loop niet 100% CPU te laten gebruiken. Mag ook 10 of 50 ms zijn." },
        ],
        assignment: "Upload, loop 10 keer voor de sensor binnen 1 minuut. Je moet exact 1 Discord-melding krijgen, en in de Serial Monitor 'cooldown actief' bij de overige.",
        challenge: "Maak de cooldown adaptief: na 3 meldingen achter elkaar verlengt hij naar 5 minuten (om bij continue activiteit niet te spammen). Reset naar 1 minuut na een uur stilte.",
        reflection: "Waarom is het cooldown-patroon (millis-vergelijking) beter dan een grote `delay()`? Wat kun je nu wél doen tijdens de cooldown?",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 16: ESP32 Crypto-ticker
  // ─────────────────────────────────────────────
  {
    id: "esp32-crypto-ticker",
    title: "Crypto-koers ticker met ESP32 (Bitcoin)",
    description: "Een mini-display dat live de Bitcoin-koers in euro toont met een pijltje dat aangeeft of de prijs gestegen of gedaald is in de laatste 24 uur. Data wordt rechtstreeks van de gratis CoinGecko-API gehaald.",
    difficulty: "Gemiddeld",
    materials: "ESP32 DevKit V1, USB-kabel, breadboard + jumpers, 1× I2C 16x2 LCD-display (met PCF8574 backpack). Library: ArduinoJson v6.",
    board: "esp32",
    tags: ["internet", "display"],
    learningGoal: "HTTPS GET-requests doen vanaf de ESP32, JSON-antwoord parsen met de ArduinoJson-bibliotheek, en data in real-time op een LCD weergeven met directionele indicator.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "cr-s1",
        title: "Eerste HTTPS GET naar CoinGecko",
        content: "We beginnen met de ruwe respons. CoinGecko's API is gratis en vereist geen sleutel voor simpele queries. Omdat het https is, gebruiken we `WiFiClientSecure` met `setInsecure()` — voor een leerproject is dat prima, in productie zou je een root-CA-certificaat pinnen. Upload deze versie en bekijk de JSON in de Serial Monitor.",
        diagram: false,
        code: cr_s1,
        legend: [
          { term: "#include <WiFiClientSecure.h>", desc: "ESP32-bibliotheek voor TLS/HTTPS-verbindingen." },
          { term: "client.setInsecure()", desc: "Sla certificaat-verificatie over. **Niet veilig** voor productie, maar goed genoeg om data te lezen voor een leerproject." },
          { term: "http.begin(client, coinUrl)", desc: "Verbind met de URL via de secure client. ESP32 doet de TLS-handshake automatisch." },
          { term: "http.GET()", desc: "Stuur de request, returnt de HTTP-statuscode (200 = OK)." },
          { term: "http.getString()", desc: "Lees de hele response-body als String. Voor grote responses beter `getStream()` gebruiken (zie volgende stap)." },
        ],
        assignment: "Upload, open de Serial Monitor op 115200 baud. Je moet iets zien als `{\"bitcoin\":{\"eur\":58234}}`.",
        challenge: "Verander de query om meerdere coins op te halen: `?ids=bitcoin,ethereum,solana&vs_currencies=eur`. Print alle drie de waardes.",
        reflection: "Waarom is `setInsecure()` slecht in productie? Welke aanvalstype maakt het mogelijk?",
      },
      {
        id: "cr-s2",
        title: "JSON parsen met ArduinoJson",
        content: "Tekst manueel knippen is foutgevoelig. **ArduinoJson** is dé bibliotheek (Library Manager → 'ArduinoJson') om JSON te parsen op microcontrollers. Geheugenefficiënt: een `StaticJsonDocument<256>` reserveert vooraf 256 bytes — genoeg voor een simpele response. We voegen ook `eur_24h_change` toe aan de query om de procentuele verandering te krijgen.",
        diagram: false,
        code: cr_s2,
        legend: [
          { term: "#include <ArduinoJson.h>", desc: "Installeer via Library Manager: zoek 'ArduinoJson', kies de versie van Benoit Blanchon." },
          { term: "StaticJsonDocument<256>", desc: "Vaste-grootte JSON-document. Geheugen wordt vooraf gereserveerd, dus geen heap-fragmentatie." },
          { term: "deserializeJson(doc, http.getStream())", desc: "Parse direct vanaf de network-stream — zuiniger dan eerst alles in een String laden." },
          { term: "doc[\"bitcoin\"][\"eur\"]", desc: "Lees genest veld op. Returnt automatisch het juiste type (float in dit geval)." },
          { term: "delay(60000)", desc: "Eens per minuut is genoeg en respecteert de gratis API rate-limit (30 calls/min)." },
        ],
        assignment: "Upload, open Serial Monitor. Je moet elke minuut twee regels zien: prijs in EUR + 24-uurs verandering in %.",
        challenge: "Voeg een hoogste-vandaag tracker toe in een variabele: print 'NIEUW HOOGSTEPUNT!' als de huidige prijs hoger is dan eerder gemeten.",
        reflection: "Wat zou er gebeuren als je `StaticJsonDocument<32>` zou gebruiken? Probeer het en kijk wat er fout gaat.",
      },
      {
        id: "cr-s3",
        title: "LCD-weergave met richting-pijl",
        content: "Tijd om het zichtbaar te maken. Sluit een I2C LCD aan (zie aansluitschema), en bouw een `toon()`-helper die de prijs op regel 1 toont en op regel 2 een ASCII-pijltje (`^` omhoog, `v` omlaag, `-` neutraal) gevolgd door het percentage. **Let op:** ESP32's I2C zit op GPIO 21 (SDA) en GPIO 22 (SCL), niet op A4/A5 zoals bij Uno.",
        diagram: true,
        code: cr_s3,
        legend: [
          { term: "char pijl = (change > 0) ? '^' : ...", desc: "Genest ternary: positief → ^, negatief → v, anders → '-'. Compacte if/else-if/else." },
          { term: "lcd.print(prijs, 0)", desc: "Tweede argument = aantal cijfers achter de komma. 0 = geheel getal (de Bitcoin-koers heeft geen 'centen' nodig op een 16-tekens-display)." },
          { term: "lcd.print(\"        \")", desc: "Spaties om eventuele oude tekst (bv. een lager getal van 5 cijfers) te wissen." },
          { term: "lcd.print(change, 2)", desc: "Verandering wél met 2 decimalen — het verschil tussen +0.5% en +5% is informatief." },
        ],
        assignment: "Sluit de LCD aan (zie schema), upload, en wacht een minuut. Je moet de prijs en het pijltje zien verschijnen.",
        challenge: "Voeg een tweede coin toe (Ethereum). Wissel elke 10 sec tussen BTC en ETH op het LCD.",
        reflection: "Wat zijn de voordelen van een eigen ticker boven gewoon je telefoon erbij pakken? Denk aan: latency, batterij, scherm-aan-houden, ...",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 17: ESP32 NS-vertrektijden
  // ─────────────────────────────────────────────
  {
    id: "esp32-ns-display",
    title: "NS-vertrektijden display (ESP32)",
    description: "Toon live de eerstvolgende treinvertrekken vanaf jouw station op een LCD — perfect voor naast de voordeur. Gebruikt de officiële NS Reisinformatie API.",
    difficulty: "Gevorderd",
    materials: "ESP32 DevKit V1, USB-kabel, breadboard + jumpers, 1× I2C 16x2 LCD-display, gratis NS-developer API-key (apiportal.ns.nl). Library: ArduinoJson v6.",
    board: "esp32",
    tags: ["internet", "display"],
    learningGoal: "Werken met een API die authenticatie via een header vereist, een grote JSON-response parsen met DynamicJsonDocument, gegevens roteren op een display, en non-blocking timing met `millis()`.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "ns-s1",
        title: "API-key aanmaken en eerste GET",
        content: "**API-key:** ga naar apiportal.ns.nl → registreer (gratis) → 'Subscribe' bij 'Ns-App' product → kopieer je 'Primary Key'. Plak die in `nsApiKey` en zet `station` op de code van jouw station ('UT' = Utrecht CS, 'AMS' = Amsterdam CS, 'ASD' = Amsterdam Centraal, 'EHV' = Eindhoven, 'GVC' = Den Haag CS). De API wil de sleutel in een aparte HTTP-header `Ocp-Apim-Subscription-Key`. Upload en bekijk de eerste 500 tekens in de Serial Monitor.",
        diagram: false,
        code: ns_s1,
        legend: [
          { term: "Ocp-Apim-Subscription-Key", desc: "API-key gaat als HTTP-header mee, niet in de URL. Veiliger en stijlconventie van Microsoft Azure (dat NS gebruikt)." },
          { term: "addHeader(\"...\", nsApiKey)", desc: "Voeg een custom header toe aan de request voor authenticatie." },
          { term: "http.getString().substring(0, 500)", desc: "Print alleen de eerste 500 tekens — de hele JSON kan duizenden tekens lang zijn." },
          { term: "String url = String(\"...\") + station", desc: "Bouw de URL door een `String`-object samen te voegen met de stationcode. De `+`-operator werkt op `String` net als in JavaScript." },
        ],
        assignment: "Maak je API-key, vul ssid/password/key/station in, upload. In de Serial Monitor moet je status `200` zien plus het begin van een grote JSON met `payload` en `departures`.",
        challenge: "Probeer een verkeerde API-key (verander 1 letter). Welke statuscode krijg je terug? (Hint: 401)",
        reflection: "Waarom geeft NS de key liever in een header dan in de URL? Denk aan: logging, browsers, caching.",
      },
      {
        id: "ns-s2",
        title: "JSON parsen met DynamicJsonDocument",
        content: "De NS-respons is groot (vaak 5–10 kB). Daarvoor gebruiken we `DynamicJsonDocument(8192)` — die alloceert pas geheugen wanneer hij weet hoe groot de input is. We pakken de eerste 3 vertrekken uit `payload.departures[]` en printen tijd, richting en spoor in de Serial Monitor. **Let op:** `plannedDateTime` komt als ISO-string `2026-05-02T08:23:00+0200`, we knippen er met `.substring(11, 16)` 'HH:MM' uit.",
        diagram: false,
        code: ns_s2,
        legend: [
          { term: "DynamicJsonDocument doc(8192)", desc: "8 kB buffer — genoeg voor ~10 vertrekken. Bij 'NoMemory' fout: vergroot dit getal." },
          { term: "JsonArray departures = doc[\"payload\"][\"departures\"]", desc: "Pak de array uit de geneste JSON-structuur. JsonArray gedraagt zich als een gewone array." },
          { term: "min((int)departures.size(), 3)", desc: "Cast naar `int` is nodig omdat `min()` niet weet welk type te kiezen tussen `size_t` en `int`." },
          { term: ".substring(11, 16)", desc: "Karakter 11 t/m 15 van een ISO-tijdstempel = 'HH:MM' (de uren en minuten)." },
          { term: "departures[i][\"plannedTrack\"]", desc: "Spoornummer als string (kan ook letters bevatten zoals '14a')." },
        ],
        assignment: "Upload. Je moet elke minuut 3 regels zien: tijd, eindbestemming en spoor van de eerstvolgende treinen.",
        challenge: "Voeg vertraging toe: NS heeft ook `actualDateTime`. Vergelijk met `plannedDateTime` en print '+5 min vertraging' als ze verschillen.",
        reflection: "Waarom is `DynamicJsonDocument` hier handiger dan `StaticJsonDocument`? Wat is het nadeel? (Hint: heap-fragmentatie bij langlopende programma's.)",
      },
      {
        id: "ns-s3",
        title: "Eerste vertrek op het LCD tonen",
        content: "Tijd om het zichtbaar te maken. We sluiten de I2C LCD aan en tonen alleen het eerste vertrek: tijd op regel 1, eindbestemming op regel 2. Lange bestemming-namen (bv. 'Schiphol Airport') worden afgeknipt op 16 tekens — anders past het niet. We vullen de rest van regel 2 met spaties om oude tekst te wissen.",
        diagram: true,
        code: ns_s3,
        legend: [
          { term: "JsonObject eerste = doc[...][0]", desc: "Pak het eerste object uit de array. JsonObject = key/value-paren." },
          { term: "(const char*)eerste[\"direction\"]", desc: "Cast naar `const char*` is nodig om JsonVariant naar een Arduino String te converteren." },
          { term: "for (int i = ...; i < 16; i++) lcd.print(' ')", desc: "Vul aan met spaties tot 16 — wist eventuele langere oude tekst van vorige update." },
          { term: "lcd.print(\"Verbinden...\")", desc: "Toon iets meteen bij opstart, zodat de gebruiker weet dat de chip leeft tijdens WiFi-verbinding (~5-10 sec)." },
        ],
        assignment: "Sluit de LCD aan, upload, wacht een minuut. Je moet een tijd + bestemming zien verschijnen.",
        challenge: "Voeg het spoor toe achter de tijd op regel 1: '08:23 sp 5'.",
        reflection: "Wat moet je doen als je station maar 1 vertrek per uur heeft? Kun je in dat geval iets anders tonen?",
      },
      {
        id: "ns-s4",
        title: "3 vertrekken roteren met non-blocking timing",
        content: "Eén vertrek is leuk, maar we hebben er 3. Met `delay(5000)` zou de hele loop bevriezen. Daarom: het **non-blocking patroon** met `millis()` en twee timers — één voor 'wanneer opnieuw fetchen' (elke minuut), één voor 'wanneer naar volgende vertrek wisselen' (elke 5 sec). De loop draait razendsnel door en checkt alleen of er iets moet gebeuren.",
        diagram: true,
        code: ns_s4,
        legend: [
          { term: "struct Vertrek { String tijd; String richting; }", desc: "Eigen datatype dat tijd en bestemming koppelt — netter dan twee parallelle arrays." },
          { term: "Vertrek vertrekken[3]", desc: "Vaste array van 3 vertrekken. Bij minder beschikbare wordt `aantal` lager gezet." },
          { term: "nu - laatsteFetch > 60000UL", desc: "60.000 ms = 1 minuut. UL voorkomt overflow bij grote getallen." },
          { term: "huidigeIdx = (huidigeIdx + 1) % aantal", desc: "Modulo zorgt voor wrapping: 0 → 1 → 2 → 0 → 1 → ...  Werkt voor elk aantal." },
        ],
        assignment: "Upload. Het LCD moet elke 5 sec wisselen tussen 3 verschillende vertrekken, en elke minuut nieuwe data ophalen.",
        challenge: "Maak de wisseltijd instelbaar via een fysieke knop op GPIO 4: kort drukken → handmatig één verder, lang drukken → pauze (geen auto-rotation).",
        reflection: "Waarom is dit non-blocking patroon beter dan `delay()`? Wat kun je nu doen tijdens de wachttijd dat je niet kon met `delay`? (Hint: knoppen lezen, status-LED knipperen, ...)",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 18: Buienradar-strook met NeoPixels
  // ─────────────────────────────────────────────
  {
    id: "buienradar-strip",
    title: "Buienradar-strook met NeoPixels (ESP32)",
    description: "Laat een ring van 24 NeoPixels de regen-voorspelling van Buienradar zien — elke LED is 5 minuten in de toekomst, kleur loopt van groen (droog) naar rood (stortregen).",
    difficulty: "Gevorderd",
    materials: "ESP32 DevKit V1, USB-kabel, breadboard + jumpers, 1× NeoPixel-ring of -strip met 24 WS2812B LEDs, externe 5V-voeding (1A+) aanbevolen voor full brightness.",
    board: "esp32",
    tags: ["internet"],
    learningGoal: "Een open HTTP-API uitlezen en parsen, sensorwaarden mappen op een visuele schaal (kleurgradient), en NeoPixels veilig aansturen vanaf een ESP32 (3.3V signaal, 5V power).",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "br-s1",
        title: "Eerste GET naar Buienradar",
        content: "Buienradar biedt een **gratis, sleutelloze** endpoint voor regen-voorspelling op coördinaten: `gpsgadget.buienradar.nl/data/raintext`. Je krijgt 24 regels terug, elke regel is een meting voor de komende 2 uur (één per 5 min). Pas `lat` en `lon` aan naar jouw locatie (Google → 'mijn coördinaten') en upload deze sketch. In de Serial Monitor zie je de ruwe respons.",
        diagram: false,
        code: br_s1,
        legend: [
          { term: "#include <HTTPClient.h>", desc: "ESP32-bibliotheek voor HTTP-requests. http:// is voldoende — Buienradar serveert ook over plain HTTP." },
          { term: "gpsgadget.buienradar.nl/data/raintext", desc: "Open endpoint: geen API-key, geen rate-limit voor normaal gebruik. Ideaal voor leerprojecten." },
          { term: "?lat=52.09&lon=5.12", desc: "Latitude/longitude als query-parameters. Hoe dichter bij jouw locatie, hoe accurater de voorspelling." },
          { term: "http.GET()", desc: "Stuur de request, returnt de HTTP-statuscode. 200 = OK." },
        ],
        assignment: "Vul je WiFi-gegevens in, pas lat/lon aan naar jouw locatie, upload. In de Serial Monitor moet je 24 regels zien zoals `127|14:35` — getal voor de pipe = regen-intensiteit.",
        challenge: "Probeer een lat/lon van een plek waar het op dit moment regent (kijk eerst op buienradar.nl). Zie je hogere getallen?",
        reflection: "Waarom is een open endpoint zonder authenticatie zowel handig als kwetsbaar voor de aanbieder? Wat kunnen ze doen om misbruik te beperken?",
      },
      {
        id: "br-s2",
        title: "Respons parsen tot 24 getallen",
        content: "De respons is een tekst die we regel voor regel doorlopen. Per regel pakken we het getal vóór de `|` met `substring()` en `toInt()`. We slaan ze op in een array `regenWaarden[24]`. Het patroon `indexOf('\\n')` om regels te knippen is universeel: het werkt voor elk regel-gebaseerd protocol.",
        diagram: false,
        code: br_s2,
        legend: [
          { term: "int regenWaarden[24]", desc: "Vaste-grootte array — 24 metingen passen er altijd in. Geen heap-allocaties." },
          { term: "body.indexOf('\\n', start)", desc: "Vind de volgende newline vanaf positie `start`. -1 als er geen meer is." },
          { term: "regel.substring(0, pipe)", desc: "Pak het stukje vóór de `|` — dat is het regen-getal als string." },
          { term: ".toInt()", desc: "Converteer string naar int. Bij ongeldige tekst returnt het 0 — geen exception." },
          { term: "(int)body.length()", desc: "Cast naar int omdat `length()` een `unsigned int` returnt — vergelijk met int gaat anders mis." },
        ],
        assignment: "Upload, kijk in de Serial Monitor: je moet één regel zien met 24 getallen tussen 0 en ~250.",
        challenge: "Print ook de tijd-strings (na de `|`) zodat je weet voor welk uur+minuut elke voorspelling geldt.",
        reflection: "Waarom een vaste array van 24 in plaats van een dynamische lijst? Wat zijn de voor- en nadelen op een microcontroller met weinig RAM?",
      },
      {
        id: "br-s3",
        title: "Kleur-mapping op de NeoPixel-strook",
        content: "Tijd voor de visuele kers. We voegen de Adafruit_NeoPixel-bibliotheek toe en bouwen een `kleurVoor()`-helper die het regen-getal afbeeldt op groen → geel → oranje → rood. **Belangrijk over voeding:** 24 NeoPixels op vol wit trekt ~1.4A — meer dan een ESP32 via USB kan leveren. Daarom `setBrightness(40)` (~16% van max) en/of een externe 5V-voeding. Het data-signaal is op 3.3V (ESP32-niveau): voor een korte draad werkt dat meestal direct, anders een 74AHCT125 level-shifter ertussen.",
        diagram: true,
        code: br_s3,
        legend: [
          { term: "Adafruit_NeoPixel strip(aantalLeds, dataPin, NEO_GRB + NEO_KHZ800)", desc: "Maak het strip-object aan. NEO_GRB = kleurvolgorde voor WS2812B." },
          { term: "strip.setBrightness(40)", desc: "Globale dimmer (0-255). Beperkt het stroomverbruik én voorkomt brown-outs op USB-voeding." },
          { term: "kleurVoor(int waarde)", desc: "Mapping-functie: een getal omzetten in een kleur. Hier handmatige if-laddern; je kunt ook lineair interpoleren tussen twee kleuren." },
          { term: "5UL * 60UL * 1000UL", desc: "5 minuten in ms. UL-suffix voorkomt overflow tijdens vermenigvuldigen (16-bit getallen lopen over bij ~32k)." },
          { term: "millis()", desc: "Aantal ms sinds opstart. Gebruikt voor non-blocking timing — geen `delay()` in de loop." },
        ],
        assignment: "Sluit de NeoPixel-ring aan (zie schema), upload, wacht ~10 sec tot de eerste fetch klaar is. De ring moet de regen-voorspelling tonen voor de komende 2 uur.",
        challenge: "Voeg een 'gemiddelde'-LED toe op een eigen pin: één losse LED die rood knippert als de gemiddelde regen-waarde over alle 24 metingen > 50 is.",
        reflection: "Welk dagelijks moment zou jij hier beter door kunnen plannen? (Hond uitlaten, fietsritje, was buiten hangen, ...)",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 19: ESP32-CAM webcam met bewegingsdetectie
  // ─────────────────────────────────────────────
  {
    id: "esp32-cam-webcam",
    title: "ESP32-CAM webcam + bewegingsdetectie",
    description: "Bouw een mini-webcam die live MJPEG streamt naar je browser, en in stap 4 automatisch een snapshot beschikbaar maakt zodra de PIR-sensor beweging detecteert.",
    difficulty: "Gevorderd",
    materials: "ESP32-CAM (AI Thinker), FTDI USB-naar-Serial-adapter (3.3V/5V), breadboard + jumpers, 1× PIR bewegingssensor (HC-SR501) voor stap 4. Optioneel: externe 5V-voeding (de USB van de FTDI is soms te zwak).",
    board: "esp32",
    tags: ["internet", "sensor"],
    learningGoal: "Werken met een bord zonder USB (FTDI-programmeren), de OV2640-camera initialiseren, een MJPEG-stream serveren via WebServer, en een fysieke trigger (PIR) koppelen aan een snapshot-endpoint.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "cam-s1",
        title: "Hardware aansluiten en eerste upload",
        content: "De ESP32-CAM **heeft geen USB-aansluiting** — je hebt een FTDI USB-naar-Serial-adapter nodig om te programmeren. Belangrijke regels:\n\n1. **Bedrading:** zie het schema hiernaast. FTDI 5V → CAM 5V, FTDI GND → CAM GND, FTDI TX → CAM U0R, FTDI RX → CAM U0T, en GPIO 0 → GND **alleen tijdens uploaden**.\n2. **Board kiezen:** Tools → Board → 'AI Thinker ESP32-CAM'. Tools → Partition Scheme → 'Huge APP'.\n3. **Upload-procedure:** houd IO0 aan GND, druk op de RESET-knop op de CAM, klik Upload, wacht tot 'Connecting...', laat IO0 los. Na uploaden: **koppel IO0 helemaal los** en druk RESET om de sketch te starten.\n\nDeze eerste sketch print alleen iets in de Serial Monitor — als dat lukt, weet je dat je hardware en upload-flow werken.",
        diagram: true,
        code: cam_s1,
        legend: [
          { term: "FTDI 5V → CAM 5V", desc: "De ESP32-CAM heeft een 5V-pin die intern wordt geregeld naar 3.3V. Met FTDI op 5V is de stroom meestal net genoeg." },
          { term: "FTDI TX → CAM U0R", desc: "TX van de FTDI gaat naar RX van de CAM (U0R = UART0 Receive). Een 'crossover' is normaal in seriële verbindingen." },
          { term: "GPIO 0 → GND", desc: "Trigger boot-modus. Alleen verbinden tijdens uploaden, daarna LOSKOPPELEN voor normale boot." },
          { term: "RESET-knopje", desc: "Witte knop op de achterkant van de ESP32-CAM. Reset = herstart het bord; nodig na elke modus-wisseling." },
        ],
        assignment: "Sluit de FTDI aan volgens het schema. Upload deze sketch (volg de IO0-procedure!). Na upload moet de Serial Monitor (115200 baud) elke 2 sec 'Nog steeds aan...' printen.",
        challenge: "Probeer de upload te doen ZONDER IO0 aan GND — welke foutmelding krijg je in de IDE? (Hint: 'Failed to connect... wrong boot mode'.)",
        reflection: "Waarom heeft de ESP32-CAM geen USB-poort terwijl een gewone ESP32 DevKit dat wel heeft? Denk aan: kostprijs, formaat, doelgroep.",
      },
      {
        id: "cam-s2",
        title: "Camera initialiseren en één foto pakken",
        content: "Nu we kunnen uploaden, gaan we de camera aanzetten. De `camera_config_t`-struct heeft veel velden — het zijn bijna allemaal de pin-mappings van de OV2640-camera-chip naar de ESP32 GPIOs. Die zijn vast voor het AI-Thinker-bord; **kopieer ze 1-op-1**. Na `esp_camera_init()` kunnen we met `esp_camera_fb_get()` één frame ophalen — een JPEG-blob in geheugen. Vergeet niet hem altijd terug te geven met `esp_camera_fb_return()`!",
        diagram: false,
        code: cam_s2,
        legend: [
          { term: "camera_config_t cfg = {}", desc: "Initialiseer alle velden op 0. Daarna vullen we per veld in wat we nodig hebben." },
          { term: "PIXFORMAT_JPEG", desc: "Camera comprimeert intern naar JPEG. Bespaart heel veel RAM én is direct verstuurbaar over HTTP." },
          { term: "FRAMESIZE_VGA", desc: "640x480 — goede balans tussen kwaliteit en RAM-gebruik. Hogere modes (UXGA = 1600x1200) lukken alleen met PSRAM." },
          { term: "jpeg_quality = 12", desc: "0 = best, 63 = slechtst. 10-15 is een sweet spot." },
          { term: "esp_camera_fb_get()", desc: "Pak een 'frame buffer' = pointer naar een JPEG in RAM. NULL bij fout." },
          { term: "esp_camera_fb_return(fb)", desc: "Geef het buffer terug aan de driver. Zonder dit: na ~3 frames krijg je NULL." },
        ],
        assignment: "Upload (denk aan de IO0-procedure!). De Serial Monitor moet 'Camera klaar!' tonen, en daarna elke 2 sec 'Foto ok - 12345 bytes' (het getal varieert).",
        challenge: "Verander `FRAMESIZE_VGA` in `FRAMESIZE_QVGA` (320x240). Hoe veel kleiner worden de foto's? En `FRAMESIZE_SVGA` (800x600)?",
        reflection: "Waarom is JPEG-output zoveel praktischer dan RAW pixels op een chip met 520kB RAM? (Tip: 640×480×3 bytes = 921 kB.)",
      },
      {
        id: "cam-s3",
        title: "Live MJPEG-stream via WiFi",
        content: "Nu maken we er een echte webcam van. We voegen WiFi en `WebServer` toe en bouwen een `/stream`-endpoint. **MJPEG** = Motion JPEG: een eindeloze HTTP-respons waarin we steeds nieuwe JPEG-frames sturen, gescheiden door een `--frame`-marker. Browsers kennen `multipart/x-mixed-replace` en tonen de stream automatisch als bewegend beeld. Open de gegeven URL in je browser, op je telefoon, in VLC — overal werkt het.",
        diagram: false,
        code: cam_s3,
        legend: [
          { term: "WebServer server(80)", desc: "ESP32's ingebouwde HTTP-server, luistert op poort 80." },
          { term: "multipart/x-mixed-replace; boundary=frame", desc: "MIME-type dat zegt: 'ik stuur meerdere parts; vervang het vorige beeld telkens'. Browsers tonen dit als video." },
          { term: "--frame\\r\\nContent-Type: image/jpeg", desc: "Boundary-marker + per-frame headers. Letterlijke `\\r\\n` (Windows-line-endings) zijn vereist door de HTTP-spec." },
          { term: "client.write(fb->buf, fb->len)", desc: "Stuur de ruwe JPEG-bytes. `write` (niet `print`) omdat het binaire data is." },
          { term: "delay(50)", desc: "Cap op ~20 fps. Lager = soepeler maar meer CPU + WiFi-belasting." },
        ],
        assignment: "Upload, open de Serial Monitor om het IP-adres te lezen, ga naar `http://<IP>/stream` in je browser. Je moet live beeld zien.",
        challenge: "Voeg een `/` route toe die een simpele HTML-pagina returnt met een `<img src='/stream'>` zodat je de stream in een nette layout ziet (met titel en eventueel een refresh-knop).",
        reflection: "MJPEG is bandbreedte-vretend (elk frame is een complete foto). Welke videocodec zou efficiënter zijn? Waarom kan een ESP32 die typisch niet aan?",
      },
      {
        id: "cam-s4",
        title: "Snapshot bij beweging (PIR-sensor)",
        content: "Slot-stap: koppel een PIR-sensor aan **GPIO 13** (één van de weinige vrije GPIOs op de CAM — de meeste zijn bezet door de camera-chip). Bij elke nieuwe beweging printen we een melding én bieden we via `/snapshot` de huidige foto aan. **Edge-detectie** (`nu && !laatstePir`) zorgt dat we maar één keer per beweging triggeren, niet 1000x zolang de sensor HIGH blijft. Een cooldown van 10 sec voorkomt spam.",
        diagram: true,
        code: cam_s4,
        legend: [
          { term: "int pirPin = 13", desc: "GPIO 13 is vrij op de AI-Thinker-CAM. GPIO 12 ook, maar die heeft een interne pull-down nodig bij boot." },
          { term: "bool laatstePir", desc: "Vorige status onthouden — basis voor edge-detectie." },
          { term: "nu && !laatstePir", desc: "TRUE alleen op de overgang LOW→HIGH (de millisecond dat beweging begint). Niet zolang het HIGH blijft." },
          { term: "t - laatsteMelding > 10000UL", desc: "Cooldown van 10 sec. Anders triggert één voorbij-loopactie meerdere meldingen." },
          { term: "/snapshot", desc: "Endpoint dat één verse JPEG returnt. Geen MJPEG-magie, gewoon één plaatje." },
        ],
        assignment: "Sluit de PIR aan (5V→VCC, GND→GND, OUT→GPIO 13). Upload. Loop voor de sensor: in de Serial Monitor verschijnt 'Beweging!'. Open `/snapshot` in je browser om de foto te zien.",
        challenge: "Sla snapshots op in een ringbuffer in PSRAM (als je ESP32-CAM PSRAM heeft) en bouw een `/last5` endpoint die de 5 laatste snapshots achter elkaar toont.",
        reflection: "Wat zijn drie nuttige toepassingen van deze setup thuis? En wat zijn de privacy-overwegingen als je dit ophangt in een gedeelde ruimte?",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 20: Bluetooth-toetsenbord emulator
  // ─────────────────────────────────────────────
  {
    id: "ble-keyboard",
    title: "Bluetooth-toetsenbord emulator (ESP32)",
    description: "Maak van je ESP32 een echt Bluetooth-toetsenbord. Verbind met je laptop of telefoon en laat een fysieke knop een wachtwoord intypen, een sneltoets sturen of media bedienen.",
    difficulty: "Gevorderd",
    materials: "ESP32 DevKit V1, USB-kabel, breadboard + jumpers, 1× drukknop (geen weerstand nodig dankzij INPUT_PULLUP).",
    board: "esp32",
    tags: ["internet"],
    learningGoal: "Een Bluetooth Low Energy HID (Human Interface Device) profiel implementeren, edge-detectie gebruiken om dubbele triggers te voorkomen, en het verschil tussen `print()` (typen) en `write()` (één-toets-press) op een BLE-keyboard begrijpen.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "ble-s1",
        title: "Bibliotheek installeren en eerste verbinding",
        content: "We gebruiken **'ESP32 BLE Keyboard'** van T-vK (te vinden via Library Manager, zoek 'ble keyboard'). Dat doet al het zware werk: BLE-stack, HID-protocol, herverbinden. Onze eerste sketch maakt een keyboard-object, start het, en zodra er een apparaat verbindt typt het elke 5 sec 'Hallo!'. **Koppelen op je laptop/telefoon:** Bluetooth-instellingen → Nieuw apparaat → kies 'ESP32 Knop'.",
        diagram: false,
        code: ble_s1,
        legend: [
          { term: "#include <BleKeyboard.h>", desc: "De T-vK-bibliotheek — installeer eerst via Library Manager. Werkt alleen op ESP32, niet op gewone Arduino." },
          { term: "BleKeyboard kb(\"ESP32 Knop\", \"Nogwa\", 100)", desc: "Naam (zichtbaar bij koppelen), fabrikant, batterij-percentage (cosmetisch — wordt getoond op iOS/Mac)." },
          { term: "kb.begin()", desc: "Start de BLE-stack en zet HID-advertising aan. Het apparaat is nu zichtbaar voor andere Bluetooth-devices." },
          { term: "kb.isConnected()", desc: "TRUE als er een apparaat gekoppeld is. Vóór dat moet kb.print() niets doen — dus altijd checken." },
          { term: "kb.print(\"Hallo!\")", desc: "Typ de tekst — het is alsof iemand op die toetsen drukt. Werkt waar de cursor ook staat." },
        ],
        assignment: "Upload, koppel je laptop met 'ESP32 Knop' via Bluetooth-instellingen, open een teksteditor en zet de cursor erin. Elke 5 sec moet 'Hallo!' verschijnen.",
        challenge: "Voeg `kb.print(\"\\n\")` toe na 'Hallo!' zodat het een echte Enter-toets stuurt en op een nieuwe regel komt.",
        reflection: "Welke beveiligingsrisico's brengt een 'altijd-gekoppeld' BLE-toetsenbord met zich mee? Wie kan jouw ESP32 als invoer-apparaat gebruiken?",
      },
      {
        id: "ble-s2",
        title: "Knop koppelen met edge-detectie",
        content: "Continu typen is niet wat we willen. We voegen een knop toe op GPIO 4 (met `INPUT_PULLUP` — knop tussen pin en GND, geen weerstand nodig). Het cruciale truc is **edge-detectie**: we onthouden de vorige status en triggeren alleen op de overgang HIGH → LOW (het moment van indrukken). Anders typt hij dezelfde tekst 100x per seconde zolang je de knop ingedrukt houdt.",
        diagram: true,
        code: ble_s2,
        legend: [
          { term: "pinMode(buttonPin, INPUT_PULLUP)", desc: "Interne pull-up: pin leest standaard HIGH, wordt LOW als knop is ingedrukt (verbonden met GND)." },
          { term: "vorigeStaat == HIGH && huidig == LOW", desc: "Edge-detectie: TRUE alleen op het moment van overgang naar ingedrukt. Niet zolang knop ingedrukt blijft." },
          { term: "vorigeStaat = huidig", desc: "Update aan einde van loop. Kritisch — zonder dit werkt edge-detectie nooit." },
          { term: "delay(20)", desc: "Simpele software-debounce. Knoppen 'bouncen' enkele ms bij contact; 20 ms is genoeg om de bounce uit te filteren." },
        ],
        assignment: "Sluit een knop aan tussen GPIO 4 en GND. Upload. Druk de knop één keer in: het wachtwoord moet één keer getypt worden, ongeacht hoe lang je drukt.",
        challenge: "Maak een 'sneltoets' i.p.v. tekst: druk eerst CMD/CTRL ingedrukt, druk Z, los CMD/CTRL — undo dus. Hint: `kb.press(KEY_LEFT_CTRL)`, `kb.press('z')`, `kb.releaseAll()`.",
        reflection: "Wat zijn drie nuttige knop-acties die je nu zou kunnen automatiseren? (Voorbeelden: e-mailadres invullen, programma openen via Spotlight, ...)",
      },
      {
        id: "ble-s3",
        title: "Media-toetsen (play/pauze)",
        content: "BLE-toetsenborden kennen ook **media-toetsen** — die werken in Spotify, YouTube, Netflix, alles wat audio/video afspeelt. Met `kb.write(KEY_MEDIA_PLAY_PAUSE)` stuur je één 'klik' van de play/pauze-toets. Andere beschikbare toetsen: `KEY_MEDIA_NEXT_TRACK`, `KEY_MEDIA_PREVIOUS_TRACK`, `KEY_MEDIA_VOLUME_UP/DOWN`, `KEY_MEDIA_MUTE`. Heel handig als afstandsbediening voor bv. presentaties of muziek tijdens het koken.",
        diagram: true,
        code: ble_s3,
        legend: [
          { term: "kb.write(KEY_MEDIA_PLAY_PAUSE)", desc: "Verschil met `print`: `write` stuurt één key-press (één 'klik'). `print` stuurt een hele tekst-string." },
          { term: "KEY_MEDIA_NEXT_TRACK", desc: "Volgende nummer. De constanten zijn gedefinieerd in BleKeyboard.h." },
          { term: "KEY_MEDIA_VOLUME_UP", desc: "Volume hoger. Niet 'systeem-volume' op alle OS'en, maar wel app-volume in Spotify/YouTube." },
          { term: "BleKeyboard kb(\"ESP32 Media\", ...)", desc: "Andere naam zodat hij verschijnt als apart apparaat in je Bluetooth-instellingen." },
        ],
        assignment: "Upload, koppel als 'ESP32 Media', open Spotify of YouTube, druk de knop. Muziek/video moet pauzeren/hervatten.",
        challenge: "Bouw een **3-knops-afstandsbediening**: vorige nummer, play/pauze, volgende nummer. Dat is letterlijk drie knoppen op verschillende GPIOs met elk hun eigen edge-detectie-blok.",
        reflection: "BLE-keyboards werken op iOS, macOS, Windows, Android en Linux zonder driver-installatie. Welk standaard-protocol maakt dat mogelijk en waarom is dat zo waardevol?",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 21: Pakketmelder voor de brievenbus
  // ─────────────────────────────────────────────
  {
    id: "pakketmelder-brievenbus",
    title: "Pakketmelder voor de brievenbus (ESP32 + reed-schakelaar)",
    description: "Een batterij-aangedreven brievenbus-sensor: zodra het klepje opengaat, sluipt de ESP32 uit deep-sleep, stuurt 'Post is er!' naar Discord, en gaat weer slapen. Maandenlang op één lading.",
    difficulty: "Gemiddeld",
    materials: "ESP32 DevKit V1, USB-kabel of LiPo-batterij, breadboard + jumpers, 1× reed-schakelaar (NO-type, met magneet), Discord-account met eigen server (voor de webhook).",
    board: "esp32",
    tags: ["internet", "domotica", "sensor"],
    learningGoal: "Een reed-schakelaar uitlezen als digitale input, edge-detectie correct toepassen, een Discord-webhook aanroepen, en deep sleep gebruiken voor jaren-lange batterijduur door alleen op een externe trigger wakker te worden.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "pak-s1",
        title: "Reed-schakelaar uitlezen",
        content: "Een **reed-schakelaar** is een glazen buisje met twee metalen contacten die naar elkaar toe gebogen worden door een naburige magneet. Geen elektronica, geen voeding nodig — gedraagt zich precies zoals een drukknop. Sluit aan tussen GPIO 4 en GND, met `INPUT_PULLUP`. Beweeg een magneet ernaartoe en in de Serial Monitor zie je de status wisselen.\n\n**Plaatsing in de brievenbus:** schakelaar op de vaste rand, magneet op het bewegende klepje. Als het klepje dicht is = magneet dichtbij = schakelaar gesloten = pin LOW.",
        diagram: true,
        code: pak_s1,
        legend: [
          { term: "int reedPin = 4", desc: "GPIO 4 is een veilige general-purpose pin op ESP32. Andere prima keuzes: GPIO 13, 14, 15." },
          { term: "INPUT_PULLUP", desc: "Pin leest standaard HIGH (interne weerstand naar 3.3V). Wordt LOW als de schakelaar geleidt." },
          { term: "huidig != vorigeStaat", desc: "Detecteer overgang. Print alleen bij verandering, niet 50x per seconde." },
          { term: "delay(20)", desc: "Reed-schakelaars 'bouncen' nauwelijks (geen mechanisch contact tussen mensen-vingers), maar 20ms blijft veiligheidsmarge." },
        ],
        assignment: "Sluit de reed-schakelaar aan tussen GPIO 4 en GND. Upload. Beweeg een magneet langs de schakelaar — je moet GESLOTEN/OPEN zien wisselen in de Serial Monitor.",
        challenge: "Pas het experiment aan: meet hoe ver (in cm) de magneet van de schakelaar mag zijn voordat hij niet meer triggert. Sterkte verschilt per magneet-type (ferriet vs. neodymium).",
        reflection: "Waarom is een reed-schakelaar betrouwbaarder voor een buiten-toepassing dan een infrarood-sensor of microswitch? Denk aan: vocht, vuil, geen bewegende delen.",
      },
      {
        id: "pak-s2",
        title: "Discord-melding bij open klepje",
        content: "Hergebruik van het webhook-patroon uit de **'Discord-melding bij beweging'**-tutorial: maak een webhook in Discord (Kanaal-instellingen → Integraties → Webhooks), kopieer de URL, plak hier. Op de overgang LOW→HIGH (klepje gaat open) sturen we 'Post is er!'. Edge-detectie zorgt dat we maar één melding per opening krijgen, niet één per polling-cyclus.",
        diagram: true,
        code: pak_s2,
        legend: [
          { term: "webhookUrl", desc: "Geheime URL met token. Zie de tutorial 'Discord-melding bij beweging' voor hoe je hem aanmaakt." },
          { term: "vorigeStaat == LOW && huidig == HIGH", desc: "Edge-detectie: alleen TRUE op het moment dat het klepje opengaat. Niet bij sluiten." },
          { term: "String(R\"({\"content\":\")\") + bericht + R\"(\"})", desc: "Raw strings + concatenatie bouwen het JSON-payload zonder dubbele-escape-hel." },
          { term: "http.POST(json)", desc: "Returnt de HTTP-statuscode. 204 = succes, 401 = verkeerde URL, 429 = te veel requests." },
        ],
        assignment: "Maak een Discord-webhook, plak de URL en je WiFi-gegevens, upload. Beweeg de magneet weg → er moet 'Post is er!' in Discord verschijnen.",
        challenge: "Voeg een tijdstempel toe aan het bericht, bv. via NTP (`configTime(0, 0, \"pool.ntp.org\")` + `getLocalTime()`). Output: 'Post is er! (14:32)'.",
        reflection: "De ESP32 staat hier permanent aan WiFi en is altijd verbonden — dat trekt ~80mA. Hoe lang gaat een 2000mAh batterij dan ongeveer mee? (Hint: ~25 uur.) De volgende stap lost dat op.",
      },
      {
        id: "pak-s3",
        title: "Deep sleep voor maandenlange batterijduur",
        content: "De truc: tussen meldingen door **slaapt** de ESP32. In deep sleep verbruikt hij ~10µA in plaats van 80mA — een factor 8000 minder. We gebruiken `esp_sleep_enable_ext0_wakeup()` om de chip te laten ontwaken zodra GPIO 4 HIGH wordt (= klepje opengaat = magneet gaat weg). Bij ontwaken start `setup()` opnieuw — we checken dan met `esp_sleep_get_wakeup_cause()` of we wakker werden door de pin (= melding sturen) of door power-on (= alleen slapen).\n\nMet 2000 mAh: ~50.000 uur = >5 jaar (in de praktijk minder door zelfontlading, maar maandenlang is realistisch).",
        diagram: true,
        code: pak_s3,
        legend: [
          { term: "GPIO_NUM_4", desc: "Typed enum-versie van GPIO 4. `esp_sleep_enable_ext0_wakeup()` accepteert alleen dit type, geen losse int." },
          { term: "esp_sleep_enable_ext0_wakeup(REED_GPIO, 1)", desc: "Configureer EXT0 wake-up: ontwaak als REED_GPIO HIGH wordt. `0` zou wekken bij LOW." },
          { term: "esp_sleep_get_wakeup_cause()", desc: "Vraag op WAAROM we wakker werden. ESP_SLEEP_WAKEUP_EXT0 = onze pin. ESP_SLEEP_WAKEUP_UNDEFINED = power-on/reset." },
          { term: "esp_deep_sleep_start()", desc: "Ga in diepste slaap. Geen return — bij volgende wake-up start setup() vanaf het begin." },
          { term: "loop() {}", desc: "Onbereikbaar. In dit deep-sleep-patroon doet alle logica zich in setup() af. De loop is leeg." },
        ],
        assignment: "Plak je WiFi en webhook in, upload, en open de Serial Monitor. Bij eerste opstart: 'Eerste opstart, geen melding nodig' → 'Slapen'. Beweeg de magneet weg → ESP32 ontwaakt → 'Post is er!' in Discord → slaapt weer.",
        challenge: "Voeg een tweede wake-up bron toe: een timer die elke 24 uur ontwaakt om te controleren of de batterij nog vol genoeg is (`esp_sleep_enable_timer_wakeup`). Stuur 'Batterij laag!' als de spanning onder een drempel zakt.",
        reflection: "Waarom is GPIO 4 hier wel maar GPIO 16 of 17 niet bruikbaar als wake-up bron? (Hint: ext0 vereist een 'RTC GPIO' — niet alle pins kwalificeren.)",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 22: Reactietijd-tester (Beginner)
  // ─────────────────────────────────────────────
  {
    id: "reactietijd-tester",
    title: "Reactietijd-tester met LCD",
    description: "Een klassiek arcade-spelletje: een willekeurig moment licht een LED op, jij drukt zo snel mogelijk een knop. Het LCD toont je reactietijd in milliseconden — en houdt je beste score bij.",
    difficulty: "Beginner",
    materials: "Arduino Uno, USB-kabel, breadboard + jumpers, 1× I2C 16x2 LCD-display (PCF8574 backpack), 1× LED, 1× 220Ω weerstand, 1× drukknop.",
    board: "arduino",
    tags: ["game", "display"],
    learningGoal: "`millis()` gebruiken om duur te meten, `random()` voor onvoorspelbare timing, een knop met edge/blocking-detectie uitlezen, een I2C LCD aansturen, en een 'best score'-variabele bijhouden tussen rondes.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "rt-s1",
        title: "Hardware-test: LCD, LED en knop",
        content: "Voor we beginnen met spel-logica: even alles testen. Sluit aan volgens het schema. De I2C LCD heeft maar 4 draadjes (VCC, GND, SDA→A4, SCL→A5). De LED komt op pin 9 met een 220Ω weerstand in serie. De knop tussen pin 7 en GND (geen weerstand: we gebruiken `INPUT_PULLUP`).\n\nDeze sketch toont de start-tekst op het LCD en zet de LED aan zolang de knop wordt ingedrukt — handige sanity-check.",
        diagram: true,
        code: rt_s1,
        legend: [
          { term: "LiquidCrystal_I2C lcd(0x27, 16, 2)", desc: "Adres 0x27 is standaard voor PCF8574-backpacks. Werkt het niet? Probeer 0x3F." },
          { term: "lcd.init() / lcd.backlight()", desc: "Initialiseer de display + zet de blauwe achtergrondverlichting aan." },
          { term: "INPUT_PULLUP", desc: "Pin standaard HIGH. Bij ingedrukte knop: LOW. Geen externe pull-up-weerstand nodig." },
          { term: "pin 9", desc: "PWM-pin (~). Voor deze tutorial alleen digitalWrite, maar pin 9 laat ook fade-effecten toe als challenge." },
        ],
        assignment: "Sluit alles aan volgens het schema. Upload. Het LCD moet 'Reactietijd!' tonen, en de LED moet aan/uit gaan met de knop.",
        challenge: "Verander pin 9 naar een PWM-fade in plaats van vol-aan: gebruik `analogWrite(ledPin, 50)` voor een rustige helderheid.",
        reflection: "Waarom heeft het LCD maar 2 datadraden (SDA, SCL) terwijl het 16 tekens × 2 regels = 32 plekken kan tonen? (Hint: I2C is een seriëel protocol.)",
      },
      {
        id: "rt-s2",
        title: "De spel-loop: random wachten + tijd meten",
        content: "Nu de spel-logica. We wachten tot de speler op start drukt, dan een **willekeurige** tijd tussen 1,5 en 4 sec (anders is het te voorspelbaar). LED gaat aan, we noteren de exacte tijd met `millis()`, en zodra de speler de knop indrukt rekenen we het verschil. **`randomSeed(analogRead(A0))`** is essentieel: zonder dit krijg je elke keer dezelfde 'willekeurige' getallen omdat de Arduino bij start altijd in dezelfde state zit.",
        diagram: true,
        code: rt_s2,
        legend: [
          { term: "randomSeed(analogRead(A0))", desc: "Zaai het random-systeem met de elektrische ruis op een open analoge pin. Anders krijg je elke run dezelfde sequentie." },
          { term: "random(1500, 4000)", desc: "Random getal tussen 1500 (incl) en 4000 (excl). Eenheid is hier ms." },
          { term: "millis()", desc: "Aantal milliseconden sinds de Arduino opstartte. Het verschil tussen twee `millis()`-aanroepen = duur." },
          { term: "wachtTotIngedrukt() / wachtTotLosgelaten()", desc: "Eigen helper-functies. Door ze samen te gebruiken voorkom je 'auto-repeat' wanneer de knop ingedrukt blijft." },
          { term: "while (digitalRead(...) == HIGH) { delay(10); }", desc: "Blocking wachtlus. Mag hier omdat we tijdens deze fase bewust niets anders doen." },
        ],
        assignment: "Upload. Druk start, wacht tot de LED aangaat, druk zo snel mogelijk. De gemeten tijd in ms verschijnt op het LCD. Wat is jouw best haalbare?",
        challenge: "Voeg een geluidseffect toe: een korte `tone(buzzerPin, 1000, 50)` op het moment dat de LED aangaat. Sluit een buzzer aan op pin 8.",
        reflection: "Een typisch menselijke reactietijd op een visuele prikkel is 200-300 ms. Wat zijn factoren die jouw tijd kunnen verbeteren of verslechteren? (Slaap, cafeïne, leeftijd, ...)",
      },
      {
        id: "rt-s3",
        title: "Best score bijhouden + valsspeel-detectie",
        content: "Twee verbeteringen voor een echte arcade-feel:\n\n1. **Best score** — variabele `besteTijd` die alleen wordt overschreven als de huidige tijd lager is. Op het start-scherm zie je je record.\n2. **Valsspeel-detectie** — wat als iemand de knop al ingedrukt houdt vóór de LED aangaat? We checken tijdens de wachttijd of er gedrukt wordt. Zo ja: 'Te vroeg!' en geen score.\n\n**Let op:** `besteTijd` reset als de Arduino uitgaat (geen EEPROM). Als challenge kun je hem opslaan met `EEPROM.put()` zodat hij een power-cycle overleeft.",
        diagram: true,
        code: rt_s3,
        legend: [
          { term: "unsigned long besteTijd = 0", desc: "0 = sentinel-waarde voor 'nog geen score'. Werkt omdat een echte reactietijd nooit 0 ms kan zijn." },
          { term: "besteTijd == 0 || reactie < besteTijd", desc: "Update als nog geen score, OF als deze beter is. `||` is short-circuit: als links TRUE, wordt rechts niet geëvalueerd." },
          { term: "millis() < deadline", desc: "Loop draait tot de deadline (= start + wacht-tijd). Tijdens die tijd checken we op valsspelen." },
          { term: "if (digitalRead(buttonPin) == LOW) { teVroeg = true; break; }", desc: "Vroege druk = vals. Break uit de wachtlus, sla de meet-fase over." },
          { term: "delay(5) in de polling-lus", desc: "Korte sleep zodat we niet 100% CPU gebruiken. 5 ms = ruim genoeg om een knopdruk niet te missen." },
        ],
        assignment: "Upload. Speel een aantal rondes. Bij verbetering: 'NIEUW RECORD!' op regel 2. Druk eens vroeg op de knop (vóór de LED aangaat) en check de 'Te vroeg!'-melding.",
        challenge: "Sla `besteTijd` op in EEPROM zodat de score een uitschakeling overleeft. Hint: `#include <EEPROM.h>`, `EEPROM.put(0, besteTijd)` om te schrijven, `EEPROM.get(0, besteTijd)` in `setup()` om te lezen.",
        reflection: "Welke andere games kun je met deze setup (LCD + LED + knop + Arduino) bouwen? Bedenk er drie. (Voorbeelden: Simon Says, Snake op tekst-scherm, ...)",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 23: Simon Says (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "simon-says",
    title: "Simon Says — onthoud de reeks",
    description: "Een echte arcade-klassieker: 4 gekleurde LEDs lichten op in een reeks die elke ronde langer wordt — kan jij hem foutloos naspelen? Met buzzer-tonen per kleur en oplopende moeilijkheid.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, breadboard + jumpers, 4× LED (rood, groen, blauw, geel), 4× 220Ω weerstand, 4× drukknop, 1× passieve buzzer.",
    board: "arduino",
    tags: ["game"],
    learningGoal: "Werken met arrays om een reeks op te slaan, `random()` met `randomSeed()` correct gebruiken, herbruikbare helper-functies schrijven, en spelers-input vergelijken met een verwachte sequentie.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "sim-s1",
        title: "Hardware-test: 4 LEDs, 4 knoppen en een buzzer",
        content: "We bouwen Simon Says volledig op. Eerst alle hardware aansluiten en testen. Sluit 4 LEDs aan op pin 8..11 (elk met een 220Ω weerstand naar GND), 4 drukknoppen op pin 2..5 (de andere kant van elke knop naar GND — we gebruiken `INPUT_PULLUP`, geen externe weerstand nodig), en een passieve buzzer op pin 12. De `setup()` knippert eenmalig alle LEDs zodat je weet dat alles goed zit.",
        diagram: true,
        code: sim_s1,
        legend: [
          { term: "INPUT_PULLUP", desc: "Interne pull-up: pin leest standaard HIGH, wordt LOW als de knop ingedrukt is. Geen extra weerstand nodig." },
          { term: "passieve buzzer", desc: "Heeft GEEN eigen oscillator — je moet zelf de frequentie aansturen met `tone()`. Een actieve buzzer maakt altijd dezelfde toon." },
          { term: "pinMode(..., OUTPUT)", desc: "Vertel de Arduino dat deze pin stroom levert (voor de LEDs en buzzer)." },
          { term: "delay(500)", desc: "Korte pauze zodat je het knipperen ook echt ziet als hardware-test." },
        ],
        assignment: "Sluit alles aan zoals het schema laat zien. Upload. Bij opstart moeten alle 4 LEDs een halve seconde tegelijk branden. Werkt er een niet? Check: weerstand verkeerd om, LED kant verkeerd (lange poot = +), of pin verkeerd.",
        challenge: "Pas `setup()` zo aan dat hij de LEDs één voor één aanknippert (rood → groen → blauw → geel) in plaats van allemaal tegelijk. Hint: je hebt 4× `digitalWrite` + `delay()` nodig.",
        reflection: "Waarom is het zo handig dat we elke knop een naam (`knopRood` etc.) geven in plaats van overal het pinnummer te typen?",
      },
      {
        id: "sim-s2",
        title: "Een willekeurige reeks opbouwen met een array",
        content: "De kern van Simon Says is een **groeiende reeks van kleuren**. We slaan deze op in een array `reeks[]` waarin elke positie een kleurnummer (0..3) bevat. Elke ronde voegen we een willekeurige kleur toe met `random(0, 4)`. **Cruciaal**: `randomSeed(analogRead(A0))` — zonder dit zaadje krijg je elke keer dezelfde 'willekeurige' getallen omdat de Arduino bij start altijd in dezelfde toestand zit.",
        code: sim_s2,
        legend: [
          { term: "const int MAX_REEKS = 50", desc: "Maximale reekslengte. Een array moet bij compileren al een vaste grootte hebben." },
          { term: "int reeks[MAX_REEKS]", desc: "De array zelf: 50 plekken, één per stap in de reeks." },
          { term: "int reeksLengte = 0", desc: "Hoeveel plekken zijn op dit moment écht gevuld. Niet hetzelfde als de array-grootte!" },
          { term: "random(0, 4)", desc: "Een random getal: 0, 1, 2 of 3 (4 is exclusief). Past perfect bij onze 4 kleuren." },
          { term: "randomSeed(analogRead(A0))", desc: "Lees ruis van een ongebruikte analoge pin als 'zaadje' voor random-getallen." },
        ],
        assignment: "Upload, open Serial Monitor (9600 baud). Elke seconde verschijnt 'Reeks is nu N stappen lang.' De Arduino bouwt nu een interne reeks op — alleen kunnen we hem nog niet zien.",
        challenge: "Print óók de hele reeks: voeg een for-loop toe die `Serial.print(reeks[i])` voor elke stap doet. Zo zie je dat de reeks elke ronde groeit met één random kleur.",
        reflection: "Wat zou er gebeuren als je `randomSeed(...)` weg laat? Probeer het: reset de Arduino een paar keer en kijk of de reeks (in de Serial Monitor) elke keer hetzelfde is.",
      },
      {
        id: "sim-s3",
        title: "Reeks afspelen: LED + toon per kleur",
        content: "Tijd om de reeks ook *zichtbaar* te maken. We schrijven twee helper-functies: `ledVan(kleur)` geeft de juiste pin terug, `toonVan(kleur)` de bijbehorende toonhoogte (4 noten zoals bij de échte Simon). Dan combineert `speelKleur()` LED + `tone()` voor één korte 'flash'. Bonus: we maken het tempo iets sneller naarmate de reeks groeit — moeilijker dus.",
        diagram: true,
        code: sim_s3,
        legend: [
          { term: "int ledVan(int kleur)", desc: "Helper-functie: geef een kleurnummer en krijg de bijbehorende LED-pin terug." },
          { term: "tone(buzzerPin, freq, duur)", desc: "Speel een toon van `freq` Hz gedurende `duur` ms op de buzzer. Werkt alleen met passieve buzzer." },
          { term: "max(150, 500 - reeksLengte * 20)", desc: "Tempo wordt sneller per ronde, maar nooit korter dan 150 ms — anders wordt het onspeelbaar." },
          { term: "262, 330, 392, 523", desc: "Frequenties van C, E, G, hoge C — een open mineur-akkoord, klinkt aangenaam." },
        ],
        assignment: "Upload. Bij elke ronde wordt een nieuwe kleur toegevoegd en de hele reeks wordt gespeeld (LED + toon). Tel mee: ronde 5 = 5 kleuren in een rij.",
        challenge: "Maak een **'attentie'-tone** vóór elke nieuwe ronde: speel een korte hoge piep (`tone(buzzerPin, 1000, 80)`) zodat de speler weet dat het zo begint.",
        reflection: "We hergebruiken `ledVan()` en `toonVan()` straks bij het uitlezen van knoppen. Waarom is het slim om dit nu al als losse functies te schrijven, in plaats van overal `if/else if`-ketens?",
      },
      {
        id: "sim-s4",
        title: "Speler-input vergelijken & game over",
        content: "De laatste stap maakt het écht een spel. Na het afspelen van de reeks moet de speler hem naspelen. We schrijven `wachtOpKnop()` die blocking wacht tot een knop ingedrukt wordt (of een time-out van 5 sec). Dan vergelijken we elke knopdruk met `reeks[i]`. Eén foutje of te lang nadenken → `gameOver()`: trieste lage toon, alle LEDs knipperen, en de reeks reset naar 0.",
        code: sim_s4,
        legend: [
          { term: "while (digitalRead(knopRood) == LOW);", desc: "Wacht tot de knop weer LOSGELATEN is. Voorkomt dat één lange druk telt als 5 drukken." },
          { term: "wachtOpKnop(5000)", desc: "Time-out van 5 sec. Geeft -1 terug bij niets — wat we als 'fout' interpreteren." },
          { term: "if (gedrukt != reeks[i]) gameOver();", desc: "Vergelijk wat de speler doet met wat de reeks zegt. Bij verschil: einde." },
          { term: "tone(buzzerPin, 110, 600)", desc: "Lage toon (110 Hz = A2) als 'sad trombone' bij verlies. Korte hoge piepjes bij winst." },
          { term: "reeksLengte = 0", desc: "Reset het spel zodat de volgende ronde weer met 1 kleur begint." },
        ],
        assignment: "Upload en speel! Hoe ver kom je? Tip: kleuren in groepjes onthouden helpt veel. Foutmoment? De LEDs knipperen 3x en je begint opnieuw.",
        challenge: "Sla je hoogste score op in een variabele `besteScore` en geef bij verbetering een speciale 'fanfare' (3 oplopende tonen) in plaats van de gewone juich-tonen.",
        reflection: "Een echte Simon Says houdt de scores bij ook na uitschakelen. Hoe zou je dat hier doen? (Hint: `EEPROM.put()`/`EEPROM.get()` — net als bij de reactietijd-tester.) Waarom is EEPROM een logische keuze en flash-geheugen niet?",
        optionalCodeTitle: "Snippet: een 'startsignaal' voordat de speler aan de beurt is",
        optionalCode: `// Een korte cue zodat de speler weet: nu mag jij!
void speler_aan_de_beurt() {
  digitalWrite(ledRood,  HIGH); digitalWrite(ledGroen, HIGH);
  digitalWrite(ledBlauw, HIGH); digitalWrite(ledGeel,  HIGH);
  tone(buzzerPin, 1500, 80);
  delay(120);
  digitalWrite(ledRood,  LOW); digitalWrite(ledGroen, LOW);
  digitalWrite(ledBlauw, LOW); digitalWrite(ledGeel,  LOW);
}

// Roep speler_aan_de_beurt() aan vlak voor de for-loop met wachtOpKnop().`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 24: Whack-a-mole (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "whack-a-mole",
    title: "Whack-a-mole — mep de mol",
    description: "Een willekeurige LED licht op — druk de juiste knop voordat hij uit gaat. Score loopt op, tempo neemt toe, en na 5 missers ben je af. Klassiek kermis-spel met 5 LEDs en een LCD-scherm.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, breadboard + jumpers, 5× LED + 5× 220Ω weerstand, 5× drukknop, 1× I2C 16x2 LCD-display.",
    board: "arduino",
    tags: ["game", "display"],
    learningGoal: "Arrays gebruiken om identieke pinnen samen te beheren, een non-blocking timer met `millis()` toepassen, edge-detectie op meerdere knoppen tegelijk doen, en moeilijkheidsgraad dynamisch aanpassen.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "wam-s1",
        title: "Hardware-test: knop stuurt eigen LED",
        content: "Voor we begint met spel-logica: even alles testen. Sluit 5 LEDs aan op pin 8..12 (elk met 220Ω weerstand) en 5 knoppen op pin 2..6. Het I2C-LCD heeft maar 4 draadjes (VCC, GND, SDA→A4, SCL→A5). Deze test-sketch maakt elke knop direct zijn eigen LED aan/uit — handige sanity-check zodat je weet dat álles correct zit voordat we het spel bouwen.",
        diagram: true,
        code: wam_s1,
        legend: [
          { term: "LiquidCrystal_I2C lcd(0x27, 16, 2)", desc: "Maak een LCD-object op I2C-adres 0x27 (vaak), 16 kolommen × 2 rijen. Werkt het niet? Probeer 0x3F." },
          { term: "lcd.init() / lcd.backlight()", desc: "Initialiseer + zet de blauwe achtergrondverlichting aan." },
          { term: "digitalRead(knopPin1) == LOW ? HIGH : LOW", desc: "Ternary: als de knop ingedrukt is, schrijf HIGH naar de LED, anders LOW. In één regel." },
          { term: "INPUT_PULLUP", desc: "Pin standaard HIGH. Knop ingedrukt = LOW. Geen externe weerstand nodig." },
        ],
        assignment: "Sluit alles aan, upload. Het LCD toont 'Whack-a-mole!' en elke knopdruk maakt de bijbehorende LED aan/uit. Werkt LED 3 niet? Check zijn weerstand en oriëntatie. Werkt knop 4 niet? Controleer of beide pootjes goed in het breadboard zitten.",
        challenge: "Pas de test aan zodat elke knop een toon op een buzzer (pin 13) afspeelt — gebruik `tone(13, 500 + i * 100, 50)` voor 5 verschillende toonhoogtes.",
        reflection: "Wat is het voordeel van pin 8..12 voor LEDs en pin 2..6 voor knoppen, in plaats van alles door elkaar te gebruiken? (Hint: denk aan structuur en arrays.)",
      },
      {
        id: "wam-s2",
        title: "Random mol + non-blocking timer",
        content: "Nu de spel-logica. Eerst: één random LED brandt 1 seconde lang, dan springt hij naar een nieuwe positie. **Belangrijk**: we gebruiken `millis()` in plaats van `delay()` zodat we tegelijk de knoppen kunnen blijven uitlezen (in de volgende stap). We zetten ook alle pins netjes in arrays `leds[]` en `knoppen[]` — dan kunnen we gewoon `leds[3]` typen in plaats van `ledPin4`.",
        code: wam_s2,
        legend: [
          { term: "int leds[5]", desc: "Array van 5 pin-nummers. We vullen 'em in setup() met de losse `ledPinN`-variabelen." },
          { term: "actieveMol", desc: "Index (0..4) van welke mol nu omhoog steekt. -1 = geen." },
          { term: "molTotMillis = millis() + molDuurMs", desc: "Deadline: het tijdstip waarop de mol weer onderduikt. Sla op, vergelijk later." },
          { term: "if (millis() >= molTotMillis)", desc: "Non-blocking check: pas iets doen als de tijd voorbij is, zonder de loop te blokkeren." },
          { term: "random(0, 5)", desc: "Random getal 0..4 (5 is exclusief) — kies een van de 5 LEDs." },
        ],
        assignment: "Upload. Een random LED brandt 1 sec, dan springt hij naar een ander. Lijkt op een ouderwetse pinball-flipper-show.",
        challenge: "Pas `molDuurMs` aan in `setup()`: probeer 300 (heel snel) en 2000 (heel relaxed). Wat is een leuk tempo om mee te starten?",
        reflection: "Waarom gebruiken we `millis()` met `if`-checks in plaats van `delay()`? Wat zou er gebeuren als we `delay(1000)` hier zouden gebruiken? (Hint: probeer eens een knop in te drukken tijdens een delay — er gebeurt niks.)",
      },
      {
        id: "wam-s3",
        title: "Scoring: juiste knop = +1, anders = miss",
        content: "Nu maken we het spel echt. Elke loop checken we **alle 5 knoppen** met edge-detectie (alleen op het moment van indrukken — niet zolang hij ingedrukt blijft). Drukt de speler de knop die bij `actieveMol` hoort? +1 punt en direct nieuwe mol. Anders → +1 mis. Een te late reactie (timer afgelopen zonder druk) telt óók als mis. De score komt live op het LCD.",
        code: wam_s3,
        legend: [
          { term: "int vorigeKnop[5] = {HIGH, ...}", desc: "Array met de vorige stand van elke knop. Begint allemaal op HIGH (los)." },
          { term: "vorigeKnop[i] == HIGH && huidig == LOW", desc: "Edge-detectie: alleen +1 op de OVERGANG van los → ingedrukt. Anders zou 1 lange druk = 100 punten worden." },
          { term: "if (i == actieveMol)", desc: "De speler drukte de knop die bij de actieve mol hoort → punt!" },
          { term: "else { gemist++; }", desc: "Verkeerde knop → miss. Zo straffen we wild op alles drukken af." },
          { term: "lcd.print(\"   \")", desc: "Spaties achter het getal overschrijven oude tekens (anders wordt 10 → 19 → 100 een puinhoop)." },
        ],
        assignment: "Upload, speel! Probeer 30 punten te halen zonder meer dan 5 missers. De score wordt live bijgewerkt op de tweede regel.",
        challenge: "Voeg een **combo-systeem** toe: bij 3 punten op rij zonder mis krijg je een bonus van +2. Bij een mis reset de combo-teller weer naar 0.",
        reflection: "Waarom moeten we `vorigeKnop[i] = huidig;` BUITEN de if-statement zetten — dus altijd, niet alleen bij een match? Probeer het te verplaatsen en kijk wat er gebeurt.",
      },
      {
        id: "wam-s4",
        title: "Tempo dat versnelt + game over",
        content: "Laatste stap: dynamische moeilijkheid. Per 5 punten wordt de mol-duur 100 ms korter (van 1200 → minimum 250 ms). Na 5 missers: game over. Het scherm toont je eindscore en alle LEDs knipperen oneindig — pas na een Arduino-reset begin je opnieuw. Dit is de complete arcade-versie.",
        code: wam_s4,
        legend: [
          { term: "molDuurMs = max(MIN_DUUR, 1200 - (score / 5) * 100)", desc: "Per 5 punten: 100ms korter. `max(...)` zorgt dat we nooit onder 250 ms gaan." },
          { term: "const int MAX_GEMIST = 5", desc: "Stel de gameover-drempel in op één plek — makkelijk te tweaken." },
          { term: "while (true)", desc: "Oneindige lus: knipperen tot de Arduino wordt gereset. Het programma zit hier voor altijd vast." },
          { term: "lcd.clear()", desc: "Wis het volledige scherm. Veiliger dan met spaties overschrijven als je een nieuwe layout wilt tonen." },
        ],
        assignment: "Upload, speel een paar potjes. Hoe ver kom je voor de mol te snel wordt? Schrijf je hoogste score op het bord met krijt — klassentoernooi.",
        challenge: "Maak een **'level up'-melding** wanneer je een nieuwe snelheid bereikt. Toon 'Level 2!' op rij 1 voor 1 seconde wanneer score 5, 10, 15... bereikt. Tip: check of `score % 5 == 0 && score > 0`.",
        reflection: "Een echte arcade-machine slaat de top-10 scores op. Hoe zou je dat hier doen? (Hint: array van `int topScores[10]` + EEPROM voor persistentie. Bij nieuwe score: vergelijk met de hele lijst, schuif lager-scorende plekken op.)",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 25: Elektronische dobbelsteen (Beginner)
  // ─────────────────────────────────────────────
  {
    id: "dobbelsteen-roller",
    title: "Elektronische dobbelsteen-roller",
    description: "Een dobbelsteen die je nooit kwijtraakt: druk op de knop, 7 LEDs in dobbelsteen-patroon 'rollen' kort en stoppen op een willekeurig getal van 1 t/m 6. Perfect voor bordspellen.",
    difficulty: "Beginner",
    materials: "Arduino Uno, breadboard + jumpers, 7× LED + 7× 220Ω weerstand, 1× drukknop.",
    board: "arduino",
    tags: ["game"],
    learningGoal: "Een 2D-array gebruiken om patronen op te slaan, `random()` voor onvoorspelbare uitkomsten, knop-debounce met edge-detectie, en een 'shuffle'-animatie schrijven met `millis()`.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "dice-s1",
        title: "7 LEDs als dobbelsteen-patroon",
        content: "Een echte dobbelsteen heeft maximaal 7 stippen-posities (4 hoeken + 2 zijkanten + 1 midden). We bouwen die fysiek na met 7 LEDs in dit patroon:\n```\n1 . 2     ← linksboven & rechtsboven\n3 7 4     ← links & rechts midden, en LED 7 in het midden\n5 . 6     ← linksonder & rechtsonder\n```\nVoor elke worp 1..6 weten we welke combinatie LEDs aan moet. Dat slaan we op in een **2D-array**: `patroon[worp][led]`. De sketch loopt alle 6 worpen langs zodat je kunt zien dat je layout klopt.",
        diagram: true,
        code: dice_s1,
        legend: [
          { term: "int leds[7]", desc: "Array van pin-nummers. Index 0 = LED 1, index 6 = LED 7 (de middelste)." },
          { term: "bool patroon[7][7]", desc: "2D-array: 7 rijen (één per worp), elk 7 booleans (welke LEDs aan). De 7e rij is een test-patroon: alles aan." },
          { term: "{ 1, 1, 0, 0, 1, 1, 0 }", desc: "Worp 4: 4 hoeken aan, midden uit. De positie in deze rij komt overeen met `leds[]`." },
          { term: "rij = n - 1", desc: "Vertaal worp (1..6) naar array-index (0..5). Arrays zijn 0-indexed." },
        ],
        assignment: "Bouw het patroon volgens het schema: ledPin1 = linksboven, ledPin7 = midden, etc. Upload. Elke 800 ms zie je een nieuwe worp 1 → 6 → 1 → 6 ... Check of elke worp het juiste dobbelsteen-patroon vormt.",
        challenge: "Voeg een 7e bedoelde 'worp' toe: bij worp 0 (of een speciale waarde 7) gaan ALLEEN de twee diagonale midden-LEDs aan. Komt niet voor in echte dobbelstenen, maar leuk om te bedenken.",
        reflection: "Waarom is een 2D-array hier zo handig? Bedenk hoe je dit zou doen met alleen losse `if`-statements — hoeveel regels code zou dat zijn?",
      },
      {
        id: "dice-s2",
        title: "Knop-druk = random worp",
        content: "Nu maken we hem échte interactief. Knop op pin 9 (andere pootje → GND). Elke keer dat je drukt, kiest `random(1, 7)` een nieuw getal 1..6 en tonen we het patroon. Cruciaal is **edge-detectie**: zonder die check zou een vasthouden van de knop honderden worpen per seconde genereren. We onthouden `vorigeKnop` en triggeren alleen op de OVERGANG van HIGH naar LOW.",
        diagram: true,
        code: dice_s2,
        legend: [
          { term: "random(1, 7)", desc: "Random getal: 1, 2, 3, 4, 5 of 6 (7 is exclusief). Precies het bereik van een dobbelsteen." },
          { term: "vorigeKnop == HIGH && huidig == LOW", desc: "Edge-detectie: alleen op het exacte moment van indrukken. Niet terwijl hij ingedrukt blijft." },
          { term: "delay(20)", desc: "Simpele debounce: knoppen 'stuiteren' bij indrukken (5–10 ms ruis), 20 ms wachten filtert dat weg." },
          { term: "randomSeed(analogRead(A0))", desc: "Lees ruis van een ongebruikte analoge pin als 'zaadje'. Zonder dit altijd dezelfde reeks worpen na opstart." },
        ],
        assignment: "Upload. Druk op de knop. Het patroon springt naar een nieuwe worp. Druk 20x — krijg je een mooie verdeling 1..6? Of valt hij vaak op hetzelfde getal? (Bij ~3 keer per getal = goed.)",
        challenge: "Geef de knop een leuke feedback: laat alle 7 LEDs heel kort tegelijk flitsen (50 ms) net vóór de nieuwe worp verschijnt — een soort 'click'-animatie.",
        reflection: "Waarom geeft `random()` zonder `randomSeed()` elke keer dezelfde reeks na een Arduino-reset? Wat is het kernprobleem van computers en 'echt willekeurig'?",
      },
      {
        id: "dice-s3",
        title: "Shuffle-animatie maakt het écht een dobbelsteen",
        content: "Een echte dobbelsteen rolt eerst en stopt dan. Onze digitale versie krijgt nu hetzelfde gevoel: bij een knopdruk tonen we een halve seconde lang **snel wisselende random getallen** (met `millis()`-loop), pas dan komt de definitieve worp. Dit voelt veel bevredigender dan 'instant uitkomst' en geeft de speler tijd om te bouwen op spanning. Optioneel: voeg een buzzer-tic toe per shuffle.",
        code: dice_s3,
        legend: [
          { term: "void shuffleAnimatie(int totaalMs)", desc: "Helper-functie: toon `totaalMs` lang snel-wisselende random getallen. Herbruikbaar." },
          { term: "unsigned long stop = millis() + totaalMs", desc: "Bereken de eind-tijd. `unsigned long` voorkomt overflow-gedoe bij grote getallen." },
          { term: "while (millis() < stop)", desc: "Loop tot de tijd voorbij is. Niet-blokkerend van buiten gezien." },
          { term: "delay(60)", desc: "60 ms tussen frames = ~16 frames per seconde. Snel genoeg dat het 'rolt', langzaam genoeg dat je elk getal ziet." },
        ],
        assignment: "Upload. Druk op de knop. Je ziet nu een halve seconde 'rollende' getallen, dan stopt het op de definitieve worp. Voelt veel beter, toch?",
        challenge: "Voeg een buzzer (pin 13) toe en speel een korte `tone(13, 1000, 30)` per frame in de shuffle-loop. Klinkt als een echte digitale dobbelsteen-machine.",
        reflection: "Waarom is de shuffle-animatie pure 'show' — de uitkomst wordt pas ná de animatie bepaald? Wat zou er veranderen als we de uitkomst tijdens de shuffle al berekenden? (Hint: niets, behalve dat `random()` extra werk doet.)",
        optionalCodeTitle: "Snippet: 2 dobbelstenen op een LCD",
        optionalCode: `// Voor bordspellen waar je 2 dobbelstenen nodig hebt (Mens-erger-je-niet, Monopoly).
// Sluit een I2C LCD aan en vervang de toonGetal()-aanroep door:

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

void toon2Dobbelstenen() {
  int d1 = random(1, 7);
  int d2 = random(1, 7);
  lcd.clear();
  lcd.print("Worp: ");
  lcd.print(d1);
  lcd.print(" + ");
  lcd.print(d2);
  lcd.setCursor(0, 1);
  lcd.print("Totaal: ");
  lcd.print(d1 + d2);
}`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 26: Schaakklok (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "schaakklok",
    title: "Schaakklok voor 2 spelers",
    description: "Bouw een werkende schaakklok: 2 knoppen, 2 timers, mm:ss-display en alarm bij 0:00. Na de les meteen bruikbaar voor échte schaakpartijen — of voor andere bordspellen waar tijd telt.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, breadboard + jumpers, 1× I2C 16x2 LCD-display, 3× drukknop (2 spelers + reset), 1× passieve buzzer.",
    board: "arduino",
    tags: ["game", "display"],
    learningGoal: "`millis()` gebruiken voor non-blocking countdown, `unsigned long` correct hanteren tegen overflow, een state-machine bouwen (stopped/speler1/speler2/gameover), en delta-tijd correct aftrekken.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "chess-s1",
        title: "Hardware-test: LCD + 2 knoppen",
        content: "Sluit aan: I2C LCD (4 draadjes — VCC, GND, SDA→A4, SCL→A5), drukknop speler 1 op pin 2 (andere kant naar GND), drukknop speler 2 op pin 3, en een passieve buzzer op pin 8. Deze test-sketch toont '5:00' voor beide spelers — nog niet aftellen, gewoon zorgen dat het scherm werkt en de pinnen kloppen.",
        diagram: true,
        code: chess_s1,
        legend: [
          { term: "LiquidCrystal_I2C lcd(0x27, 16, 2)", desc: "I2C-adres 0x27 (vaak), 16 kolommen × 2 rijen. Werkt het niet? Probeer 0x3F." },
          { term: "lcd.setCursor(0, 0)", desc: "Spring naar kolom 0, rij 0 (eerste regel). Coördinaten zijn 0-indexed." },
          { term: "INPUT_PULLUP", desc: "Geen extra weerstand nodig. Knop los = HIGH, ingedrukt = LOW." },
          { term: "passieve buzzer", desc: "Heeft géén eigen oscillator — gebruikt straks `tone()` voor het alarm." },
        ],
        assignment: "Sluit alles aan, upload. Het LCD moet 'Speler 1: 05:00' op rij 1 en 'Speler 2: 05:00' op rij 2 tonen. Geen reactie? Check de I2C-adres of zie de aansluit-instructies in de I2C LCD tutorial.",
        challenge: "Maak de tekst korter: 'P1 05:00' en 'P2 05:00'. Bedenk waarom dat handig kan zijn als we straks ook seconden-aftellen tonen — meer ruimte voor extra info.",
        reflection: "Waarom 5 minuten per speler? In Blitz-schaak is 3 of 5 min standaard. Welke andere bordspellen kennen jij waar tijd-druk belangrijk is?",
      },
      {
        id: "chess-s2",
        title: "Aftellen met millis() — non-blocking",
        content: "Het hart van een schaakklok: tijd correct aftellen zonder de loop te blokkeren. We gebruiken `unsigned long` om milliseconden bij te houden (groot genoeg voor 49 dagen — overflow geen probleem voor één partij). De truc is **delta-tijd**: we onthouden `vorigeMillis`, berekenen elke loop hoeveel tijd er verstreken is, en trekken dat af van de actieve speler. Voor nu staat `actieveSpeler` standaard op 1 — speler 1's klok loopt automatisch.",
        code: chess_s2,
        legend: [
          { term: "unsigned long tijd1 = 5UL * 60UL * 1000UL", desc: "5 min in ms. `UL` = unsigned long literal — anders berekent Arduino dit als 16-bit `int` en krijg je overflow." },
          { term: "unsigned long delta = nu - vorigeMillis", desc: "Verstreken tijd sinds de vorige loop. Werkt zelfs over de millis()-overflow heen, mits beide unsigned long zijn." },
          { term: "if (tijd1 > delta) tijd1 -= delta;", desc: "Veilig aftrekken: voorkom dat we onder 0 zakken (unsigned wraparound = enorm groot getal!)." },
          { term: "minuten = sec / 60; seconden = sec % 60", desc: "Klassieke deling + modulo: 137 sec = 2 min 17 sec." },
          { term: "if (seconden < 10) lcd.print('0')", desc: "Voorloop-nul: '02' i.p.v. '2'. Zonder dit krijg je '5:7' i.p.v. '05:07'." },
        ],
        assignment: "Pas in de code `actieveSpeler = 1;` toe (in setup, of gewoon hardcoderen). Upload. Speler 1's tijd telt af van 05:00. Bij 04:59, 04:58... soepel. Speler 2 blijft op 05:00.",
        challenge: "Verander de starttijd naar 3 min en geef speler 2 4 min (handicap-modus voor een sterkere tegenstander). Tip: pas alleen de twee initialisaties van `tijd1` en `tijd2` aan.",
        reflection: "Waarom werkt `nu - vorigeMillis` ook correct ná ~49 dagen wanneer `millis()` overflowt? Antwoord: omdat `unsigned long`-aftrekken modulo werkt — het verschil blijft kloppen.",
      },
      {
        id: "chess-s3",
        title: "Knoppen wisselen de actieve speler",
        content: "Nu de magie: druk je eigen knop = jouw klok stopt, tegenstander start. Dit is hét principe van een schaakklok. Bij eerste druk start de partij (vanuit `stopped`-state). Knop indrukken = klein 'klik'-toontje voor feedback. We gebruiken edge-detectie zodat één lange druk niet 100x wisselt. Reset-knop volgt in de laatste stap.",
        diagram: true,
        code: chess_s3,
        legend: [
          { term: "actieveSpeler = 0/1/2", desc: "State machine: 0 = klok niet gestart, 1 = speler 1 aan zet, 2 = speler 2 aan zet." },
          { term: "vorigeKnop1 == HIGH && huidig1 == LOW", desc: "Edge-detectie: trigger alleen op de OVERGANG van los → ingedrukt." },
          { term: "if (actieveSpeler == 0) actieveSpeler = 2;", desc: "Bij eerste druk op P1's knop: P1 is klaar, dus P2 begint. Klassiek schaak-protocol." },
          { term: "tone(buzzerPin, 1200, 50)", desc: "Korte hoge piep van 50 ms — auditieve feedback bij elke druk." },
          { term: "delay(50)", desc: "Soepele update zonder CPU te slopen. mm:ss verandert maar 1x per seconde." },
        ],
        assignment: "Upload. Druk knop 1 → speler 2's klok loopt. Druk knop 2 → speler 1's klok loopt. Druk knop 1 weer → terug naar speler 2. Test of de tijd niet sprongsgewijs verandert maar soepel doortikt.",
        challenge: "Voeg **anti-double-click** toe: als de andere speler vlak na zijn drukbeurt nóg eens drukt op zijn eigen knop, gebeurt er niks (alleen de tegenstander mag wisselen). Hint: check `if (actieveSpeler != 1)` voordat je iets doet bij knop 1.",
        reflection: "Waarom is edge-detectie hier essentieel? Probeer eens een knop ingedrukt te houden — wat zou er gebeuren zonder de `vorigeKnop`-check? (Antwoord: 100x per seconde wisselen → klok lijkt te stilstaan.)",
      },
      {
        id: "chess-s4",
        title: "Reset-knop, alarm bij 0:00, en pijl-indicator",
        content: "Drie laatste verbeteringen voor een **complete** schaakklok:\n\n1. **Reset-knop op pin 4** — altijd bruikbaar om opnieuw te beginnen (5 min, alle klokken op stop).\n2. **Alarm bij 0:00** — `gameOver`-state: pieptoon blijft aan, geen knop-wisselen meer mogelijk. Pas reset-knop maakt het stil.\n3. **Pijl-indicator** — een '>' op de regel van de actieve speler. Veel duidelijker dan alleen de tijden vergelijken.\n\nDit is de versie die je écht naast je schaakbord kunt leggen.",
        code: chess_s4,
        legend: [
          { term: "const unsigned long START_TIJD", desc: "Centraal de starttijd. Aanpassen voor blitz (3 min), bullet (1 min), klassiek (10 min) — één plek." },
          { term: "bool gameOver = false", desc: "Status-flag. Eenmaal true: knoppen werken niet meer voor de partij, alleen reset." },
          { term: "if (tijd1 > delta) ... else { tijd1 = 0; gameOver = true; }", desc: "Bij verstrijken van de tijd: zet exact op 0 én markeer game over. Voorkomt negatieve restwaarde." },
          { term: "lcd.print(actief ? '>' : ' ')", desc: "Pijl-indicator: ternary geeft '>' bij actieve speler, anders een spatie zodat de layout intact blijft." },
          { term: "tone(buzzerPin, 880)", desc: "Continue toon (geen duur opgegeven). Stopt pas met `noTone()` — wat de reset-functie doet." },
        ],
        assignment: "Upload. Speel een 'snelle test-partij' van 30 sec per kant (pas `START_TIJD` tijdelijk aan naar 30000UL). Druk je eigen knop = wisselen. Loopt jouw tijd op 0 → continu alarm + 'GAME OVER'-indicatie. Druk reset → opnieuw 5 min.",
        challenge: "Voeg **byo-yomi** toe (Japans schaak-/go-format): als je tijd op 0 dreigt te raken (< 10 sec) krijg je elke keer 5 sec extra na een drukbeurt. Tip: `if (actieveSpeler == 1) tijd1 += 5000;` bij wisselen, alleen onder bepaalde voorwaarde.",
        reflection: "Waarom sla je `START_TIJD` op als `const unsigned long` en niet als `int`? (Hint: 5 min = 300.000 ms — past niet in een 16-bit `int` van Arduino Uno, max 32.767.)",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 27: Battleship op 8x8 LED-matrix (Gevorderd)
  // ─────────────────────────────────────────────
  {
    id: "battleship-matrix",
    title: "Battleship op 8x8 LED-matrix",
    description: "Het klassieke 'Zeeslag' op een echte 8x8 LED-matrix. Joystick beweegt je richtkruis, knopdruk schiet, hit/miss-feedback met blink-patronen, en een win-animatie als alle schepen tot zinken zijn gebracht.",
    difficulty: "Gevorderd",
    materials: "Arduino Uno, breadboard + jumpers, 1× MAX7219 8x8 LED-matrix module, 1× analoge joystick-module (X+Y+SW), 1× extra drukknop (vuur), USB-voeding (matrix kan veel stroom trekken bij volle helderheid). Bibliotheek: 'LedControl' van Eberhard Fahle (via Bibliotheekbeheer).",
    board: "arduino",
    tags: ["game", "display"],
    learningGoal: "Werken met de LedControl-bibliotheek voor een MAX7219, een 2D-game-state in arrays beheren, joystick-input vertalen naar een rooster-cursor, en een complete spel-loop met state, feedback en win-conditie bouwen.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "bs-s1",
        title: "MAX7219 8x8 matrix opzetten",
        content: "De MAX7219 is een chip die 64 LEDs aanstuurt via slechts 3 pinnen (DIN/CLK/CS). De **LedControl**-bibliotheek (installeren via Bibliotheekbeheer) doet alle SPI-communicatie voor je. Je hoeft alleen `setLed(matrix-index, rij, kolom, aan)` aan te roepen. Belangrijk: bij opstart staat de chip in spaarstand → eerst `shutdown(0, false)` om hem wakker te maken, daarna helderheid laag zetten (anders trekt hij véél stroom van je USB).",
        diagram: true,
        code: bs_s1,
        legend: [
          { term: "#include <LedControl.h>", desc: "Externe bibliotheek 'LedControl' — installeer via Schets → Bibliotheek beheren." },
          { term: "LedControl(12, 11, 10, 1)", desc: "Constructor: DIN=12, CLK=11, CS=10, en 1 matrix in serie." },
          { term: "matrix.shutdown(0, false)", desc: "Wakker maken: false = uit spaarstand. Standaard staat de MAX7219 namelijk uit." },
          { term: "matrix.setIntensity(0, 4)", desc: "Helderheid 0..15. **Pas op**: bij 15 trekt de matrix 600+ mA — meer dan een USB-poort kan leveren bij alle LEDs aan." },
          { term: "matrix.setLed(0, rij, kolom, true)", desc: "Zet één LED aan. Eerste 0 = matrix-index (we hebben er maar één)." },
        ],
        assignment: "Sluit aan: VCC → 5V, GND → GND, DIN → pin 12, CLK → pin 11, CS → pin 10. Installeer de LedControl-bibliotheek. Upload. Een diagonale 'streep' loopt van linksboven naar rechtsonder, dan terug. Werkt het niet? Check de bedrading — DIN/CLK/CS verwisselen is een héél vaak gemaakte fout.",
        challenge: "Pas de loop aan zodat hij in plaats van een diagonaal een **vierkant** tekent (rand van 8x8). Tip: 4 nested for-loops, elk voor één zijde.",
        reflection: "Waarom is de MAX7219 zo populair voor LED-matrices? (Hint: 64 LEDs zonder MAX7219 = 64 GPIOs nodig + 64 weerstanden + multiplexing-code. Met MAX7219 = 3 pinnen + 1 weerstand op de chip zelf.)",
      },
      {
        id: "bs-s2",
        title: "Schepen plaatsen + game-data structuren",
        content: "Een spel heeft **state** nodig: data die bewaard wordt tussen loops. We maken twee 8x8 booleaanse arrays: `schip[r][k]` zegt of er een schip ligt, `getroffen[r][k]` of die cel al geraakt is. In `setup()` plaatsen we 4 random scheeps-cellen (geen overlap). Voor uitleg-doeleinden zetten we hier ALLES op 'getroffen' zodat je op het scherm ziet waar de schepen liggen — in stap 4 verwijderen we dat zodat de speler ze écht moet zoeken.",
        code: bs_s2,
        legend: [
          { term: "const int VELD = 8", desc: "Grid-grootte. Door dit als constante te definiëren kun je later makkelijk naar 16x16 schalen." },
          { term: "bool schip[VELD][VELD]", desc: "2D-array van 64 booleans. true = schip-cel, false = water." },
          { term: "while (geplaatst < AANTAL_SCHEPEN)", desc: "Probeer-en-test: pak een random cel; als hij vrij is, plaats het schip; herhaal tot er genoeg geplaatst zijn." },
          { term: "randomSeed(analogRead(A2))", desc: "A2 ligt los → ruis als zaadje. Cruciaal: anders elke partij dezelfde scheeps-locaties." },
          { term: "matrix.setLed(0, r, k, aan)", desc: "Eén cel aan/uit. Hier tonen we alleen schepen die ook geraakt zijn." },
        ],
        assignment: "Upload. De matrix toont 4 random brandende LEDs — dat zijn de schepen. Reset de Arduino een paar keer; door `randomSeed` zou de positie elke keer anders moeten zijn.",
        challenge: "Verander naar **3 schepen van 2 cellen** (totaal 6 cellen). Tip: kies een random startcel + random richting (horizontaal/verticaal), check of beide cellen nog vrij zijn. Veel echter Battleship-gevoel.",
        reflection: "Waarom hebben we drie aparte arrays nodig (`schip`, `getroffen`, en straks `beschoten`)? Wat zou er fout gaan als we alleen één 'getroffen'-array hadden?",
      },
      {
        id: "bs-s3",
        title: "Joystick → knipperend richtkruis",
        content: "Nu komt het leven in het spel: een **richtkruis** dat je met de joystick beweegt. De joystick geeft 0..1023 op X (A0) en Y (A1), met midden ~512. We checken of de stick ver genoeg uit het midden geduwd is (<300 of >700) en passen `cursorRij`/`cursorKol` aan. Belangrijk: niet vaker dan 1x per 200 ms verspringen, anders schiet de cursor voorbij. De cursor knippert (250 ms aan/uit) zodat hij zichtbaar blijft *óver* getroffen schepen heen.",
        diagram: true,
        code: bs_s3,
        legend: [
          { term: "int joystickX = A0; int joystickY = A1", desc: "Joystick X- en Y-as op de twee analoge pinnen." },
          { term: "x < 300 / x > 700", desc: "Dood-zone: alleen reageren als de stick duidelijk uit het midden is — kleine ruis negeren." },
          { term: "millis() - laatsteBeweging < BEWEEG_DELAY", desc: "Throttling: 1 cursor-stap per 200 ms maximum, ongeacht hoe lang je de stick vasthoudt." },
          { term: "matrix.setLed(0, cursorRij, cursorKol, cursorAan)", desc: "Teken de cursor *over* de inhoud heen. Knipperen maakt hem zichtbaar zelfs op een geraakte schip-cel." },
          { term: "if (millis() - laatsteKnipper > 250)", desc: "Toggle de cursor elke 250 ms: 2x per seconde knipperen." },
        ],
        assignment: "Sluit de joystick aan: VCC→5V, GND→GND, VRX→A0, VRY→A1. Upload. Beweeg de stick — de knipperende LED moet 4 kanten op te bewegen zijn. Lukt het niet of beweegt hij verkeerd? Wissel `joystickX` en `joystickY`, of inverteer de check (`<` ↔ `>`).",
        challenge: "Voeg **wrap-around** toe: als de cursor de rechterrand bereikt, verschijnt hij links. Vervang `cursorKol < VELD - 1` door een modulo-truc: `cursorKol = (cursorKol + 1) % VELD`. Voor links: `cursorKol = (cursorKol + VELD - 1) % VELD`.",
        reflection: "Waarom hebben we de knipperende cursor zo gemaakt dat hij over de inhoud heen wordt getekend, in plaats van eronder? (Hint: anders zie je hem niet meer zodra je over een geraakte schip-cel beweegt.)",
      },
      {
        id: "bs-s4",
        title: "Vuur-knop met hit/miss-feedback",
        content: "De vuur-knop op pin 4 (andere kant naar GND) gebruikt edge-detectie zodat één druk = één schot. Bij een treffer (`schip[][]` is true): 3x snel knipperen op de cel, dan blijft hij branden. Bij een mis: korte 'plons'-animatie waarbij de hele rij even oplicht. We onthouden ook welke cellen al beschoten zijn, zodat je niet 2x op dezelfde plek kunt klikken (zou onbedoelde 'cheat' kunnen zijn).",
        diagram: true,
        code: bs_s4,
        legend: [
          { term: "int knopVuur = 4", desc: "Vuur-knop op digitale pin 4. Andere kant naar GND. INPUT_PULLUP voor stabiele input." },
          { term: "bool beschoten[VELD][VELD]", desc: "Derde 2D-array: welke cellen al een schot kregen, om dubbel-schieten te voorkomen." },
          { term: "if (vorigeKnop == HIGH && huidig == LOW) schiet();", desc: "Edge-detectie: één schot per knop-OVERGANG, niet zolang ingedrukt." },
          { term: "hitFeedback() / missFeedback()", desc: "Aparte animaties — voelt heel verschillend aan voor de speler. Hits 'flashen' op de cel; misses tonen 'plons' op de hele rij." },
          { term: "if (beschoten[...]) return;", desc: "Vroeg-terug-patroon: voorkom 2x op dezelfde cel schieten." },
        ],
        assignment: "Sluit de vuur-knop aan op pin 4. Upload. Beweeg met joystick + druk vuur. Een raak schot blijft permanent branden, een mis flikkert kort de hele rij. Probeer een schip te vinden — gebruik de mis-rijen als hint om in te zoomen.",
        challenge: "Voeg een **buzzer** (pin 5) toe: korte hoge piep bij hit (`tone(5, 1500, 100)`), lage 'plons' bij mis (`tone(5, 200, 200)`). Ook al heel arcadig.",
        reflection: "Waarom is de mis-feedback de hele rij in plaats van alleen die ene cel? (Hint: een single-cel mis-flash zou amper te zien zijn naast de knipperende cursor — een hele rij is duidelijk anders.)",
      },
      {
        id: "bs-s5",
        title: "Win-conditie + complete game",
        content: "Laatste stap: de overwinning. Een teller `treffers` houdt bij hoeveel schepen geraakt zijn. Zodra dat `AANTAL_SCHEPEN` is, triggert `winAnimatie()` — een schaakbord-patroon dat 8x toggle-t voor een 'feest'-effect. Daarna toont de matrix permanent ALLE schepen-locaties als trofee. De speler kan de Arduino resetten voor een nieuwe partij. Dit is de complete, speelbare versie.",
        code: bs_s5,
        legend: [
          { term: "int treffers = 0", desc: "Teller die bij elk raak schot omhoog gaat. Vergelijkbaar met de score in andere games." },
          { term: "if (treffers == AANTAL_SCHEPEN)", desc: "Win-conditie: alle schepen vernietigd. Trigger animatie + zet `gewonnen = true`." },
          { term: "((r + k + n) % 2) == 0", desc: "Schaakbord-pattern: even cellen aan, oneven uit. Door `n` te verhogen flipt het patroon = 'flicker'-effect." },
          { term: "if (gewonnen) return;", desc: "Eenmaal gewonnen: niets meer doen in de loop — het win-scherm blijft staan tot reset." },
          { term: "schoten++ vs treffers++", desc: "Twee aparte tellers: `schoten` = totaal aantal pogingen, `treffers` = raak. Verschil = aantal missers — handig voor een 'efficiency'-score." },
        ],
        assignment: "Upload. Speel een complete partij: zoek alle 4 schepen tot de win-animatie komt. Hoe veel schoten had je nodig? Bij 4 = perfect (1-shot kills, geluk!). Bij 64 = je hebt het hele veld leeggeschoten.",
        challenge: "Toon de **score** (totaal schoten) op een aparte LCD óf via Serial Monitor (`Serial.println(schoten)`) op het moment dat je wint. Dan kun je records tussen klasgenoten vergelijken.",
        reflection: "Welke 3 dingen zou je nog kunnen toevoegen om dit een **complete commercial game** te maken? (Voorbeelden: 2-spelers met 2 matrices, schepen langer dan 1 cel, een 'sonar'-functie waarbij de joystick-druk een schip in de buurt verraadt, geluid via DFPlayer, ...)",
        optionalCodeTitle: "Snippet: een 'sonar' die schepen in de buurt verraadt",
        optionalCode: `// Druk op een tweede knop = sonar-puls: alle cellen rondom een schip lichten kort op.
// Voeg een 'sonarKnop' op pin 6 toe en deze functie:

void sonarPuls() {
  for (int r = 0; r < VELD; r++) {
    for (int k = 0; k < VELD; k++) {
      bool dichtbij = false;
      // Check 3x3 buren rond deze cel
      for (int dr = -1; dr <= 1; dr++) {
        for (int dk = -1; dk <= 1; dk++) {
          int nr = r + dr, nk = k + dk;
          if (nr >= 0 && nr < VELD && nk >= 0 && nk < VELD) {
            if (schip[nr][nk]) dichtbij = true;
          }
        }
      }
      if (dichtbij) matrix.setLed(0, r, k, true);
    }
  }
  delay(500);          // toon de sonar-cellen 0,5 sec
  // Daarna: tekenVeld() in volgende loop herstelt de echte stand.
}`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 28: Magic 8-Ball met servo (Beginner)
  // ─────────────────────────────────────────────
  {
    id: "magic-8-ball",
    title: "Magic 8-Ball met servo",
    description: "De klassieke schud-en-vraag 'orakel-bal' nagebouwd: druk op de knop, de servo schudt heen en weer, en het LCD toont een willekeurig antwoord. Perfect als gimmick op je bureau of als grappige opener voor een les.",
    difficulty: "Beginner",
    materials: "Arduino Uno, breadboard + jumpers, 1× I2C 16x2 LCD-display, 1× SG90 servo, 1× drukknop. Optioneel: een leuk balletje of doosje waarin de servo het 'antwoord' onthult.",
    board: "arduino",
    tags: ["game", "motor"],
    learningGoal: "Een array van strings gebruiken voor willekeurige antwoorden, `random()` met `randomSeed()` correct toepassen, een servo aansturen voor 'mechanische feedback', en edge-detectie op een knop doen.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "m8-s1",
        title: "Hardware-test: servo + LCD + knop",
        content: "Voor we de logica bouwen, eerst de hardware testen. Sluit aan: I2C-LCD (4 draadjes — VCC, GND, SDA→A4, SCL→A5), SG90 servo (rood→5V, bruin→GND, oranje→pin 9) en een drukknop op pin 7 (andere kant naar GND, we gebruiken `INPUT_PULLUP`). Bij elke knopdruk wiebelt de servo van 60° naar 120° en terug. Werkt dat? Dan zit alles correct.\n\n**Real-life toepassing:** in een lokaal-deurbel of attentie-systeem doe je hetzelfde — knop indrukken triggert een mechanische actie + visuele melding.",
        diagram: true,
        code: m8_s1,
        legend: [
          { term: "servo1.attach(9)", desc: "Vertel de Servo-bibliotheek dat ons servo-signaal op pin 9 zit. Pin 9/10 zijn de meest gebruikte." },
          { term: "servo1.write(90)", desc: "Stuur de servo naar 90° (midden). Bereik: 0..180°." },
          { term: "INPUT_PULLUP", desc: "Interne pull-up: pin standaard HIGH, ingedrukt = LOW. Geen extra weerstand nodig." },
          { term: "LiquidCrystal_I2C lcd(0x27, 16, 2)", desc: "I2C-adres 0x27 (vaak), 16 kolommen × 2 rijen. Werkt het niet? Probeer 0x3F." },
        ],
        assignment: "Sluit alles aan, upload. Druk de knop = servo wiebelt + LCD blijft 'Druk de knop...' tonen. Werkt de servo niet? Check je 5V/GND-aansluitingen — een SG90 trekt korte stroompiekjes en mag GEEN 3.3V krijgen.",
        challenge: "Pas de 'wiebel'-animatie aan: van 30° naar 150° = grotere zwaai. Wat voelt natuurlijker?",
        reflection: "Waarom `INPUT_PULLUP` in plaats van een externe pull-down weerstand? (Hint: minder bedrading = minder kans op 'losse contact'-fouten.)",
      },
      {
        id: "m8-s2",
        title: "Lijst van antwoorden + random kiezen",
        content: "Nu maken we het écht een Magic 8-Ball. We slaan 8 antwoorden op in een **String-array** `antwoorden[]`. Elke knopdruk kiest `random(0, AANTAL_ANTW)` een willekeurige index en toont dat antwoord op het LCD. Cruciaal: `randomSeed(analogRead(A0))` — een ongebruikte analoge pin geeft elektrische ruis als 'zaadje', anders krijg je elke keer dezelfde 'willekeurige' reeks na een Arduino-reset.",
        code: m8_s2,
        legend: [
          { term: "String antwoorden[AANTAL_ANTW]", desc: "Een array van strings — elke plek bevat één antwoord-zin." },
          { term: "random(0, 8)", desc: "Random getal: 0..7 (8 is exclusief). Past perfect bij onze 8 antwoorden." },
          { term: "randomSeed(analogRead(A0))", desc: "Lees ruis van een ongebruikte analoge pin. Zonder dit elke keer dezelfde reeks na reset." },
          { term: "lcd.clear()", desc: "Wis het hele scherm voor we het nieuwe antwoord tonen — anders mengen letters door elkaar." },
        ],
        assignment: "Upload. Druk de knop — er verschijnt elke keer een ander antwoord. Druk 10x: krijg je een leuke verdeling, of valt hij vaak op hetzelfde?",
        challenge: "Vervang de 8 antwoorden door eigen tekst (bijv. inside-jokes met je klas). Tip: het LCD heeft maar 16 tekens per regel — langere zinnen worden afgekapt.",
        reflection: "Waarom telt `random(0, 8)` t/m 7 en niet t/m 8? Zoek 'zero-based indexing' op — het is een patroon dat in álle programmeertalen terugkomt.",
      },
      {
        id: "m8-s3",
        title: "Schud-animatie met edge-detectie",
        content: "Eindversie: voor het antwoord verschijnt schudt de servo 3 keer heftig heen en weer — net als een echte 8-Ball voor je hem omdraait. Dit voelt bevredigender dan 'instant antwoord'. We gebruiken **edge-detectie** zodat één lange knopdruk niet honderd worpen geeft: alleen op de exacte OVERGANG van HIGH→LOW triggeren we.",
        code: m8_s3,
        legend: [
          { term: "void rollen()", desc: "Helper-functie: 3x heen-en-weer + terug naar midden. Herbruikbaar als je later meer 'schud'-momenten wilt." },
          { term: "vorigeKnop == HIGH && huidig == LOW", desc: "Edge-detectie: trigger alleen op het MOMENT van indrukken. Niet zolang ingedrukt." },
          { term: "delay(120)", desc: "120 ms per zwaai = ~4 zwaaien per seconde. Sneller voelt nerveuzer, langzamer voelt majestueuzer." },
          { term: "delay(20)  // debounce", desc: "Knoppen 'stuiteren' bij indrukken. 20 ms wachten filtert die ruis weg." },
        ],
        assignment: "Upload. Bij elke knopdruk: servo schudt eerst, dan komt het antwoord. Voelt veel echter, toch?",
        challenge: "Voeg een **'thinking'-animatie** toe op het LCD: tijdens de schud-fase tekent het LCD 3 puntjes die één voor één verschijnen ('.', '..', '...').",
        reflection: "De animatie heeft geen invloed op de uitkomst — die wordt pas erna bepaald. Waarom voelt de gebruiker hem dan toch 'eerlijker'? (Dit is het hart van game-feedback design.)",
        optionalCodeTitle: "Snippet: tilt-switch in plaats van een knop",
        optionalCode: `// Een tilt-switch (kogeltje in een buisje) maakt contact als je de bal kantelt.
// Sluit aan zoals een knop (één pin -> pin 7, andere -> GND).
// Code blijft IDENTIEK: de tilt-switch geeft net als een knop een LOW.
// Voordeel: voelt nog meer als een echte 8-Ball — gewoon kantelen!`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 29: Slim plantenwater-systeem (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "plantenwater-systeem",
    title: "Slim plantenwater-systeem",
    description: "Je plant water-geven vergeten? Niet meer! Een capacitieve bodemvocht-sensor meet de aarde, en bij te droog schakelt een relais een 5V-pompje aan voor exact 3 sec. Met max-runtime + cooldown — dus geen ondergelopen klaslokaal.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, breadboard + jumpers, 1× capacitieve bodemvocht-sensor (v1.2 — niet de roest-gevoelige resistieve!), 1× 5V-relais module (1-kanaals), 1× klein 5V-aquarium-pompje (~5W), 1× I2C 16x2 LCD-display, een waterreservoir + slangetje. **Veiligheid: ALLES op 5V/12V DC. Géén 230V in deze tutorial!**",
    board: "arduino",
    tags: ["domotica", "sensor"],
    learningGoal: "Een analoge sensor kalibreren en `map()` gebruiken om naar percentages te converteren, een relais correct ACTIVE-LOW aansturen, en kritische veiligheid (max-runtime + cooldown) in code afdwingen.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "plant-s1",
        title: "Bodemvocht-kalibratie (droog vs nat)",
        content: "De sensor geeft een **ruwe analoge waarde** (0..1023), niet een percentage. We moeten 'm eerst kalibreren: hoe hoog is de waarde als-ie volledig droog is (in de lucht), en hoe laag in een glas water? Die twee uitersten gebruiken we straks om naar 0..100 % te schalen.\n\n**Real-life toepassing:** elke planten-soort heeft een ander 'ideaal' vochtgehalte. Cactussen 10–20%, varens 60+%. Door zelf te kalibreren past je systeem zich aan.",
        diagram: true,
        code: plant_s1,
        legend: [
          { term: "int soilPin = A0", desc: "De sensor's AOUT zit op analoge pin A0. Analoog = waarde 0..1023." },
          { term: "analogRead(soilPin)", desc: "Lees de spanning. Hoge waarde = droog, lage waarde = nat (bij capacitieve sensor)." },
          { term: "Serial.println(ruw)", desc: "Print 1 keer per halve seconde de waarde. Open Serial Monitor (9600 baud)." },
          { term: "capacitief vs resistief", desc: "Capacitief gaat NIET roesten in vochtige aarde. Resistief (de blote koperen prongs) wel — ga voor capacitief." },
        ],
        assignment: "Sluit aan: VCC→5V, GND→GND, AOUT→A0. Upload. Open Serial Monitor. **Houd de sensor in de lucht** = noteer de waarde (= DROOG). **Stop 'm in een glas water tot net onder het lijntje** = noteer (= NAT). Bij de meesten: DROOG ≈ 850–900, NAT ≈ 350–400.",
        challenge: "Kalibreer ook in echte (vochtige) aarde versus echte (droge) aarde. Past de mapping nog?",
        reflection: "Waarom kalibreer je per sensor en niet één keer voor altijd? (Hint: tolerantie tussen sensoren, en aarde verschilt qua mineraal-gehalte → invloed op de meting.)",
      },
      {
        id: "plant-s2",
        title: "Procent-conversie + drempel-logica",
        content: "Met de twee kalibratie-getallen schalen we naar percentages met `map()`. We klemmen het resultaat met `constrain()` zodat negatieve of 100+%-waardes niet voorkomen (kan gebeuren als de sensor net in een andere positie zit). Onder een drempel (bijv. 30%) printen we 'water geven nodig'. **Nog niets pompen!** Eerst de logica testen op de Serial Monitor.",
        code: plant_s2,
        legend: [
          { term: "const int DROOG = 880", desc: "JOUW gemeten droog-waarde uit stap 1. Aanpassen naar wat jij hebt!" },
          { term: "map(ruw, DROOG, NAT, 0, 100)", desc: "Lineair omschalen: DROOG (hoog ruw) → 0 %, NAT (laag ruw) → 100 %. De volgorde van argumenten klopt!" },
          { term: "constrain(procent, 0, 100)", desc: "Veiligheid: klem tussen 0 en 100. Anders kun je negatieve % zien." },
          { term: "DREMPEL_PROCENT = 30", desc: "Onder 30% vocht = water geven. Tweak per plantsoort." },
        ],
        assignment: "Upload. Houd de sensor in lucht → ~0%. Stop in nat papier of vochtige aarde → 50–80%. Werkt de berekening? Pas DROOG/NAT aan als je waardes raar zijn.",
        challenge: "Voeg een **3-zone label** toe: <30% = 'TE DROOG', 30..70% = 'OK', >70% = 'TE NAT' (root rot risico voor sommige planten).",
        reflection: "Waarom is `constrain()` belangrijk? Wat zou `map()` teruggeven als de sensor in een onmogelijk droge omgeving (waarde > DROOG) zit?",
      },
      {
        id: "plant-s3",
        title: "Relais + pomp veilig aansturen",
        content: "Nu het 'doe-iets'-deel: bij te droog → pomp aan via relais. **Drie cruciale veiligheids-regels** in deze stap:\n\n1. **`pinMode(...)` + `digitalWrite(HIGH)` IN setup()**: de meeste hobby-relais zijn ACTIVE-LOW. Zonder dit klikt het relais aan tijdens elke Arduino-reset = ongewilde 3 sec pomp.\n2. **Max-runtime van 3 sec hard-coded**: als de sensor stuk gaat en altijd 'droog' meldt, mag de pomp NOOIT eindeloos doorpompen.\n3. **Cooldown van 1 minuut**: na elke beurt 60 sec wachten — de aarde moet de tijd krijgen om het water te absorberen vóór we opnieuw meten.",
        diagram: true,
        code: plant_s3,
        legend: [
          { term: "int pompPin = 7", desc: "Sluit aan op IN-pin van het relais. Het relais schakelt vervolgens de 5V-pomp." },
          { term: "digitalWrite(pompPin, HIGH)  // = UIT", desc: "ACTIVE-LOW: HIGH = relais open = pomp uit. LOW = dicht = pomp aan. **Verwarrend, dus expliciet noteren!**" },
          { term: "POMP_MAX_MS = 3000UL", desc: "Hard begrensde max-runtime. Sensor-defect mag NOOIT een aquarium veroorzaken." },
          { term: "COOLDOWN_MS = 60000UL", desc: "1 min wachten tussen beurten. Geeft de aarde tijd om water op te nemen." },
          { term: "(nu - laatstePompTijd) > COOLDOWN_MS", desc: "Klassieke `millis()`-pattern: vergelijk verstreken tijd, nooit blokkerend." },
        ],
        assignment: "Sluit het relais aan: IN→pin 7, VCC→5V, GND→GND. Sluit de pomp aan via de NO/COM-contacten van het relais (apart 5V-voeding raden we aan — Arduino USB kan een pomp niet altijd voeden). Upload. Bij 'droge' sensor: pomp gaat 3 sec aan, dan 1 min stilte ook al blijft de sensor droog.",
        challenge: "Voeg een **handmatige knop** toe op pin 4: druk = direct 1 sec extra water (in noodgeval), zonder de cooldown te negeren.",
        reflection: "Waarom is de combinatie 'max-runtime + cooldown' veiliger dan alleen max-runtime? (Hint: stel een sensor blijft 'droog' melden — wat zou er zonder cooldown elk loopje gebeuren?)",
      },
      {
        id: "plant-s4",
        title: "LCD-status: laatste actie + sensor-waarde",
        content: "De plant kan zijn eigen status laten zien op een LCD. Eerste regel: huidige vochtigheid in %. Tweede regel: wat het systeem het laatst gedaan heeft ('Net water gehad', 'Cooldown actief', 'Nat genoeg :)'). Zo zie je in één oogopslag of het systeem werkt — handig voor klas-demonstratie of als zelf-check zonder Serial Monitor.",
        code: plant_s4,
        legend: [
          { term: "String laatsteActie", desc: "Onthoud wat we het laatst deden. Toont op rij 2 van het LCD." },
          { term: "lcd.clear()", desc: "Volledig scherm leegmaken voor we opnieuw schrijven. Voorkomt 'spookletters'." },
          { term: "lcd.setCursor(0, 0)", desc: "Cursor naar kolom 0, rij 0 (eerste regel). 0-indexed." },
          { term: "delay(2000)", desc: "Update om de 2 sec — snel genoeg om responsief te voelen, langzaam genoeg om af te lezen." },
        ],
        assignment: "Upload. Het LCD toont nu live de status. Test: laat de plant droog worden, kijk of de pomp aanslaat én of het LCD de actie netjes meldt.",
        challenge: "Voeg een vierde status toe: 'NOODSTOP' als de pomp 5 keer achter elkaar in 10 min aan moest (= sensor of plant heeft een groter probleem). Pomp-aansturen wordt dan tijdelijk uitgeschakeld tot reset.",
        reflection: "Welke 3 reële risico's blijven er nog over zelfs met deze veiligheid? (Voorbeelden: pomp die droog loopt, slang die loskomt, kabel die loslaat...) Hoe zou je die kunnen detecteren?",
        optionalCodeTitle: "Snippet: water-bijhouden via een tweede sensor",
        optionalCode: `// Tweede sensor in de waterbak: detecteer wanneer er bijgevuld moet worden.
// Sluit aan op A1, gebruik dezelfde droog/nat-mapping.
int waterbakPin = A1;
int waterRuw = analogRead(waterbakPin);
if (waterRuw > 800) {
  // bak bijna leeg
  lcd.setCursor(0, 0);
  lcd.print("WATER BIJVULLEN!");
  // pomp uitschakelen tot bijgevuld
}`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 30: CO₂-meter voor het klaslokaal (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "co2-meter-klaslokaal",
    title: "CO₂-meter voor het klaslokaal",
    description: "Slechte lucht in het lokaal? Een MQ-135-sensor + NeoPixel-strip toont in één oogopslag: groen (frisse lucht), oranje (raam open!), rood (raam open NU + buzzer). Met snooze-knop voor als de leraar al weet dat het slecht is.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, breadboard + jumpers, 1× MQ-135 gas-sensor (budget), 1× WS2812B NeoPixel-strip (8 LEDs is genoeg), 1× passieve buzzer, 1× drukknop (snooze). Optioneel duurder alternatief: SCD30 met échte NDIR-meting (zie 'reflectie' in stap 1 voor uitleg).",
    board: "arduino",
    tags: ["sensor"],
    learningGoal: "Het verschil tussen een goedkope (MQ-135) en een precieze (SCD30) sensor begrijpen, een analoge waarde naar betekenisvolle eenheden mappen, een NeoPixel-strip gebruiken als zone-indicator, en een snooze-mechanisme implementeren met `millis()`.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "co2-s1",
        title: "MQ-135 opwarmen + ruwe waardes",
        content: "**Belangrijk om te weten**: de MQ-135 is een budget-sensor (~€3) die *meerdere* gassen detecteert (CO₂, NH₃, NOx, alcohol...). Hij geeft GEEN exacte ppm — alleen een ruwe analoge waarde die hoger wordt bij meer 'vieze' lucht. Voor échte CO₂-metingen is een SCD30 (~€50, NDIR-technologie) precies. Voor school-context met budget: MQ-135 is voldoende om 'frisse vs slechte lucht' te onderscheiden.\n\n**Cruciaal**: de sensor heeft een **opwarm-tijd van ~1-2 minuten** nodig. De heater binnenin moet op temperatuur komen voor stabiele waardes. Eerste minuut zie je rare schommelingen — die negeren!",
        diagram: true,
        code: co2_s1,
        legend: [
          { term: "int mqPin = A0", desc: "AOUT van de MQ-135 op analoge pin A0." },
          { term: "MQ-135 vs SCD30", desc: "MQ-135 = goedkoop, ruw, niet-CO₂-specifiek. SCD30 = duur, exacte ppm, échte CO₂-meting." },
          { term: "opwarm-tijd 1-2 min", desc: "De interne heater moet op temperatuur komen. Negeer waardes in de eerste minuut!" },
          { term: "5V op VCC", desc: "MQ-135 trekt redelijk veel stroom (~150 mA) door de heater. 3.3V is NIET voldoende." },
        ],
        assignment: "Sluit aan: VCC→5V, GND→GND, AOUT→A0. Upload, open Serial Monitor (9600). Wacht 2 min en let op: waardes stabiliseren rond een vast getal (~150-300 in frisse lucht). Adem dan eens vlak over de sensor — waardes schieten omhoog.",
        challenge: "Houd een fles azijn vlakbij de sensor (NIET aanraken!). Wat gebeurt er? (Spoiler: MQ-135 reageert ook op damp van zuren/alcohol.)",
        reflection: "Waarom is MQ-135 'goed genoeg' voor klaslokaal-monitoring, ook al meet hij niet écht CO₂? (Hint: in een vol lokaal stijgen ALLE menselijke uitstoot tegelijk: CO₂, vocht, lichaamsgeur. Wat de MQ-135 meet correleert sterk met 'aantal mensen × tijd'.)",
      },
      {
        id: "co2-s2",
        title: "Ruwe waarde -> ppm-schatting",
        content: "We zetten de ruwe waarde om naar een ruwe ppm-schatting met `map()`. **Dit is geen wetenschappelijke meting** — de schaal is alleen een hulpmiddel om grenswaardes (800/1200 ppm) te kunnen instellen. Frisse buitenlucht ≈ 400 ppm, ventileer-grens in scholen ≈ 800 ppm, alarm ≈ 1200 ppm.",
        code: co2_s2,
        legend: [
          { term: "int co2Schatting(int ruw)", desc: "Helper-functie. Door 'm los te schrijven kun je 'm hergebruiken in alle volgende stappen." },
          { term: "map(ruw, 100, 900, 400, 2000)", desc: "Ruw 100 -> 400 ppm (frisse lucht), Ruw 900 -> 2000 ppm (slecht). Lineair daartussen." },
          { term: "if (ppm < 400) ppm = 400", desc: "Klemmen: ppm onder 400 is fysiek raar — buitenlucht is altijd ≥400. Voorkom verwarrende negatieve schattingen." },
          { term: "drempels 800 / 1200", desc: "Wereldwijde guideline: <800 = goed, 800-1200 = ventileer, >1200 = NU ventileren." },
        ],
        assignment: "Upload. Wacht 2 min opwarm. Lees in Serial Monitor: rond welke ppm zit jouw lokaal? Adem 30 sec vlak op de sensor — hoe hoog ga je?",
        challenge: "Maak de mapping accurater: meet bij echt-frisse-buitenlucht (raam open, sensor naar buiten houden 5 min) en kalibreer met DAT als '400 ppm' nul-punt.",
        reflection: "Waarom is een lineaire `map()` een **slechte benadering** van de echte ppm-verhouding? (Hint: gas-sensoren zijn meestal logaritmisch in werkelijkheid. De fout kan ±300 ppm zijn — wel goed genoeg voor 'rood/oranje/groen', niet voor wetenschap.)",
      },
      {
        id: "co2-s3",
        title: "Drie kleurzones op de NeoPixel-strip",
        content: "Nu maken we het **visueel direct duidelijk**: alle 8 LEDs op de strip krijgen één kleur op basis van de zone. Groen <800 ppm (oké), oranje 800-1200 ppm (ventileer), rood >1200 ppm (NU openzetten). Een 'stoplicht-strip' die je in je ooghoek ziet zonder een display te hoeven lezen.",
        code: co2_s3,
        legend: [
          { term: "Adafruit_NeoPixel strip(LEDS, dataPin, NEO_GRB + NEO_KHZ800)", desc: "Standaard NeoPixel-init. 8 LEDs in serie volstaat." },
          { term: "uint32_t kleurZone(int ppm)", desc: "Helper-functie geeft de juiste kleur terug op basis van de drempels — herbruikbaar." },
          { term: "strip.Color(0, 80, 0)  // groen", desc: "Niet 0,255,0 — 80 is fel genoeg én voorkomt overbelasting van de USB-stroom met 8 felle LEDs." },
          { term: "strip.show()", desc: "Stuur de buffer naar de strip. Zonder dit zie je niets veranderen." },
        ],
        assignment: "Sluit aan: 5V→strip 5V, GND→strip GND, pin 6→strip Din. Upload. Strip is groen in frisse lucht. Adem 30 sec op de sensor → oranje → rood.",
        challenge: "Maak 'm 'gradient': bij 600 ppm 1 LED rood + 7 groen, bij 800 ppm 4 rood + 4 groen, etc. Visueel veel mooier dan 'alle of niets'.",
        reflection: "Waarom kies je voor een NeoPixel-strip i.p.v. een LCD? (Hint: kunt je zonder lezen herkennen, ook vanaf de andere kant van het lokaal, ook met je rug ernaartoe.)",
      },
      {
        id: "co2-s4",
        title: "Buzzer-alarm bij rood + snooze-knop",
        content: "Eindversie: bij 'rood' (>1200 ppm) speelt een korte hoge piep elke seconde. Maar — leraar wéét al dat het slecht is en wil het pauzeren. Snooze-knop op pin 4: druk = 5 minuten geen alarm, maar de strip blijft wel rood. Na 5 min: weer hoorbaar tot iemand het raam open zet.",
        diagram: true,
        code: co2_s4,
        legend: [
          { term: "SNOOZE_MS = 5UL * 60UL * 1000UL", desc: "5 minuten in milliseconden. `UL`-suffix verplicht — anders int-overflow op Arduino Uno." },
          { term: "snoozeTotMillis = millis() + SNOOZE_MS", desc: "Sla het exacte 'einde'-moment op. Vergelijk later met `millis() < snoozeTotMillis`." },
          { term: "tone(buzzerPin, 1200, 80)", desc: "80ms-piep op 1200 Hz — kort genoeg om niet vervelend te zijn, hoog genoeg om aandacht te trekken." },
          { term: "edge-detectie op snooze-knop", desc: "Eén druk = één snooze, niet 100x per seconde zolang ingedrukt." },
          { term: "noTone(buzzerPin)", desc: "Stop alle tonen. Belangrijk in de else-tak om 'hangende' tonen te voorkomen." },
        ],
        assignment: "Sluit aan: buzzer + → pin 8, buzzer − → GND. Snooze-knop pin 4 ↔ GND. Upload. Adem op de sensor tot rood + buzzer piept. Druk snooze: 5 min stil. Adem nog meer → strip blijft rood, geen geluid. Na 5 min: weer piep.",
        challenge: "Voeg **3 alarm-niveaus** toe: rood = korte piep, zeer-rood (>1800 ppm) = continue toon, gevaarlijk (>2500 ppm) = snel-knipperen + alarm dat niet snooze-baar is.",
        reflection: "Waarom is een snooze-knop pedagogisch belangrijk? (Hint: zonder snooze gaan leraren het systeem uitschakelen of negeren = doel verloren. Met snooze = systeem blijft acceptabel = wordt langer gebruikt.)",
        optionalCodeTitle: "Snippet: upgrade naar SCD30 (échte NDIR-CO₂)",
        optionalCode: `// Voor een serieuze schoolopstelling: vervang MQ-135 door SCD30 (~€50).
// Bibliotheek: 'SparkFun SCD30 Arduino Library'.
#include <SparkFun_SCD30_Arduino_Library.h>
SCD30 sensor;

void setup() {
  Wire.begin();   // SDA->A4, SCL->A5
  sensor.begin();
}

void loop() {
  if (sensor.dataAvailable()) {
    int ppm = sensor.getCO2();   // ECHTE CO2 in ppm
    // Verder identiek: kleurZone(ppm), buzzer, snooze...
  }
}

// Voordeel: ±30 ppm nauwkeurigheid, geen opwarmtijd, alleen CO2 (geen kruisreactie).`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 31: Slim slot met RFID-pas (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "rfid-slot",
    title: "Slim slot met RFID-pas",
    description: "Een RC522-lezer + servo = werkend RFID-slot. Bekende pas → groene LED + servo opent 5 sec. Onbekende pas → rode LED knippert 3x. Met uitleg hoe je je eigen pas-UID ontdekt en in de 'whitelist' zet.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, breadboard + jumpers, 1× RC522 RFID-module + 1 RFID-tag/kaart (vaak 2 stuks meegeleverd), 1× SG90 servo, 1× groene LED + 220Ω, 1× rode LED + 220Ω. **Demo/leerproject — niet voor échte huisdeuren!** Een SG90 + UID-vergelijking is niet veilig genoeg voor een woning.",
    board: "arduino",
    tags: ["domotica", "sensor"],
    learningGoal: "Een SPI-module aansluiten en initialiseren, ruwe byte-arrays vergelijken, een 'whitelist' van toegestane UIDs hard-coderen, en de **veiligheidsbeperkingen** van simpele RFID begrijpen.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "rfid-s1",
        title: "RC522 opzetten via SPI",
        content: "De RC522 communiceert via **SPI** — een vast communicatie-protocol met 4 vaste pinnen (SDA/SS, SCK, MOSI, MISO) plus een RST (reset) en een VCC. Op de Arduino Uno zijn SPI-pinnen vast: SCK=13, MOSI=11, MISO=12. SDA(SS) en RST mag je kiezen — wij nemen 10 en 9.\n\n**LET OP — voeding 3.3V, NIET 5V!** Sluit je VCC op 5V aan, dan brand je de chip door. **En de datapinnen?** De meeste hobby-RC522-breakouts zijn NIET officieel 5V-tolerant op de SPI-lijnen — ook al werkt het vaak 'gewoon' op een Uno, je kan de chip beschadigen of onbetrouwbaar maken. Voor lange-termijn-projecten gebruik je een **logic-level shifter** (paar euro extra) of een 3.3V-microcontroller (ESP32, Pro Mini 3.3V). Voor een korte schooldemo op de Uno: meestal werkt het, maar weet dat het officieel buiten spec is.\n\n**Disclaimer**: dit blijft een **demo-/leerproject** — niet voor échte sloten (zie ook materialen).",
        diagram: true,
        code: rfid_s1,
        legend: [
          { term: "#include <SPI.h>", desc: "SPI-bibliotheek (standaard, hoeft niet geïnstalleerd). Vereist voor RC522." },
          { term: "MFRC522 rfid(SS_PIN, RST_PIN)", desc: "Maak een rfid-object aan. SS=10, RST=9 in onze opstelling." },
          { term: "rfid.PCD_Init()", desc: "Initialiseer de chip. Zonder dit reageert de RC522 op niets." },
          { term: "rfid.PICC_IsNewCardPresent()", desc: "Check of er een nieuwe kaart vóór de antenne is. Returnt false als er niets ligt." },
          { term: "VCC = 3.3V !!!", desc: "Cruciaal: de RC522 op 3.3V aansluiten, NIET 5V. 5V brandt de chip door binnen seconden." },
        ],
        assignment: "Sluit alles aan volgens het schema (5 SPI-draadjes + VCC + GND). Installeer de 'MFRC522' bibliotheek (Bibliotheekbeheer → 'MFRC522' van GithubCommunity). Upload. Open Serial Monitor — bij 'tag voor de lezer houden' verschijnt 'Kaart gedetecteerd!'.",
        challenge: "Probeer een bankpas of OV-chipkaart. Werkt het ook? (Sommige wel, sommige niet — afhankelijk van het type.)",
        reflection: "Waarom heeft de RC522 6 dataverbindingen nodig terwijl een knop er maar 1 nodig heeft? (Hint: SPI is een vol communicatieprotocol, géén simpel signaal — het stuurt complete commando's heen en weer.)",
      },
      {
        id: "rfid-s2",
        title: "UID uitlezen + tonen via Serial",
        content: "Elke RFID-tag heeft een **uniek serienummer (UID)** — meestal 4 of 7 bytes. Dat is wat we straks gebruiken om te bepalen of een pas 'bekend' is. Eerst: lees je eigen pasje uit en noteer de UID. We printen elke byte als 2-cijferige HEX (bijv. `DE AD BE EF`).\n\n**Ontwerp-keuze**: we gebruiken `delay(800)` na elke uitlezing — anders leest dezelfde kaart 100x per seconde uit zolang hij voor de antenne ligt.",
        code: rfid_s2,
        legend: [
          { term: "rfid.uid.uidByte", desc: "Array van bytes met de UID. Lengte staat in `rfid.uid.size`." },
          { term: "rfid.uid.size", desc: "Hoeveel bytes de UID heeft. Vaak 4, soms 7 (afhankelijk van het type tag)." },
          { term: "Serial.print(byte, HEX)", desc: "Print als hexadecimaal. Cruciaal: anders zie je decimale getallen die niet overeenkomen met datasheets." },
          { term: "if (uid[i] < 0x10) Serial.print(\"0\")", desc: "Padding: byte 0x07 wordt anders '7' i.p.v. '07'. Voorkomt verwarring." },
          { term: "rfid.PICC_HaltA()", desc: "Vertel de kaart 'klaar, slaap weer'. Anders blijft hij actief en heb je rare loops." },
        ],
        assignment: "Upload. Houd JOUW pas voor de lezer. Noteer de UID die in Serial Monitor verschijnt (4 bytes, bijv. `A3 5F 12 E7`). Doe hetzelfde voor de tweede tag uit het pakket. Bewaar deze 2 UIDs voor stap 3!",
        challenge: "Een ander persoon laat zijn OV-chipkaart of bankpas lezen. Welk UID-formaat heeft die? (Vaak 7 bytes — meer 'echte' tags hebben langere UIDs.)",
        reflection: "Waarom is een UID **NIET hetzelfde als een wachtwoord**? (Hint: UIDs zijn niet geheim — bedoeld als sticker op een doos. Iedereen kan jouw UID met een goedkope reader uitlezen en hem klonen.)",
      },
      {
        id: "rfid-s3",
        title: "Toegestane lijst vergelijken",
        content: "Nu de logica: bij elke uitgelezen UID checken of-ie in onze 'toegestane' lijst staat. We slaan de UIDs op in een **2D-array** `toegestaan[AANTAL][UID_LEN]`. De helper-functie `zelfdeUID()` vergelijkt twee UIDs byte voor byte. `isToegestaan()` loopt alle whitelisted UIDs langs en returnt true bij een match.\n\n**Belangrijk**: vervang de voorbeeld-UIDs (`DE AD BE EF` etc.) door JOUW echte UIDs uit stap 2! Anders herkent het systeem niets.",
        code: rfid_s3,
        legend: [
          { term: "byte toegestaan[AANTAL_PASSEN][UID_LEN]", desc: "2D-array: rij per pas, 4 bytes per pas. Vergelijkbaar met een tabel." },
          { term: "0xDE, 0xAD, 0xBE, 0xEF", desc: "Voorbeeld-UID (knipoog naar hex-grappen). VERVANG DEZE door jouw echte UIDs uit stap 2!" },
          { term: "if (gelezen[i] != kandidaat[i]) return false", desc: "Vroeg-terug: zodra één byte verschilt, is het GEEN match — geen verdere check nodig." },
          { term: "for (int i = 0; i < AANTAL_PASSEN; i++)", desc: "Loop alle whitelist-UIDs langs. Stop zodra er een match is." },
        ],
        assignment: "Vervang de twee voorbeeld-UIDs in de code door jouw eigen UIDs uit stap 2. Upload. Houd jouw pas voor de lezer = 'TOEGANG OK'. Houd een onbekende kaart (een willekeurige andere RFID-tag) = 'TOEGANG GEWEIGERD'.",
        challenge: "Verbreed naar 5 toegestane passen. Tip: alleen `AANTAL_PASSEN` aanpassen + 3 extra UIDs toevoegen aan de array.",
        reflection: "Waarom is hard-coden van UIDs in code 'verschrikkelijk' voor een echt slot? (Hint: nieuwe pas? Code wijzigen + heruploaden. Pas verloren? Diegene heeft nog steeds toegang tot ALLE plekken waar zijn UID staat.)",
      },
      {
        id: "rfid-s4",
        title: "Servo + LEDs voor toegang/geweigerd",
        content: "Eindversie: bij OK → groene LED aan + servo draait naar 180° (open) + 5 sec wachten + servo terug naar 0° (dicht). Bij geweigerd → rode LED knippert 3x. Dit is een werkend demonstratie-slot.\n\n**Disclaimer voor leerlingen**: dit is een **demo**. Een SG90 servo is niet sterk genoeg om een echte deur dicht te houden, en UID-vergelijking is binnen 1 minuut te omzeilen met een $5 USB-RFID-cloner. Voor échte sloten heb je smartlocks met cryptografische authenticatie nodig.",
        diagram: true,
        code: rfid_s4,
        legend: [
          { term: "servo1.attach(3)", desc: "Servo op pin 3 (servo niet op 9 — pin 9 is RST voor de RFID)." },
          { term: "servo1.write(180) / servo1.write(0)", desc: "180° = 'open' positie, 0° = 'dicht'. Pas aan voor jouw mechaniek." },
          { term: "groenLedPin = 6, rodeLedPin = 7", desc: "Aparte LEDs voor visuele feedback. 220Ω in serie verplicht." },
          { term: "afgewezen() blink-loop", desc: "3x knipperen = duidelijk 'NEE' signaal. Geen servo-beweging." },
          { term: "DEMO ONLY", desc: "Servo + UID-vergelijking is niet veilig voor een echte deur. Klonen kan in seconden, mechaniek is zwak." },
        ],
        assignment: "Sluit aan: servo signal→pin 3, groene LED→pin 6 (via 220Ω), rode LED→pin 7 (via 220Ω). Upload. Bekende pas: groene LED + servo opent 5 sec. Onbekende pas: rode LED knippert 3x.",
        challenge: "Voeg een **buzzer** toe op pin 5: korte hoge bevestigings-toon bij OK (`tone(5, 2000, 100)`), lage 'fout'-toon bij geweigerd (`tone(5, 200, 200)`).",
        reflection: "Welke 3 dingen zou je móeten toevoegen om dit een 'echt' slot te maken? (Voorbeelden: encrypted authentication via DESFire-tags, log van alle pogingen in EEPROM, anti-tamper-sensor, batterij-back-up...)",
        optionalCodeTitle: "Snippet: log laatste 10 toegangs-pogingen",
        optionalCode: `// Houd in EEPROM bij wie wanneer toegang kreeg/geweigerd werd.
// Geheel gebruik: bij elke poging schrijf 1 byte (tag-index) naar circular buffer.
#include <EEPROM.h>

const int LOG_START = 0;
const int LOG_LEN = 10;
int logIndex = 0;

void logToegang(int tagIndex, bool ok) {
  byte entry = ok ? (tagIndex + 1) : 99;  // 99 = geweigerd
  EEPROM.write(LOG_START + logIndex, entry);
  logIndex = (logIndex + 1) % LOG_LEN;
}

// Lees terug via Serial om te zien wie de laatste 10 pogingen waren.`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 32: Aanwezigheidssensor met auto-licht (Beginner)
  // ─────────────────────────────────────────────
  {
    id: "pir-auto-licht",
    title: "Aanwezigheidssensor met auto-licht",
    description: "WC binnenlopen = licht aan. 30 sec stilte = licht uit. Klassiek 'beweging-trigger'-systeem dat je in elk huis terugziet. Optioneel: een LDR-extensie zodat het licht overdag uitblijft.",
    difficulty: "Beginner",
    materials: "Arduino Uno, breadboard + jumpers, 1× PIR-sensor (HC-SR501), 1× 5V-relais module (1-kanaals) + 5V/12V LED-strip OF gewoon een Arduino-LED voor demo. Optioneel: 1× LDR + 10kΩ. **Veiligheid: alleen 5V/12V DC. Geen 230V-lampen!**",
    board: "arduino",
    tags: ["domotica", "sensor"],
    learningGoal: "Een PIR-sensor combineren met een relais voor 'doe-iets-bij-beweging'-projecten, een non-blocking timer met `millis()` schrijven, en relais correct ACTIVE-LOW initialiseren tegen 'reset-flikkering'.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "auto-s1",
        title: "PIR + relais aansluiten en testen",
        content: "Eerst de basics: zodra de PIR beweging detecteert (uitgang gaat HIGH), schakelen we het relais aan = lamp aan. Geen beweging meer = relais uit = lamp uit. Heel direct.\n\n**Cruciaal in `setup()`**: `digitalWrite(relaisPin, HIGH)` als eerste, vóór alles anders. Hobby-relais zijn ACTIVE-LOW: standaard IDLE = HIGH. Doe je dit niet, dan klikt het relais aan tijdens elke Arduino-reset = lamp ploft kort aan, slecht voor de relais én verwarrend.\n\n**Real-life toepassing**: precies hoe automatische gangverlichting werkt in nieuwe huizen.",
        diagram: true,
        code: auto_s1,
        legend: [
          { term: "int pirPin = 2", desc: "PIR OUT op digitale pin 2. PIR geeft HIGH bij beweging, LOW erbuiten." },
          { term: "int relaisPin = 7", desc: "Relais IN op pin 7. Het relais schakelt vervolgens de eigenlijke lamp/strip." },
          { term: "digitalWrite(relaisPin, HIGH) // = UIT", desc: "ACTIVE-LOW relais: HIGH = aan-gewone-stand = lamp UIT. CRUCIAAL als allereerste in setup()." },
          { term: "PIR HC-SR501 dipswitches", desc: "Op de PIR zelf: 2 draaiknopjes (gevoeligheid + tijd). Tijd kun je hier laag zetten omdat we zelf de duur in code regelen." },
        ],
        assignment: "Sluit aan: PIR VCC→5V, PIR GND→GND, PIR OUT→pin 2. Relais IN→pin 7, VCC→5V, GND→GND. Lamp via NO/COM van relais (gebruik een LED-strip met aparte 5V-voeding voor demo). Upload. Beweeg je hand → lamp aan. Stilstaan → lamp uit.",
        challenge: "Vervang de relais-aansturing door een gewone Arduino-LED op pin 13 voor snelle test zonder relais. Werkt de PIR-detectie?",
        reflection: "Waarom maakt de PIR een 'klik'-geluid de eerste keer dat je het systeem aanzet? (Hint: PIR heeft ~1 min opwarm/kalibratie. Eerste minuut: vals-positieven mogelijk.)",
      },
      {
        id: "auto-s2",
        title: "Auto-uit na 30 sec stilte (millis-timer)",
        content: "Nu de slimme versie: bij beweging → lamp aan + onthoud het tijdstip. Bij elke beweging: tijdstip 'verversen' (de 'aanwezig'-timer reset). Als er 30 sec lang GEEN beweging meer is → lamp uit. We gebruiken `millis()` non-blocking — dan blijft de PIR continu reageerbaar.\n\n**Dit is een fundamenteel patroon**: 'tijd sinds laatste actie'. Je vindt het overal terug — auto's die zelf-vergrendelen na 5 min, tv's die uit gaan na geen-druk-meer-op-de-afstandsbediening, schermsavers...",
        code: auto_s2,
        legend: [
          { term: "NA_LICHT_AAN_MS = 30UL * 1000UL", desc: "30 sec in milliseconden. UL-suffix verplicht — anders int-overflow." },
          { term: "laatsteBewegingMs = millis()", desc: "'Tijdstip-stempel' van de laatste beweging. Continu verfrissen zolang er beweging is." },
          { term: "(millis() - laatsteBewegingMs) > NA_LICHT_AAN_MS", desc: "Klassiek niet-blokkerend pattern. Kijkt of er genoeg tijd verstreken is." },
          { term: "bool lichtAan", desc: "State-flag. Voorkomt onnodig herhaald 'relaisAan()' aanroepen — én logging-spam." },
        ],
        assignment: "Upload. Beweeg je hand. Lamp aan. Sta stil. Na 30 sec: lamp uit. Beweeg weer (of na 25 sec): timer reset, lamp blijft aan. Test ook: beweeg 1 sec, sta dan 35 sec stil — moet uitgaan.",
        challenge: "Maak de duur instelbaar via een potmeter op A1: `NA_LICHT_AAN_MS = map(analogRead(A1), 0, 1023, 5000, 120000);` — geeft een instelbare timer van 5 sec tot 2 min.",
        reflection: "Waarom gebruiken we `millis()` met aftrekken in plaats van een teller die we elke seconde ophogen? (Hint: probeer eens 'als beweging dan tellerWeer = 0; loop: teller++; delay(1000);' — wat gebeurt er met de PIR-respons tijdens de delay?)",
      },
      {
        id: "auto-s3",
        title: "LDR-uitbreiding: alleen 's avonds aan",
        content: "Laatste verfijning: overdag gaat het licht NIET aan, ook al is er beweging. Voeg een LDR toe op A0 (via spanningsdeler met 10kΩ → GND). Hoe meer licht → hoge waarde. Onder een drempel (~600) is het 'nacht' → systeem werkt normaal. Boven de drempel = overdag → blijft uit.\n\n**Bonus-logica**: als het licht aanstaat én plotseling overdag licht wordt (zon op), gaat het direct uit. Bespaart energie.",
        diagram: true,
        code: auto_s3,
        legend: [
          { term: "int ldrPin = A0", desc: "LDR via spanningsdeler op analoge pin A0. Drempel-instelling per ruimte/tijd." },
          { term: "DAGLICHT_DREMPEL = 600", desc: "Boven dit getal = overdag, niets doen. Tweak voor JOUW ruimte (test met de Serial Monitor)." },
          { term: "bool overdag = (licht > DAGLICHT_DREMPEL)", desc: "Boolean variabele leest een stuk lekkerder dan overal de check herhalen." },
          { term: "if (lichtAan && overdag) relaisUit()", desc: "Bonus: als het licht aanstond + de zon komt op = direct uit. Energie-besparing." },
        ],
        assignment: "Sluit de LDR aan: één pootje → 5V, andere pootje → A0 én via 10kΩ naar GND. Upload. Test in donker (hand over LDR): beweging → lamp aan zoals voorheen. Test in fel licht: beweging → lamp blijft uit.",
        challenge: "Voeg **'schemering-overgang'** toe: tussen waarde 500 en 700 = 'twilight'-zone waarin het licht maar half-helder aangaat (PWM op een MOSFET i.p.v. relais).",
        reflection: "Waarom wordt PIR-met-auto-licht overal gebruikt in trappenhuizen, maar nooit in slaapkamers? (Hint: bewust uitgaan ≠ in slaap vallen — PIR triggert niet op stille slaap, dus systeem zou middenin de nacht uitschakelen. Slaapkamers gebruiken meestal handmatige schakelaars of dim-cycli.)",
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 33: OLED-grafieken & mini-oscilloscoop (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "oled-oscilloscoop",
    title: "OLED-grafieken & mini-oscilloscoop",
    description: "Plot een analoge sensor-waarde live als scrollende lijn op een 128x64 OLED. Inclusief assen en automatisch min/max-zoomen — eigen mini-scope op je bureau.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, SSD1306 OLED (128x64, I2C-versie met 4 pinnen), potmeter (10kΩ) of een willekeurige analoge sensor (LDR, MQ-, microfoon-module...), breadboard + jumpers. Bibliotheken: Adafruit_SSD1306 + Adafruit_GFX (Bibliotheekbeheer).",
    board: "arduino",
    tags: ["display", "sensor"],
    learningGoal: "Een SSD1306 OLED aansturen via I2C, een ringbuffer gebruiken om over tijd te verzamelen, en die data live tekenen als grafiek met dynamische assen-schaal.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "oled-s1",
        title: "OLED + Adafruit-bibliotheek setup",
        content: "De SSD1306 is een **monochroom OLED-scherm** dat via **I2C** praat — dezelfde 2 draadjes (SDA/SCL) als bij de I2C LCD. Op de Arduino Uno zijn dat A4 (SDA) en A5 (SCL). Het meest voorkomende I2C-adres is **0x3C**, maar een paar modules zijn 0x3D — als 'OLED niet gevonden' verschijnt, probeer dat adres in de code.\n\n**Bibliotheek installeren**: Bibliotheekbeheer → zoek 'Adafruit SSD1306' van Adafruit → installeer (vraagt automatisch om 'Adafruit GFX' — ja zeggen).\n\n**Verschil met LCD**: een LCD toont alleen tekens uit een tabel, een OLED is een echte pixelmatrix (128 × 64 = 8192 pixels). Daarom kunnen we straks ook lijnen, assen en grafieken tekenen.",
        diagram: true,
        code: oled_s1,
        legend: [
          { term: "#include <Adafruit_SSD1306.h>", desc: "Hoofdbibliotheek voor SSD1306 OLEDs. Vraagt automatisch om Adafruit GFX (de tekenfuncties)." },
          { term: "Adafruit_SSD1306 display(128, 64, &Wire, -1)", desc: "Maak het scherm-object. -1 = geen aparte reset-pin gebruiken." },
          { term: "display.begin(SSD1306_SWITCHCAPVCC, 0x3C)", desc: "Initialiseer met intern voltage + I2C-adres 0x3C. Returnt false bij fout." },
          { term: "display.display()", desc: "CRUCIAAL: zonder deze regel zie je niks. De Adafruit-lib tekent alles in een geheugen-buffer en pas display() stuurt het naar het scherm." },
          { term: "while (true) {}", desc: "Bij init-fout: stop hier in plaats van met een leeg scherm verder te gaan. Maakt fout makkelijker te zien." },
        ],
        assignment: "Sluit aan: VCC→5V (of 3.3V — check je module), GND→GND, SDA→A4, SCL→A5. Installeer Adafruit_SSD1306 via Bibliotheekbeheer. Upload. Je zou 'Hallo OLED!' linksboven moeten zien.",
        challenge: "Verander de tekstgrootte: `display.setTextSize(2)` voor 2x zo groot. Hoeveel tekens passen er nog op een regel?",
        reflection: "Waarom moet je `display.display()` aanroepen? Wat zou er gebeuren als je 'm vergeet?",
      },
      {
        id: "oled-s2",
        title: "Tekst + lijnen tekenen (assen-skelet)",
        content: "Nu gaan we **pixel-tekenen**. De Adafruit_GFX-bibliotheek geeft je `drawLine(x1, y1, x2, y2, kleur)`, `drawPixel(x, y, kleur)`, `drawRect(...)` enzovoort. Coordinaten: (0,0) = LINKSBOVEN, x gaat naar rechts, y gaat NAAR BENEDEN. Dat klopt anders dan een wiskunde-grafiek waar y omhoog gaat — daar moeten we straks rekening mee houden bij de grafiek.\n\nIn deze stap bouwen we het 'skelet' van onze scope: een titel, een Y-as links, een X-as onderaan en een schuine demo-lijn als preview.",
        code: oled_s2,
        legend: [
          { term: "drawLine(10, 10, 10, 63, SSD1306_WHITE)", desc: "Lijn van (10,10) naar (10,63). Vertikaal omdat de x-coordinaat hetzelfde blijft = Y-as." },
          { term: "drawLine(10, 63, 127, 63, ...)", desc: "Horizontale lijn helemaal onderaan = X-as." },
          { term: "SSD1306_WHITE", desc: "De OLED is monochroom — pixel staat aan (wit) of uit. Geen kleuren, geen helderheidsniveaus." },
          { term: "setCursor(x, y)", desc: "Waar de volgende display.print() begint. Y=0 is bovenaan." },
          { term: "Coordinaten: y omlaag", desc: "Een hoge sensor-waarde betekent straks een KLEINE y. Daarom mappen we straks min->63, max->8 (omgedraaid)." },
        ],
        assignment: "Upload. Je ziet nu een titel, twee assen en een diagonale lijn. Verander `drawLine(10, 60, 127, 12, ...)` naar `drawLine(127, 60, 10, 12, ...)` — wat verandert er?",
        challenge: "Voeg een rechthoek toe rond de hele grafiek met `display.drawRect(10, 10, 117, 54, SSD1306_WHITE)` — dat geeft een nettere 'plot-area'.",
        reflection: "Op een 128 × 64-scherm zijn er 8192 pixels. Hoeveel bytes geheugen heeft de Arduino dan minstens nodig om de hele buffer bij te houden? (Hint: 8 pixels per byte = 1024 bytes. Op een Uno met 2KB SRAM is dat al bijna de helft!)",
      },
      {
        id: "oled-s3",
        title: "Ringbuffer voor 128 metingen",
        content: "Een **ringbuffer** is een lijst met vaste grootte waarin de oudste waarde altijd door de nieuwste overschreven wordt — een 'rondlopende' geschiedenis. Wij gebruiken er één van precies 128 elementen, eentje per pixel-kolom op het scherm.\n\nDe truc: een teller `schrijfIndex` wijst naar de plek waar de **volgende** meting komt. Na elke meting `schrijfIndex = (schrijfIndex + 1) % 128`. De modulo zorgt dat hij na 127 weer op 0 begint. Tegelijk wijst die index naar de **oudste** waarde (die straks overschreven wordt) — handig om straks van oud naar nieuw te lezen.\n\n**Dit pattern zie je overal**: chat-apps die laatste-N-berichten bewaren, audio-recorders, sensor-loggers, kringbuffers in audio/streaming...",
        code: oled_s3,
        legend: [
          { term: "const int N = 128", desc: "1 waarde per pixel-kolom. Past precies in 128 × 2 bytes = 256 bytes RAM (int = 2 bytes op Uno)." },
          { term: "int buffer[N]", desc: "De ringbuffer zelf. Vooraf met nullen vullen voorkomt 'rommel' in de eerste schermen." },
          { term: "schrijfIndex = (schrijfIndex + 1) % N", desc: "DE klassieke ringbuffer-truc. Modulo-operator wraps van 127 -> 0 zonder if/else." },
          { term: "Oudste = nieuwste plek", desc: "Subtiel: de plek waar we STRAKS schrijven, bevat NU de oudste waarde. Dat gebruiken we in stap 4 om in volgorde te tekenen." },
          { term: "delay(50)", desc: "20 metingen per seconde — meer dan genoeg voor een trage potmeter, niet zo snel dat de Serial overspoeld raakt." },
        ],
        assignment: "Upload. Open Serial Monitor. Draai aan de potmeter en kijk dat schrijfIndex netjes 0,1,2,...,127,0,1,2,... loopt en dat de meting meeverandert.",
        challenge: "Maak `N = 64` in plaats van 128 (halve scherm-breedte). Waarom kan dat? Wat zou je veranderen aan stap 4 om dit netjes te tekenen?",
        reflection: "Waarom is een ringbuffer beter dan elke meting telkens 1 plek opschuiven (`for i: buffer[i] = buffer[i+1]`)? (Hint: opschuiven kost 128 stappen per meting — een ringbuffer kost 1.)",
      },
      {
        id: "oled-s4",
        title: "Scrollende grafiek met assen + min/max-labels",
        content: "Eindversie: bij elke meting tekenen we de **hele buffer** opnieuw als verbonden lijn. We loop'en de buffer in 'oudste -> nieuwste'-volgorde door op `schrijfIndex` te starten en met modulo door te tellen. Daardoor scrollt de grafiek mooi van rechts naar links, alsof je een zaag-machine ziet.\n\n**Auto-zoom op de Y-as**: we berekenen elke frame de huidige min en max van de buffer, en mappen die naar de y-coordinaten 63 (onderaan) tot 8 (bijna bovenaan). Daardoor blijft een vlakke signaal toch goed zichtbaar — anders zie je alleen een rechte lijn ergens in het midden.\n\n**Resultaat**: een werkende oscilloscoop voor lage frequenties (~33 fps × 128 pixels = 4 sec geschiedenis op het scherm).",
        diagram: true,
        code: oled_s4,
        legend: [
          { term: "for (int x = 0; x < N; x++) { int idx = (schrijfIndex + x) % N; ... }", desc: "Lees de buffer in 'oudste -> nieuwste'-volgorde door bij schrijfIndex te beginnen. Modulo wraps automatisch." },
          { term: "int y = map(w, minW, maxW, 63, 8)", desc: "Hoge waarde -> kleine y (=hoog op scherm), lage waarde -> grote y (=laag op scherm). De omgekeerde range mapt 'm goed." },
          { term: "if (maxW - minW < 10) maxW = minW + 10", desc: "Voorkom delen-door-nul / vlakke lijn als alle waarden hetzelfde zijn. Forceer een minimum bereik." },
          { term: "drawLine(x - 1, vorigeY, x, y, ...)", desc: "Verbonden lijn-grafiek: trek lijn van vorige y-positie naar nieuwe. Mooier dan losse pixels." },
          { term: "setTextColor(WHITE, BLACK)", desc: "Tekst MET zwarte achtergrond — anders is het label onleesbaar over de grafiek-lijn." },
        ],
        assignment: "Upload. Draai aan de potmeter en kijk de grafiek live mee bewegen. Vervang de potmeter door een LDR (op A0 + 10kΩ naar GND) en wuif je hand er overheen — je ziet de schaduw als een dipje in de lijn.",
        challenge: "Voeg een **trigger-modus** toe: teken alleen opnieuw wanneer de waarde door een drempel (bv. 512) heen stijgt. Dan staat een periodiek signaal stil op het scherm, zoals een echte scope.",
        reflection: "Waarom kan deze 'scope' geen audio-signaal van een microfoon meten? (Hint: 33 fps = 33 metingen per seconde. Audio heeft 8000+ samples per seconde nodig — ver buiten ons bereik. Voor audio heb je interrupts + DMA + een veel snellere chip nodig.)",
        optionalCodeTitle: "Snippet: voeg een trigger toe (alleen tekenen op stijgende flank)",
        optionalCode: `// Houd de vorige meting bij. Trigger = vorige < drempel && nieuwe >= drempel.
int vorige = 0;
const int DREMPEL = 512;
bool triggerOk = false;

void loop() {
  int meting = analogRead(potPin);

  // Trigger-detectie: alleen tekenen als we net door drempel heen stegen.
  if (vorige < DREMPEL && meting >= DREMPEL) triggerOk = true;
  vorige = meting;

  buffer[schrijfIndex] = meting;
  schrijfIndex = (schrijfIndex + 1) % N;

  if (triggerOk) {
    teken();
    triggerOk = false;
  }
  delay(30);
}`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 34: Tilt-game met accelerometer (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "tilt-game-mpu6050",
    title: "Tilt-game met accelerometer",
    description: "Bouw een 'kantel'-spel: een MPU6050-accelerometer voelt hoe je het bord houdt, en een balletje rolt mee over een 8×8 LED-matrix. Vang het knipperende doel om punten te scoren.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, MPU6050-module (ook bekend als GY-521), 8×8 LED-matrix met MAX7219-driver, breadboard + jumpers. Bibliotheken: MPU6050_light (van rfetick) + LedControl (Bibliotheekbeheer).",
    board: "arduino",
    tags: ["game", "sensor"],
    learningGoal: "Een I2C-accelerometer uitlezen, fysieke kanteling vertalen naar grid-coordinaten, en een simpele game-loop bouwen rond positie + doel + score.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "tilt-s1",
        title: "MPU6050 uitlezen via I2C",
        content: "De **MPU6050** is een goedkope (~€2) 6-as bewegingssensor: 3 acceleratie-assen + 3 rotatie-assen (gyro). Voor een tilt-game hebben we alleen de **acceleratie** nodig. Hij praat via **I2C** op A4/A5 — net als de OLED en LCD die we al gebruikt hebben.\n\n**Bibliotheek-keuze**: er bestaan drie populaire MPU6050-libs. Wij gebruiken `MPU6050_light` van rfetick — kleinste API, direct werkende `getAccX/Y/Z()`, geen gedoe met sensor-fusion of registers.\n\n**Drift is normaal**: ook stilliggend zie je waarden van ±0.05g schommelen. Dat is geen kapotte sensor — het is gewoon een goedkope MEMS-chip. Voor een tilt-game maakt dat niks uit; voor precieze hoekmetingen zou je meerdere sensoren moeten combineren (sensor fusion).",
        diagram: true,
        code: tilt_s1,
        legend: [
          { term: "#include <MPU6050_light.h>", desc: "Lichte bibliotheek met directe getAccX/Y/Z()-functies. Installeer via Bibliotheekbeheer ('MPU6050_light' van rfetick)." },
          { term: "MPU6050 mpu(Wire)", desc: "Maak het sensor-object aan. 'Wire' = de standaard I2C-bus (A4=SDA, A5=SCL op Uno)." },
          { term: "mpu.begin()", desc: "Init. Returnt 0 bij succes, anders een foutcode (1=geen contact = bedrading checken)." },
          { term: "mpu.calcOffsets()", desc: "Auto-nul: meet ~1 sec terwijl je het bord plat houdt en trekt die offset er voortaan vanaf." },
          { term: "mpu.update()", desc: "VERPLICHT in elke loop voordat je getAccX/Y/Z aanroept. Anders krijg je oude waarden." },
          { term: "Drift ±0.05g", desc: "Normaal. Voor een tilt-game irrelevant. Voor een hoek-meting tot 0.1° heb je sensor-fusion nodig." },
        ],
        assignment: "Sluit aan: VCC→5V (de module heeft een eigen 3.3V-regelaar), GND→GND, SDA→A4, SCL→A5. Installeer 'MPU6050_light' via Bibliotheekbeheer. Upload. Open Serial Monitor — bij plat liggen: ax≈0, ay≈0, az≈+1.0 (zwaartekracht omhoog op de chip).",
        challenge: "Kantel het bord 90° rechtsom. Welke as wordt nu +1.0g? En als je 'm op zijn kop houdt?",
        reflection: "Waarom meet de Z-as +1.0g als de sensor PLAT ligt? (Hint: dit is de zwaartekracht die de sensor 'voelt'. In een vrije val zou az = 0 zijn — dat gebruiken iPhones om val-detectie te doen.)",
      },
      {
        id: "tilt-s2",
        title: "Acceleratie mappen naar 8×8 grid",
        content: "Onze 8×8 LED-matrix heeft 64 vakjes — coordinaten (x, y) van 0..7. We willen dat een **lichte kanteling** de bal al beweegt, en een **stevige kanteling** 'm helemaal naar de rand schuift. Bij plat liggen moet hij in het midden staan: (4, 4).\n\nFormule: `v = a * 8 + 4` mapt acceleratie -1.0g..+1.0g naar -4..+12, en met `constrain` clampen we naar 0..7. Bij a=0 (plat) → v=4 (midden). Bij a=+0.5 → v=8 → clamp naar 7 (rand). Lekker responsief.\n\n**Geen rocket science**: dit is gewoon een lineaire schaling. Als de bal te 'gevoelig' beweegt: vermenigvuldig met 4 in plaats van 8. Te 'sloom': vermenigvuldig met 16.",
        code: tilt_s2,
        legend: [
          { term: "int balX, balY", desc: "Bal-positie op het 8x8 grid. We houden 'm in 'wereld'-coordinaten 0..7." },
          { term: "(int)(a * 8.0 + 4.0)", desc: "Lineaire schaal: -1.0g -> -4 (clampt naar 0), 0g -> 4 (midden), +1.0g -> +12 (clampt naar 7). Vervang de 8 door grotere waarde voor gevoeliger spel." },
          { term: "if (v < 0) v = 0; if (v > 7) v = 7", desc: "Clamp/constrain. Voorkomt dat de bal 'verdwijnt' buiten het scherm." },
          { term: "Plat liggen = midden", desc: "Bij ax=ay=0 valt de formule terug op v=4 — precies het midden van het 8x8 grid." },
        ],
        assignment: "Upload. Open Serial Monitor. Beweeg het bord rustig. De getallen (balX, balY) moeten tussen 0 en 7 blijven en duidelijk meebewegen met de kanteling.",
        challenge: "Vermenigvuldig met 4 in plaats van 8 — nu moet je veel verder kantelen om de rand te raken. Of vermenigvuldig met 16 — dan is alleen al een tikje genoeg om naar de rand te schuiven.",
        reflection: "Waarom werkt dit ook prima zonder de Y-as om te draaien? (Hint: we testen zelf welke fysieke richting bij welke as hoort. Sluit de matrix straks gewoon aan zoals het 'logisch' aanvoelt — software-correctie is goedkoper dan herbedraden.)",
      },
      {
        id: "tilt-s3",
        title: "Render-helper: balletje op de 8×8 matrix",
        content: "Nu combineren we de MPU6050 met de LED-matrix uit de eerdere battleship-tutorial. De `LedControl`-bibliotheek heeft één rare gewoonte: de API is `setLed(module, ROW, COL, on)` — dus eerst de Y, dan de X. Daarom passeren we `(0, balY, balX, true)` en niet andersom. **Dit verwart bijna iedereen de eerste keer.**\n\nWe schrijven een mini-render-functie `tekenBal(x, y)` die de matrix wist en één LED aanzet. Door dat in elke loop opnieuw te doen krijg je de illusie van een bewegende bal.",
        diagram: true,
        code: tilt_s3,
        legend: [
          { term: "LedControl matrix(12, 11, 10, 1)", desc: "Pinnen: DIN=12, CLK=11, CS=10. '1' = aantal modules (we gebruiken 1 matrix). Dit is de standaard MAX7219-bedrading." },
          { term: "matrix.shutdown(0, false)", desc: "MAX7219 start in 'shutdown'. Met false zet je hem aan. Vergeten = donkere matrix." },
          { term: "matrix.setIntensity(0, 4)", desc: "Helderheid 0..15. Op 4 is comfortabel; op 15 verblindt het." },
          { term: "matrix.setLed(0, y, x, true)", desc: "PAS OP volgorde: (module, ROW, COL, aan/uit). Y eerst, X tweede — andersom dan veel andere libraries." },
          { term: "tekenBal(int x, int y)", desc: "Render-helper: wis matrix + zet 1 LED aan. Wordt elke loop aangeroepen met de nieuwe bal-positie." },
        ],
        assignment: "Sluit de MAX7219-matrix aan: DIN→pin 12, CLK→pin 11, CS→pin 10, VCC→5V, GND→GND. Upload. Kantel het bord — de LED hoort mee te bewegen over de 8×8 grid.",
        challenge: "Beweegt de bal in de 'verkeerde' richting (kantel naar rechts maar bal gaat naar links)? Voeg `balX = 7 - balX;` toe na de map-aanroep om die as te spiegelen. Doe hetzelfde voor Y indien nodig.",
        reflection: "Waarom 'flikkert' de matrix niet ondanks dat we hem 20x per seconde wissen + opnieuw tekenen? (Hint: de MAX7219 heeft zelf een interne buffer + multiplext de LEDs op ~1kHz. Wij sturen alleen de NIEUWE staat; hij houdt 'm tussendoor zichtbaar.)",
      },
      {
        id: "tilt-s4",
        title: "Game-loop: doel pakken + score + juich-animatie",
        content: "Eindversie: een willekeurig **doel-vakje** licht op, jij rolt het balletje er met kantelen naartoe, raakt 'm = +1 punt + alle LEDs flitsen 3x als juich-feedback, dan komt er een nieuw doel.\n\n**Knipperende bal**: omdat doel + bal allebei 'aan' zijn, zou je bij overlap niks zien. Truc: de bal wordt elke frame aan/uit getoggled met een `static bool aan` — op het doel zie je dus altijd het knipperende balletje wanneer ze samenvallen. Dit zelfde 'static bool toggle'-pattern werkt overal waar je iets wilt laten knipperen zonder een aparte timer-variabele.",
        code: tilt_s4,
        legend: [
          { term: "static bool aan", desc: "Static = behoudt waarde tussen functie-aanroepen door. Klassieke C-truc om state in een functie te bewaren zonder globale variabele." },
          { term: "plaatsDoel()", desc: "random(0, 8) geeft 0..7 — perfecte coordinaten voor het 8x8 grid. randomSeed(analogRead(A0)) in setup() voor echte willekeur." },
          { term: "if (balX == doelX && balY == doelY)", desc: "Eenvoudige collision-check op een grid: pixel-perfect gelijk = 'gepakt'." },
          { term: "juich() animatie", desc: "Hele matrix 3x knipperen = duidelijke 'goal!'-feedback voor de speler. Belangrijke UX-regel: succes ALTIJD groot vieren." },
          { term: "Score in Serial", desc: "Op een 8x8 matrix is geen plek voor een nummer — Serial Monitor open laten voor de score, of voeg een OLED toe als upgrade." },
        ],
        assignment: "Upload. Een doel licht op. Kantel om de bal ernaartoe te rollen. Bij raken: hele matrix knippert + score + nieuw doel. Open Serial Monitor om je score bij te houden.",
        challenge: "Voeg een **obstakel** toe: een derde willekeurig vakje dat ook knippert. Als je dat raakt: game over (juich() vervangen door een 'sad' rode-loop animatie + score reset).",
        reflection: "Waarom voelt het spel beter aan met een korte `delay(80)` dan zonder delay? (Hint: zonder delay update de bal honderden keren per seconde — sneller dan je hand kan compenseren. 12-15 fps is genoeg voor vloeiend spel én geeft de speler tijd om te reageren.)",
        optionalCodeTitle: "Snippet: voeg een obstakel toe dat game-over geeft",
        optionalCode: `int obstX = 0, obstY = 0;

void plaatsObstakel() {
  do {
    obstX = random(0, 8);
    obstY = random(0, 8);
  } while ((obstX == balX && obstY == balY) || (obstX == doelX && obstY == doelY));
}

void gameOver() {
  for (int n = 0; n < 5; n++) {
    for (int r = 0; r < 8; r++)
      for (int c = 0; c < 8; c++)
        matrix.setLed(0, r, c, true);
    delay(80);
    matrix.clearDisplay(0);
    delay(80);
  }
  score = 0;
  plaatsDoel();
  plaatsObstakel();
}

// In loop(): na de doel-check toevoegen:
// if (balX == obstX && balY == obstY) gameOver();`
      }
    ]
  },
  // ─────────────────────────────────────────────
  // TUTORIAL 35: IR-afstandsbediening leren & afspelen (Gemiddeld)
  // ─────────────────────────────────────────────
  {
    id: "ir-remote-leren",
    title: "IR-afstandsbediening leren & afspelen",
    description: "Lees codes uit van élke TV-afstandsbediening, sla ze op in code en speel ze terug via een IR-LED. Eigen mini-universele afstandsbediening op één Arduino.",
    difficulty: "Gemiddeld",
    materials: "Arduino Uno, VS1838B IR-receiver (3-pins module of los op breadboard), IR-LED (zendt 940nm — uitziet als gewone LED), 220Ω weerstand, 4 drukknoppen, breadboard + jumpers, een willekeurige TV/airco-afstandsbediening om uit te lezen. Bibliotheek: IRremote v3.x of v4.x (Bibliotheekbeheer → 'IRremote' van shirriff/Arduino-IRremote).",
    board: "arduino",
    tags: ["sensor"],
    learningGoal: "Werken met de IRremote-bibliotheek, IR-codes ontvangen en classificeren, ze opslaan in een struct-array, en ze later terug zenden via een IR-LED.",
    dateAdded: "2026-05-02",
    steps: [
      {
        id: "ir-s1",
        title: "Receiver setup + smoke-test",
        content: "De **VS1838B** is een 3-pins IR-module: VCC, GND en DATA. Hij heeft intern al een **38 kHz-bandfilter + demodulator** ingebouwd — daardoor levert-ie een schoon digitaal signaal aan de Arduino, geen analoge gekkigheid. **Pin-volgorde checken op je module!** De volgorde verschilt per fabrikant — kijk op de print of in de datasheet, anders blaas je 'm op.\n\n**Bibliotheek**: installeer 'IRremote' van shirriff/Arduino-IRremote via Bibliotheekbeheer. Wij gebruiken **v3.x of v4.x** — de moderne API met `IrReceiver` / `IrSender` als globale objecten. **Pas op**: oude tutorials op internet gebruiken nog v2.x (`#include <IRremote.h>` + `IRrecv myIR(...)`) — dat is INCOMPATIBEL. Onze code is v3+.\n\nIn deze stap: gewoon kijken of er signaal binnenkomt. Bij elke IR-druk verschijnt 'Signaal ontvangen!' in de Serial Monitor + de ingebouwde LED op pin 13 knippert mee.",
        diagram: true,
        code: ir_s1,
        legend: [
          { term: "#include <IRremote.hpp>", desc: "Let op: .hpp (niet .h). v3+ syntax. v2.x oude code gebruikt #include <IRremote.h>." },
          { term: "IrReceiver.begin(pin, ENABLE_LED_FEEDBACK)", desc: "Globale singleton, geen object aanmaken. ENABLE_LED_FEEDBACK = pin 13 knippert mee bij elke ontvangst." },
          { term: "int irRecvPin = 11", desc: "Data-pin van de VS1838B. Mag elke digitale pin zijn — 11 is gewoon traditie in de IRremote-voorbeelden." },
          { term: "IrReceiver.decode()", desc: "Returnt true als er een nieuwe code binnen is. False = nog niks." },
          { term: "IrReceiver.resume()", desc: "VERPLICHT na elke decode(). Vertelt de bibliotheek 'klaar, luister naar de volgende'. Vergeten = je hoort er nooit meer een." },
        ],
        assignment: "Sluit aan: VS1838B VCC→5V, GND→GND, OUT→pin 11. Installeer IRremote v3+ via Bibliotheekbeheer. Upload. Open Serial Monitor (9600). Richt een TV-remote op de sensor en druk willekeurige knoppen — 'Signaal ontvangen!' moet verschijnen + LED 13 knippert.",
        challenge: "Probeer je telefoon: vrijwel alle moderne smartphones hebben GEEN IR meer. Een tablet, oude TV-remote, airco-remote of speelgoedauto-remote werkt wel. Welke krijg je werkend?",
        reflection: "Waarom heeft een IR-module die 38 kHz-filter ingebouwd? (Hint: zonder zou de Arduino kamerverlichting, zon, halogeenlampen ook als 'IR' zien. 38 kHz pulseren is heel onnatuurlijk = uniek herkenbaar. Daarom werken IR-remotes ook in fel zonlicht.)",
      },
      {
        id: "ir-s2",
        title: "Codes leren: protocol + adres + commando",
        content: "Een IR-druk bestaat uit 3 stukjes data:\n- **Protocol** (NEC, Sony, RC5, Samsung, ...) — welk merk/standaard\n- **Adres** (16-bit) — welk apparaat (TV, airco, ...)\n- **Commando** (8-bit) — welke knop (volume +, kanaal -, ...)\n\nDe IRremote-lib decodeert dat automatisch. We printen alledrie en negeren 'herhalingen' (`IRDATA_FLAGS_IS_REPEAT`) — anders krijg je per knop-druk 5x dezelfde regel zolang je 'm vasthoudt.\n\n**Doel van deze stap**: noteer voor 4 knoppen op je remote (bv. aan/uit, vol+, vol-, mute) het adres en commando. Die heb je in stap 3 nodig.",
        code: ir_s2,
        legend: [
          { term: "IrReceiver.decodedIRData.protocol", desc: "Enum: NEC, SONY, RC5, SAMSUNG, ... Bij UNKNOWN: protocol niet herkend, maar raw-data wel — kan ook." },
          { term: "decodedIRData.address", desc: "16-bit identifier voor 'welk apparaat'. Vaak hetzelfde voor alle knoppen op één remote." },
          { term: "decodedIRData.command", desc: "8-bit identifier voor 'welke knop'. Dit verschilt per knop op de remote." },
          { term: "IRDATA_FLAGS_IS_REPEAT", desc: "Flag = 1 als dit een 'auto-repeat'-frame is (knop ingedrukt gehouden). Negeren maakt logs leesbaar." },
          { term: "getProtocolString(...)", desc: "Vertaalt het protocol-enum naar leesbare tekst voor in Serial." },
        ],
        assignment: "Upload. Druk op je remote: aan/uit, vol+, vol-, mute. NOTEER van elk: adres + commando (in HEX). Die ga je in stap 3 invullen. Voorbeeld-uitvoer: `Protocol: NEC adres: 0xFF00 commando: 0x40`.",
        challenge: "Probeer 2 verschillende remotes (TV én airco). Hebben ze hetzelfde protocol? Hetzelfde adres?",
        reflection: "Waarom heeft IRremote dat 'flags & IRDATA_FLAGS_IS_REPEAT'-systeem? (Hint: TV-volume ophogen werkt door knop ingedrukt te HOUDEN — dat moet meermaals een puls geven. Maar voor 'aan/uit' wil je ALLEEN de eerste druk. De flag laat de programmeur kiezen.)",
      },
      {
        id: "ir-s3",
        title: "Codes opslaan in een struct-array",
        content: "Nu we onze 4 codes hebben: opslaan in code zodat we ze kunnen herkennen en straks terugzenden. We gebruiken een `struct` met een naam + adres + commando, en een array van die structs als 'whitelist'.\n\n**Belangrijk**: vervang de voorbeeld-codes (`0x00FF`, `0x40` etc.) door JOUW eigen waarden uit stap 2. Anders herkent het systeem niets en zendt-ie straks codes voor een TV die niemand heeft.\n\nIn de loop checken we elke ontvangen code tegen de whitelist. Match → naam printen. Geen match → adres+commando printen zodat je nieuwe codes kunt toevoegen.",
        code: ir_s3,
        legend: [
          { term: "struct OpgenomenCode { ... }", desc: "Eigen data-type met meerdere velden. Net als een mini-class zonder methodes. Heel handig voor 'records' van data." },
          { term: "OpgenomenCode codes[] = { ... }", desc: "Array van structs. Compiler bepaalt zelf de lengte uit het aantal items tussen de accolades." },
          { term: "sizeof(codes) / sizeof(codes[0])", desc: "Klassieke C-truc om de array-lengte uit te rekenen. Werkt alleen op echte arrays, niet op pointers." },
          { term: "for (int i = 0; i < AANTAL; i++)", desc: "Doorzoek de whitelist. Stop zodra er een match is. O(N) is prima voor maximaal ~50 codes." },
          { term: "0x00FF, 0x40 (vervangen!)", desc: "Voorbeeld-codes — voor jouw remote ZIJN DEZE FOUT. Gebruik de waarden die je in stap 2 in de Serial Monitor zag." },
        ],
        assignment: "Vervang de 4 voorbeeld-codes door JOUW eigen waarden uit stap 2. Upload. Druk op je remote: bekende knoppen → naam printen. Onbekende knoppen → 'Onbekend: 0x.../0x...' printen.",
        challenge: "Voeg een 5e knop toe ('Channel +') aan de array. Doe je dit door alleen de codes-array uit te breiden? Wat verandert er nog? (Hint: niks! AANTAL wordt automatisch herberekend door sizeof.)",
        reflection: "Waarom zit de knop-naam in de struct in plaats van een aparte parallelle array (`const char* namen[] = ...`)? (Hint: 1 plek per knop = onmogelijk om uit sync te raken. Bij parallelle arrays vergeet je een keer iets bij te werken en dan klopt 'naam[2]' niet meer bij 'codes[2]'.)",
      },
      {
        id: "ir-s4",
        title: "Knoppen → IR-codes uitzenden via IR-LED",
        content: "Eindversie: 4 knoppen, elke knop zendt z'n bijbehorende code via een **IR-LED**. Je hebt nu een werkende mini-universele afstandsbediening.\n\n**Cruciaal — pin 3 verplicht!** IRremote v3+/v4 gebruikt op de Uno **standaard pin 3** voor zenden. Pin 3 is een TIMER2-PWM-pin; de bibliotheek genereert daarop het 38 kHz draaggolfsignaal. Andere pinnen werken NIET zonder extra config. Onthoud: receiver kan elke pin, **zender moet pin 3** op de Uno.\n\n**IR-LED ALTIJD met 220Ω weerstand!** De LED kan tot 100mA pulsen, en zonder weerstand brandt-ie binnen seconden door. Lange poot (anode) → pin 3 via 220Ω, korte poot (kathode) → GND.\n\n**Edge-detectie op de knoppen**: bij vasthouden zou je 50× per seconde zenden — irritant + spam. We onthouden `wasIngedrukt[]` en zenden alleen op de los→ingedrukt-overgang.",
        diagram: true,
        code: ir_s4,
        legend: [
          { term: "int irLedPin = 3", desc: "VERPLICHT pin 3 op de Uno. Andere pinnen kunnen geen 38 kHz PWM. Via 220Ω in serie naar de IR-LED-anode (lange poot)." },
          { term: "IrSender.begin(irLedPin)", desc: "Start de 38 kHz-PWM-carrier op pin 3. Daarna kun je sendNEC(), sendSony() etc. aanroepen." },
          { term: "IrSender.sendNEC(adres, commando, 0)", desc: "Zend in NEC-protocol. Laatste 0 = geen herhalingen (alleen 1 puls). Voor andere protocollen: sendSony(), sendRC5(), etc." },
          { term: "wasIngedrukt[i] = nu", desc: "Edge-detectie: alleen op overgang los→ingedrukt zenden. Voorkomt 50 verzonden codes per seconde bij vasthouden." },
          { term: "IR-LED 220Ω verplicht", desc: "Zonder weerstand: doorgebrand binnen seconden. IR-LED ziet er normaal uit maar zendt 940nm — onzichtbaar voor het oog (wel zichtbaar via een telefooncamera!)." },
        ],
        assignment: "Sluit aan: IR-LED anode→pin 3 (via 220Ω), kathode→GND. 4 knoppen op pin 4..7 (andere pin van elke knop → GND). Vul JOUW codes uit stap 2 in. Upload. Houd de IR-LED dichtbij je TV (1-2 meter), druk op een Arduino-knop → de TV moet reageren.",
        challenge: "**Werkt-ie niet?** Test of de IR-LED écht zendt: richt 'm op je smartphone-camera (achter-camera) en druk op een knop. De LED hoort PAARS/WIT te flitsen door de camera. Veel telefoon-camera's filteren IR niet weg — handige debug-truc.",
        reflection: "Waarom werkt deze 'universele afstandsbediening' wel voor TV's en airco's, maar niet voor moderne Apple TV's / Chromecasts? (Hint: die gebruiken Bluetooth of WiFi, geen IR. IR vereist line-of-sight + werkt alleen op klassieke apparaten met IR-ontvanger.)",
        optionalCodeTitle: "Snippet: zend dezelfde code in andere protocollen",
        optionalCode: `// Niet elk apparaat is NEC. Voorbeelden voor andere veelgebruikte protocollen:

// Sony TV (12-bit commando)
IrSender.sendSony(commando, 12);

// RC5 (Philips, oudere apparaten)
IrSender.sendRC5(adres, commando);

// Samsung TVs
IrSender.sendSamsung(adres, commando, 0);

// Onbekend protocol — zend de raw decode terug:
IrSender.sendNECRaw(IrReceiver.decodedIRData.decodedRawData, 0);`
      }
    ]
  }
];
