// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001; // O la porta che preferisci
const url = "127.0.0.1";
app.use(cors());
app.use(express.json());

let usersConnected = 0;

// Percorso al file counter.json fuori dalla cartella del sito
const counterFile = path.resolve(__dirname, "counter.json");
const writeQueue = [];
// Funzione per leggere il contatore dal file
function readCounter() {
  try {
    const data = fs.readFileSync(counterFile, "utf8");
    console.log(data);
    return JSON.parse(data);
  } catch (error) {
    // Se il file non esiste, inizializzalo
    const initialData = { baseSteps: 0, views: 0, startTime: Date.now() };
    console.log(initialData);
    writeCounterAsync(initialData);
    return initialData;
  }
}

// Inizializza il contatore leggendo dal file
let data = readCounter();

function processWriteQueue() {
  if (writeQueue.length === 0) {
    return;
  }

  const dataToWrite = writeQueue.shift();

  fs.writeFile(counterFile, JSON.stringify(dataToWrite), (err) => {
    if (err) {
      console.error("Errore nella scrittura di counter.json", err);
    } else {
      // console.log("Contatore salvato nel file counter.json");
    }

    // Processa la prossima scrittura
    processWriteQueue();
  });
}

function writeCounterAsync(data) {
  writeQueue.push(data);
  if (writeQueue.length === 1) {
    // Se la coda era vuota, inizia a processare
    processWriteQueue();
  }
}

function updateData(updateFn) {
  // Esegui l'aggiornamento allo stato
  updateFn(data);

  // Clona l'oggetto data per evitare riferimenti
  const dataClone = { ...data };

  // Scrivi lo stato aggiornato su disco in modo asincrono
  writeCounterAsync(dataClone);
}

function incrementStepCounter(io) {
  updateData((data) => {
    data.baseSteps += 1;
  });

  console.log(`Contatore Passi incrementato a ${data.baseSteps}`);

  io.emit("stepCounterUpdate", { stepCounter: data.baseSteps });
}

function incrementViewsCounter(io) {
  updateData((data) => {
    data.views += 1;
  });

  console.log(`Contatore Views incrementato a ${data.views}`);

  io.emit("viewsCounterUpdate", { viewsCounter: data.views });
}

function setUsersConnected(io, connection) {
  usersConnected = usersConnected + connection;

  io.emit("usersConnectedUpdate", { usersConnected: data.usersConnected });
}

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: `https://${url}:3000`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Un client si e' connesso:", socket.id);

  // Incrementa il contatore delle views di 1, per la nuova connessione appena aperta
  incrementViewsCounter(io);
  setUsersConnected(io, 1);
  // Invia il contatore attuale al nuovo client
  socket.emit("counterUpdate", { stepCounter: data.baseSteps, viewsCounter: data.views });

  // Gestisci errori del socket
  socket.on("error", (error) => {
    console.error("Errore del socket:", error);
  });

  // Gestisci la disconnessione del client
  socket.on("disconnect", () => {
    console.log("Un client si � disconnesso:", socket.id);
    setUsersConnected(io, -1);
  });
});

// Avvia un timer che incrementa il contatore ogni secondo
setInterval(() => incrementStepCounter(io), 750);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
