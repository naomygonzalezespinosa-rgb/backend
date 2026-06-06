const express = require('express');
const librosController = require('../controllers/librosController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verificarToken, librosController.listar);
router.get('/buscar/catalogo', verificarToken, librosController.buscar);
router.get('/disponibles/catalogo', verificarToken, librosController.disponibles);
router.get('/:id', verificarToken, librosController.obtener);
router.post('/', verificarToken, librosController.crear);
router.put('/:id', verificarToken, librosController.actualizar);
router.delete('/:id', verificarToken, librosController.eliminar);

module.exports = router;
