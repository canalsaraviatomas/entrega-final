//Funcion para copiar el ID de la partida
const copiarId = () => { 
    navigator.clipboard.writeText(id);
}

//Funcion para guardar el estado de la partida
function guardarEstado() {
    const data = {
        tableroId: estadoPartida.tableroId,
        jugador1Id: estadoPartida.jugador1Id,
        jugador2Id: estadoPartida.jugador2Id,
        color1Id: estadoPartida.color1Id,
        color2Id: estadoPartida.color2Id,
        turno: estadoPartida.turno,
        lleno: estadoPartida.lleno,
        posicion1: estadoPartida.posicion1,
        posicion2: estadoPartida.posicion2,
        indicesPreguntas: estadoPartida.indicesPreguntas
    };
    //Se envia el estado de la partida al servidor
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (estadoPartida.turno != idJugador)
        downloadBoard();
}

//Funcion que se ejecuta cuando hay un ganador
const declararGanador = ganador => {
    const botonEnviar = document.getElementById('enviarPregunta');
    botonEnviar.setAttribute('disabled', '');
    botonPreguntaAudio.setAttribute('disabled', '');
    const nombreGanador = ganador == 1 ? estadoPartida.jugador1Id : estadoPartida.jugador2Id;
    const colorGanador = ganador == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
    const texto = document.getElementById('turnoJugador');
    texto.innerHTML = 'El jugador ' + ganador + ': ' + nombreGanador + ' ha ganado la partida!';
    texto.style.webkitTextStroke = '0.5px black';
    texto.style.color = colorGanador;
    const link = document.createElement('a');
    link.href = 'http://localhost:3000';
    link.textContent = 'Volver al lobby';
    const txt = document.getElementById('turnoActual');
    txt.appendChild(link);
}

//Funcion que invoca la opcion elegida por el jugador
const opcionElegida = () => {
    const opciones = document.querySelectorAll('.opcion');
    let seleccionado;
    for (let i = 0; i < 3; i++) {
        if (opciones[i].checked) {
            seleccionado = document.getElementById('opcion' + i).innerHTML;
            break;
        }
    }
    verificarRespuesta(seleccionado);
}