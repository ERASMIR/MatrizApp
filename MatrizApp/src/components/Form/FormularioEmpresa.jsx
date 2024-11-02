import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { createEmpresa } from '@services/apiServices'; // Asegúrate de ajustar la ruta según tu estructura de carpetas


const FormularioEmpresa = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
    nombreEmpresa: '',
    numeroIdentificatorio: '',
    direccion: '',
    telefono: '',
    email: '',
  });


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Almacena el archivo seleccionado en el estado
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre_empresa', formData.nombreEmpresa);
    data.append('numero_identificatorio', formData.numeroIdentificatorio);
    data.append('direccion', formData.direccion);
    data.append('telefono', formData.telefono);
    data.append('email', formData.email);
    if (selectedFile) {
        data.append('logo', selectedFile); // Agregamos el archivo solo si existe
      }

    try {
      await createEmpresa(data);
      alert('Empresa creada con éxito');
      // Puedes reiniciar el formulario aquí si es necesario
      setFormData({
        nombreEmpresa: '',
        numeroIdentificatorio: '',
        direccion: '',
        telefono: '',
        email: '',
        logo: null,
      });
    } catch (error) {
      console.error('Error al crear la empresa:', error);
      alert('Hubo un error al crear la empresa');
    }
  };

  return (
    <Box maxW="500px" mx="auto">
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="nombreEmpresa" isRequired>
            <FormLabel>Nombre Empresa</FormLabel>
            <Input
              type="text"
              name="nombreEmpresa"
              value={formData.nombreEmpresa}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="numeroIdentificatorio" isRequired>
            <FormLabel>Número Identificatorio</FormLabel>
            <Input
              type="text"
              name="numeroIdentificatorio"
              value={formData.numeroIdentificatorio}
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

          <FormControl id="telefono" isRequired>
            <FormLabel>Teléfono</FormLabel>
            <Input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="logo">
            <FormLabel>Logo</FormLabel>
            <Input
              type="file"
              name="logo"
              accept=".jpg,.png"
              onChange={handleFileChange}
            />
          </FormControl>

          <Button colorScheme="teal" type="submit">
            Crear Empresa
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default FormularioEmpresa;
