const db = require('../db/db');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  const query = 'SELECT * FROM tabla_categoria';
  
  try {
    const [results] = await db.matrizLegal.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener las categorías:', err);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// Obtener todas las normas
const getNormas = async (req, res) => {
  const query = 'SELECT * FROM tabla_normas';
  
  try {
    const [results] = await db.matrizLegal.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener las normas:', err);
    res.status(500).json({ error: 'Error al obtener las normas' });
  }
};

// Obtener normas filtradas por categoría
const getNormasByCategoria = async (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT 
        tn.id AS id_norma,
        tn.nombre AS nombre_norma, 
        tn.resumen AS resumen_norma, 
        tj.jurisdiccion AS nombre_jurisdiccion
      FROM 
        tabla_normas tn
      JOIN 
        tabla_jurisdicciones tj 
      ON 
        tn.id_jurisdiccion = tj.id
      WHERE 
        tn.id_categoria = ?`;
    
    try {
      const [results] = await db.matrizLegal.query(query, [id]);
      res.json(results);
    } catch (err) {
      console.error('Error al obtener las normas por categoría:', err);
      res.status(500).json({ error: 'Error al obtener las normas por categoría' });
    }
  };
  

// Obtener todos los artículos
const getArticulos = async (req, res) => {
  const query = 'SELECT * FROM tabla_articulos';
  
  try {
    const [results] = await db.matrizLegal.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los artículos:', err);
    res.status(500).json({ error: 'Error al obtener los artículos' });
  }
};

// Obtener todos los artículos de una norma
const getNormaById = async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM tabla_articulos WHERE id_norma = ?';
  
  try {
    const [results] = await db.matrizLegal.query(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'No se encontraron artículos para esta norma' });
    }
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los artículos de la norma:', err);
    res.status(500).json({ error: 'Error al obtener los artículos de la norma' });
  }
};


// Obtener normas por jurisdición
const getNormasByJurisdiccion = async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      tn.id AS id_norma,
      tn.nombre AS nombre_norma, 
      tn.resumen AS resumen_norma, 
      tj.jurisdiccion AS nombre_jurisdiccion
    FROM 
      tabla_normas tn
    JOIN 
      tabla_jurisdicciones tj 
    ON 
      tn.id_jurisdiccion = tj.id
    WHERE 
      tn.id_jurisdiccion = ?`;
  
  try {
    const [results] = await db.matrizLegal.query(query, [id]);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener las normas por categoría:', err);
    res.status(500).json({ error: 'Error al obtener las normas por categoría' });
  }
};

const getJurisdicciones = async (req, res) => {
  const query = 'SELECT * FROM tabla_jurisdicciones';
  
  try {
    const [results] = await db.matrizLegal.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los artículos:', err);
    res.status(500).json({ error: 'Error al obtener los artículos' });
  }
};


module.exports = {
  getCategorias,
  getNormas,
  getArticulos,
  getNormasByCategoria,
  getNormaById,
  getNormasByJurisdiccion,
  getJurisdicciones,
};
