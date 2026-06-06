const librosModel = require('../models/librosModel');

async function listar(req, res) {
  try {
    const libros = await librosModel.listar();
    return res.json(libros);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar libros', error: error.message });
  }
}

async function obtener(req, res) {
  try {
    const libro = await librosModel.obtenerPorId(req.params.id);
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    return res.json(libro);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener libro', error: error.message });
  }
}

async function buscar(req, res) {
  try {
    const libros = await librosModel.buscar(req.query.q || '');
    return res.json(libros);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al buscar libros', error: error.message });
  }
}

async function disponibles(req, res) {
  try {
    return res.json(await librosModel.disponibles());
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar libros disponibles', error: error.message });
  }
}

async function crear(req, res) {
  try {
    const validacion = validarLibro(req.body);
    if (validacion) return res.status(400).json({ mensaje: validacion });

    const id = await librosModel.crear(req.body);
    return res.status(201).json({ mensaje: 'Libro registrado', id });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar libro', error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const validacion = validarLibro(req.body);
    if (validacion) return res.status(400).json({ mensaje: validacion });

    await librosModel.actualizar(req.params.id, req.body);
    return res.json({ mensaje: 'Libro actualizado' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar libro', error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    await librosModel.eliminar(req.params.id);
    return res.json({ mensaje: 'Libro eliminado' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar libro', error: error.message });
  }
}

function validarLibro(libro) {
  if (!libro.titulo || !libro.autor || !libro.codigo) return 'Titulo, autor y codigo del libro son obligatorios';
  if (Number(libro.stock) < 0) return 'El stock no puede ser negativo';
  if (libro.anio && (Number(libro.anio) < 1000 || Number(libro.anio) > new Date().getFullYear())) {
    return 'El anio del libro no es valido';
  }
  return null;
}

module.exports = { listar, obtener, buscar, disponibles, crear, actualizar, eliminar };
