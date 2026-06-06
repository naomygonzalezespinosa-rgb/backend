const bcrypt = require('bcryptjs');
const usuariosModel = require('../models/usuariosModel');
const authModel = require('../models/authModel');

async function listar(req, res) {
  try {
    return res.json(await usuariosModel.listar());
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar usuarios', error: error.message });
  }
}

async function obtener(req, res) {
  try {
    const usuario = await usuariosModel.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
}

async function porRol(req, res) {
  try {
    const rolesValidos = ['estudiante', 'bibliotecario', 'administrador'];
    if (!rolesValidos.includes(req.params.rol)) return res.status(400).json({ mensaje: 'Rol no valido' });
    return res.json(await usuariosModel.listarPorRol(req.params.rol));
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al listar usuarios por rol', error: error.message });
  }
}

async function crear(req, res) {
  try {
    const { nombre, matricula, email, password, rol = 'estudiante' } = req.body;
    const validacion = validarUsuario({ nombre, email, rol, password }, true);
    if (validacion) return res.status(400).json({ mensaje: validacion });

    const existe = await authModel.findByEmail(email);
    if (existe) return res.status(400).json({ mensaje: 'Este email ya esta registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await usuariosModel.crear({ nombre, matricula, email, passwordHash, rol });
    return res.status(201).json({ mensaje: 'Usuario registrado', id });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const validacion = validarUsuario(req.body, false);
    if (validacion) return res.status(400).json({ mensaje: validacion });

    await usuariosModel.actualizar(req.params.id, req.body);
    return res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    await usuariosModel.eliminar(req.params.id);
    return res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
}

function validarUsuario(usuario, requierePassword) {
  const rolesValidos = ['estudiante', 'bibliotecario', 'administrador'];
  if (!usuario.nombre || !usuario.email || !usuario.rol) return 'Nombre, email y rol son obligatorios';
  if (!rolesValidos.includes(usuario.rol)) return 'Rol no valido para la biblioteca escolar';
  if (requierePassword && (!usuario.password || usuario.password.length < 6)) return 'El password debe tener al menos 6 caracteres';
  return null;
}

module.exports = { listar, obtener, porRol, crear, actualizar, eliminar };
