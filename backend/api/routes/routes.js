const express = require("express");
const router = express.Router();
const {
  validarPreguntasJSON,
  getPreguntas,
  addPregunta,
  editPregunta,
  deletePregunta,
} = require("../controllers/controllers");

router.get("/validar-json", validarPreguntasJSON);
router.get("/preguntas", getPreguntas);
router.post("/preguntas", addPregunta);
router.put("/preguntas/:numero", editPregunta);
router.delete("/preguntas/:numero", deletePregunta);

module.exports = router;
