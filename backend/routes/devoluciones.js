const express = require('express');
const devolucionesController = require('../controllers/devolucionesController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verificarToken, devolucionesController.listar);
router.get('/estado/:estado', verificarToken, devolucionesController.porEstadoLibro);
router.get('/:id', verificarToken, devolucionesController.obtener);
router.post('/', verificarToken, devolucionesController.crear);
router.put('/:id', verificarToken, devolucionesController.actualizar);
router.delete('/:id', verificarToken, devolucionesController.eliminar);

module.exports = router;
