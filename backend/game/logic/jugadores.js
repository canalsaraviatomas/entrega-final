//Funcion que cuando se une el jugador 2 a la partida se actualiza el HTML
function actualizarJugador() {
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tableroId: estadoPartida.tableroId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.jugador2Id !== null) {
                Object.assign(estadoPartida, data);
                document.getElementById('jugador2').style.borderColor = estadoPartida.color2Id;
                document.getElementById('jugador2').style.boxShadow = `0 15px 15px -15px ${estadoPartida.color2Id}`;
                document.getElementById('nombre2').innerHTML = 'JUGADOR 2: ' + data.jugador2Id;
                document.getElementById('botonTirarJugador1').removeAttribute('disabled');
                document.getElementById('botonTirarJugador' + idJugador).removeAttribute('disabled');
            }
        })
}

//Funcion que se ejecuta mientras se este esperando al jugador 2
const esperandoJugador = () => {
    if (estadoPartida.turno != idJugador) {
        actualizarJugador()
        setTimeout(esperandoJugador, 1000);
    }
    else {
        document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: 1';
        document.getElementById('entrada').style.background = `linear-gradient(90deg,${estadoPartida.color1Id} 50%,${estadoPartida.color2Id} 50%)`;
    }
}