import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./api/index.js";
import { logicModules } from "./game/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de la API
app.use("/api", apiRouter);

// Servir archivos estáticos del frontend (css, js)
app.use("/static/css", express.static(path.join(__dirname, "../frontend/css")));
app.use("/static/js", express.static(path.join(__dirname, "../frontend/js")));

// Servir index.html como pantalla de inicio
app.get(["/", "/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/index.html"));
});

app.get("/game.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/game.html"));
});

// Servir imágenes y otros recursos si existen
app.use("/static/img", express.static(path.join(__dirname, "../imagenes")));

app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);

export default app;
