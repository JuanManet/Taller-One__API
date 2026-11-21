const { db } = require('../config/database');

const TIPOS_VALIDOS = ['Automóvil', 'Motocicleta', 'Otro'];

function crearVehiculo(req, res, next) {
  const {
    placa,
    marca,
    modelo,
    tipo,
    anio,
    color,
    numero_motor,
    numero_chasis,
    id_cliente
  } = req.body || {};

  if (!placa || !marca || !modelo || !tipo || !anio || !id_cliente) {
    return res.status(400).json({
      error: 'Los campos "placa", "marca", "modelo", "tipo", "anio" y "id_cliente" son obligatorios'
    });
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({
      error: `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`
    });
  }

  const cliente = db
    .prepare('SELECT id_cliente FROM cliente WHERE id_cliente = ?')
    .get(id_cliente);

  if (!cliente) {
    return res.status(400).json({
      error: `El cliente con id ${id_cliente} no existe`
    });
  }

  try {
    const resultado = db.prepare(`
      INSERT INTO vehiculo (
        placa, marca, modelo, tipo, anio, color,
        numero_motor, numero_chasis, id_cliente
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      placa,
      marca,
      modelo,
      tipo,
      anio,
      color || null,
      numero_motor || null,
      numero_chasis || null,
      id_cliente
    );

    const vehiculo = db
      .prepare('SELECT * FROM vehiculo WHERE id_vehiculo = ?')
      .get(Number(resultado.lastInsertRowid));

    res.status(201).json(vehiculo);
  } catch (error) {
    next(error);
  }
}

function listarVehiculos(req, res) {
  const vehiculos = db.prepare(`
    SELECT
      v.*,
      c.nombre AS cliente_nombre,
      c.documento AS cliente_documento
    FROM vehiculo v
    JOIN cliente c ON v.id_cliente = c.id_cliente
    ORDER BY v.id_vehiculo
  `).all();

  res.json(vehiculos);
}

module.exports = {
  crearVehiculo,
  listarVehiculos
};