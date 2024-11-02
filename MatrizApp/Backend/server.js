const express = require('express');
const app = express();
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(express.json());
app.use('/api/users', userRoutes);

// Connect to the database and sync models
const startServer = async () => {
  try {
    await sequelize.sync(); // Esto crea las tablas si no existen
    console.log('Modelos sincronizados con la base de datos.');
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error al sincronizar modelos con la base de datos:', error);
  }
};

startServer();
