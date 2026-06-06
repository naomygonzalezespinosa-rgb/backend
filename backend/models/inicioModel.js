const db = require('../config/db');

async function obtenerResumen() {
  const [[libros]] = await db.query('SELECT COUNT(*) AS total FROM libros');
  const [[usuarios]] = await db.query('SELECT COUNT(*) AS total FROM usuarios');
  const [[prestamos]] = await db.query("SELECT COUNT(*) AS total FROM prestamos WHERE estado = 'activo'");
  const [[devoluciones]] = await db.query('SELECT COUNT(*) AS total FROM devoluciones');
  const [[disponibles]] = await db.query('SELECT COALESCE(SUM(stock), 0) AS total FROM libros');
  const [[vencidos]] = await db.query("SELECT COUNT(*) AS total FROM prestamos WHERE estado = 'vencido' OR (estado = 'activo' AND fecha_devolucion < CURDATE())");

  return {
    total_libros: libros.total,
    total_usuarios: usuarios.total,
    prestamos_activos: prestamos.total,
    devoluciones_registradas: devoluciones.total,
    ejemplares_disponibles: disponibles.total,
    prestamos_vencidos: vencidos.total
  };
}

module.exports = { obtenerResumen };
