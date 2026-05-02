import type { ReactNode } from "react";
import { ArrowRight, CircuitBoard, Wifi } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ComponentType =
  | "neopixel"
  | "led"
  | "potmeter"
  | "pir"
  | "ldr"
  | "dht"
  | "buzzer"
  | "button"
  | "servo"
  | "joystick"
  | "stepper"
  | "encoder"
  | "lcd_i2c"
  | "oled_ssd1306"
  | "mpu6050"
  | "ir_recv"
  | "ir_led"
  | "matrix8x8"
  | "relay"
  | "reed"
  | "soil"
  | "mq"
  | "rfid"
  | "pump";

type ColorKey = "teal" | "yellow" | "amber" | "blue" | "rose" | "violet" | "orange" | "slate" | "green";

type WiringRow = {
  from: string;
  to: string;
  resistance?: string;
  color: ColorKey;
  direction?: "in" | "out";
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

// ─── Board detection ──────────────────────────────────────────────────────────

function isEsp32(code: string): boolean {
  return /#include\s*<WiFi\.h>|#include\s*<WebServer\.h>|#include\s*<HTTPClient\.h>|#include\s*<WiFiClientSecure\.h>|#include\s*<BLEDevice\.h>|#include\s*<BleKeyboard\.h>|esp_camera|esp_sleep|esp_deep_sleep/.test(code);
}

function isEsp32Cam(code: string): boolean {
  return /esp_camera|PWDN_GPIO_NUM|AI[\s_-]?Thinker/i.test(code);
}

function pinLabel(pin: string, esp32: boolean): string {
  if (esp32) return `GPIO ${pin.replace(/^A/, "")}`;
  return pin.startsWith("A") ? `Analoge pin ${pin}` : `Pin ${pin}`;
}

const BOARD_VCC = (esp32: boolean) => esp32 ? "5V (VIN)" : "5V";
const BOARD_VCC_LOGIC = (esp32: boolean) => esp32 ? "3.3V" : "5V";

// ─── Parser ───────────────────────────────────────────────────────────────────

type ParsedPin = { name: string; pin: string };

function parsePins(code: string): ParsedPin[] {
  const result: ParsedPin[] = [];
  const seen = new Set<string>();

  // int vars: match if name contains "pin", "joystick" or "joy"
  const intPattern = /int\s+(\w+)\s*=\s*(A?\d+)\s*;/g;
  // #define: match pure numeric / A+numeric values
  const definePattern = /#define\s+(\w+)\s+(A?\d+)\b/g;
  // servo.attach(N): matches servo1.attach(9), servo2.attach(10), etc.
  const servoPattern = /(servo\w*)\.attach\((\d+)\)/gi;

  let m: RegExpExecArray | null;
  while ((m = intPattern.exec(code)) !== null) {
    const name = m[1];
    const n = name.toLowerCase();
    if ((n.includes("pin") || n.includes("joystick") || n.includes("joy")) && !seen.has(name)) {
      seen.add(name);
      result.push({ name, pin: m[2] });
    }
  }
  while ((m = definePattern.exec(code)) !== null) {
    const name = m[1];
    const n = name.toLowerCase();
    if ((n.includes("pin") || n.includes("button") || n.includes("btn")) && !seen.has(name)) {
      seen.add(name);
      result.push({ name, pin: m[2] });
    }
  }
  while ((m = servoPattern.exec(code)) !== null) {
    const servoName = m[1].toLowerCase();
    const pin = m[2];
    const syntheticName = `${servoName}_pin${pin}`;
    if (!seen.has(syntheticName)) {
      seen.add(syntheticName);
      result.push({ name: syntheticName, pin });
    }
  }
  return result;
}

function classifyName(name: string): ComponentType | null {
  const n = name.toLowerCase();
  if (n === "data_pin" || n.startsWith("datapin") || n === "data") return "neopixel";
  if (n.includes("pomp") || n.includes("pump")) return "pump";
  if (n.includes("relay") || n.includes("relais") || n.includes("lamp")) return "relay";
  if (n.includes("reed")) return "reed";
  if (n.includes("soil") || n.includes("bodem") || (n.includes("vocht") && !n.includes("dht"))) return "soil";
  if (n.includes("mq") || n.includes("co2") || n.includes("ppm") || (n.includes("gas") && n.includes("pin"))) return "mq";
  // IR moet vóór "led" staan: irLedPin bevat anders óók "led".
  if (n.includes("irrecv") || n.includes("ir_recv") || n.includes("ir_receive") || n.includes("irreceive")) return "ir_recv";
  if (n.includes("irled") || n.includes("ir_led") || n.includes("ir_send") || n.includes("irsend") || n.includes("ir_tx") || n.includes("irtx")) return "ir_led";
  if (n.includes("led")) return "led";
  if (n.includes("pot")) return "potmeter";
  if (n.includes("pir")) return "pir";
  if (n.includes("ldr")) return "ldr";
  if (n === "dhtpin" || n.includes("dht")) return "dht";
  if (n.includes("buzz")) return "buzzer";
  if (n.includes("button") || n.includes("btn") || n.includes("knop")) return "button";
  if (n.startsWith("servo")) return "servo";
  if (n.includes("joystick") || n.includes("joy")) return "joystick";
  if (n.startsWith("step") || n.startsWith("dir")) return "stepper";
  if (n.startsWith("clk") || n.startsWith("dt") || n.includes("encoder")) return "encoder";
  return null;
}

// ─── Build wiring rows from parsed pins ───────────────────────────────────────

type DiagramData = {
  signalRows: WiringRow[];
  powerRows: PowerRow[];
  gndRows: PowerRow[];
  esp32: boolean;
};

function buildDiagram(code: string): DiagramData {
  const esp32 = isEsp32(code);
  const pins = parsePins(code);
  const signalRows: WiringRow[] = [];
  const detectedComponents = new Set<ComponentType>();

  // Detect I2C devices: LCD, OLED (SSD1306 / U8g2), MPU6050. Allemaal delen ze SDA/SCL.
  // Default I2C pins: Arduino A4/A5, ESP32 GPIO 21/22.
  const i2cDeviceLabels: string[] = [];
  if (/#include\s*<LiquidCrystal_I2C\.h>|LiquidCrystal_I2C\s+\w+\s*\(/.test(code)) {
    detectedComponents.add("lcd_i2c");
    i2cDeviceLabels.push("LCD");
  }
  if (/#include\s*<Adafruit_SSD1306\.h>|#include\s*<U8g2lib\.h>|#include\s*<U8x8lib\.h>|Adafruit_SSD1306\s+\w+\s*\(|U8G2_\w+/.test(code)) {
    detectedComponents.add("oled_ssd1306");
    i2cDeviceLabels.push("OLED");
  }
  if (/#include\s*<MPU6050\.h>|#include\s*<Adafruit_MPU6050\.h>|#include\s*<MPU6050_light\.h>|MPU6050\s+\w+\s*[;(]|Adafruit_MPU6050\s+\w+/.test(code)) {
    detectedComponents.add("mpu6050");
    i2cDeviceLabels.push("MPU6050");
  }
  if (i2cDeviceLabels.length > 0) {
    const label = i2cDeviceLabels.join(" + ");
    if (esp32) {
      signalRows.push({ from: "GPIO 21 (SDA)", to: `${label} SDA`, color: "blue", direction: "out" });
      signalRows.push({ from: "GPIO 22 (SCL)", to: `${label} SCL`, color: "blue", direction: "out" });
    } else {
      signalRows.push({ from: "Pin A4 (SDA)", to: `${label} SDA`, color: "blue", direction: "out" });
      signalRows.push({ from: "Pin A5 (SCL)", to: `${label} SCL`, color: "blue", direction: "out" });
    }
  }

  // Detect RC522 RFID module via MFRC522 library (SPI bus, fixed wiring on Uno).
  if (/#include\s*<MFRC522\.h>|MFRC522\s+\w+\s*\(/.test(code)) {
    detectedComponents.add("rfid");
    if (esp32) {
      signalRows.push({ from: "GPIO 5 (SS / SDA)",   to: "RC522 SDA (SS)",                 color: "amber", direction: "out" });
      signalRows.push({ from: "GPIO 18 (SCK)",       to: "RC522 SCK",                      color: "amber", direction: "out" });
      signalRows.push({ from: "GPIO 23 (MOSI)",      to: "RC522 MOSI",                     color: "amber", direction: "out" });
      signalRows.push({ from: "GPIO 19 (MISO)",      to: "RC522 MISO",                     color: "amber", direction: "in"  });
      signalRows.push({ from: "GPIO 4 (RST)",        to: "RC522 RST",                      color: "amber", direction: "out" });
      signalRows.push({ from: "GPIO 21 (IRQ — optioneel)", to: "RC522 IRQ (niet vereist in basiscode)", color: "amber", direction: "in"  });
    } else {
      signalRows.push({ from: "Pin 10 (SS / SDA)",   to: "RC522 SDA (SS)",                 color: "amber", direction: "out" });
      signalRows.push({ from: "Pin 13 (SCK)",        to: "RC522 SCK",                      color: "amber", direction: "out" });
      signalRows.push({ from: "Pin 11 (MOSI)",       to: "RC522 MOSI",                     color: "amber", direction: "out" });
      signalRows.push({ from: "Pin 12 (MISO)",       to: "RC522 MISO",                     color: "amber", direction: "in"  });
      signalRows.push({ from: "Pin 9 (RST)",         to: "RC522 RST",                      color: "amber", direction: "out" });
      signalRows.push({ from: "Pin 2 (IRQ — optioneel)", to: "RC522 IRQ (niet vereist in basiscode)", color: "amber", direction: "in"  });
    }
  }

  // Detect MAX7219 8x8 LED matrix via the LedControl library.
  // Constructor signature: LedControl name(DIN, CLK, CS, NUM_DEVICES);
  const ledCtrlMatch = /LedControl\s+\w+\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,/.exec(code);
  if (ledCtrlMatch || /#include\s*[<"]LedControl\.h[>"]/.test(code)) {
    detectedComponents.add("matrix8x8");
    const dinPin = ledCtrlMatch ? ledCtrlMatch[1] : "12";
    const clkPin = ledCtrlMatch ? ledCtrlMatch[2] : "11";
    const csPin  = ledCtrlMatch ? ledCtrlMatch[3] : "10";
    signalRows.push({ from: pinLabel(dinPin, esp32), to: "MAX7219 DIN (Data In)", color: "teal", direction: "out" });
    signalRows.push({ from: pinLabel(clkPin, esp32), to: "MAX7219 CLK (Clock)",  color: "teal", direction: "out" });
    signalRows.push({ from: pinLabel(csPin,  esp32), to: "MAX7219 CS (Load)",    color: "teal", direction: "out" });
  }

  for (const { name, pin } of pins) {
    const type = classifyName(name);
    if (!type) continue;
    detectedComponents.add(type);

    const label = pinLabel(pin, esp32);

    switch (type) {
      case "neopixel":
        signalRows.push({ from: label, resistance: "330Ω", to: "NeoPixel Din (Data In)", color: "teal", direction: "out" });
        break;
      case "led":
        signalRows.push({ from: label, resistance: "220Ω", to: "LED + (anode)", color: "yellow", direction: "out" });
        break;
      case "potmeter":
        signalRows.push({ from: label, to: "Potmeter (midden-aansluiting)", color: "violet", direction: "in" });
        break;
      case "pir":
        signalRows.push({ from: label, to: "PIR sensor OUT-pin", color: "orange", direction: "in" });
        break;
      case "ldr":
        signalRows.push({ from: label, to: "LDR + 10kΩ spanningsdeler", color: "amber", direction: "in" });
        break;
      case "dht":
        signalRows.push({ from: label, resistance: "10kΩ", to: "DHT11 DATA-pin", color: "blue", direction: "in" });
        break;
      case "buzzer":
        signalRows.push({ from: label, to: "Buzzer + (positief)", color: "rose", direction: "out" });
        break;
      case "button": {
        const lbl = name.toLowerCase().includes("left")
          ? "Knop links (andere pin → GND)"
          : name.toLowerCase().includes("right")
          ? "Knop rechts (andere pin → GND)"
          : "Knop (andere pin → GND)";
        signalRows.push({ from: label, to: lbl, color: "slate", direction: "in" });
        break;
      }
      case "reed":
        signalRows.push({ from: label, to: "Reed-schakelaar (andere pin → GND)", color: "slate", direction: "in" });
        break;
      case "servo": {
        const servoLabel = name.toLowerCase().includes("servo2") || name.toLowerCase().includes("_2")
          ? "Servo 2 Signaal (Oranje)"
          : "Servo 1 Signaal (Oranje)";
        signalRows.push({ from: label, to: servoLabel, color: "green", direction: "out" });
        break;
      }
      case "joystick": {
        const axisLabel = name.toLowerCase().includes("y")
          ? "Joystick VRY (Y-as)"
          : "Joystick VRX (X-as)";
        signalRows.push({ from: label, to: axisLabel, color: "violet", direction: "in" });
        break;
      }
      case "stepper": {
        const n = name.toLowerCase();
        const isStep = n.startsWith("step");
        const axis = n.includes("x") ? " (X-as)" : n.includes("y") ? " (Y-as)" : n.includes("z") ? " (Z-as)" : "";
        const lbl = isStep
          ? `A4988/DRV8825 STEP${axis}`
          : `A4988/DRV8825 DIR${axis}`;
        signalRows.push({ from: label, to: lbl, color: "blue", direction: "out" });
        break;
      }
      case "encoder": {
        const n = name.toLowerCase();
        const lbl = n.startsWith("clk")
          ? "Rotary Encoder CLK"
          : n.startsWith("dt")
          ? "Rotary Encoder DT"
          : "Rotary Encoder";
        signalRows.push({ from: label, to: lbl, color: "orange", direction: "in" });
        break;
      }
      case "relay":
        signalRows.push({ from: label, to: "Relais IN (control)", color: "rose", direction: "out" });
        break;
      case "soil":
        signalRows.push({ from: label, to: "Bodemvocht-sensor AOUT", color: "blue", direction: "in" });
        break;
      case "mq":
        signalRows.push({ from: label, to: "MQ-135 AOUT (analoge waarde)", color: "amber", direction: "in" });
        break;
      case "pump":
        signalRows.push({ from: label, to: "Relais IN (stuurt 5V-pomp)", color: "rose", direction: "out" });
        break;
      case "ir_recv":
        signalRows.push({ from: label, to: "VS1838B IR-receiver OUT (data)", color: "amber", direction: "in" });
        break;
      case "ir_led":
        signalRows.push({ from: label, resistance: "220Ω", to: "IR-LED + (anode, lange poot)", color: "rose", direction: "out" });
        break;
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
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "NeoPixel 5V", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "NeoPixel GND", color: "slate" });
        break;
      case "led":
        gndRows.push({ arduinoPin: "GND", componentPin: "LED − (kathode)", color: "slate" });
        break;
      case "potmeter":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "Potmeter links", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Potmeter rechts", color: "slate" });
        break;
      case "pir":
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "PIR VCC (5V)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "PIR GND", color: "slate" });
        break;
      case "ldr":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "LDR (via weerstand naar input)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "10kΩ naar GND", color: "slate" });
        break;
      case "dht":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "DHT11 VCC", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "DHT11 GND", color: "slate" });
        break;
      case "buzzer":
        gndRows.push({ arduinoPin: "GND", componentPin: "Buzzer − (negatief)", color: "slate" });
        break;
      case "button":
        gndRows.push({ arduinoPin: "GND", componentPin: "Knoppen (andere aansluitpen)", color: "slate" });
        break;
      case "servo":
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "Servo(s) VCC (Rood)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Servo(s) GND (Bruin)", color: "slate" });
        break;
      case "joystick":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "Joystick VCC", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Joystick GND", color: "slate" });
        break;
      case "stepper":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "Driver VDD (logica)", color: "rose" });
        powerRows.push({ arduinoPin: "Externe 8–35V", componentPin: "Driver VMOT (motor) + 100µF cap", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Driver GND (logica + motor)", color: "slate" });
        break;
      case "encoder":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "Encoder + (VCC)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Encoder GND", color: "slate" });
        break;
      case "lcd_i2c":
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "LCD VCC (op I2C-backpack)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "LCD GND (op I2C-backpack)", color: "slate" });
        break;
      case "oled_ssd1306":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "OLED VCC (3.3V of 5V — check je module)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "OLED GND", color: "slate" });
        break;
      case "mpu6050":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "MPU6050 VCC (3.3V of 5V via on-board regelaar)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "MPU6050 GND", color: "slate" });
        break;
      case "ir_recv":
        powerRows.push({ arduinoPin: BOARD_VCC_LOGIC(esp32), componentPin: "VS1838B VCC (let op pin-volgorde!)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "VS1838B GND", color: "slate" });
        break;
      case "ir_led":
        gndRows.push({ arduinoPin: "GND", componentPin: "IR-LED − (kathode, korte poot)", color: "slate" });
        break;
      case "matrix8x8":
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "MAX7219 VCC (5V)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "MAX7219 GND", color: "slate" });
        break;
      case "relay":
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "Relais-module VCC (5V)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Relais-module GND", color: "slate" });
        break;
      case "reed":
        gndRows.push({ arduinoPin: "GND", componentPin: "Reed-schakelaar (andere pin)", color: "slate" });
        break;
      case "soil":
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "Bodemvocht VCC (5V)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Bodemvocht GND", color: "slate" });
        break;
      case "mq":
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "MQ-135 VCC (5V — heater!)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "MQ-135 GND", color: "slate" });
        break;
      case "rfid":
        powerRows.push({ arduinoPin: "3.3V", componentPin: "RC522 3.3V (NIET 5V!)", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "RC522 GND", color: "slate" });
        break;
      case "pump":
        powerRows.push({ arduinoPin: BOARD_VCC(esp32), componentPin: "Relais-module VCC (5V)", color: "rose" });
        powerRows.push({ arduinoPin: "Externe 5V (apart!)", componentPin: "Pomp + via Relais NO/COM", color: "rose" });
        gndRows.push({ arduinoPin: "GND", componentPin: "Relais-module GND + pomp − (gemeenschappelijk)", color: "slate" });
        break;
    }
  }

  return { signalRows, powerRows, gndRows, esp32 };
}

// ─── ESP32-CAM FTDI programmer wiring (fixed) ─────────────────────────────────

type CamRow = { from: string; to: string; note?: string };

const FTDI_ROWS: CamRow[] = [
  { from: "FTDI 5V",   to: "ESP32-CAM 5V" },
  { from: "FTDI GND",  to: "ESP32-CAM GND" },
  { from: "FTDI TX",   to: "ESP32-CAM U0R (RX, GPIO 3)" },
  { from: "FTDI RX",   to: "ESP32-CAM U0T (TX, GPIO 1)" },
  { from: "GND-rail",  to: "ESP32-CAM IO0", note: "alleen tijdens uploaden" },
];

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
  const { signalRows, powerRows, gndRows, esp32 } = buildDiagram(code);
  const cam = isEsp32Cam(code);

  if (signalRows.length === 0 && !cam) return null;

  const board = cam ? "ESP32-CAM" : esp32 ? "ESP32" : "Arduino";

  return (
    <div className="my-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-100/50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h4 className="font-display font-semibold text-sm text-slate-700 flex items-center gap-2">
          <CircuitBoard className="w-4 h-4 text-primary" />
          Aansluitschema
        </h4>
        {esp32 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Wifi className="w-3 h-3" /> {cam ? "ESP32-CAM" : "ESP32"}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3">
        {cam && (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              FTDI-programmer ↔ ESP32-CAM (alleen tijdens uploaden)
            </p>
            {FTDI_ROWS.map((row, i) => (
              <Row
                key={`ftdi-${i}`}
                left={<ChipBadge label={row.from} color="violet" />}
                middle={row.note}
                right={<ChipBadge label={row.to} color="violet" />}
              />
            ))}
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg px-3 py-2 text-[12px] text-amber-800 leading-relaxed">
              <strong>Upload-procedure:</strong> Houd <code className="bg-amber-100 px-1 rounded">IO0 → GND</code> vast, druk op de RESET-knop op de ESP32-CAM, klik op Upload in de Arduino IDE. Wanneer je <em>"Connecting..."</em> ziet → laat <code className="bg-amber-100 px-1 rounded">IO0</code> los. Na uploaden: koppel <code className="bg-amber-100 px-1 rounded">IO0</code> volledig los en druk RESET om het programma te starten.
            </div>
          </>
        )}

        {signalRows.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {cam ? "Extra sensoren (ESP32-CAM GPIOs)" : "Data / signaal"}
          </p>
        )}
        {signalRows.map((row, i) => (
          <Row
            key={i}
            left={<ChipBadge label={`${board}  ${row.from}`} color={row.color} />}
            middle={row.resistance}
            right={<ChipBadge label={row.to} color={row.color} />}
          />
        ))}

        {powerRows.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-2">Voeding</p>
        )}
        {powerRows.map((row, i) => (
          <Row
            key={i}
            left={<ChipBadge label={`${board}  ${row.arduinoPin}`} color="rose" />}
            right={<ChipBadge label={row.componentPin} color="rose" />}
          />
        ))}

        {gndRows.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-2">Aarde (GND)</p>
        )}
        {gndRows.map((row, i) => (
          <Row
            key={i}
            left={<ChipBadge label={`${board}  ${row.arduinoPin}`} color="slate" />}
            right={<ChipBadge label={row.componentPin} color="slate" />}
          />
        ))}
      </div>
    </div>
  );
}
