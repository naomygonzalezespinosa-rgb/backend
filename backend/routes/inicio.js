const express = require('express');
const inicioController = require('../controllers/inicioController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verificarToken, inicioController.resumen);

module.exports = router;
