const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const app = express();

// Servir archivos estáticos
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));
app.use("/views", express.static(path.join(__dirname, "../frontend/views")));

// Ruta raíz sirve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/index.html"));
});

const server = http.createServer(app);
const io = socketIO(server);

// Almacenar jugadores conectados temporalmente en memoria
let jugadores = [];
let partidaIniciada = false;

io.on("connection", (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);

  // Listener: join-game
  socket.on("join-game", (data) => {
    jugadores.push({
      id: socket.id,
      nombre: data?.nombre || `Jugador${jugadores.length + 1}`,
    });
    console.log(`Jugador unido: ${socket.id} (${data?.nombre})`);
    io.emit("game-state", { jugadores, partidaIniciada });
  });

  // Listener: start-game
  socket.on("start-game", () => {
    if (jugadores.length >= 2 && !partidaIniciada) {
      partidaIniciada = true;
      console.log("Partida iniciada");
      io.emit("game-state", { jugadores, partidaIniciada });
      // Emitir pregunta genérica
      io.emit("question", { pregunta: "Pregunta de ejemplo" });
    }
  });

  // Listener: roll-dice
  socket.on("roll-dice", (data) => {
    console.log(`Dado lanzado por ${socket.id}:`, data);
    // Emitir resultado a todos
    io.emit("game-state", { jugadores, partidaIniciada, dado: data });
  });

  // Listener: answer-question
  socket.on("answer-question", (data) => {
    console.log(`Respuesta recibida de ${socket.id}:`, data);
    // Emitir estado actualizado
    io.emit("game-state", { jugadores, partidaIniciada });
  });

  // Listener: disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
    // Eliminar jugador
    jugadores = jugadores.filter((j) => j.id !== socket.id);
    if (partidaIniciada && jugadores.length === 1) {
      // Emitir game-over al único jugador restante
      io.emit("game-over", { ganador: jugadores[0] });
      partidaIniciada = false;
      jugadores = [];
    } else {
      io.emit("game-state", { jugadores, partidaIniciada });
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
