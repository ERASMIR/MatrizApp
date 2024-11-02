const db = require('../db/db'); // Conexión a la base de datos
const path = require('path'); // Para manejar rutas de archivos

// Función para crear una empresa
const createEmpresa = async (req, res) => {
  const { nombre_empresa, numero_identificatorio, direccion, telefono, email } = req.body;
  const logo = req.file ? req.file.filename : null; // Para el archivo logo

  // Primero, insertar la empresa en la tabla 'tabla_empresa'
  const queryInsertEmpresa = `
    INSERT INTO tabla_empresa (nombre_empresa, numero_identificatorio, direccion, telefono, email, logo_path)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Query para insertar la locación "Sede Central"
  const queryInsertLocacion = `
    INSERT INTO tabla_locacion (nombre, id_empresa)
    VALUES ('Sede Central', ?)
  `;

  // Query para insertar los artículos gestionados para la empresa y su locación
  const queryInsertGestionArticulos = `
    INSERT INTO gestión_articulos (articulo_id, id_empresa, id_locacion)
    VALUES (?, ?, ?)
  `;

  try {
    // Iniciar una transacción para asegurar que todas las operaciones se realicen correctamente
    await db.datosAplicacion.beginTransaction();

    // Guardar los datos de la empresa
    const [resultEmpresa] = await db.datosAplicacion.query(queryInsertEmpresa, [nombre_empresa, numero_identificatorio, direccion, telefono, email, logo]);

    // Obtener el ID de la empresa recién creada
    const empresaId = resultEmpresa.insertId;

    // Insertar la locación "Sede Central"
    const [resultLocacion] = await db.datosAplicacion.query(queryInsertLocacion, ['Sede Central', empresaId]);

    // Obtener el ID de la locación recién creada
    const locacionId = resultLocacion.insertId;

    // Crear una lista de consultas para insertar los 2805 registros de gestión de artículos
    const queries = [];
    for (let i = 1; i <= 2805; i++) {
      queries.push(db.gestionLegal.query(queryInsertGestionArticulos, [i, empresaId, locacionId]));
    }

    // Ejecutar todas las consultas
    await Promise.all(queries);

    // Confirmar la transacción
    await db.datosAplicacion.commit();

    res.status(201).json({ message: 'Empresa creada, Sede Central y registros de gestión de artículos insertados correctamente' });
  } catch (error) {
    console.error('Error al crear la empresa, la Sede Central o gestionar los artículos:', error);

    // Revertir la transacción en caso de error
    await db.datosAplicacion.rollback();
    res.status(500).json({ error: 'Error al crear la empresa, la Sede Central o gestionar los artículos' });
  }
};

const getEmpresas = async (req, res) => {
  const query = 'SELECT * FROM tabla_empresa'; // Asegúrate de usar tu tabla correcta
  
  try {
      const [rows] = await db.datosAplicacion.query(query);
      res.json(rows);
  } catch (error) {
      console.error('Error al obtener empresas:', error);
      res.status(500).json({ message: 'Error al obtener empresas' });
  }
};

module.exports = {
  createEmpresa,
  getEmpresas
};
