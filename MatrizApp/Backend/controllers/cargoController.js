const db = require('../db/db');

// Obtener todos los usuarios
const getCargo = async (req, res) => {
  const query = 'SELECT * FROM tabla_cargos'; // Asegúrate de usar tu tabla correcta
  
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
const createCargo = async (req, res) => {
  const { nombre, registro,  user, cargo, mail, telefono, password, empresa} = req.body;

  // Primero, insertar el usuario en la tabla registro_usuarios'
  const queryInsertLocacion = `
    INSERT INTO tabla_cargo ( nombre_cargo )
    VALUES (?)
  `;

  try {
    // Iniciar una transacción para asegurar que ambas operaciones se realicen correctamente
    await db.datosAplicacion.beginTransaction();

    // Guardar los datos de la locacion
    const [result] = await db.datosAplicacion.query(queryInsertLocacion, [nombre_cargo]);

    

    // Ejecutar todas las consultas
    await Promise.all(queries);

    // Confirmar la transacción
    await db.datosAplicacion.commit();

    res.status(201).json({ message: 'usuarios insertados correctamente' });
  } catch (error) {
    console.error('Error al crear un usuario:', error);

    // Revertir la transacción en caso de error
    await db.datosAplicacion.rollback();
    res.status(500).json({ error: 'Error al crear un usuario' });
  }
};



module.exports = {
  getCargo,
  createCargo,
  // Exporta otras funciones aquí
};
