import express from "express";
import {
  cargar,
  numeroRandom,
  join,
  joinExisting,
  update,
  save,
  joining,
  preguntaRandom,
  verificar,
  ping,
  gameStatus,
} from "./controllers/controllers.js";

const router = express.Router();

// Lobby and game join routes
router.post("/cargar", cargar);
router.post("/join", join);
router.post("/joinExisting", joinExisting);
router.get("/joining/:tableroId", joining);

// Game logic routes
router.get("/preguntaFinal", preguntaRandom);
router.post("/verify", verificar);
router.get("/numeroRandom", numeroRandom);
router.post("/update", update);
router.post("/save", save);

// Multiplayer and status
router.post("/ping", ping);
router.get("/gameStatus/:tableroId", gameStatus);

export default router;
