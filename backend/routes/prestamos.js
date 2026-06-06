const express = require('express');
const prestamosController = require('../controllers/prestamosController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verificarToken, prestamosController.listar);
router.get('/activos/lista', verificarToken, prestamosController.activos);
router.get('/usuario/:usuarioId', verificarToken, prestamosController.porUsuario);
router.get('/:id', verificarToken, prestamosController.obtener);
router.post('/', verificarToken, prestamosController.crear);
router.put('/:id', verificarToken, prestamosController.actualizar);
router.delete('/:id', verificarToken, prestamosController.eliminar);

module.exports = router;
