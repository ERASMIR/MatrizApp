const express = require('express');
const router = express.Router();
const matrizLegalArController = require('../controllers/matrizLegalArController');

// Ruta para obtener todas las categorías
router.get('/categorias', matrizLegalArController.getCategorias);

// Ruta para obtener todas las normas
router.get('/normas', matrizLegalArController.getNormas);

// Ruta para obtener todos los artículos
router.get('/articulos', matrizLegalArController.getArticulos);

// Ruta para obtener normas filtradas por categoría (usando el ID de la categoría)
router.get('/normas/categorias/:id', matrizLegalArController.getNormasByCategoria);

// Ruta para obtener artículos de una norma específica (usando el ID de la norma)
router.get('/articulos/norma/:id', matrizLegalArController.getNormaById);

// Ruta para obtener normas filtradas por jurisdicción (usando el ID de la norma)
router.get('/normas/jurisdicciones/:id', matrizLegalArController.getNormasByJurisdiccion);

// Ruta para obtener normas filtradas por jurisdicción (usando el ID de la norma)
router.get('/jurisdicciones', matrizLegalArController.getJurisdicciones);

// Puedes agregar más rutas aquí usando el controlador

module.exports = router;
