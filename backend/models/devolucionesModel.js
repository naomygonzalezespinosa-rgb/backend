const db = require('../config/db');

async function listar() {
  const [rows] = await db.query(`
    SELECT d.*, p.usuario_id, p.libro_id, u.nombre AS usuario, l.titulo AS libro
    FROM devoluciones d
    INNER JOIN prestamos p ON p.id = d.prestamo_id
    INNER JOIN usuarios u ON u.id = p.usuario_id
    INNER JOIN libros l ON l.id = p.libro_id
    ORDER BY d.id DESC
  `);
  return rows;
}

async function obtenerPorId(id) {
  const [rows] = await db.query('SELECT * FROM devoluciones WHERE id = ?', [id]);
  return rows[0];
}

async function porEstadoLibro(estadoLibro) {
  const [rows] = await db.query(`
    SELECT d.*, u.nombre AS usuario, l.titulo AS libro
    FROM devoluciones d
    INNER JOIN prestamos p ON p.id = d.prestamo_id
    INNER JOIN usuarios u ON u.id = p.usuario_id
    INNER JOIN libros l ON l.id = p.libro_id
    WHERE d.estado_libro = ?
    ORDER BY d.id DESC
  `, [estadoLibro]);
  return rows;
}

async function crear({ prestamo_id, fecha_devolucion_real, estado_libro, observaciones }) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [[prestamo]] = await connection.query('SELECT * FROM prestamos WHERE id = ? FOR UPDATE', [prestamo_id]);
    if (!prestamo) throw new Error('Prestamo no encontrado');
    if (prestamo.estado === 'devuelto') throw new Error('El prestamo ya fue devuelto');

    const [result] = await connection.query(
      'INSERT INTO devoluciones (prestamo_id, fecha_devolucion_real, estado_libro, observaciones) VALUES (?, ?, ?, ?)',
      [prestamo_id, fecha_devolucion_real, estado_libro || 'bueno', observaciones || null]
    );
    await connection.query("UPDATE prestamos SET estado = 'devuelto' WHERE id = ?", [prestamo_id]);
    await connection.query('UPDATE libros SET stock = stock + 1 WHERE id = ?', [prestamo.libro_id]);

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function actualizar(id, { fecha_devolucion_real, estado_libro, observaciones }) {
  await db.query(
    'UPDATE devoluciones SET fecha_devolucion_real = ?, estado_libro = ?, observaciones = ? WHERE id = ?',
    [fecha_devolucion_real, estado_libro, observaciones || null, id]
  );
}

async function eliminar(id) {
  await db.query('DELETE FROM devoluciones WHERE id = ?', [id]);
}

module.exports = { listar, obtenerPorId, porEstadoLibro, crear, actualizar, eliminar };
