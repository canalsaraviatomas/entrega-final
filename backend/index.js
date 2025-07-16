const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const app = express();

// Servir archivos estáticos
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));
app.use("/views", express.static(path.join(__dirname, "../frontend/views")));

// Ruta raíz sirve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/views/index.html"));
});

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
