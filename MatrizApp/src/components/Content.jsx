import React, { useState, useEffect } from 'react';
import apiService from './services/apiServices'; // Asegúrate de ajustar la ruta según sea necesario

const DataTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [normas, setNormas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasData = await apiService.getCategorias();
        const normasData = await apiService.getNormas();
        setCategorias(categoriasData);
        setNormas(normasData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Categorías</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            {/* Agrega más columnas según la estructura de tu tabla_categoria */}
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.id}</td>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              {/* Agrega más celdas según la estructura de tu tabla_categoria */}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Normas</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            {/* Agrega más columnas según la estructura de tu tabla_normas */}
          </tr>
        </thead>
        <tbody>
          {normas.map((norma) => (
            <tr key={norma.id}>
              <td>{norma.id}</td>
              <td>{norma.nombre}</td>
              <td>{norma.descripcion}</td>
              {/* Agrega más celdas según la estructura de tu tabla_normas */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
