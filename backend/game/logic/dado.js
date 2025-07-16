class Dado {
  lanzar() {
    // Devuelve un número aleatorio entre 1 y 6
    return Math.floor(Math.random() * 6) + 1;
  }
}

module.exports = Dado;
