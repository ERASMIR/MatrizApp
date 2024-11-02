import React from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, Input, Box, } from '@chakra-ui/react';

const PopoverComponent = ({
  isOpen,
  onOpen,
  onClose,
  searchValue,
  handleSearchChange,
  filteredItems,
  handleSelect,
  placeholder,
  selectedId,
  itemKey,
  prefix // Prop para definir el prefijo
}) => {
  // Función para agregar prefijo al ID
  const addPrefix = (id) => `${prefix}${id}`;

  // Función para eliminar prefijo del ID
 // const removePrefix = (id) => id.replace(new RegExp(`^${prefix}`), '');

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Box 
          as="button"
          bg="transparent" 
          color="gray.650"
          fontWeight="bold"
          variant="outline" 
          px={2} 
          py={1} 
          border="1px"
          borderColor="teal.500"
          borderRadius="md"
          size= "sm"
          fontSize="sm"
        >
          Seleccionar {placeholder}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="300px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
          />
        </PopoverHeader>
        <Box maxHeight="200px" overflowY="auto">
          {filteredItems.length ? (
            filteredItems.map((item, index) => {
              const itemId = item.id || ''; // Asegúrate de que id no sea undefined
              const itemIdWithPrefix = addPrefix(itemId);
              return (
                <Box
                  key={`${itemIdWithPrefix}-${index}`} // Usa una combinación única de ID y índice
                  p={2}
                  cursor="pointer"
                  size="sm"
                  bg={itemIdWithPrefix === selectedId ? 'teal.100' : 'white'}
                  onClick={() => handleSelect(itemIdWithPrefix)} // Usa el ID con prefijo
                >
                  {item[itemKey]}
                </Box>
              );
            })
          ) : (
            <Box p={2} textAlign="center">
              No se encontraron resultados
            </Box>
          )}
        </Box>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverComponent;
