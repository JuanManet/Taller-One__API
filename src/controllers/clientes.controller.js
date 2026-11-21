const { db } = require('../config/database');

function crearCliente(req, res, next) {
  const { nombre, documento, telefono, correo, direccion } = req.body || {};

  if (!nombre || !documento || !telefono) {
    return res.status(400).json({
      error: 'Los campos "nombre", "documento" y "telefono" son obligatorios'
    });
  }

  try {
    const resultado = db
      .prepare(`
        INSERT INTO cliente (nombre, documento, telefono, correo, direccion)
        VALUES (?, ?, ?, ?, ?)
      `)
      .run(nombre, documento, telefono, correo || null, direccion || null);

    const cliente = db
      .prepare('SELECT * FROM cliente WHERE id_cliente = ?')
      .get(Number(resultado.lastInsertRowid));

    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
}

function listarClientes(req, res) {
  const clientes = db
    .prepare('SELECT * FROM cliente ORDER BY id_cliente')
    .all();

  res.json(clientes);
}

function obtenerCliente(req, res) {
  const cliente = db
    .prepare('SELECT * FROM cliente WHERE id_cliente = ?')
    .get(req.params.id);

  if (!cliente) {
    return res.status(404).json({
      error: `El cliente con id ${req.params.id} no existe`
    });
  }

  res.json(cliente);
}

function actualizarCliente(req, res) {
  const { nombre, documento, telefono, correo, direccion } = req.body || {};

  const cliente = db
    .prepare('SELECT id_cliente FROM cliente WHERE id_cliente = ?')
    .get(req.params.id);

  if (!cliente) {
    return res.status(404).json({
      error: `El cliente con id ${req.params.id} no existe`
    });
  }

  db.prepare(`
    UPDATE cliente
    SET nombre = ?, documento = ?, telefono = ?, correo = ?, direccion = ?
    WHERE id_cliente = ?
  `).run(
    nombre,
    documento,
    telefono,
    correo || null,
    direccion || null,
    req.params.id
  );

  const clienteActualizado = db
    .prepare('SELECT * FROM cliente WHERE id_cliente = ?')
    .get(req.params.id);

  res.json(clienteActualizado);
}

function eliminarCliente(req, res) {
  const resultado = db
    .prepare('DELETE FROM cliente WHERE id_cliente = ?')
    .run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({
      error: `El cliente con id ${req.params.id} no existe`
    });
  }

  res.json({ mensaje: `Cliente ${req.params.id} eliminado` });
}

module.exports = {
  crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente
};