import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const Jurisdicciones = ({ data = [], onSelectJurisdiccion, selectedJurisdiccion }) => {
  return (
    <Box>
      <Table variant="simple" colorScheme="teal.500">
        <Thead>
          <Tr>
            <Th>Norma</Th>
            <Th>Descripción</Th>
            <Th>Jurisdicción</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.length > 0 ? (
            data.map((jurisdiccion) => (
              <Tr
                key={jurisdiccion.id}
                onClick={() => onSelectJurisdiccion(jurisdiccion.id_norma)}
                cursor="pointer"
                bg={jurisdiccion.id_norma === selectedJurisdiccion ? 'gray.100' : 'white'}
              >
                <Td>{jurisdiccion.nombre_norma || '-'}</Td>
                <Td>{jurisdiccion.resumen_norma || '-'}</Td>
                <Td>{jurisdiccion.nombre_jurisdiccion || '-'}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2}>No hay jurisdicciones disponibles</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Jurisdicciones;
