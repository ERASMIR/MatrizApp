const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const multer = require('multer'); // Para manejar archivos (logo)

// Configurar almacenamiento de archivos con multer (para guardar logos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public'); // Carpeta donde se guardarán los logos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Nombre único para cada logo
  }
});

// Configuración para aceptar solo archivos .jpg y .png
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos .jpg y .png'));
    }
  }
});

// Definir la ruta para crear una empresa
// El campo 'logo' en el formulario será el nombre que se use para el archivo
router.post('/crear-empresa', upload.single('logo'), empresaController.createEmpresa);

// empresaRoutes.js
router.get('/lista-empresas', empresaController.getEmpresas);


module.exports = router;
