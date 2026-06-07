const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const id = new URLSearchParams(window.location.search).get('id');

if (!token) window.location.href = 'login.html';
if (!id) window.location.href = 'libros.html';

async function cargarDetalle() {
  const respuesta = await fetch(`${API_URL}/libros/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (respuesta.status === 401) return cerrarSesion();

  const libro = await respuesta.json();
  if (!respuesta.ok) {
    document.getElementById('mensaje').textContent = libro.mensaje;
    return;
  }

  document.getElementById('detalleLibro').innerHTML = `
    <h1>${libro.titulo}</h1>
    <p class="muted">${libro.autor}</p>
    <p><strong>Codigo:</strong> ${libro.codigo || ''}</p>
    <p><strong>Editorial:</strong> ${libro.editorial || ''}</p>
    <p><strong>Anio:</strong> ${libro.anio || ''}</p>
    <p><strong>Disponibilidad:</strong> ${libro.stock > 0 ? 'Disponible' : 'No disponible'}</p>
    <p>${libro.descripcion || 'Sin descripcion registrada.'}</p>
    <a class="boton" href="prestamos-registrar.html">Solicitar prestamo</a>
  `;
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

cargarDetalle();



