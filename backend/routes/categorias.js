const express = require('express');
const categoriasController = require('../controllers/categoriasController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verificarToken, categoriasController.listar);
router.get('/con-libros/resumen', verificarToken, categoriasController.conLibros);
router.get('/:id', verificarToken, categoriasController.obtener);
router.post('/', verificarToken, categoriasController.crear);
router.put('/:id', verificarToken, categoriasController.actualizar);
router.delete('/:id', verificarToken, categoriasController.eliminar);

module.exports = router;
