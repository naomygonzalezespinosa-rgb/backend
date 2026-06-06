const API_URL = 'http://localhost:3000/api';

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const mensaje = document.getElementById('mensaje');

  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value
    })
  });

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    mensaje.className = 'mensaje error';
    mensaje.textContent = datos.mensaje || 'Error al iniciar sesion';
    return;
  }

  sessionStorage.setItem('token', datos.token);
  sessionStorage.setItem('nombre', datos.nombre);
  sessionStorage.setItem('usuario', JSON.stringify(datos.usuario));
  window.location.href = 'inicio.html';
});



