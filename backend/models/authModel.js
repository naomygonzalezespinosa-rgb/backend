const db = require('../config/db');

// Busca un usuario por email para validar registro y login del sistema escolar.
async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

// Crea una cuenta con password encriptado y rol real del sistema.
async function createUser({ nombre, matricula, email, passwordHash, rol = 'estudiante' }) {
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, matricula, email, password, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre, matricula || null, email, passwordHash, rol]
  );
  return result.insertId;
}

module.exports = { findByEmail, createUser };
