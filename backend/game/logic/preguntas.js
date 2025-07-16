const fs = require("fs");
const path = require("path");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function obtenerPreguntas() {
  const preguntasPath = path.join(
    __dirname,
    "../../data/preguntas/Preguntas.json"
  );
  const data = fs.readFileSync(preguntasPath, "utf8");
  let preguntas = JSON.parse(data);
  preguntas = shuffle(preguntas);
  return preguntas;
}

module.exports = { obtenerPreguntas };
