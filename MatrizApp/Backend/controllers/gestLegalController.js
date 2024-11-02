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


const updateAplicaArticulo = async (req, res) => {
  try {
    const articulos = req.body.articuloId; // Debería ser un arreglo

    // Verificar que estás recibiendo un arreglo
    if (!Array.isArray(articulos)) {
      return res.status(400).json({ error: "Se esperaba un arreglo de artículos." });
    }

    // Iterar sobre cada artículo y procesar la actualización
    for (const articulo of articulos) {
      // Verificar que cada artículo tenga la estructura correcta
      const { articuloId, empresaId, locacionId, fechaRegistro, selectAplica  } = articulo;
      if (articuloId === undefined || empresaId === undefined || locacionId === undefined || fechaRegistro === undefined || selectAplica === undefined ) {
        return res.status(400).json({ error: "Faltan datos en el artículo." });
      }

      // Aquí realiza la lógica para actualizar el artículo en la base de datos
      await db.gestionLegal.query(
        `UPDATE gestión_articulos
         SET select_aplica = ?, fecha_registro = ?
         WHERE articulo_id = ? AND id_locacion = ? AND id_empresa = ?`,
        [selectAplica, fechaRegistro, articuloId, locacionId, empresaId]
      );
    }

    return res.status(200).json({ message: "Artículos actualizados exitosamente." });
  } catch (error) {
    console.error("Error al actualizar los artículos:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};



const getValorAplica = async (req, res) => {
  const { articuloId, locacionId, empresaId } = req.params;  // Asumimos que los parámetros vendrán por la URL

  const query = 
  `SELECT select_aplica, id_empresa, id_locacion, fecha_registro, articulo_id
   FROM gestión_articulos 
   WHERE articulo_id = ? AND id_locacion = ? AND id_empresa = ?`;  // Filtro por artículo, empresa y locación
  
  try {
      const [rows] = await db.gestionLegal.query(query, [articuloId, locacionId, empresaId ]);  // Pasamos los parámetros a la consulta
      if (rows.length > 0) {
          res.json(rows[0]);  // Si se encuentra un valor, devolver el primero (el único que debe coincidir)
      } else {
          res.status(404).json({ message: 'No se encontró información para el artículo especificado' });
      }
  } catch (error) {
      console.error('Error al obtener el valor de aplica:', error);
      res.status(500).json({ message: 'Error al obtener el valor de aplica' });
  }
};


module.exports = {
    getAplica,
    updateAplicaArticulo,
    getValorAplica
    // Exporta otras funciones aquí
  };
  