const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');



// locacionRoutes.js
router.get('/lista-cargos', cargoController.getCargo);
router.post('/crear-cargo', cargoController.createCargo);


module.exports = router;