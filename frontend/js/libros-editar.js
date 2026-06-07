const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const id = new URLSearchParams(window.location.search).get('id');

if (!token) window.location.href = 'login.html';
if (!id) window.location.href = 'libros.html';

async function cargarCategorias() {
  const respuesta = await fetch(`${API_URL}/categorias`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const categorias = await respuesta.json();
  document.getElementById('categoria_id').innerHTML = categorias
    .map((categoria) => `<option value="${categoria.id}">${categoria.nombre}</option>`)
    .join('');
}

async function cargarLibro() {
  await cargarCategorias();
  const respuesta = await fetch(`${API_URL}/libros/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const libro = await respuesta.json();

  document.getElementById('titulo').value = libro.titulo || '';
  document.getElementById('autor').value = libro.autor || '';
  document.getElementById('editorial').value = libro.editorial || '';
  document.getElementById('anio').value = libro.anio || '';
  document.getElementById('categoria_id').value = libro.categoria_id || '';
  document.getElementById('codigo').value = libro.codigo || '';
  document.getElementById('descripcion').value = libro.descripcion || '';
  document.getElementById('stock').value = libro.stock || 0;
}

document.getElementById('libroForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const respuesta = await fetch(`${API_URL}/libros/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(obtenerDatosFormulario())
  });
  const datos = await respuesta.json();
  document.getElementById('mensaje').textContent = datos.mensaje;
  if (respuesta.ok) setTimeout(() => window.location.href = 'libros.html', 800);
});

function obtenerDatosFormulario() {
  return {
    titulo: document.getElementById('titulo').value,
    autor: document.getElementById('autor').value,
    editorial: document.getElementById('editorial').value,
    anio: Number(document.getElementById('anio').value),
    categoria_id: Number(document.getElementById('categoria_id').value),
    codigo: document.getElementById('codigo').value,
    descripcion: document.getElementById('descripcion').value,
    stock: Number(document.getElementById('stock').value)
  };
}

cargarLibro();



