class Partida {
  constructor(jugadores, preguntas) {
    this.jugadores = jugadores.map((j, idx) => ({
      ...j,
      posicion: 0,
      color: j.color || "#000",
      id: j.id,
      nombre: j.nombre || `Jugador${idx + 1}`,
    }));
    this.turno = 0; // índice del jugador activo
    this.preguntas = preguntas;
    this.casillas = Array(22).fill(null); // 0 entrada, 1-20 intermedias, 21 salida
    this.casillas[0] = this.jugadores.map((j) => j.id); // entrada
    this.finalizada = false;
  }

  getJugadorActual() {
    return this.jugadores[this.turno];
  }

  lanzarDado() {
    // Devuelve número entre 1 y 6
    return Math.floor(Math.random() * 6) + 1;
  }

  moverJugador(jugadorId, dado) {
    if (dado < 1 || dado > 6) return { error: "Tirada inválida" };
    const jugador = this.jugadores.find((j) => j.id === jugadorId);
    if (!jugador) return { error: "Jugador no encontrado" };
    const destino = jugador.posicion + dado;
    if (destino > 21)
      return { error: "No puede avanzar más allá de la salida" };
    // Verificar si la casilla destino está ocupada
    if (this.jugadores.some((j) => j.posicion === destino)) {
      return { error: "Casilla ocupada" };
    }
    // Asignar pregunta de la casilla destino
    const pregunta = this.preguntas[(destino - 1) % this.preguntas.length];
    return { destino, pregunta };
  }

  responderPregunta(jugadorId, destino, correcta) {
    const jugador = this.jugadores.find((j) => j.id === jugadorId);
    if (!jugador) return { error: "Jugador no encontrado" };
    if (correcta) {
      jugador.posicion = destino;
      // Verificar si llegó a la salida
      if (destino === 21) {
        this.finalizada = true;
        return { ganador: jugador };
      }
    }
    // Cambiar turno
    this.turno = (this.turno + 1) % this.jugadores.length;
    return { estado: this.getEstado() };
  }

  getEstado() {
    return {
      jugadores: this.jugadores,
      turno: this.turno,
      finalizada: this.finalizada,
    };
  }

  abandonar(jugadorId) {
    // Eliminar jugador y declarar ganador al otro
    this.jugadores = this.jugadores.filter((j) => j.id !== jugadorId);
    if (this.jugadores.length === 1) {
      this.finalizada = true;
      return { ganador: this.jugadores[0] };
    }
    return { estado: this.getEstado() };
  }

  reiniciar() {
    this.jugadores = [];
    this.turno = 0;
    this.preguntas = [];
    this.casillas = Array(22).fill(null);
    this.finalizada = false;
  }
}

module.exports = Partida;
