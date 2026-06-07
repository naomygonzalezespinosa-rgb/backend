const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

if (!token) window.location.href = 'login.html';
document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);
document.getElementById('filtroRol').addEventListener('change', cargarUsuarios);

async function cargarUsuarios() {
  const rol = document.getElementById('filtroRol').value;
  const url = rol ? `${API_URL}/usuarios/rol/${rol}` : `${API_URL}/usuarios`;
  const respuesta = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (respuesta.status === 401) return cerrarSesion();

  const usuarios = await respuesta.json();
  document.getElementById('tablaUsuarios').innerHTML = usuarios.map((usuario) => `
    <tr>
      <td>${usuario.nombre}</td>
      <td>${usuario.matricula || ''}</td>
      <td>${usuario.email}</td>
      <td>${usuario.rol}</td>
    </tr>
  `).join('');
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

cargarUsuarios();



