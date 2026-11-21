const app = require('./src/app');
const { inicializarBaseDatos } = require('./src/config/database');

const PUERTO = process.env.PUERTO || 3000;

inicializarBaseDatos();

app.listen(PUERTO, () => {
  console.log(`🛠️ TallerOne escuchando en http://localhost:${PUERTO}`);
});