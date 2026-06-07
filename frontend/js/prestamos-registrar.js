const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

if (!token) window.location.href = 'login.html';

async function cargarOpciones() {
  const [usuariosRes, librosRes] = await Promise.all([
    fetch(`${API_URL}/usuarios`, { headers: { Authorization: `Bearer ${token}` } }),
    fetch(`${API_URL}/libros`, { headers: { Authorization: `Bearer ${token}` } })
  ]);

  const usuarios = await usuariosRes.json();
  const libros = await librosRes.json();

  document.getElementById('usuario_id').innerHTML = usuarios
    .map((usuario) => `<option value="${usuario.id}">${usuario.nombre}</option>`)
    .join('');

  document.getElementById('libro_id').innerHTML = libros
    .map((libro) => `<option value="${libro.id}">${libro.titulo} (${libro.stock})</option>`)
    .join('');
}

document.getElementById('prestamoForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const respuesta = await fetch(`${API_URL}/prestamos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(obtenerDatosFormulario())
  });
  const datos = await respuesta.json();
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = datos.mensaje;
  mensaje.className = respuesta.ok ? 'mensaje' : 'mensaje error';
  if (respuesta.ok) setTimeout(() => window.location.href = 'prestamos.html', 800);
});

function obtenerDatosFormulario() {
  return {
    usuario_id: Number(document.getElementById('usuario_id').value),
    libro_id: Number(document.getElementById('libro_id').value),
    fecha_prestamo: document.getElementById('fecha_prestamo').value,
    fecha_devolucion: document.getElementById('fecha_devolucion').value
  };
}

cargarOpciones();



