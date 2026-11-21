const express = require('express');
const controller = require('../controllers/clientes.controller');

const router = express.Router();

router.post('/', controller.crearCliente);
router.get('/', controller.listarClientes);
router.get('/:id', controller.obtenerCliente);
router.put('/:id', controller.actualizarCliente);
router.delete('/:id', controller.eliminarCliente);

module.exports = router;