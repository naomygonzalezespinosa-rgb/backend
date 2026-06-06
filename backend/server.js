const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const inicioRoutes = require('./routes/inicio');
const librosRoutes = require('./routes/libros');
const categoriasRoutes = require('./routes/categorias');
const usuariosRoutes = require('./routes/usuarios');
const prestamosRoutes = require('./routes/prestamos');
const devolucionesRoutes = require('./routes/devoluciones');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/inicio', inicioRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/devoluciones', devolucionesRoutes);

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
