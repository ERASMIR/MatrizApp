// Importar Express y MySQL
const express = require('express');
// Importar cors
const cors = require('cors');
const app = express();

// Importar las rutas
const userRoutes = require('./routes/userRoutes');
const matrizLegalArRoutes = require('./routes/matrizLegalArRoutes');

// Configuración de middleware
app.use(express.json()); // para parsear cuerpos JSON
app.use(cors()); // Configuración de CORS

// Rutas
app.use('/matriz-legal-ar', matrizLegalArRoutes);
app.use('/users', userRoutes);

// PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
