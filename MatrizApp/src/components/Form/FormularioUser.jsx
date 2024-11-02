import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, Select } from '@chakra-ui/react';
import { createUser } from '@services/apiServices'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import { getEmpresas } from '@services/apiServices';
import { getCargo } from '@services/apiServices';
import { getClaseUser } from '@services/apiServices';

const FormularioUser = () => { 
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    registro: '',
    user: '',
    cargo: '', // Mantener el estado para almacenar el ID del cargo
    email: '',
    telefono: '',
    password: '',
    claseuser: '',
    empresa: '', // Mantener el estado para almacenar el ID de la empresa
  });

  const [empresas, setEmpresas] = useState([]); // Estado para las empresas
  const [cargos, setCargos] = useState([]);     // Estado para los cargos
  const [claseUser, setClaseUser] = useState([]);     // Estado para los cargos

  // Función para manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // useEffect para obtener las empresas al cargar el componente
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await getEmpresas();
        setEmpresas(response.data); // Guarda las empresas en el estado
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };

    fetchEmpresas(); // Llama a la función cuando el componente se monta
  }, []);

  // useEffect para obtener los cargos al cargar el componente
  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await getCargo();
        setCargos(response.data); // Guarda los cargos en el estado
      } catch (error) {
        console.error('Error al obtener los cargos:', error);
      }
    };

    fetchCargos(); // Llama a la función cuando el componente se monta
  }, []);


  // useEffect para obtener los cargos al cargar el componente
  useEffect(() => {
    const fetchClaseUser = async () => {
      try {
        const response = await getClaseUser();
        setClaseUser(response.data); // Guarda los cargos en el estado
      } catch (error) {
        console.error('Error al obtener los cargos:', error);
      }
    };

    fetchClaseUser(); // Llama a la función cuando el componente se monta
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('apellidos', formData.apellidos);
    data.append('registro', formData.registro);
    data.append('user', formData.user);
    data.append('idCargo', formData.cargo); // Enviar el ID del cargo
    data.append('email', formData.email);
    data.append('telefono', formData.telefono);
    data.append('password', formData.password);
    data.append('claseuser', formData.claseuser);
    data.append('idEmpresa', formData.empresa); // Enviar el ID de la empresa

    try {
      await createUser(data); // Ajustado para enviar el FormData que contiene los IDs correctos
      alert('Usuario creado con éxito');
      // Reiniciar el formulario
      setFormData({
        nombre: '',
        apellidos: '',
        registro: '',
        user: '',
        cargo: '',
        email: '',
        telefono: '',
        password: '',
        empresa: '',
        claseuser: '',
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

          <FormControl id="apellidos" isRequired>
            <FormLabel>Apellidos</FormLabel>
            <Input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="registro" isRequired>
            <FormLabel>Número de Registro</FormLabel>
            <Input
              type="text"
              name="registro"
              value={formData.registro}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="user" isRequired>
            <FormLabel>Nombre de Usuario</FormLabel>
            <Input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Campo para seleccionar un cargo */}
          <FormControl id="cargo" isRequired>
            <FormLabel>Cargo</FormLabel>
            <Select
              placeholder="Seleccionar Cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleInputChange}
            >
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nombre_cargo}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="telefono" isRequired>
            <FormLabel>Número de Teléfono</FormLabel>
            <Input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </FormControl>


           {/* Campo para seleccionar un cargo */}
           <FormControl id="clase_usuario" isRequired>
            <FormLabel>Clase de Usuario</FormLabel>
            <Select
              placeholder="Seleccionar tipo de usuario"
              name="claseuser"
              value={formData.claseuser}
              onChange={handleInputChange}
            >
              {claseUser.map((claseuser) => (
                <option key={claseuser.id} value={claseuser.id}>
                  {claseuser.nombre_clase}
                </option>
              ))}
            </Select>
          </FormControl>


          {/* Campo para seleccionar una empresa */}
          <FormControl id="empresa" isRequired>
            <FormLabel>Empresa</FormLabel>
            <Select
              placeholder="Seleccionar empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleInputChange}
            >
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre_empresa}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button colorScheme="teal" type="submit">
            Crear Usuario
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default FormularioUser;
