const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

if (!token) window.location.href = 'login.html';
document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);
document.getElementById('prestamoRapidoForm').addEventListener('submit', registrarPrestamo);

inicializarFechas();

async function cargarMisPrestamos() {
  const respuesta = await fetch(`${API_URL}/prestamos/usuario/${usuario.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (respuesta.status === 401) return cerrarSesion();

  const prestamos = await respuesta.json();
  const tabla = document.getElementById('tablaMisPrestamos');

  if (!prestamos.length) {
    tabla.innerHTML = '<tr><td colspan="5">Aun no tienes prestamos registrados.</td></tr>';
    return;
  }

  tabla.innerHTML = prestamos.map((prestamo) => `
    <tr>
      <td>${prestamo.libro}</td>
      <td>${prestamo.autor}</td>
      <td>${formatearFecha(prestamo.fecha_prestamo)}</td>
      <td>${formatearFecha(prestamo.fecha_devolucion)}</td>
      <td>${prestamo.estado}</td>
    </tr>
  `).join('');
}

async function cargarLibrosDisponibles() {
  const respuesta = await fetch(`${API_URL}/libros/disponibles/catalogo`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (respuesta.status === 401) return cerrarSesion();

  const libros = await respuesta.json();
  const select = document.getElementById('libro_id');

  if (!libros.length) {
    select.innerHTML = '<option value="">No hay libros disponibles</option>';
    select.disabled = true;
    return;
  }

  select.innerHTML = libros.map((libro) =>
    `<option value="${libro.id}">${libro.titulo} - ${libro.autor} (${libro.stock})</option>`
  ).join('');
}

async function registrarPrestamo(event) {
  event.preventDefault();
  const mensaje = document.getElementById('mensajePrestamo');

  const respuesta = await fetch(`${API_URL}/prestamos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      usuario_id: usuario.id,
      libro_id: Number(document.getElementById('libro_id').value),
      fecha_prestamo: document.getElementById('fecha_prestamo').value,
      fecha_devolucion: document.getElementById('fecha_devolucion').value
    })
  });

  if (respuesta.status === 401) return cerrarSesion();

  const datos = await respuesta.json();
  mensaje.textContent = datos.mensaje || 'Prestamo procesado';
  mensaje.className = respuesta.ok ? 'mensaje' : 'mensaje error';

  if (respuesta.ok) {
    await cargarMisPrestamos();
    await cargarLibrosDisponibles();
  }
}

function inicializarFechas() {
  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + 7);

  document.getElementById('fecha_prestamo').value = formatoInputFecha(hoy);
  document.getElementById('fecha_devolucion').value = formatoInputFecha(limite);
}

function formatoInputFecha(fecha) {
  return fecha.toISOString().slice(0, 10);
}

function formatearFecha(fecha) {
  return fecha ? String(fecha).slice(0, 10) : '';
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

cargarMisPrestamos();
cargarLibrosDisponibles();



