const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

if (!sessionStorage.getItem('token')) window.location.href = 'login.html';
document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);

const nombre = usuario?.nombre || 'Usuario';
const iniciales = obtenerIniciales(nombre);
const rol = usuario?.rol || 'Sin rol';

document.getElementById('perfil').innerHTML = `
  <div class="perfil-cover"></div>
  <div class="perfil-content">
    <div class="perfil-avatar">${iniciales}</div>
    <span class="perfil-chip">${rol}</span>
    <h1>${nombre}</h1>
    <p class="muted">Perfil de usuario de la Biblioteca Escolar.</p>

    <div class="perfil-datos">
      <div>
        <span>Matricula</span>
        <strong>${usuario?.matricula || 'No registrada'}</strong>
      </div>
      <div>
        <span>Email</span>
        <strong>${usuario?.email || 'No registrado'}</strong>
      </div>
      <div>
        <span>Rol</span>
        <strong>${rol}</strong>
      </div>
    </div>

    <div class="acciones perfil-actions">
      <a class="boton secundario" href="mis-prestamos.html">Mis prestamos</a>
      <a class="boton" href="libros.html">Ver catalogo</a>
    </div>
  </div>
`;

function obtenerIniciales(nombreCompleto) {
  return nombreCompleto
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}



