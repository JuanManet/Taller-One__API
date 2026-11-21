const { db } = require('../config/database');

const CANALES_VALIDOS = ['Presencial', 'Teléfono', 'WhatsApp', 'Web'];
const ESTADOS_VALIDOS = ['Pendiente', 'Confirmada', 'Atendida', 'Cancelada'];

function crearCita(req, res, next) {
  const {
    fecha_hora,
    canal_solicitud,
    estado,
    observaciones,
    id_cliente,
    id_vehiculo
  } = req.body || {};

  if (!fecha_hora || !canal_solicitud || !id_cliente || !id_vehiculo) {
    return res.status(400).json({
      error: 'Los campos "fecha_hora", "canal_solicitud", "id_cliente" y "id_vehiculo" son obligatorios'
    });
  }

  if (!CANALES_VALIDOS.includes(canal_solicitud)) {
    return res.status(400).json({
      error: `El canal debe ser uno de: ${CANALES_VALIDOS.join(', ')}`
    });
  }

  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({
      error: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`
    });
  }

  const cliente = db
    .prepare('SELECT id_cliente FROM cliente WHERE id_cliente = ?')
    .get(id_cliente);

  const vehiculo = db
    .prepare('SELECT id_vehiculo FROM vehiculo WHERE id_vehiculo = ?')
    .get(id_vehiculo);

  if (!cliente) {
    return res.status(400).json({ error: `El cliente con id ${id_cliente} no existe` });
  }

  if (!vehiculo) {
    return res.status(400).json({ error: `El vehículo con id ${id_vehiculo} no existe` });
  }

  try {
    const resultado = db.prepare(`
      INSERT INTO cita (
        fecha_hora, canal_solicitud, estado, observaciones, id_cliente, id_vehiculo
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      fecha_hora,
      canal_solicitud,
      estado || 'Pendiente',
      observaciones || null,
      id_cliente,
      id_vehiculo
    );

    const cita = db
      .prepare('SELECT * FROM cita WHERE id_cita = ?')
      .get(Number(resultado.lastInsertRowid));

    res.status(201).json(cita);
  } catch (error) {
    next(error);
  }
}

function listarCitas(req, res) {
  const citas = db.prepare(`
    SELECT
      c.id_cita,
      c.fecha_hora,
      c.canal_solicitud,
      c.estado,
      c.observaciones,
      cl.id_cliente,
      cl.nombre AS cliente_nombre,
      v.id_vehiculo,
      v.placa,
      v.marca,
      v.modelo
    FROM cita c
    JOIN cliente cl ON c.id_cliente = cl.id_cliente
    JOIN vehiculo v ON c.id_vehiculo = v.id_vehiculo
    ORDER BY c.fecha_hora
  `).all();

  res.json(citas);
}

module.exports = {
  crearCita,
  listarCitas
};