//Globales
let voices = [];
let idJugador;
let numeroFinal;
let parametro = '/partida/';
let pos = window.location.pathname.indexOf(parametro);
let id = window.location.pathname.substring(pos + parametro.length);
const boton1 = document.getElementById('botonTirarJugador1');
const boton2 = document.getElementById('botonTirarJugador2');
const botonPreguntaAudio = document.getElementById('escucharRespuesta');

let estadoPartida = {
    tableroId: null,
    jugador1Id: null,
    jugador2Id: null,
    color1Id: null,
    color2Id: null,
    turno: null,
    lleno: false,
    posicion1: 0,
    posicion2: 0,
    nombrePregunta: null,
    valorRespuesta: null,
    ganador: null,
    indicesPreguntas: []
};

boton1.setAttribute('disabled', '');
boton2.setAttribute('disabled', '');
document.getElementById('copiarId').addEventListener('click', () => copiarId());
botonPreguntaAudio.addEventListener('click', () => decir(document.getElementById('nombrePregunta').innerHTML));

//Cargar voces para el audio
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
};

const numeroAleatorio = () => { // animacion del dado
    return Math.floor(Math.random() * 6) + 1;
}

//Funcion que se encarga de descargar el tablero
const downloadBoard = () => {
    if (estadoPartida.ganador)
        return;
    //Solo actualiza el tablero si no es el turno del jugador
    if (estadoPartida.turno != idJugador) {
        actualizarTablero();
        setTimeout(downloadBoard, 3000);
    }
    else {
        //Si es el turno del jugador, se actualiza el tablero y se habilita el boton de tirar dado
        cambiarBotones();
        document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
    }
}

//Funcion que se ejecuta al cargar la pagina
function iniciar() {
    document.getElementById('idPartida').innerHTML = 'ID de la partida: ' + id;
    document.getElementById('enviarPregunta').addEventListener('click', () => opcionElegida());
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableroId: id })
    })
        .then(response => response.json())
        .then(data => {
            Object.assign(estadoPartida, data);
            //Se asignan los ids a los jugadores
            if (data.jugador1Id && !data.jugador2Id) {
                idJugador = 1;
                boton1.addEventListener('click', mostrarNumerosRapidos);
                esperandoJugador();
            }
            else if (data.jugador2Id) {
                idJugador = 2;
                boton2.addEventListener('click', mostrarNumerosRapidos);
                estadoPartida.lleno = true;
                estadoPartida.turno = 1;
                document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
                document.getElementById('entrada').style.background = `linear-gradient(90deg,${estadoPartida.color1Id} 50%,${estadoPartida.color2Id} 50%)`;
                guardarEstado();
            }
        });
}

window.alert = function(message, timeout = null) {
    const alert = document.createElement('div');
    const alertButton = document.createElement('button');
    alertButton.innerText = 'Aceptar';
    alert.classList.add('alert');
    alert.id = 'alerta';
    alertButton.id = 'alertaBoton';
    alert.innerHTML = `<span style = "padding: 10px">${message}</span>`;
    alert.appendChild(alertButton);
    alertButton.addEventListener('click', (e) => alert.remove());
    if(timeout != null) {
        setTimeout(() => {
            if(alert) alert.remove();
        }, Number(timeout));
    }
    document.body.appendChild(alert);
}

const sendPing = () => {
    fetch('/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: idJugador, gameId: estadoPartida.tableroId })
    }).catch(err => console.error('Error sending ping:', err));
}

setInterval(sendPing, 1000);
let ok = false;
const checkGameStatus = () => {
    fetch(`/game-status/${estadoPartida.tableroId}`)
        .then(response => response.json())
        .then(data => {
            if ((data.status === 'win_by_disconnect')&&(!ok)){
                ok = true;
                alert('Has Ganado, tu oponente se ha desconectado', 5000);
                declararGanador(idJugador);
            }
        })
        .catch(err => console.error('Error checking game status:', err));
}

setInterval(checkGameStatus, 3000);