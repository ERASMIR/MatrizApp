const db = require('../db/db');

// Obtener todos los usuarios
const getAplica = async (req, res) => {
  const query = 'SELECT * FROM aplica_norma'; // listado si aplica o no una norma
  
  try {
      const [rows] = await db.gestionLegal.query(query);
      res.json(rows);
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};


// Función para actualizar los datos en la tabla de artículos
const updateAplicaArticulo = async (req, res) => {
  console.log(req.body); // Verificar los datos recibidos

  // Recibiendo los IDs y campos necesarios del cuerpo de la solicitud
  const { articuloId, locacionId, empresaId, selectAplica, fechaRegistro} = req.body;

  // Aquí podrías agregar una verificación de los datos
  if (!articuloId || !locacionId || !empresaId || selectAplica === undefined || !fechaRegistro) {
    return res.status(400).json({ error: 'Faltan parámetros en la solicitud' });
  }


  // Consulta para actualizar los datos en la tabla de artículos
  const queryUpdateArticulo = `
    UPDATE gestión_articulos
    SET select_aplica = ?, fecha_registro = ?
    WHERE articulo_id = ? AND id_locacion = ? AND id_empresa = ?
  `;

  try {
    // Iniciar una transacción para asegurar que la operación se realice correctamente
    await db.gestionLegal.beginTransaction();

    // Ejecutar la consulta de actualización con los parámetros correspondientes
    const [result] = await db.gestionLegal.query(queryUpdateArticulo, [selectAplica, fechaRegistro, articuloId, locacionId, empresaId]);

    // Confirmar la transacción
    await db.gestionLegal.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró el artículo para actualizar' });
    }

    res.status(200).json({ message: 'Artículo actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el artículo:', error);

    // Revertir la transacción en caso de error
    await db.gestionLegal.rollback();
    res.status(500).json({ error: 'Error al actualizar el artículo' });
  }
};




module.exports = {
    getAplica,
    updateAplicaArticulo,
    // Exporta otras funciones aquí
  };
  