const express = require('express');
const router = express.Router();
const locacionController = require('../controllers/locacionController');



// Definir la ruta para crear una locacion
router.post('/crear-locacion', locacionController.createLocacion);


// locacionRoutes.js
router.get('/lista-locaciones', locacionController.getLocacion);


module.exports = router;