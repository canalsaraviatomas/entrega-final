# 🧠 Juego de Preguntas y Respuestas Multijugador

## 🎯 Objetivo

Desarrollar un **juego de preguntas y respuestas multijugador** totalmente funcional, utilizando **Node.js**, con una **interfaz gráfica web**. El juego debe ser jugable de inicio a fin, mostrando tablero, fichas, preguntas y turnos.

---

## 🛠️ Tecnologías Requeridas

- Backend: **Node.js**, con `Express` y `Socket.IO`
- Frontend: **HTML, CSS y JavaScript**
- Comunicación: **WebSockets** para eventos en tiempo real (turnos, movimiento, respuestas)
- Preguntas: cargadas desde un archivo `JSON`

---

## 📁 Estructura del Proyecto

Copilot debe construir exactamente esta estructura, creando cada carpeta y archivo necesario:

entrega-final/
├── backend/
│ ├── api/
│ │ ├── controllers/
│ │ │ └── controllers.js # Lógica de rutas HTTP (si aplica)
│ │ ├── routes/
│ │ │ └── routes.js # Rutas del API (por si se usa HTTP además de WebSocket)
│ │ └── index.js # Inicializa API REST (opcional)
│ ├── data/
│ │ ├── partidas/
│ │ │ └── partidas.json # Registro de partidas activas (opcional)
│ │ └── preguntas/
│ │ └── Preguntas.json # Banco de preguntas (mínimo 20)
│ ├── game/
│ │ ├── logic/
│ │ │ ├── dado.js # Lógica del dado
│ │ │ ├── jugadores.js # Lógica de los jugadores
│ │ │ ├── MultiPlayers.js # Control multijugador (emparejar, turnos)
│ │ │ ├── partida.js # Estado general de la partida
│ │ │ ├── preguntas.js # Cargar y manejar preguntas
│ │ │ └── tablero.js # Estructura del tablero
│ │ └── index.js # Inicializa lógica del juego
│ ├── imagenes/
│ │ └── dado/
│ │ └── sound.png # Recursos multimedia
│ └── index.js # Servidor principal con Express y Socket.IO
├── frontend/
│ ├── css/
│ │ ├── game.css # Estilos del tablero y jugabilidad
│ │ └── menuLogin.css # Estilos del login/inicio
│ ├── js/
│ │ ├── game.js # Lógica del juego en el cliente
│ │ └── menuLogin.js # Lógica de login
│ └── views/
│ ├── game.html # Tablero visual interactivo
│ └── index.html # Pantalla de inicio/login

---

## 🎮 Reglas y Funcionalidades del Juego

### Reglas Principales

- 2 jugadores se conectan desde el navegador
- Ambos eligen su nombre y color de ficha
- Comienzan en la casilla de entrada (casilla 0)
- Se turnan para lanzar un dado virtual (1–6)
- Cada casilla tiene una **pregunta aleatoria** del JSON
- Si el jugador responde bien, **avanza** a la casilla destino
- Si responde mal, **permanece** en su lugar
- Si la casilla está ocupada, **no se puede mover**
- Gana quien llegue primero a la casilla final

### Detalles Técnicos y Visuales

- La interfaz debe mostrar:
  - Tablero gráfico
  - Pregunta actual
  - Opciones de respuesta (texto, imagen o audio)
  - Botón verde **Aceptar**
  - Botón rojo **Cancelar**
- Mientras un jugador juega, el otro solo observa
- Si un jugador abandona, el otro gana
- Si se corta la conexión, la partida se reinicia
- Se debe evitar repetir preguntas en la misma partida

---

## 📄 Formato del Archivo de Preguntas (Preguntas.json)

El archivo debe tener al menos **20 preguntas** en formato:

```json
[
  {
    "id": 1,
    "pregunta": "¿Qué imagen comienza con la misma letra que la figura?",
    "opciones": ["pelota", "zanahoria", "casco"],
    "respuesta_correcta": "casco",
    "imagen": "casco.png",
    "audio": "pregunta1.mp3"
  },
  ...
]
```

✅ Requisitos para Copilot
Copilot debe:

Crear toda la estructura de carpetas y archivos listada arriba

Implementar la lógica de juego en backend, usando módulos para cada parte

Servir la interfaz web desde Node, y conectarla con WebSocket

Cargar y asignar preguntas al iniciar la partida

Manejar eventos de jugador: turno, lanzamiento de dado, selección de respuesta

Actualizar visualmente el tablero para ambos jugadores

Mostrar mensajes de fin de partida o abandono

Controlar que las casillas no puedan ser ocupadas por 2 fichas

(Opcional) Validar el archivo JSON al cargar

(Opcional) Agregar control de tiempo por turno

🚀 Instrucciones de Desarrollo para Copilot Agent

Primero crear toda la estructura de carpetas y archivos

Luego:

Implementar frontend/views/index.html con selector de jugador

Implementar frontend/views/game.html con tablero y preguntas

Conectar frontend y backend con Socket.IO

Crear lógica del juego por módulos: jugadores, dado, tablero, etc.

Cargar preguntas desde Preguntas.json y asignarlas aleatoriamente

Probar con dos pestañas/localhosts para simular 2 jugadores

Asegurar que sea jugable hasta el final, sin errores
