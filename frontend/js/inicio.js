const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

if (!token) window.location.href = 'login.html';

document.getElementById('bienvenida').textContent = usuario ? `Bienvenido, ${usuario.nombre}` : '';
document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);

async function cargarResumen() {
  const mensaje = document.getElementById('mensaje');
  const respuesta = await fetch(`${API_URL}/inicio`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const datos = await respuesta.json();
  if (respuesta.status === 401) {
    sessionStorage.clear();
    window.location.href = 'login.html';
    return;
  }
  if (!respuesta.ok) {
    mensaje.textContent = datos.mensaje || 'No se pudo cargar el resumen';
    return;
  }

  document.getElementById('fechaServidor').textContent = formatearFecha(datos.fecha);
  animarNumero('totalLibros', datos.resumen.total_libros);
  animarNumero('totalUsuarios', datos.resumen.total_usuarios);
  animarNumero('totalPrestamos', datos.resumen.prestamos_activos);
  animarNumero('totalDevoluciones', datos.resumen.devoluciones_registradas);
  animarNumero('totalDisponibles', datos.resumen.ejemplares_disponibles);
  animarNumero('totalVencidos', datos.resumen.prestamos_vencidos);
}

function animarNumero(id, valorFinal) {
  const elemento = document.getElementById(id);
  const total = Number(valorFinal) || 0;
  let actual = 0;
  const pasos = Math.max(12, Math.min(28, total * 4));
  const incremento = total / pasos;

  const intervalo = setInterval(() => {
    actual += incremento;
    if (actual >= total) {
      elemento.textContent = total;
      clearInterval(intervalo);
      return;
    }
    elemento.textContent = Math.floor(actual);
  }, 24);
}

function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible';
  return new Date(fecha).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

cargarResumen();



