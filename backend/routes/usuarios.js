const express = require('express');
const usuariosController = require('../controllers/usuariosController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verificarToken, usuariosController.listar);
router.get('/rol/:rol', verificarToken, usuariosController.porRol);
router.get('/:id', verificarToken, usuariosController.obtener);
router.post('/', verificarToken, usuariosController.crear);
router.put('/:id', verificarToken, usuariosController.actualizar);
router.delete('/:id', verificarToken, usuariosController.eliminar);

module.exports = router;
