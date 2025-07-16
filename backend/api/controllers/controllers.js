const fs = require("fs");
const path = require("path");

function validarPreguntasJSON(req, res) {
  const filePath = path.join(__dirname, "../../data/preguntas/Preguntas.json");
  let preguntas;
  let errores = [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    preguntas = JSON.parse(raw);
  } catch (e) {
    return res.json({
      valido: false,
      errores: ["No se pudo leer o parsear el archivo JSON."],
    });
  }
  preguntas.forEach((pregunta, idx) => {
    if (typeof pregunta.numero !== "number") {
      errores.push(`Pregunta ${idx + 1}: campo 'numero' debe ser numérico.`);
    }
    if (!pregunta.pregunta || typeof pregunta.pregunta !== "string") {
      errores.push(
        `Pregunta ${idx + 1}: campo 'pregunta' es obligatorio y debe ser texto.`
      );
    }
    if (
      !Array.isArray(pregunta.respuestas) ||
      pregunta.respuestas.length !== 3
    ) {
      errores.push(`Pregunta ${idx + 1}: debe tener exactamente 3 respuestas.`);
    } else {
      const correctas = pregunta.respuestas.filter((r) => r.correcta === true);
      if (correctas.length !== 1) {
        errores.push(
          `Pregunta ${idx + 1}: debe haber exactamente 1 respuesta correcta.`
        );
      }
      pregunta.respuestas.forEach((r, ridx) => {
        if (!r.texto || typeof r.texto !== "string") {
          errores.push(
            `Pregunta ${idx + 1}, respuesta ${ridx + 1}: campo 'texto' es obligatorio.`
          );
        }
        // imagen/audio son opcionales
      });
    }
    // imagenPregunta/audioPregunta son opcionales
  });
  res.json({ valido: errores.length === 0, errores });
}

module.exports = {
  validarPreguntasJSON,
};
