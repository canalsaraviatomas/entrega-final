// Gestor de preguntas y respuestas
let preguntas = [];
let editando = null;

function cargarPreguntas() {
  fetch("/api/preguntas")
    .then((res) => res.json())
    .then((data) => {
      preguntas = data;
      renderTabla();
      limpiarFormulario();
    });
}

function renderTabla() {
  const tbody = document.querySelector("#tablaPreguntas tbody");
  tbody.innerHTML = "";
  preguntas.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.numero}</td>
      <td>${p.pregunta}</td>
      <td>${p.respuestas.map((r) => `${r.texto}${r.correcta ? " ✔" : ""}`).join("<br>")}</td>
      <td><button onclick="editarPregunta(${p.numero})">Editar</button></td>
      <td><button onclick="eliminarPregunta(${p.numero})">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function limpiarFormulario() {
  document.getElementById("formTitulo").textContent = "Agregar nueva pregunta";
  document.getElementById("btnGuardar").textContent = "Agregar";
  document.getElementById("btnCancelar").style.display = "none";
  editando = null;
  document.getElementById("numero").value = "";
  document.getElementById("pregunta").value = "";
  document.getElementById("imagenPregunta").value = "";
  document.getElementById("audioPregunta").value = "";
  renderRespuestasInputs();
  document.getElementById("resultadoEditor").textContent = "";
}

function renderRespuestasInputs(respuestas = [{}, {}, {}]) {
  const div = document.getElementById("respuestas");
  div.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const r = respuestas[i] || {};
    div.innerHTML += `
      <div>
        <label>Texto: <input type="text" id="respTexto${i}" value="${r.texto || ""}" required /></label>
        <label>Imagen: <input type="text" id="respImagen${i}" value="${r.imagen || ""}" /></label>
        <label>Audio: <input type="text" id="respAudio${i}" value="${r.audio || ""}" /></label>
        <label>Correcta: <input type="radio" name="correcta" value="${i}" ${r.correcta ? "checked" : ""} required /></label>
      </div>
    `;
  }
}

document.getElementById("formPregunta").onsubmit = function (e) {
  e.preventDefault();
  const numero = parseInt(document.getElementById("numero").value);
  const pregunta = document.getElementById("pregunta").value;
  const imagenPregunta =
    document.getElementById("imagenPregunta").value || null;
  const audioPregunta = document.getElementById("audioPregunta").value || null;
  const respuestas = [];
  const correcta = document.querySelector('input[name="correcta"]:checked');
  for (let i = 0; i < 3; i++) {
    respuestas.push({
      texto: document.getElementById("respTexto" + i).value,
      imagen: document.getElementById("respImagen" + i).value || null,
      audio: document.getElementById("respAudio" + i).value || null,
      correcta: correcta && correcta.value == i,
    });
  }
  const nueva = { numero, pregunta, imagenPregunta, audioPregunta, respuestas };
  const url = editando ? `/api/preguntas/${editando}` : "/api/preguntas";
  const method = editando ? "PUT" : "POST";
  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nueva),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errores ? data.errores.join("\n") : data.error);
      }
      return res.json();
    })
    .then(() => {
      cargarPreguntas();
    })
    .catch((err) => {
      document.getElementById("resultadoEditor").textContent = err.message;
    });
};

document.getElementById("btnCancelar").onclick = function () {
  limpiarFormulario();
};

window.editarPregunta = function (numero) {
  const p = preguntas.find((x) => x.numero === numero);
  if (!p) return;
  editando = numero;
  document.getElementById("formTitulo").textContent = "Editar pregunta";
  document.getElementById("btnGuardar").textContent = "Guardar cambios";
  document.getElementById("btnCancelar").style.display = "";
  document.getElementById("numero").value = p.numero;
  document.getElementById("pregunta").value = p.pregunta;
  document.getElementById("imagenPregunta").value = p.imagenPregunta || "";
  document.getElementById("audioPregunta").value = p.audioPregunta || "";
  renderRespuestasInputs(p.respuestas);
};

window.eliminarPregunta = function (numero) {
  if (!confirm("¿Eliminar la pregunta?")) return;
  fetch(`/api/preguntas/${numero}`, { method: "DELETE" })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      return res.json();
    })
    .then(() => {
      cargarPreguntas();
    })
    .catch((err) => {
      document.getElementById("resultadoEditor").textContent = err.message;
    });
};

// Inicializar
cargarPreguntas();
