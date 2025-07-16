const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../data/preguntas/Preguntas.json");

function validarPregunta(pregunta) {
  let errores = [];
  if (typeof pregunta.numero !== "number") {
    errores.push("Campo 'numero' debe ser numérico.");
  }
  if (!pregunta.pregunta || typeof pregunta.pregunta !== "string") {
    errores.push("Campo 'pregunta' es obligatorio y debe ser texto.");
  }
  if (!Array.isArray(pregunta.respuestas) || pregunta.respuestas.length !== 3) {
    errores.push("Debe tener exactamente 3 respuestas.");
  } else {
    const correctas = pregunta.respuestas.filter((r) => r.correcta === true);
    if (correctas.length !== 1) {
      errores.push("Debe haber exactamente 1 respuesta correcta.");
    }
    pregunta.respuestas.forEach((r, ridx) => {
      if (!r.texto || typeof r.texto !== "string") {
        errores.push(`Respuesta ${ridx + 1}: campo 'texto' es obligatorio.`);
      }
    });
  }
  return errores;
}

function validarPreguntasJSON(req, res) {
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
    const err = validarPregunta(pregunta);
    if (err.length > 0) {
      errores.push(`Pregunta ${pregunta.numero || idx + 1}: ${err.join("; ")}`);
    }
  });
  res.json({ valido: errores.length === 0, errores });
}

function getPreguntas(req, res) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const preguntas = JSON.parse(raw);
    res.json(preguntas);
  } catch (e) {
    res.status(500).json({ error: "No se pudo leer el archivo." });
  }
}

function addPregunta(req, res) {
  const nueva = req.body;
  const errores = validarPregunta(nueva);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const preguntas = JSON.parse(raw);
    if (preguntas.some((p) => p.numero === nueva.numero)) {
      return res
        .status(400)
        .json({ errores: ["Ya existe una pregunta con ese número."] });
    }
    preguntas.push(nueva);
    fs.writeFileSync(filePath, JSON.stringify(preguntas, null, 2), "utf8");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "No se pudo guardar la pregunta." });
  }
}

function editPregunta(req, res) {
  const numero = parseInt(req.params.numero);
  const nueva = req.body;
  const errores = validarPregunta(nueva);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    let preguntas = JSON.parse(raw);
    const idx = preguntas.findIndex((p) => p.numero === numero);
    if (idx === -1) {
      return res.status(404).json({ error: "Pregunta no encontrada." });
    }
    preguntas[idx] = nueva;
    fs.writeFileSync(filePath, JSON.stringify(preguntas, null, 2), "utf8");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "No se pudo editar la pregunta." });
  }
}

function deletePregunta(req, res) {
  const numero = parseInt(req.params.numero);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    let preguntas = JSON.parse(raw);
    const idx = preguntas.findIndex((p) => p.numero === numero);
    if (idx === -1) {
      return res.status(404).json({ error: "Pregunta no encontrada." });
    }
    preguntas.splice(idx, 1);
    fs.writeFileSync(filePath, JSON.stringify(preguntas, null, 2), "utf8");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "No se pudo eliminar la pregunta." });
  }
}

module.exports = {
  validarPreguntasJSON,
  getPreguntas,
  addPregunta,
  editPregunta,
  deletePregunta,
};
