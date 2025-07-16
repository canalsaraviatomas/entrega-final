// scriptTablero.js
// Este script conecta el tablero con el backend usando el parámetro id de la URL

// Obtener el id de la partida desde la URL
const urlParams = new URLSearchParams(window.location.search);
const tableroId = urlParams.get("id");

// Estado local de la partida
let estadoPartida = { tableroId };

// Función para actualizar el tablero desde el backend
function actualizarTablero() {
  fetch("/api/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableroId }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Actualiza el estado y la UI según los datos recibidos
      Object.assign(estadoPartida, data);
      document.getElementById("idPartida").textContent =
        "ID de la partida: " + tableroId;
      document.getElementById("nombre1").textContent =
        "Jugador 1: " + (data.jugador1Id || "");
      document.getElementById("nombre2").textContent =
        "Jugador 2: " + (data.jugador2Id || "");
      // Colores
      document.getElementById("jugador1").style.borderColor =
        data.color1Id || "#000";
      document.getElementById("jugador2").style.borderColor =
        data.color2Id || "#000";
      document.getElementById("jugador1").style.boxShadow =
        `0 15px 15px -15px ${data.color1Id || "#000"}`;
      document.getElementById("jugador2").style.boxShadow =
        `0 15px 15px -15px ${data.color2Id || "#000"}`;
      // Turno
      document.getElementById("turnoJugador").textContent =
        "Turno del jugador: " + (data.turno || "");
      // Pregunta actual
      if (data.nombrePregunta) {
        let namePreg = document.getElementById("nombrePregunta");
        if (!namePreg) {
          namePreg = document.createElement("p");
          namePreg.id = "nombrePregunta";
          document.getElementById("container-preguntas").appendChild(namePreg);
        }
        namePreg.textContent = data.nombrePregunta;
      }
      // Respuesta
      if (data.valorRespuesta) {
        let valorR = document.getElementById("valorRespuesta");
        if (!valorR) {
          valorR = document.createElement("p");
          valorR.id = "valorRespuesta";
          document.getElementById("container-preguntas").appendChild(valorR);
        }
        valorR.textContent = data.valorRespuesta;
        valorR.className = data.valorRespuesta.includes("Correcta")
          ? "correcta"
          : "incorrecta";
      }
      // TODO: Actualizar posiciones de fichas y tablero visual
    });
}

// Actualizar el tablero cada 3 segundos
setInterval(actualizarTablero, 3000);

// Inicializar al cargar
actualizarTablero();

// Puedes agregar aquí la lógica para tirar el dado, responder preguntas, etc. usando el id de la partida en todas las llamadas al backend
