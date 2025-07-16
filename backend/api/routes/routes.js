const express = require("express");
const router = express.Router();
const { validarPreguntasJSON } = require("../controllers/controllers");

router.get("/validar-json", validarPreguntasJSON);

module.exports = router;
