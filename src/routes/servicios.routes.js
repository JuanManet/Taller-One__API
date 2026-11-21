const express = require('express');
const { db } = require('../config/database');

const router = express.Router();

// Crear un servicio
router.post('/', (req, res) => {
  const {
    nombre,
    descripcion,
    costo_estimado,
    duracion_estimada,
    activo
  } = req.body || {};

  if (!nombre || costo_estimado === undefined || !duracion_estimada) {
    return res.status(400).json({
      error: 'Los campos "nombre", "costo_estimado" y "duracion_estimada" son obligatorios'
    });
  }

  if (Number(costo_estimado) < 0) {
    return res.status(400).json({
      error: 'El campo "costo_estimado" debe ser mayor o igual que cero'
    });
  }

  if (Number(duracion_estimada) <= 0) {
    return res.status(400).json({
      error: 'El campo "duracion_estimada" debe ser mayor que cero'
    });
  }

  try {
    const resultado = db.prepare(`
      INSERT INTO servicio (
        nombre, descripcion, costo_estimado, duracion_estimada, activo
      )
      VALUES (?, ?, ?, ?, ?)
    `).run(
      nombre,
      descripcion || null,
      costo_estimado,
      duracion_estimada,
      activo === false ? 0 : 1
    );

    const servicio = db
      .prepare('SELECT * FROM servicio WHERE id_servicio = ?')
      .get(Number(resultado.lastInsertRowid));

    res.status(201).json(servicio);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        error: 'Ya existe un servicio con ese nombre'
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Listar servicios
router.get('/', (req, res) => {
  const servicios = db
    .prepare('SELECT * FROM servicio ORDER BY id_servicio')
    .all();

  res.json(servicios);
});

// Obtener un servicio por id
router.get('/:id', (req, res) => {
  const servicio = db
    .prepare('SELECT * FROM servicio WHERE id_servicio = ?')
    .get(req.params.id);

  if (!servicio) {
    return res.status(404).json({
      error: `El servicio con id ${req.params.id} no existe`
    });
  }

  res.json(servicio);
});

// Actualizar un servicio
router.put('/:id', (req, res) => {
  const {
    nombre,
    descripcion,
    costo_estimado,
    duracion_estimada,
    activo
  } = req.body || {};

  const servicio = db
    .prepare('SELECT id_servicio FROM servicio WHERE id_servicio = ?')
    .get(req.params.id);

  if (!servicio) {
    return res.status(404).json({
      error: `El servicio con id ${req.params.id} no existe`
    });
  }

  if (!nombre || costo_estimado === undefined || !duracion_estimada) {
    return res.status(400).json({
      error: 'Los campos "nombre", "costo_estimado" y "duracion_estimada" son obligatorios'
    });
  }

  db.prepare(`
    UPDATE servicio
    SET nombre = ?, descripcion = ?, costo_estimado = ?,
        duracion_estimada = ?, activo = ?
    WHERE id_servicio = ?
  `).run(
    nombre,
    descripcion || null,
    costo_estimado,
    duracion_estimada,
    activo === false ? 0 : 1,
    req.params.id
  );

  const servicioActualizado = db
    .prepare('SELECT * FROM servicio WHERE id_servicio = ?')
    .get(req.params.id);

  res.json(servicioActualizado);
});

// Eliminar un servicio
router.delete('/:id', (req, res) => {
  const resultado = db
    .prepare('DELETE FROM servicio WHERE id_servicio = ?')
    .run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({
      error: `El servicio con id ${req.params.id} no existe`
    });
  }

  res.json({ mensaje: `Servicio ${req.params.id} eliminado` });
});

module.exports = router;