const express = require('express');
const controller = require('../controllers/ordenes.controller');

const router = express.Router();

router.post('/', controller.crearOrden);
router.get('/', controller.listarOrdenes);

module.exports = router;