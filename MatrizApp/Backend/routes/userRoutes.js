const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');



// locacionRoutes.js
router.get('/lista-usuarios', userController.getUser);
router.post('/crear-usuarios', userController.createUser);
router.get('/clases-user', userController.getClaseUser);


module.exports = router;