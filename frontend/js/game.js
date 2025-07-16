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

// Placeholder para game-over
socket.on("game-over", (data) => {
  document.getElementById("estado").textContent =
    "¡Ganador: " + (data.ganador?.nombre || "Jugador") + "!";
});

// Botones deshabilitados por ahora
document.getElementById("btnLanzarDado").disabled = true;
document.getElementById("btnResponder").disabled = true;
