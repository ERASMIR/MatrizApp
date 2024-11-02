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

  try {
    // Iniciar una transacción para asegurar que ambas operaciones se realicen correctamente
    await db.datosAplicacion.beginTransaction();

    // Guardar los datos de la empresa
    const [result] = await db.datosAplicacion.query(queryInsertEmpresa, [nombre_empresa, numero_identificatorio, direccion, telefono, email, logo]);

    // Obtener el ID de la empresa recién creada
    const empresaId = result.insertId;

    // Crear 2805 registros en la tabla 'gestion_articulos'
    const queryInsertGestionArticulos = `
      INSERT INTO gestión_articulos (articulo_id, id_empresa)
      VALUES (?, ?)
    `;

    // Crear una lista de consultas para insertar los 2805 registros
    const queries = [];
    for (let i = 1; i <= 2805; i++) {
      queries.push(db.gestionLegal.query(queryInsertGestionArticulos, [i, empresaId]));
    }

    // Ejecutar todas las consultas
    await Promise.all(queries);

    // Confirmar la transacción
    await db.datosAplicacion.commit();

    res.status(201).json({ message: 'Empresa creada y registros de gestión de artículos insertados correctamente' });
  } catch (error) {
    console.error('Error al crear la empresa o gestionar los artículos:', error);

    // Revertir la transacción en caso de error
    await db.datosAplicacion.rollback();
    res.status(500).json({ error: 'Error al crear la empresa o gestionar los artículos' });
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
