PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cliente (
  id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(100) NOT NULL,
  documento VARCHAR(20) NOT NULL UNIQUE,
  telefono VARCHAR(20) NOT NULL,
  correo VARCHAR(120) UNIQUE,
  direccion VARCHAR(150),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehiculo (
  id_vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
  placa VARCHAR(10) NOT NULL UNIQUE,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Automóvil', 'Motocicleta', 'Otro')),
  anio INTEGER NOT NULL,
  color VARCHAR(30),
  numero_motor VARCHAR(50) UNIQUE,
  numero_chasis VARCHAR(50) UNIQUE,
  id_cliente INTEGER NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE IF NOT EXISTS cita (
  id_cita INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha_hora DATETIME NOT NULL,
  canal_solicitud TEXT NOT NULL CHECK (
    canal_solicitud IN ('Presencial', 'Teléfono', 'WhatsApp', 'Web')
  ),
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (
    estado IN ('Pendiente', 'Confirmada', 'Atendida', 'Cancelada')
  ),
  observaciones TEXT,
  id_cliente INTEGER NOT NULL,
  id_vehiculo INTEGER NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo)
);

CREATE TABLE IF NOT EXISTS servicio (
  id_servicio INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  costo_estimado DECIMAL(12,2) NOT NULL CHECK (costo_estimado >= 0),
  duracion_estimada INTEGER NOT NULL CHECK (duracion_estimada > 0),
  activo BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS mecanico (
  id_mecanico INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(100) NOT NULL,
  documento VARCHAR(20) NOT NULL UNIQUE,
  telefono VARCHAR(20) UNIQUE,
  disponibilidad TEXT NOT NULL DEFAULT 'Disponible' CHECK (
    disponibilidad IN ('Disponible', 'Ocupado', 'Inactivo')
  ),
  estado_laboral TEXT NOT NULL DEFAULT 'Activo' CHECK (
    estado_laboral IN ('Activo', 'Inactivo')
  )
);

CREATE TABLE IF NOT EXISTS especialidad (
  id_especialidad INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS mecanico_especialidad (
  id_mecanico INTEGER NOT NULL,
  id_especialidad INTEGER NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('Básico', 'Intermedio', 'Avanzado')),
  PRIMARY KEY (id_mecanico, id_especialidad),
  FOREIGN KEY (id_mecanico) REFERENCES mecanico(id_mecanico),
  FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad)
);

CREATE TABLE IF NOT EXISTS orden_trabajo (
  id_orden INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha_ingreso DATETIME NOT NULL,
  fecha_salida DATETIME,
  estado TEXT NOT NULL DEFAULT 'Recibida' CHECK (
    estado IN ('Recibida', 'Diagnóstico', 'Reparación', 'Terminada', 'Entregada')
  ),
  prioridad TEXT NOT NULL DEFAULT 'Normal' CHECK (
    prioridad IN ('Baja', 'Normal', 'Alta', 'Urgente')
  ),
  observaciones TEXT,
  id_cita INTEGER UNIQUE,
  id_cliente INTEGER NOT NULL,
  id_vehiculo INTEGER NOT NULL,
  id_mecanico INTEGER,
  FOREIGN KEY (id_cita) REFERENCES cita(id_cita),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo),
  FOREIGN KEY (id_mecanico) REFERENCES mecanico(id_mecanico)
);

CREATE TABLE IF NOT EXISTS orden_servicio (
  id_orden INTEGER NOT NULL,
  id_servicio INTEGER NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  costo_real DECIMAL(12,2) NOT NULL CHECK (costo_real >= 0),
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (
    estado IN ('Pendiente', 'En proceso', 'Terminado')
  ),
  PRIMARY KEY (id_orden, id_servicio),
  FOREIGN KEY (id_orden) REFERENCES orden_trabajo(id_orden),
  FOREIGN KEY (id_servicio) REFERENCES servicio(id_servicio)
);

CREATE TABLE IF NOT EXISTS repuesto (
  id_repuesto INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(100) NOT NULL,
  referencia VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  cantidad_stock INTEGER NOT NULL CHECK (cantidad_stock >= 0),
  costo_unitario DECIMAL(12,2) NOT NULL CHECK (costo_unitario >= 0),
  disponibilidad TEXT NOT NULL DEFAULT 'Disponible' CHECK (
    disponibilidad IN ('Disponible', 'Agotado', 'Pendiente')
  )
);

CREATE TABLE IF NOT EXISTS servicio_repuesto (
  id_servicio INTEGER NOT NULL,
  id_repuesto INTEGER NOT NULL,
  cantidad_requerida INTEGER NOT NULL CHECK (cantidad_requerida > 0),
  PRIMARY KEY (id_servicio, id_repuesto),
  FOREIGN KEY (id_servicio) REFERENCES servicio(id_servicio),
  FOREIGN KEY (id_repuesto) REFERENCES repuesto(id_repuesto)
);

CREATE TABLE IF NOT EXISTS orden_repuesto (
  id_orden INTEGER NOT NULL,
  id_repuesto INTEGER NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  costo_unitario DECIMAL(12,2) NOT NULL CHECK (costo_unitario >= 0),
  estado TEXT NOT NULL DEFAULT 'Solicitado' CHECK (
    estado IN ('Solicitado', 'Pendiente', 'Utilizado', 'Cancelado')
  ),
  PRIMARY KEY (id_orden, id_repuesto),
  FOREIGN KEY (id_orden) REFERENCES orden_trabajo(id_orden),
  FOREIGN KEY (id_repuesto) REFERENCES repuesto(id_repuesto)
);

CREATE TABLE IF NOT EXISTS pago (
  id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha_pago DATETIME NOT NULL,
  valor DECIMAL(12,2) NOT NULL CHECK (valor > 0),
  tipo_pago TEXT NOT NULL CHECK (tipo_pago IN ('Abono', 'Pago final')),
  metodo_pago TEXT NOT NULL CHECK (
    metodo_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro')
  ),
  observaciones TEXT,
  id_orden INTEGER NOT NULL,
  FOREIGN KEY (id_orden) REFERENCES orden_trabajo(id_orden)
);

CREATE TABLE IF NOT EXISTS factura (
  id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
  numero VARCHAR(30) NOT NULL UNIQUE,
  fecha_emision DATETIME NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  impuestos DECIMAL(12,2) NOT NULL CHECK (impuestos >= 0),
  total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  forma_pago TEXT NOT NULL CHECK (
    forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Mixto')
  ),
  id_orden INTEGER NOT NULL UNIQUE,
  FOREIGN KEY (id_orden) REFERENCES orden_trabajo(id_orden)
);

CREATE TABLE IF NOT EXISTS historial_vehicular (
  id_historial INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha_servicio DATE NOT NULL,
  servicio_realizado VARCHAR(200) NOT NULL,
  costo DECIMAL(12,2) NOT NULL CHECK (costo >= 0),
  recomendaciones TEXT,
  observaciones TEXT,
  id_vehiculo INTEGER NOT NULL,
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo)
);