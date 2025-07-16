//Funcion para mostrar la pregunta
function hacerPregunta() {
    const containerPreguntas = document.getElementById('container-preguntas');
    const name = document.getElementById('nombrePregunta') ?? document.createElement('p');
    const valorRespuesta = document.getElementById('valorRespuesta');
    if (valorRespuesta)
        valorRespuesta.remove();
    const botonEnviar = document.getElementById('enviarPregunta');
    if (botonEnviar.hasAttribute('disabled')) {
        botonEnviar.removeAttribute('disabled');
        botonPreguntaAudio.removeAttribute('disabled');
    }
    document.getElementById('enviarPregunta').style.display = 'inline-block';
    document.getElementById('escucharRespuesta').style.display = 'inline-block';
    containerPreguntas.append(botonPreguntaAudio);
    //Obtener pregunta del servidor
    fetch('/preguntaFinal?id=' + estadoPartida.tableroId)
        .then(response => response.json())
        .then(data => {
            let nombreJugador = estadoPartida.turno == 1 ? estadoPartida.jugador1Id : estadoPartida.jugador2Id;
            name.innerHTML = 'Pregunta para ' + nombreJugador + ': ' + data.pregunta;
            name.id = 'nombrePregunta';
            containerPreguntas.append(name);
            let vectorOpciones = ['correcta', 'incorrecta1', 'incorrecta2'];
            for (let i = 0; i < 3; i++) {
                let opcion = Math.floor(Math.random() * (vectorOpciones.length - 1));
                const div = document.createElement('div');
                div.className = 'opcionPregunta'

                const input = document.createElement('input');
                input.type = 'radio';
                input.className = 'opcion';
                input.name = 'respuesta';

                const label = document.createElement('label');
                label.innerHTML = data[vectorOpciones[opcion]];
                label.id = 'opcion' + i;

                const icon = document.createElement('img');
                icon.style = 'width: 20px; height: 20px;';
                icon.src = '/s/media/sound.png';
                icon.alt = 'Audio';

                const botonEscuchar = document.createElement('button');
                botonEscuchar.className = 'audio';
                botonEscuchar.addEventListener('click', () => decir(label.innerHTML));

                botonEscuchar.appendChild(icon);
                div.append(input, label, botonEscuchar)
                containerPreguntas.append(div);
                vectorOpciones.splice(opcion, 1);
            }
            guardarCambios();
        });
}

//Funcion para eliminar la pregunta anterior
const eliminarAnterior = () => {
    const nombrePregunta = document.getElementById('nombrePregunta');
    if (nombrePregunta)
        nombrePregunta.remove();
    const opciones = document.querySelectorAll('.opcionPregunta');
    if (opciones) {
        opciones.forEach(element => {
            element.remove()
        });
    }
    const valorRespuesta = document.getElementById('valorRespuesta');
    if (valorRespuesta)
        valorRespuesta.remove();
}

//Funcion para verificar si es correcta o no la respuesta elegida
function verificarRespuesta(seleccionado) {
    let p = document.createElement('p');
    p.id = 'valorRespuesta';
    let contenido = document.getElementById('nombrePregunta').innerHTML;
    let pregunta = contenido.substring(contenido.indexOf('¿'));
    const data = {
        nombrePregunta: pregunta,
        seleccionada: seleccionado,
        id: estadoPartida.tableroId
    }
    fetch('/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            let destino1 = estadoPartida.posicion1 + numeroFinal;
            let destino2 = estadoPartida.posicion2 + numeroFinal;
            let posicion = estadoPartida.turno == 1 ? estadoPartida.posicion1 : estadoPartida.posicion2;
            let destino = estadoPartida.turno == 1 ? destino1 : destino2;
            let colorJugador = estadoPartida.turno == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
            let casillero = destino >= 21 ? document.getElementById('salida') : document.getElementById(destino);
            if (data == 'Correcta') {
                p.innerHTML = 'Respuesta jugador ' + estadoPartida.turno + ': Correcta';
                p.className = 'correcta';
                casillero.style.border = '1px solid';
                casillero.style.backgroundColor = colorJugador;
                if (posicion === 0) {
                    let inicio = document.getElementById('entrada');
                    inicio.removeAttribute('style');
                    if (estadoPartida.turno === 1)
                        estadoPartida.posicion2 === 0 ? inicio.style.backgroundColor = estadoPartida.color2Id : inicio.style.backgroundColor = 'white';
                    else
                        estadoPartida.posicion1 === 0 ? inicio.style.backgroundColor = estadoPartida.color1Id : inicio.style.backgroundColor = 'white';
                }
                else
                    document.getElementById(posicion).removeAttribute('style');
                estadoPartida.turno == 1 ? estadoPartida.posicion1 = destino : estadoPartida.posicion2 = destino;
                posicion = destino;
            }
            else {
                p.innerHTML = 'Respuesta jugador ' + estadoPartida.turno + ': Incorrecta';
                p.className = 'incorrecta';
                casillero.removeAttribute('style');
            }
            document.getElementById('container-preguntas').append(p);
            //Se cambia el turno del jugador
            estadoPartida.turno == 1 ? estadoPartida.turno++ : estadoPartida.turno--;
            if (posicion >= 21) {
                estadoPartida.ganador = idJugador;
                declararGanador(estadoPartida.ganador);
            }
            else {
                document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
                setTimeout(eliminarAnterior, 3500);
            }
            guardarCambios();
        })
}