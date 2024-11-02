const express = require('express');
const router = express.Router();
const gestLegalController = require('../controllers/gestLegalController');



// locacionRoutes.js
router.get('/lista-aplica', gestLegalController.getAplica);
router.patch('/update-aplica-art', gestLegalController.updateAplicaArticulo);
router.get('/lista-valor-aplica/:articuloId/:locacionId/:empresaId', gestLegalController.getValorAplica);



module.exports = router;