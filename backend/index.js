import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./api/index.js";
import { logicModules } from "./game/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine (mantener si usas EJS)
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de la API
app.use("/api", apiRouter);

// Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, "../public")));

// (Opcional) Acceso a lógica del juego desde logicModules
// console.log(Object.keys(logicModules));

app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);

export default app;
