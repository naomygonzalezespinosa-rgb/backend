const inicioModel = require('../models/inicioModel');

async function resumen(req, res) {
  try {
    const resumen = await inicioModel.obtenerResumen();
    return res.json({
      mensaje: 'Bienvenido al Sistema de Biblioteca Escolar',
      fecha: new Date().toISOString(),
      modulos: ['libros', 'categorias', 'usuarios', 'prestamos', 'devoluciones'],
      resumen
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener resumen', error: error.message });
  }
}

module.exports = { resumen };
