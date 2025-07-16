//Funcion para marcar el destino en caso de acertar
const marcarDestino = turno => {
    let destino1 = estadoPartida.posicion1 + numeroFinal;
    let destino2 = estadoPartida.posicion2 + numeroFinal;
    let destino = turno == 1 ? destino1 : destino2;
    if (destino == estadoPartida.posicion1 || destino == estadoPartida.posicion2) {
        mostrarNumerosRapidos();
        return;
    }
    let colorJugador = turno == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
    let casillero = destino >= 21 ? document.getElementById('salida') : document.getElementById(destino);
    casillero.style.border = '3px dotted';
    casillero.style.borderColor = colorJugador;
    hacerPregunta();
}

//Funcion para actualizar los cambios del tablero
function guardarCambios() {
    const data = {
        tableroId: estadoPartida.tableroId,
        turno: estadoPartida.turno,
        posicion1: estadoPartida.posicion1,
        posicion2: estadoPartida.posicion2,
        nombrePregunta: document.getElementById('nombrePregunta').innerHTML,
        ganador: estadoPartida.ganador,
    };
    if (document.getElementById('valorRespuesta') != null)
        data.valorRespuesta = document.getElementById('valorRespuesta').innerHTML;
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (estadoPartida.turno != idJugador && !estadoPartida.ganador)
        downloadBoard();
}

//Funcion para marcar el casillero en el tablero
const marcarCasillero = (posicionA, posicionB, salida, colorA, colorB) => { 
    if (posicionA === 0) {
        let entrada = document.getElementById('entrada');
        entrada.removeAttribute('style');
        entrada.style.backgroundColor = posicionB === 0 ? colorB : 'white';
    } else
        document.getElementById(posicionA).style.backgroundColor = 'white';
    let marcar = salida >= 21 ? 'salida' : salida;
    document.getElementById(marcar).style.backgroundColor = colorA;
}

//Funcion que se encarga de actualizar el tablero constantemente
function actualizarTablero() { 
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
            if (data.ganador)
                declararGanador(data.ganador);
            const containerPreguntas = document.getElementById('container-preguntas');
            let namePreg = document.getElementById('nombrePregunta');
            document.getElementById('enviarPregunta').setAttribute('disabled', '');
            document.getElementById('escucharRespuesta').setAttribute('disabled', '');
            if (namePreg === null) {
                namePreg = document.createElement('p');
                namePreg.id = 'nombrePregunta';
                containerPreguntas.append(namePreg);
            }
            namePreg.innerHTML = data.nombrePregunta;
            let valorR = document.getElementById('valorRespuesta');
            if (valorR === null) {
                valorR = document.createElement('p');
                valorR.id = 'valorRespuesta';
                containerPreguntas.append(valorR);
            }
            valorR.innerHTML = data.valorRespuesta;
            if (valorR.innerHTML !== '') {
                let contenido = valorR.innerHTML;
                let partes = contenido.split(':');
                let texto = partes[1].trim();
                valorR.className = texto === 'Incorrecta' ? 'incorrecta' : 'correcta';
            }
            if (data.posicion1 != estadoPartida.posicion1)
                marcarCasillero(estadoPartida.posicion1, estadoPartida.posicion2, data.posicion1, data.color1Id, estadoPartida.color2Id);
            else if (data.posicion2 != estadoPartida.posicion2)
                marcarCasillero(estadoPartida.posicion2, estadoPartida.posicion1, data.posicion2, data.color2Id, estadoPartida.color1Id);
            Object.assign(estadoPartida, data);
        })
}