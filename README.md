# 🚗 TallerOne

**TallerOne** es una plataforma de gestión de servicios y turnos para talleres mecánicos multimarca. Permite administrar clientes, vehículos, citas, servicios, mecánicos, órdenes de trabajo, repuestos, pagos, facturas e historial vehicular a través de una API REST.

## ✨ Características

- 👥 Registro y consulta de clientes.
- 🚙 Administración de vehículos asociados a cada cliente.
- 📅 Gestión de citas por canal de solicitud: presencial, teléfono, WhatsApp o web.
- 🛠️ Catálogo de servicios con costo y duración estimados.
- 🧑‍🔧 Gestión de mecánicos, especialidades y niveles de conocimiento.
- 📋 Creación y seguimiento de órdenes de trabajo.
- 🔩 Control de repuestos, cantidades requeridas y utilizadas.
- 💳 Registro de pagos y emisión de facturas.
- 📚 Historial de servicios realizados a cada vehículo.
- 🗄️ Base de datos SQLite con relaciones entre tablas y validación de claves foráneas.

## 🧰 Tecnologías

| Tecnología | Uso |
|---|---|
| 🟢 Node.js | Entorno de ejecución |
| 🚂 Express | Framework para la API REST |
| 🗃️ SQLite | Base de datos relacional |
| 📦 `node:sqlite` | Módulo nativo para conectarse a SQLite |
| 📝 Markdown | Documentación del proyecto |

## 📋 Requisitos

- 🟢 Node.js 22.13 o superior.
- 📦 npm.
- 💻 Un editor de código, por ejemplo Visual Studio Code.

El módulo `node:sqlite` está incluido en Node.js y permite trabajar con bases de datos SQLite sin instalar controladores adicionales. [2]

## ⚙️ Instalación

Clona o descarga el proyecto y ejecuta:

```bash
npm install
```

## ▶️ Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciarlo en modo normal:

```bash
npm start
```

El servidor estará disponible en:

```text
http://localhost:3000
```

Al ejecutar el proyecto por primera vez, se crea automáticamente el archivo `tallerone.db` y se generan las tablas definidas en `src/database/schema.sql`.

## 🗂️ Estructura del proyecto

```text
tallerone/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── database/
│   │   └── schema.sql
│   ├── routes/
│   │   ├── clientes.routes.js
│   │   ├── vehiculos.routes.js
│   │   ├── citas.routes.js
│   │   ├── servicios.routes.js
│   │   ├── mecanicos.routes.js
│   │   ├── ordenes.routes.js
│   │   ├── repuestos.routes.js
│   │   ├── pagos.routes.js
│   │   └── facturas.routes.js
│   ├── controllers/
│   │   ├── clientes.controller.js
│   │   ├── vehiculos.controller.js
│   │   ├── citas.controller.js
│   │   └── ordenes.controller.js
│   ├── middleware/
│   │   ├── validarCampos.js
│   │   └── manejarErrores.js
│   └── app.js
├── server.js
├── package.json
├── README.md
└── tallerone.db
```

## 🔗 Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| 🟢 `GET` | `/` | Información general de la API |
| ➕ `POST` | `/api/clientes` | Crear un cliente |
| 📄 `GET` | `/api/clientes` | Listar clientes |
| 🔍 `GET` | `/api/clientes/:id` | Obtener un cliente por id |
| ✏️ `PUT` | `/api/clientes/:id` | Actualizar un cliente |
| 🗑️ `DELETE` | `/api/clientes/:id` | Eliminar un cliente |
| ➕ `POST` | `/api/vehiculos` | Crear un vehículo |
| 📄 `GET` | `/api/vehiculos` | Listar vehículos con datos del cliente |
| ➕ `POST` | `/api/citas` | Crear una cita |
| 📄 `GET` | `/api/citas` | Listar citas |
| ➕ `POST` | `/api/servicios` | Crear un servicio |
| 📄 `GET` | `/api/servicios` | Listar servicios |
| ➕ `POST` | `/api/mecanicos` | Crear un mecánico |
| 📄 `GET` | `/api/mecanicos` | Listar mecánicos |
| ➕ `POST` | `/api/ordenes` | Crear una orden de trabajo |
| 📄 `GET` | `/api/ordenes` | Listar órdenes de trabajo |
| ➕ `POST` | `/api/repuestos` | Crear un repuesto |
| 📄 `GET` | `/api/repuestos` | Listar repuestos |
| 💳 `POST` | `/api/pagos` | Registrar un pago |
| 🧾 `POST` | `/api/facturas` | Crear una factura |

## 🧪 Ejemplos de uso

### 👥 Crear un cliente

```http
POST http://localhost:3000/api/clientes
Content-Type: application/json


{
  "nombre": "Juan Pérez",
  "documento": "1010202030",
  "telefono": "3001234567",
  "correo": "juan.perez@correo.com",
  "direccion": "Calle 123 #45-67"
}
```

### 🚙 Crear un vehículo

```http
POST http://localhost:3000/api/vehiculos
Content-Type: application/json


{
  "placa": "ABC123",
  "marca": "Toyota",
  "modelo": "Corolla",
  "tipo": "Automóvil",
  "anio": 2020,
  "color": "Blanco",
  "numero_motor": "MTR-001",
  "numero_chasis": "CHS-001",
  "id_cliente": 1
}
```

### 📅 Crear una cita

```http
POST http://localhost:3000/api/citas
Content-Type: application/json


{
  "fecha_hora": "2026-11-20 09:00:00",
  "canal_solicitud": "WhatsApp",
  "estado": "Pendiente",
  "observaciones": "Revisión de frenos",
  "id_cliente": 1,
  "id_vehiculo": 1
}
```

### 📋 Crear una orden de trabajo

```http
POST http://localhost:3000/api/ordenes
Content-Type: application/json


{
  "fecha_ingreso": "2026-11-20 10:00:00",
  "estado": "Recibida",
  "prioridad": "Normal",
  "observaciones": "El cliente reporta ruido al frenar",
  "id_cliente": 1,
  "id_vehiculo": 1,
  "id_mecanico": 1,
  "servicios": [
    {
      "id_servicio": 1,
      "cantidad": 1,
      "costo_real": 80000,
      "estado": "Pendiente"
    }
  ]
}
```

## 📏 Reglas de negocio

- 👥 Un cliente puede tener varios vehículos.
- 🚙 Un vehículo pertenece a un solo cliente.
- 📅 Una cita está asociada a un cliente y a un vehículo.
- 📋 Una orden de trabajo puede originarse a partir de una cita.
- 🛠️ Una orden puede tener varios servicios y varios repuestos.
- 🔩 Un servicio puede requerir varios repuestos.
- 📦 Un repuesto puede utilizarse en varios servicios u órdenes.
- 💳 Una orden puede tener varios pagos, pero solo una factura.
- 📚 El historial vehicular registra los servicios realizados a un vehículo.

## 🏷️ Estados y valores permitidos

| Campo | Valores permitidos |
|---|---|
| 🚙 Tipo de vehículo | `Automóvil`, `Motocicleta`, `Otro` |
| 📅 Canal de solicitud | `Presencial`, `Teléfono`, `WhatsApp`, `Web` |
| 📅 Estado de cita | `Pendiente`, `Confirmada`, `Atendida`, `Cancelada` |
| 📋 Estado de orden | `Recibida`, `Diagnóstico`, `Reparación`, `Terminada`, `Entregada` |
| ⚡ Prioridad de orden | `Baja`, `Normal`, `Alta`, `Urgente` |
| 🧑‍🔧 Disponibilidad del mecánico | `Disponible`, `Ocupado`, `Inactivo` |
| 🧑‍💼 Estado laboral del mecánico | `Activo`, `Inactivo` |
| 🎓 Nivel de especialidad | `Básico`, `Intermedio`, `Avanzado` |
| 🛠️ Estado de servicio en orden | `Pendiente`, `En proceso`, `Terminado` |
| 📦 Disponibilidad de repuesto | `Disponible`, `Agotado`, `Pendiente` |
| 🔩 Estado de repuesto en orden | `Solicitado`, `Pendiente`, `Utilizado`, `Cancelado` |
| 💳 Tipo de pago | `Abono`, `Pago final` |
| 💳 Método de pago | `Efectivo`, `Tarjeta`, `Transferencia`, `Otro` |
| 🧾 Forma de pago de factura | `Efectivo`, `Tarjeta`, `Transferencia`, `Mixto` |

## 📡 Respuestas HTTP

| Código | Significado |
|---|---|
| 🟢 `200` | La solicitud se procesó correctamente |
| 🟩 `201` | Se creó un registro correctamente |
| 🟡 `400` | Faltan datos obligatorios o son inválidos |
| 🔍 `404` | El recurso solicitado no existe |
| 🟠 `409` | Se intentó guardar un valor único duplicado |
| 🔴 `500` | Ocurrió un error interno del servidor |