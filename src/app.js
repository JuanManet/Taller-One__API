const express = require('express');

const clientesRoutes = require('./routes/clientes.routes');
const vehiculosRoutes = require('./routes/vehiculos.routes');
const citasRoutes = require('./routes/citas.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const ordenesRoutes = require('./routes/ordenes.routes');

const app = express();

app.use(express.json());

// Información general de TallerOne.
app.get('/', (req, res) => {
  res.json({
    sistema: 'TallerOne',
    descripcion:
      'Plataforma de gestión de servicios y turnos para talleres mecánicos multimarca'
  });
});

// Módulos disponibles.
app.use('/api/clientes', clientesRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/ordenes', ordenesRoutes);

// Ruta no encontrada.
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Manejador general de errores.
// Conserva los cuatro parámetros.
app.use((error, req, res, next) => {
  console.error(error);

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'El cuerpo de la petición contiene un JSON inválido'
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

module.exports = app;