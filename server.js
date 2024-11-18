// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3001; // O la porta che preferisci

app.use(cors());
app.use(express.json());

// Percorso al file counter.json fuori dalla cartella del sito
const counterFile = path.resolve(__dirname, "..", "counter.json");

// Funzione per leggere il contatore dal file
function readCounter() {
  try {
    const data = fs.readFileSync(counterFile, "utf8");
    console.log(data);
    return JSON.parse(data);
  } catch (error) {
    // Se il file non esiste, inizializzalo
    const initialData = { baseSteps: 0, startTime: Date.now() };
    console.log(initialData);
    writeCounter(initialData);
    return initialData;
  }
}

// Funzione per scrivere il contatore nel file
function writeCounter(data) {
  fs.writeFileSync(counterFile, JSON.stringify(data));
}

// Inizializza il contatore leggendo dal file
let data = readCounter();

// Funzione per incrementare il contatore
function incrementCounter() {
  data.baseSteps += 1; // Incrementa di 1 ogni secondo
  writeCounter(data); // Salva il contatore nel file
  console.log(`Contatore incrementato a ${data.baseSteps}`);
}

// Avvia un timer che incrementa il contatore ogni secondo
setInterval(incrementCounter, 750); // 1000 millisecondi = 1 secondo

// Endpoint per ottenere il valore del contatore
app.get("/counter", (req, res) => {
  res.json({ counter: data.baseSteps });
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
