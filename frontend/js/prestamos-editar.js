const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const id = new URLSearchParams(window.location.search).get('id');

if (!token) window.location.href = 'login.html';
if (!id) window.location.href = 'prestamos.html';

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
    .map((libro) => `<option value="${libro.id}">${libro.titulo}</option>`)
    .join('');
}

async function cargarPrestamo() {
  await cargarOpciones();
  const respuesta = await fetch(`${API_URL}/prestamos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const prestamo = await respuesta.json();

  document.getElementById('usuario_id').value = prestamo.usuario_id || '';
  document.getElementById('libro_id').value = prestamo.libro_id || '';
  document.getElementById('fecha_prestamo').value = formatearFecha(prestamo.fecha_prestamo);
  document.getElementById('fecha_devolucion').value = formatearFecha(prestamo.fecha_devolucion);
  document.getElementById('estado').value = prestamo.estado || 'activo';
}

document.getElementById('prestamoForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const respuesta = await fetch(`${API_URL}/prestamos/${id}`, {
    method: 'PUT',
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
    fecha_devolucion: document.getElementById('fecha_devolucion').value,
    estado: document.getElementById('estado').value
  };
}

function formatearFecha(fecha) {
  return fecha ? String(fecha).slice(0, 10) : '';
}

cargarPrestamo();



