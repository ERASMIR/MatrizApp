const db = require('../db/db'); // Conexión a la base de datos
const path = require('path'); // Para manejar rutas de archivos

const createLocacion = async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { id_empresa, nombre, direccion, id_responsable } = req.body; // Asegúrate de usar los nombres correctos

  // Validación de los datos recibidos
  if (!id_empresa || !nombre || !direccion || !id_responsable) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const queryInsertLocacion = `
    INSERT INTO tabla_locacion (id_empresa, nombre, direccion, id_responsable)
    VALUES (?, ?, ?, ?)
  `;

  try {
    // Iniciar una transacción
    await db.datosAplicacion.beginTransaction();

    // Guardar los datos de la locación
    const [result] = await db.datosAplicacion.query(queryInsertLocacion, [id_empresa, nombre, direccion, id_responsable]);

    // Aquí puedes agregar más consultas si necesitas hacer algo más en la transacción

    // Confirmar la transacción
    await db.datosAplicacion.commit();

    res.status(201).json({ message: 'Locación creada correctamente' });
  } catch (error) {
    console.error('Error al crear la locación:', error);

    // Revertir la transacción en caso de error
    await db.datosAplicacion.rollback();
    res.status(500).json({ error: 'Error al crear la locación' });
  }
};




// const createLocacion = async (req, res) => {
//   const { empresa, nombre, direccion, idResponsable} = req.body;

//   // Primero, insertar la empresa en la tabla 'tabla_locacion'
//   const queryInsertLocacion = `
//     INSERT INTO tabla_locacion (id_empresa, nombre, direccion, id_responsable)
//     VALUES (?, ?, ?, ?)
//   `;

//   try {
//     // Iniciar una transacción para asegurar que ambas operaciones se realicen correctamente
//     await db.datosAplicacion.beginTransaction();

//     // Guardar los datos de la locacion
//     const [result] = await db.datosAplicacion.query(queryInsertLocacion, [empresa, nombre, direccion, idResponsable]);

    

//     // Ejecutar todas las consultas
//     await Promise.all(queries);

//     // Confirmar la transacción
//     await db.datosAplicacion.commit();

//     res.status(201).json({ message: 'Empresa creada y registros de gestión de artículos insertados correctamente' });
//   } catch (error) {
//     console.error('Error al crear la empresa o gestionar los artículos:', error);

//     // Revertir la transacción en caso de error
//     await db.datosAplicacion.rollback();
//     res.status(500).json({ error: 'Error al crear la empresa o gestionar los artículos' });
//   }
// };

const getLocacion = async (req, res) => {
  const query = 'SELECT * FROM tabla_locacion'; // Asegúrate de usar tu tabla correcta
  
  try {
      const [rows] = await db.datosAplicacion.query(query);
      res.json(rows);
  } catch (error) {
      console.error('Error al obtener empresas:', error);
      res.status(500).json({ message: 'Error al obtener empresas' });
  }
};


module.exports = {
  createLocacion,
  getLocacion
};
