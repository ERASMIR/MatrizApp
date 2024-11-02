import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const Categorias = ({ data = [], onSelectCategoria, selectedCategoria }) => {
  return (
    <Box>
      <Table variant="simple" colorScheme="teal.500">
        <Thead>
          <Tr>
            <Th>Nombre Norma</Th>
            <Th>Resumen</Th>
            <Th>Jurisdicción</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.length > 0 ? (
            data.map((norma) => (
              <Tr
                key={norma.id_norma}
                onClick={() => onSelectCategoria(norma.id_norma)}
                cursor="pointer"
                bg={norma.id_norma === selectedCategoria ? 'gray.100' : 'white'}
              >
                <Td>{norma.nombre_norma || '-'}</Td>
                <Td>{norma.resumen_norma || '-'}</Td>
                <Td>{norma.nombre_jurisdiccion || '-'}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={3}>No hay normas disponibles</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Categorias;
