const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

if (!token) window.location.href = 'login.html';
document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);

async function cargarReportes() {
  const respuesta = await fetch(`${API_URL}/inicio`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (respuesta.status === 401) return cerrarSesion();

  const datos = await respuesta.json();
  document.getElementById('fechaReporte').textContent = `Fecha del servidor: ${datos.fecha}`;
  document.getElementById('reporteGrid').innerHTML = Object.entries(datos.resumen).map(([clave, valor]) => `
    <article class="stat">${clave.replaceAll('_', ' ')}<strong>${valor}</strong></article>
  `).join('');
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

cargarReportes();



