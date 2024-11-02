// DataTable.jsx
import React, { useEffect, useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { getCategorias, getNormas } from '../services/apiServices'; // Importa las funciones directamente

const DataTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [normas, setNormas] = useState([]);

  useEffect(() => {
    // Obtener categorías
    getCategorias().then(data => {
      setCategorias(data);
    });

    // Obtener normas
    getNormas().then(data => {
      setNormas(data);
    });
  }, []);

  return (
    <Table variant="striped" colorScheme="teal">
      <Thead>
        <Tr>
          <Th>Categorías</Th>
          <Th>Normas</Th>
        </Tr>
      </Thead>
      <Tbody>
        {categorias.map((categoria, index) => (
          <Tr key={index}>
            <Td>{categoria.nombre_categoria}</Td>
            <Td>{normas[index]?.nombre_norma}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default DataTable;
