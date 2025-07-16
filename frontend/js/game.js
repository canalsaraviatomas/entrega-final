// Conexión Socket.IO
const socket = io();

// Obtener datos de jugador
const nombre = localStorage.getItem("nombre") || "Jugador";
const color = localStorage.getItem("color") || "#000000";

// Unirse al juego
socket.emit("join-game", { nombre, color });

// Placeholder para mostrar estado
socket.on("game-state", (data) => {
  document.getElementById("estado").textContent =
    "Jugadores conectados: " +
    (data.jugadores?.length || 0) +
    (data.partidaIniciada ? " | Partida iniciada" : "");
});

// Placeholder para pregunta
socket.on("question", (data) => {
  document.getElementById("pregunta").textContent =
    data.pregunta || "(Sin pregunta)";
  document.getElementById("opciones").textContent = "(Opciones...)";
});

// Manejo de game-over
socket.on("game-over", (data) => {
  document.getElementById("finJuego").style.display = "block";
  document.getElementById("finJuego").textContent =
    "¡Fin de la partida! Ganador: " + (data.ganador?.nombre || "Jugador") + "";
  setTimeout(() => {
    window.location.href = "/views/index.html";
  }, 3500);
});

// Botón abandonar
document.getElementById("btnAbandonar").onclick = function () {
  socket.emit("leave-game");
  document.getElementById("finJuego").style.display = "block";
  document.getElementById("finJuego").textContent =
    "Has abandonado la partida.";
  setTimeout(() => {
    window.location.href = "/views/index.html";
  }, 2000);
};

// Botones deshabilitados por ahora
document.getElementById("btnLanzarDado").disabled = true;
document.getElementById("btnResponder").disabled = true;
