// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001; // O la porta che preferisci

app.use(cors());
app.use(express.json());

// Percorso al file counter.json fuori dalla cartella del sito
const counterFile = path.resolve(__dirname, "counter.json");

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
  try {
    fs.writeFileSync(counterFile, JSON.stringify(data));
    console.log("Contatore salvato nel file:", data);
  } catch (error) {
    console.error("Errore nella scrittura di counter.json", error);
  }
}

// Inizializza il contatore leggendo dal file
let data = readCounter();

// Funzione per incrementare il contatore
function incrementCounter(io) {
  data.baseSteps += 1; // Incrementa di 1 ogni secondo
  writeCounter(data); // Salva il contatore nel file
  console.log(`Contatore incrementato a ${data.baseSteps}`);

  // Invia l'aggiornamento del contatore a tutti i client connessi
  io.emit("counterUpdate", { counter: data.baseSteps });
}

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "https://stefanoscalfari.it",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Un client si è connesso:", socket.id);

  // Invia il contatore attuale al nuovo client
  socket.emit("counterUpdate", { counter: data.baseSteps });

  // Gestisci la disconnessione del client
  socket.on("disconnect", () => {
    console.log("Un client si è disconnesso:", socket.id);
  });
});

// Avvia un timer che incrementa il contatore ogni secondo
setInterval(() => incrementCounter(io), 750);

// Endpoint per ottenere il valore del contatore
app.get("/counter", (req, res) => {
  res.json({ counter: data.baseSteps });
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://dominio:${port}`);
});
