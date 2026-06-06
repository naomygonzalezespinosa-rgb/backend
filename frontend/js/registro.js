const API_URL = 'http://localhost:3000/api';

document.getElementById('registroForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const mensaje = document.getElementById('mensaje');

  const respuesta = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: document.getElementById('nombre').value,
      matricula: document.getElementById('matricula').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      rol: document.getElementById('rol').value
    })
  });

  const datos = await respuesta.json();
  mensaje.textContent = datos.mensaje;
  mensaje.className = respuesta.ok ? 'mensaje' : 'mensaje error';

  if (respuesta.ok) {
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);
  }
});



