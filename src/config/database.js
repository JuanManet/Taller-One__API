const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');

const rutaBaseDatos = path.join(__dirname, '..', '..', 'tallerone.db');

// SQLite crea el archivo automáticamente si no existe.
const db = new DatabaseSync(rutaBaseDatos);

db.exec('PRAGMA foreign_keys = ON;');

function inicializarBaseDatos() {
  const rutaSchema = path.join(__dirname, '..', 'database', 'schema.sql');
  const sql = fs.readFileSync(rutaSchema, 'utf8');

  db.exec(sql);
}

module.exports = {
  db,
  inicializarBaseDatos
};