const express = require('express');
const controller = require('../controllers/vehiculos.controller');

const router = express.Router();

router.post('/', controller.crearVehiculo);
router.get('/', controller.listarVehiculos);

module.exports = router;