const db = require('../config/db');

async function listar() {
  const [rows] = await db.query(`
    SELECT p.*, u.nombre AS usuario, l.titulo AS libro
    FROM prestamos p
    INNER JOIN usuarios u ON u.id = p.usuario_id
    INNER JOIN libros l ON l.id = p.libro_id
    ORDER BY p.id DESC
  `);
  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await db.query('SELECT * FROM prestamos WHERE id = ?', [id]);
  return rows[0];
}

async function activos() {
  const [rows] = await db.query(`
    SELECT p.*, u.nombre AS usuario, l.titulo AS libro
    FROM prestamos p
    INNER JOIN usuarios u ON u.id = p.usuario_id
    INNER JOIN libros l ON l.id = p.libro_id
    WHERE p.estado = 'activo'
    ORDER BY p.fecha_devolucion ASC
  `);
  return rows;
}

async function porUsuario(usuarioId) {
  const [rows] = await db.query(`
    SELECT p.*, l.titulo AS libro, l.autor
    FROM prestamos p
    INNER JOIN libros l ON l.id = p.libro_id
    WHERE p.usuario_id = ?
    ORDER BY p.id DESC
  `, [usuarioId]);
  return rows;
}

async function crear({ usuario_id, libro_id, fecha_prestamo, fecha_devolucion }) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [[libro]] = await connection.query('SELECT stock FROM libros WHERE id = ? FOR UPDATE', [libro_id]);
    if (!libro || libro.stock <= 0) {
      throw new Error('No hay stock disponible para este libro');
    }

    const [result] = await connection.query(
      'INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, libro_id, fecha_prestamo, fecha_devolucion, 'activo']
    );
    await connection.query('UPDATE libros SET stock = stock - 1 WHERE id = ?', [libro_id]);

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function actualizar(id, { usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado }) {
  await db.query(
    'UPDATE prestamos SET usuario_id = ?, libro_id = ?, fecha_prestamo = ?, fecha_devolucion = ?, estado = ? WHERE id = ?',
    [usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado, id]
  );
}

async function eliminar(id) {
  await db.query('DELETE FROM prestamos WHERE id = ?', [id]);
}

module.exports = { listar, obtenerPorId, activos, porUsuario, crear, actualizar, eliminar };
