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
io.on("connection", (socket) => {

const { obtenerPreguntas } = require('./game/logic/preguntas');
const Partida = require('./game/logic/partida');

let jugadores = [];
let partida = null;

io.on("connection", (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);

  socket.on("join-game", (data) => {
    if (jugadores.length < 2) {
      jugadores.push({ id: socket.id, nombre: data?.nombre, color: data?.color });
      console.log(`Jugador unido: ${socket.id} (${data?.nombre})`);
      io.emit("game-state", { jugadores, partidaIniciada: !!partida });
    } else {
      socket.emit("game-state", { error: "Sala llena" });
    }
  });

  socket.on("start-game", () => {
    if (jugadores.length === 2 && !partida) {
      partida = new Partida(jugadores, obtenerPreguntas());
      console.log("Partida iniciada");
      io.emit("game-state", { ...partida.getEstado(), partidaIniciada: true });
      // Primer turno: enviar pregunta al jugador activo
      const jugadorActual = partida.getJugadorActual();
      socket.to(jugadorActual.id).emit("question", { pregunta: "Lanza el dado para avanzar" });
    }
  });

  socket.on("roll-dice", (data) => {
    if (!partida || partida.finalizada) return;
    const jugadorActual = partida.getJugadorActual();
    if (socket.id !== jugadorActual.id) {
      socket.emit("game-state", { ...partida.getEstado(), mensaje: "No es tu turno" });
      return;
    }
    const dado = data?.dado;
    const mov = partida.moverJugador(socket.id, dado);
    if (mov.error) {
      socket.emit("game-state", { ...partida.getEstado(), mensaje: mov.error });
      return;
    }
    // Enviar pregunta de la casilla destino
    socket.emit("question", mov.pregunta);
    // Guardar destino temporalmente en socket
    socket._destino = mov.destino;
    io.emit("game-state", { ...partida.getEstado(), dado });
  });

  socket.on("answer-question", (data) => {
    if (!partida || partida.finalizada) return;
    const jugadorActual = partida.getJugadorActual();
    if (socket.id !== jugadorActual.id) {
      socket.emit("game-state", { ...partida.getEstado(), mensaje: "No es tu turno" });
      return;
    }
    const correcta = !!data?.correcta;
    const destino = socket._destino;
    const res = partida.responderPregunta(socket.id, destino, correcta);
    if (res.ganador) {
      io.emit("game-over", { ganador: res.ganador });
      partida = null;
      jugadores = [];
    } else {
      io.emit("game-state", { ...partida.getEstado() });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
    if (partida && !partida.finalizada) {
      const res = partida.abandonar(socket.id);
      if (res.ganador) {
        io.emit("game-over", { ganador: res.ganador });
        partida = null;
        jugadores = [];
      } else {
        io.emit("game-state", { ...partida.getEstado() });
      }
    } else {
      jugadores = jugadores.filter(j => j.id !== socket.id);
      io.emit("game-state", { jugadores, partidaIniciada: !!partida });
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
