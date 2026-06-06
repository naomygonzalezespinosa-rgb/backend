const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');

if (!token) window.location.href = 'login.html';

document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);
document.getElementById('buscador').addEventListener('input', cargarLibros);

async function cargarLibros() {
  const catalogo = document.getElementById('catalogoLibros');
  const mensaje = document.getElementById('mensaje');
  const q = document.getElementById('buscador').value.trim();
  const url = q ? `${API_URL}/libros/buscar/catalogo?q=${encodeURIComponent(q)}` : `${API_URL}/libros`;
  const respuesta = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const libros = await respuesta.json();
  if (respuesta.status === 401) return cerrarSesion();

  if (!respuesta.ok) {
    mensaje.className = 'mensaje error';
    mensaje.textContent = libros.mensaje || 'No se pudieron cargar los libros';
    return;
  }

  catalogo.innerHTML = libros.map((libro, index) => {
    const colores = ['matcha', 'lavanda', 'rosa', 'miel', 'azul'];
    const inicial = (libro.titulo || 'L').trim().charAt(0).toUpperCase();
    const stockClase = Number(libro.stock) > 0 ? 'libro-stock' : 'libro-stock agotado';
    const disponibilidad = Number(libro.stock) > 0 ? `${libro.stock} disponibles` : 'No disponible';

    return `
    <article class="libro-card">
      <div class="libro-visual ${colores[index % colores.length]}">
        <div class="libro-portada">${inicial}</div>
      </div>
      <div class="libro-info">
        <span class="libro-chip">${libro.categoria || 'Sin categoria'}</span>
        <h2>${libro.titulo}</h2>
        <div class="libro-meta">
          <span>${libro.autor}</span>
          <span>${libro.codigo || 'Sin codigo'}</span>
          <span class="${stockClase}">${disponibilidad}</span>
        </div>
        <div class="acciones">
        <a class="boton secundario" href="detalle-libro.html?id=${libro.id}">Detalle</a>
        <a class="boton secundario" href="libros-editar.html?id=${libro.id}">Editar</a>
        <button class="boton peligro" type="button" onclick="eliminarLibro(${libro.id})">Eliminar</button>
        </div>
      </div>
    </article>
  `;
  }).join('');
}

async function eliminarLibro(id) {
  if (!confirm('Deseas eliminar este libro?')) return;

  const respuesta = await fetch(`${API_URL}/libros/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const datos = await respuesta.json();
  document.getElementById('mensaje').textContent = datos.mensaje;
  cargarLibros();
}

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

cargarLibros();



