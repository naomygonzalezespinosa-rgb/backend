const db = require('../config/db');

async function listar() {
  const [rows] = await db.query('SELECT id, nombre, matricula, email, rol, creado_en FROM usuarios ORDER BY id DESC');
  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await db.query('SELECT id, nombre, matricula, email, rol, creado_en FROM usuarios WHERE id = ?', [id]);
  return rows[0];
}

async function listarPorRol(rol) {
  const [rows] = await db.query('SELECT id, nombre, matricula, email, rol, creado_en FROM usuarios WHERE rol = ? ORDER BY nombre', [rol]);
  return rows;
}

async function crear({ nombre, matricula, email, passwordHash, rol }) {
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, matricula, email, password, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre, matricula || null, email, passwordHash, rol]
  );
  return result.insertId;
}

async function actualizar(id, { nombre, matricula, email, rol }) {
  await db.query('UPDATE usuarios SET nombre = ?, matricula = ?, email = ?, rol = ? WHERE id = ?', [nombre, matricula || null, email, rol, id]);
}

async function eliminar(id) {
  await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
}

module.exports = { listar, obtenerPorId, listarPorRol, crear, actualizar, eliminar };
