import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, Select } from '@chakra-ui/react';
import { createLocacion, getUser } from '@services/apiServices';
import { EmpresaContext } from '@context/EmpresaContext';

const FormularioLocacion = () => {
  const { empresaSeleccionada } = useContext(EmpresaContext);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    idResponsable: '',
    empresa: empresaSeleccionada || '',
  });

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Agregar estado para manejar errores

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true); // Iniciar loading
        const response = await getUser();
        const usuariosValidos = response.data.filter(usuario => usuario.nombre && usuario.apellidos);
        setUsuarios(usuariosValidos);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setError('Error al obtener los usuarios'); // Manejar error
      } finally {
        setLoading(false); // Finalizar loading
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      empresa: empresaSeleccionada || '',
    }));
  }, [empresaSeleccionada]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLocacion(formData);
      alert('Locación creada con éxito');
      setFormData({
        nombre: '',
        direccion: '',
        idResponsable: '',
        empresa: empresaSeleccionada || '',
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
            {loading ? (
              <p>Cargando usuarios...</p>
            ) : error ? ( // Mostrar error si existe
              <p>{error}</p>
            ) : usuarios.length > 0 ? (
              <Select
                name="idResponsable"
                value={formData.idResponsable}
                onChange={handleInputChange}
                placeholder="Seleccione un responsable"
              >
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellidos}
                  </option>
                ))}
              </Select>
            ) : (
              <p>No hay usuarios disponibles</p>
            )}
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
