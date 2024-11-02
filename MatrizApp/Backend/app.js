// Importar Express y MySQL
const express = require('express');
// Importar cors
const cors = require('cors');
const app = express();

// Importar las rutas
const userRoutes = require('./routes/userRoutes');
const matrizLegalArRoutes = require('./routes/matrizLegalArRoutes');
const empresaRoutes = require('./routes/empresaRoutes'); // Importar la nueva ruta para empresas
const locacionRoutes = require('./routes/locacionRoutes'); 
const cargosRoutes = require('./routes/cargoRoutes'); 
const gestLegalRoutes = require('./routes/gestLegalRoutes');


// Configuración de middleware
app.use(express.json()); // para parsear cuerpos JSON
app.use(cors()); // Configuración de CORS

// Rutas
app.use('/matriz-legal-ar', matrizLegalArRoutes); //matriz legal
app.use('/users', userRoutes); // usuarios
app.use('/empresa', empresaRoutes); // Agregar la ruta para las empresas
app.use('/locacion', locacionRoutes); //locaciones de empresas
app.use('/cargos', cargosRoutes); //cargos
app.use('/gestion-legal', gestLegalRoutes); //gestion legal de artículos


// PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
