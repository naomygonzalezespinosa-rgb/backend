const db = require('../config/db');

async function listar() {
  const [rows] = await db.query('SELECT * FROM categorias ORDER BY nombre');
  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
  return rows[0];
}

async function conCantidadLibros() {
  const [rows] = await db.query(`
    SELECT c.*, COUNT(l.id) AS total_libros
    FROM categorias c
    LEFT JOIN libros l ON l.categoria_id = c.id
    GROUP BY c.id
    ORDER BY c.nombre
  `);
  return rows;
}

async function crear({ nombre, descripcion }) {
  const [result] = await db.query(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion || null]
  );
  return result.insertId;
}

async function actualizar(id, { nombre, descripcion }) {
  await db.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion || null, id]);
}

async function eliminar(id) {
  await db.query('DELETE FROM categorias WHERE id = ?', [id]);
}

module.exports = { listar, obtenerPorId, conCantidadLibros, crear, actualizar, eliminar };
