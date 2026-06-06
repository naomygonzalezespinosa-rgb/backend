const prestamosModel = require('../models/prestamosModel');

async function listar(req, res) {
  try {
    return res.json(await prestamosModel.listar());
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar prestamos', error: error.message });
  }
}

async function obtener(req, res) {
  try {
    const prestamo = await prestamosModel.obtenerPorId(req.params.id);
    if (!prestamo) return res.status(404).json({ mensaje: 'Prestamo no encontrado' });
    return res.json(prestamo);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener prestamo', error: error.message });
  }
}

async function activos(req, res) {
  try {
    return res.json(await prestamosModel.activos());
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar prestamos activos', error: error.message });
  }
}

async function porUsuario(req, res) {
  try {
    return res.json(await prestamosModel.porUsuario(req.params.usuarioId));
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar prestamos del usuario', error: error.message });
  }
}

async function crear(req, res) {
  try {
    const validacion = validarPrestamo(req.body);
    if (validacion) return res.status(400).json({ mensaje: validacion });

    const id = await prestamosModel.crear(req.body);
    return res.status(201).json({ mensaje: 'Prestamo registrado', id });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar prestamo', error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const validacion = validarPrestamo(req.body);
    if (validacion) return res.status(400).json({ mensaje: validacion });

    await prestamosModel.actualizar(req.params.id, req.body);
    return res.json({ mensaje: 'Prestamo actualizado' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar prestamo', error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    await prestamosModel.eliminar(req.params.id);
    return res.json({ mensaje: 'Prestamo eliminado' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar prestamo', error: error.message });
  }
}

function validarPrestamo(prestamo) {
  if (!prestamo.usuario_id || !prestamo.libro_id || !prestamo.fecha_prestamo || !prestamo.fecha_devolucion) {
    return 'Usuario, libro, fecha de prestamo y fecha limite son obligatorios';
  }
  if (new Date(prestamo.fecha_devolucion) < new Date(prestamo.fecha_prestamo)) {
    return 'La fecha limite no puede ser anterior a la fecha de prestamo';
  }
  if (prestamo.estado && !['activo', 'devuelto', 'vencido'].includes(prestamo.estado)) return 'Estado de prestamo no valido';
  return null;
}

module.exports = { listar, obtener, activos, porUsuario, crear, actualizar, eliminar };
