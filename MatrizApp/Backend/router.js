const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia esto con tu usuario de MySQL
  password: '', // Cambia esto con tu contraseña de MySQL
  database: 'matriz_legal_ar'
});

connection.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para obtener todos los elementos de la tabla_categoria
router.get('/categorias', (req, res) => {
  const query = 'SELECT * FROM tabla_categoria';
  
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener las categorías' });
      return;
    }
    res.json(results);
  });
});



// Ruta para obtener todos los elementos de la tabla_jurisdicciones
router.get('/jurisdicciones', (req, res) => {
  const query = 'SELECT * FROM tabla_jurisdicciones';
  
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener las jurisdicciones' });
      return;
    }
    res.json(results);
  });
});


// Ruta para obtener todos los elementos de la tabla_normas
router.get('/normas', (req, res) => {
  const query = 'SELECT * FROM tabla_normas';
  
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener las normas' });
      return;
    }
    res.json(results);
  });
});


// Ruta para obtener todos los elementos de la tabla_articulos
router.get('/articulos', (req, res) => {
  const query = 'SELECT * FROM tabla_articulos';
  
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener las articulos' });
      return;
    }
    res.json(results);
  });
});



module.exports = router;
