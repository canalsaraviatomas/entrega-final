const numeroAleatorio = () => { // animacion del dado
    return Math.floor(Math.random() * 6) + 1;
}

//Funcion para mostrar la imagen del dado
const mostrarImagen = () => {
    const imagen = document.getElementById('dado' + estadoPartida.turno);
    setTimeout(function () {
        imagen.style.transition = 'opacity 1s ease-in';
        imagen.style.opacity = 1;
    }, 100);
}

//Funcion para habilitar o deshabilitar los botones de tirar dado
const cambiarBotones = () => {
    const botonTirar = document.getElementById('botonTirarJugador' + idJugador);
    botonTirar.hasAttribute('disabled') ? botonTirar.removeAttribute('disabled') : botonTirar.setAttribute('disabled', '');
}

//Animacion de tirar el dado
function mostrarNumerosRapidos() {
    if (estadoPartida.turno === idJugador) {
        fetch('/numeroFinal')
            // Se obtiene el número que le tocó al jugador
            .then(response => response.json())
            .then(data => {
                numeroFinal = data.numero;
            });

        let botonActual = estadoPartida.turno === 1 ? document.getElementById('botonTirarJugador1') : document.getElementById('botonTirarJugador2');
        botonActual.setAttribute('disabled', '');

        const numerosContainer = document.getElementById('container-numeros-jugador' + estadoPartida.turno);
        let contador = 0;
        let id;
        function mostrarSiguienteNumero() {
            if (contador < 18 || !numeroFinal) {
                const numeroAleatorio = Math.floor(Math.random() * 6) + 1;
                numerosContainer.innerHTML = '';
                let imagen = document.createElement('img');
                imagen.src = '/s/media/cara' + numeroAleatorio + '.png';
                imagen.style.width = '50px';
                numerosContainer.append(imagen);
                contador++;
                id = setTimeout(mostrarSiguienteNumero, 100);
            } else {
                clearTimeout(id);
                if (document.getElementById('dado' + estadoPartida.turno) !== null)
                    document.getElementById('dado' + estadoPartida.turno).remove();

                let imagen = document.createElement('img');
                estadoPartida.turno === 1 ? imagen.id = 'dado1' : imagen.id = 'dado2';
                imagen.style.opacity = 0;
                imagen.src = '/s/media/cara' + numeroFinal + '.png';
                const player = estadoPartida.turno === 1 ? document.getElementById('jugador1') : document.getElementById('jugador2');
                player.append(imagen);

                mostrarImagen();
                numerosContainer.innerHTML = '';
                let texto = document.createElement('p');
                texto.style.margin = '0';
                texto.innerHTML = "El número que te tocó es: " + numeroFinal;
                numerosContainer.append(texto);

                estadoPartida.turno === 1 ? marcarDestino(1) : marcarDestino(2);
            }
        }
        mostrarSiguienteNumero();
    }
}