const db = require('../config/db');

async function listar() {
  const [rows] = await db.query(`
    SELECT l.*, c.nombre AS categoria
    FROM libros l
    LEFT JOIN categorias c ON c.id = l.categoria_id
    ORDER BY l.id DESC
  `);
  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await db.query('SELECT * FROM libros WHERE id = ?', [id]);
  return rows[0];
}

async function buscar(termino = '') {
  const like = `%${termino}%`;
  const [rows] = await db.query(`
    SELECT l.*, c.nombre AS categoria
    FROM libros l
    LEFT JOIN categorias c ON c.id = l.categoria_id
    WHERE l.titulo LIKE ? OR l.autor LIKE ? OR l.codigo LIKE ?
    ORDER BY l.titulo
  `, [like, like, like]);
  return rows;
}

async function disponibles() {
  const [rows] = await db.query(`
    SELECT l.*, c.nombre AS categoria
    FROM libros l
    LEFT JOIN categorias c ON c.id = l.categoria_id
    WHERE l.stock > 0
    ORDER BY l.titulo
  `);
  return rows;
}

async function crear(libro) {
  const [result] = await db.query(
    'INSERT INTO libros (titulo, autor, editorial, anio, categoria_id, codigo, descripcion, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [libro.titulo, libro.autor, libro.editorial, libro.anio, libro.categoria_id, libro.codigo, libro.descripcion || null, libro.stock]
  );
  return result.insertId;
}

async function actualizar(id, libro) {
  await db.query(
    'UPDATE libros SET titulo = ?, autor = ?, editorial = ?, anio = ?, categoria_id = ?, codigo = ?, descripcion = ?, stock = ? WHERE id = ?',
    [libro.titulo, libro.autor, libro.editorial, libro.anio, libro.categoria_id, libro.codigo, libro.descripcion || null, libro.stock, id]
  );
}

async function eliminar(id) {
  await db.query('DELETE FROM libros WHERE id = ?', [id]);
}

module.exports = { listar, obtenerPorId, buscar, disponibles, crear, actualizar, eliminar };
