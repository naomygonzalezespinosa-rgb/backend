const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

if (!token) window.location.href = 'login.html';

document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);
document.getElementById('buscador').addEventListener('input', cargarPrestamos);

async function cargarPrestamos() {
  const tabla = document.getElementById('tablaPrestamos');
  const mensaje = document.getElementById('mensaje');
  const respuesta = await fetch(`${API_URL}/prestamos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const prestamos = await respuesta.json();
  if (respuesta.status === 401) return cerrarSesion();

  if (!respuesta.ok) {
    mensaje.className = 'mensaje error';
    mensaje.textContent = prestamos.mensaje || 'No se pudieron cargar los prestamos';
    return;
  }

  const q = document.getElementById('buscador').value.trim().toLowerCase();
  const filtrados = q
    ? prestamos.filter((prestamo) =>
      `${prestamo.usuario} ${prestamo.libro} ${prestamo.estado}`.toLowerCase().includes(q)
    )
    : prestamos;

  tabla.innerHTML = filtrados.map((prestamo) => `
    <tr>
      <td>${prestamo.usuario}</td>
      <td>${prestamo.libro}</td>
      <td>${formatearFecha(prestamo.fecha_prestamo)}</td>
      <td>${formatearFecha(prestamo.fecha_devolucion)}</td>
      <td>${prestamo.estado}</td>
      <td class="acciones">
        <a class="boton secundario" href="prestamos-editar.html?id=${prestamo.id}">Editar</a>
        <button class="boton peligro" type="button" onclick="eliminarPrestamo(${prestamo.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

async function eliminarPrestamo(id) {
  if (!confirm('Deseas eliminar este prestamo?')) return;

  const respuesta = await fetch(`${API_URL}/prestamos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const datos = await respuesta.json();
  document.getElementById('mensaje').textContent = datos.mensaje;
  cargarPrestamos();
}

function formatearFecha(fecha) {
  return fecha ? String(fecha).slice(0, 10) : '';
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

cargarPrestamos();



