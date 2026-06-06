const devolucionesModel = require('../models/devolucionesModel');

async function listar(req, res) {
  try {
    return res.json(await devolucionesModel.listar());
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar devoluciones', error: error.message });
  }
}

async function obtener(req, res) {
  try {
    const devolucion = await devolucionesModel.obtenerPorId(req.params.id);
    if (!devolucion) return res.status(404).json({ mensaje: 'Devolucion no encontrada' });
    return res.json(devolucion);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener devolucion', error: error.message });
  }
}

async function porEstadoLibro(req, res) {
  try {
    const estados = ['bueno', 'danado', 'perdido'];
    if (!estados.includes(req.params.estado)) return res.status(400).json({ mensaje: 'Estado del libro no valido' });
    return res.json(await devolucionesModel.porEstadoLibro(req.params.estado));
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar devoluciones por estado', error: error.message });
  }
}

async function crear(req, res) {
  try {
    const validacion = validarDevolucion(req.body);
    if (validacion) return res.status(400).json({ mensaje: validacion });

    const id = await devolucionesModel.crear(req.body);
    return res.status(201).json({ mensaje: 'Devolucion registrada', id });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar devolucion', error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const validacion = validarDevolucion(req.body, true);
    if (validacion) return res.status(400).json({ mensaje: validacion });

    await devolucionesModel.actualizar(req.params.id, req.body);
    return res.json({ mensaje: 'Devolucion actualizada' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar devolucion', error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    await devolucionesModel.eliminar(req.params.id);
    return res.json({ mensaje: 'Devolucion eliminada' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar devolucion', error: error.message });
  }
}

function validarDevolucion(devolucion, esUpdate = false) {
  const estados = ['bueno', 'danado', 'perdido'];
  if (!esUpdate && !devolucion.prestamo_id) return 'El prestamo es obligatorio para registrar la devolucion';
  if (!devolucion.fecha_devolucion_real) return 'La fecha real de devolucion es obligatoria';
  if (devolucion.estado_libro && !estados.includes(devolucion.estado_libro)) return 'Estado del libro no valido';
  return null;
}

module.exports = { listar, obtener, porEstadoLibro, crear, actualizar, eliminar };
