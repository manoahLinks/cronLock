#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ---------------- RFID ----------------
#define SS_PIN   5
#define RST_PIN  22
MFRC522 mfrc522(SS_PIN, RST_PIN);

// ---------------- LED ----------------
#define LED_PIN  2

// ---------------- WIFI ----------------
const char* ssid     = "AwesomeuncleB";
const char* password = "Awesomelyuncleb";

// ---------------- PAYMENT API ----------------
const char* apiURL = "put the key here";

// ---------------- AUTHORIZED UID ----------------
byte authorizedUID[4] = {0x6A, 0x17, 0x41, 0xB4};

// ---------------- LCD SIMULATION ----------------
void lcdSim(String line1, String line2) {
  Serial.println("----------------");
  Serial.println("[LCD]");
  Serial.print("Line 1: ");
  Serial.println(line1);
  Serial.print("Line 2: ");
  Serial.println(line2);
  Serial.println("----------------");
}

void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); // system ON

  // RFID
  SPI.begin();
  mfrc522.PCD_Init();

  // WiFi
  WiFi.begin(ssid, password);
  lcdSim("Connecting WiFi", "Please wait");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
  Serial.println(WiFi.localIP());

  lcdSim("Door System", "Scan Card");
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  lcdSim("Card Detected", "Checking...");

  bool cardAuthorized = true;

  Serial.print("Card UID: ");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    Serial.print(" ");

    if (mfrc522.uid.uidByte[i] != authorizedUID[i]) {
      cardAuthorized = false;
    }
  }
  Serial.println();

  // ---------- CASE 1: CARD NOT AUTHORIZED ----------
  if (!cardAuthorized) {
    lcdSim("Card Not Auth", "Register & Pay");
    Serial.println("CARD NOT AUTHORIZED");
    delay(3000);
    lcdSim("Door System", "Scan Card");
    return;
  }

  // ---------- CASE 2: CARD AUTHORIZED ----------
  lcdSim("Card Authorized", "Checking Pay");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiURL);
    http.addHeader("Content-Type", "application/json");

    // Minimal payload (optional, API still works if ignored)
    String payload = "{ \"uid\": \"6A1741B4\" }";

    int httpCode = http.POST(payload);

    Serial.print("HTTP Status Code: ");
    Serial.println(httpCode);

    if (httpCode == 200) {
      lcdSim("Access Granted", "Welcome");
      Serial.println("PAYMENT SUCCESS");
      Serial.println("ACCESS GRANTED");
    } else {
      lcdSim("Card Authorized", "Make Payment");
      Serial.println("PAYMENT NOT COMPLETED");
    }

    http.end();
  } else {
    lcdSim("WiFi Error", "No Access");
    Serial.println("WIFI DISCONNECTED");
  }

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  delay(3000);
  lcdSim("Door System", "Scan Card");
}