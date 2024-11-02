const db = require('../db/db');

// Obtener todos los usuarios
const getUser = async (req, res) => {
  const query = 'SELECT * FROM registro_usuarios'; // Asegúrate de usar tu tabla correcta
  
  try {
      const [rows] = await db.datosAplicacion.query(query);
      res.json(rows);
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};


const path = require('path'); // Para manejar rutas de archivos



// Función para crear un usuario
const createUser = async (req, res) => {
  console.log(req.body); // Verificar los datos recibidos

  const { nombre, apellidos, registro,  user, idCargo, email, telefono, password, claseuser, idEmpresa} = req.body;

  // Primero, insertar el usuario en la tabla registro_usuarios'
  const queryInsertUsuario = `
    INSERT INTO registro_usuarios ( nombre, apellidos, registro,  user, id_cargo, email, telefono, password, clase_de_usuario, id_empresa)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Iniciar una transacción para asegurar que ambas operaciones se realicen correctamente
    await db.datosAplicacion.beginTransaction();

    // Guardar los datos de la locacion
    const [result] = await db.datosAplicacion.query(queryInsertUsuario, [nombre, apellidos, registro, user, idCargo, email, telefono, password, claseuser, idEmpresa]);

    

    // Ejecutar todas las consultas
    //await Promise.all(queries);

    // Confirmar la transacción
    await db.datosAplicacion.commit();

    res.status(201).json({ message: 'usuario insertado correctamente' });
  } catch (error) {
    console.error('Error al crear un usuario:', error);

    // Revertir la transacción en caso de error
    await db.datosAplicacion.rollback();
    res.status(500).json({ error: 'Error al crear un usuario' });
  }
};



// Obtener todos los usuarios
const getClaseUser = async (req, res) => {
  const query = 'SELECT * FROM clase_user'; // Asegúrate de usar tu tabla correcta
  
  try {
      const [rows] = await db.datosAplicacion.query(query);
      res.json(rows);
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};



module.exports = {
  getUser,
  createUser,
  getClaseUser,
  // Exporta otras funciones aquí
};
