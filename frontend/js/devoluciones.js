const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

if (!token) window.location.href = 'login.html';
document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);

async function cargarDatos() {
  const [prestamosRes, devolucionesRes] = await Promise.all([
    fetch(`${API_URL}/prestamos/activos/lista`, { headers: { Authorization: `Bearer ${token}` } }),
    fetch(`${API_URL}/devoluciones`, { headers: { Authorization: `Bearer ${token}` } })
  ]);
  if (prestamosRes.status === 401 || devolucionesRes.status === 401) return cerrarSesion();

  const prestamos = await prestamosRes.json();
  const devoluciones = await devolucionesRes.json();

  document.getElementById('prestamo_id').innerHTML = prestamos.map((prestamo) =>
    `<option value="${prestamo.id}">${prestamo.usuario} - ${prestamo.libro}</option>`
  ).join('');

  document.getElementById('tablaDevoluciones').innerHTML = devoluciones.map((devolucion) => `
    <tr>
      <td>${devolucion.usuario}</td>
      <td>${devolucion.libro}</td>
      <td>${formatearFecha(devolucion.fecha_devolucion_real)}</td>
      <td>${devolucion.estado_libro}</td>
      <td>${devolucion.observaciones || ''}</td>
    </tr>
  `).join('');
}

document.getElementById('devolucionForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const respuesta = await fetch(`${API_URL}/devoluciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      prestamo_id: Number(document.getElementById('prestamo_id').value),
      fecha_devolucion_real: document.getElementById('fecha_devolucion_real').value,
      estado_libro: document.getElementById('estado_libro').value,
      observaciones: document.getElementById('observaciones').value
    })
  });
  if (respuesta.status === 401) return cerrarSesion();
  const datos = await respuesta.json();
  document.getElementById('mensaje').textContent = datos.mensaje;
  cargarDatos();
});

function formatearFecha(fecha) {
  return fecha ? String(fecha).slice(0, 10) : '';
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

cargarDatos();



