const { db } = require('../config/database');

const ESTADOS_ORDEN = [
  'Recibida',
  'Diagnóstico',
  'Reparación',
  'Terminada',
  'Entregada'
];

const PRIORIDADES = ['Baja', 'Normal', 'Alta', 'Urgente'];

function crearOrden(req, res, next) {
  const {
    fecha_ingreso,
    estado,
    prioridad,
    observaciones,
    id_cita,
    id_cliente,
    id_vehiculo,
    id_mecanico,
    servicios
  } = req.body || {};

  if (!fecha_ingreso || !id_cliente || !id_vehiculo) {
    return res.status(400).json({
      error: 'Los campos "fecha_ingreso", "id_cliente" y "id_vehiculo" son obligatorios'
    });
  }

  if (estado && !ESTADOS_ORDEN.includes(estado)) {
    return res.status(400).json({
      error: `El estado debe ser uno de: ${ESTADOS_ORDEN.join(', ')}`
    });
  }

  if (prioridad && !PRIORIDADES.includes(prioridad)) {
    return res.status(400).json({
      error: `La prioridad debe ser una de: ${PRIORIDADES.join(', ')}`
    });
  }

  try {
    db.exec('BEGIN TRANSACTION;');

    const resultado = db.prepare(`
      INSERT INTO orden_trabajo (
        fecha_ingreso, estado, prioridad, observaciones,
        id_cita, id_cliente, id_vehiculo, id_mecanico
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      fecha_ingreso,
      estado || 'Recibida',
      prioridad || 'Normal',
      observaciones || null,
      id_cita || null,
      id_cliente,
      id_vehiculo,
      id_mecanico || null
    );

    const idOrden = Number(resultado.lastInsertRowid);

    if (Array.isArray(servicios)) {
      const insertarServicio = db.prepare(`
        INSERT INTO orden_servicio (
          id_orden, id_servicio, cantidad, costo_real, estado
        )
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const item of servicios) {
        const servicio = db
          .prepare('SELECT id_servicio FROM servicio WHERE id_servicio = ?')
          .get(item.id_servicio);

        if (!servicio) {
          throw new Error(`El servicio con id ${item.id_servicio} no existe`);
        }

        insertarServicio.run(
          idOrden,
          item.id_servicio,
          item.cantidad || 1,
          item.costo_real || 0,
          item.estado || 'Pendiente'
        );
      }
    }

    db.exec('COMMIT;');

    const orden = db
      .prepare('SELECT * FROM orden_trabajo WHERE id_orden = ?')
      .get(idOrden);

    res.status(201).json(orden);
  } catch (error) {
    db.exec('ROLLBACK;');
    next(error);
  }
}

function listarOrdenes(req, res) {
  const ordenes = db.prepare(`
    SELECT
      o.*,
      c.nombre AS cliente_nombre,
      v.placa,
      v.marca,
      v.modelo,
      m.nombre AS mecanico_nombre
    FROM orden_trabajo o
    JOIN cliente c ON o.id_cliente = c.id_cliente
    JOIN vehiculo v ON o.id_vehiculo = v.id_vehiculo
    LEFT JOIN mecanico m ON o.id_mecanico = m.id_mecanico
    ORDER BY o.fecha_ingreso DESC
  `).all();

  res.json(ordenes);
}

module.exports = {
  crearOrden,
  listarOrdenes
};