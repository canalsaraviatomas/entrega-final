document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const color = document.getElementById('color').value;
  // Guardar datos en localStorage
  localStorage.setItem('nombre', nombre);
  localStorage.setItem('color', color);
  // Redirigir a game.html
  window.location.href = '/views/game.html';
});
