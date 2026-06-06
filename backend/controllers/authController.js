const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

async function registrar(req, res) {
  try {
    const { nombre, matricula, email, correo, password, rol } = req.body;
    const emailUsuario = email || correo;

    if (!nombre || !emailUsuario || !password) {
      return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });
    }

    const existe = await authModel.findByEmail(emailUsuario);
    if (existe) {
      return res.status(400).json({ mensaje: 'Este email ya esta registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await authModel.createUser({ nombre, matricula, email: emailUsuario, passwordHash, rol });

    return res.status(201).json({ mensaje: 'Usuario registrado correctamente', id });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, correo, password } = req.body;
    const emailUsuario = email || correo;

    if (!emailUsuario || !password) {
      return res.status(400).json({ mensaje: 'Email y password son requeridos' });
    }

    const usuario = await authModel.findByEmail(emailUsuario);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    return res.json({
      mensaje: 'Login exitoso',
      token,
      nombre: usuario.nombre,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        matricula: usuario.matricula,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesion', error: error.message });
  }
}

module.exports = { registrar, login };
