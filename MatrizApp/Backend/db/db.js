const mysql = require('mysql2/promise');

const dbConfig = {
  matrizLegal: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Matriz_Legal_AR'
  },
  datosAplicacion: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'datos de aplicacion'
  },
  gestionLegal: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_legal'
  },
  // Puedes agregar más configuraciones para otras bases de datos aquí
};

const connections = {};

async function initializeConnections() {
  for (const [key, config] of Object.entries(dbConfig)) {
    try {
      connections[key] = await mysql.createConnection(config);
      console.log(`Conectado a la base de datos ${key}`);
    } catch (err) {
      console.error(`Error al conectar a la base de datos ${key}:`, err);
    }
  }
}

initializeConnections();

module.exports = connections;
