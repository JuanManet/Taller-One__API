const express = require('express');
const controller = require('../controllers/citas.controller');

const router = express.Router();

router.post('/', controller.crearCita);
router.get('/', controller.listarCitas);

module.exports = router;