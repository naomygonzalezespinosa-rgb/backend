const categoriasModel = require('../models/categoriasModel');

async function listar(req, res) {
  try {
    return res.json(await categoriasModel.listar());
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar categorias', error: error.message });
  }
}

async function obtener(req, res) {
  try {
    const categoria = await categoriasModel.obtenerPorId(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: 'Categoria no encontrada' });
    return res.json(categoria);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener categoria', error: error.message });
  }
}

async function conLibros(req, res) {
  try {
    return res.json(await categoriasModel.conCantidadLibros());
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar categorias con libros', error: error.message });
  }
}

async function crear(req, res) {
  try {
    if (!req.body.nombre) return res.status(400).json({ mensaje: 'El nombre de la categoria es obligatorio' });
    const id = await categoriasModel.crear(req.body);
    return res.status(201).json({ mensaje: 'Categoria registrada', id });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar categoria', error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    if (!req.body.nombre) return res.status(400).json({ mensaje: 'El nombre de la categoria es obligatorio' });
    await categoriasModel.actualizar(req.params.id, req.body);
    return res.json({ mensaje: 'Categoria actualizada' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar categoria', error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    await categoriasModel.eliminar(req.params.id);
    return res.json({ mensaje: 'Categoria eliminada' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar categoria', error: error.message });
  }
}

module.exports = { listar, obtener, conLibros, crear, actualizar, eliminar };
