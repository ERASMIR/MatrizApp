import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { createLocacion } from '@services/apiServices'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

const FormularioLocacion = () => { 
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    responsable: '',
    empresa: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('id_empresa', formData.idEmpresa);
    data.append('nombre', formData.nombre);
    data.append('direccion', formData.direccion);
    data.append('id_responsable', formData.idResponsable);
    

    try {
      await createLocacion(formData); // Asegúrate de que tu función para crear locaciones esté configurada correctamente
      alert('Locación creada con éxito');
      // Reiniciar el formulario
      setFormData({
        nombre: '',
        direccion: '',
        responsable: '',
        empresa: '',
      });
    } catch (error) {
      console.error('Error al crear la locación:', error);
      alert('Hubo un error al crear la locación');
    }
  };

  return (
    <Box maxW="500px" mx="auto">
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="nombre" isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="direccion" isRequired>
            <FormLabel>Dirección</FormLabel>
            <Input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="responsable" isRequired>
            <FormLabel>Responsable</FormLabel>
            <Input
              type="text"
              name="responsable"
              value={formData.idResponsable}
              onChange={handleInputChange}
            />
          </FormControl>

          <Button colorScheme="teal" type="submit">
            Crear Locación
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default FormularioLocacion;
