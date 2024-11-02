import React, { useEffect, useState, useContext } from 'react';
import { Box, Flex, IconButton, Menu, MenuButton, MenuList, MenuItem, Button, Avatar } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaBell, FaEnvelope } from 'react-icons/fa'; // Importa los íconos
import { getEmpresas, getLocacion } from '@services/apiServices'; // Asegúrate de importar las funciones
import { Link } from 'react-router-dom'; // Necesario para redirigir a las páginas
import { EmpresaContext } from '@context/EmpresaContext'; // Importar el contexto de empresa
import { LocacionContext } from '@context/LocacionContext'; // Importar el contexto de locación

const Header = ({ onMenuSelect }) => {
  const { setEmpresaSeleccionada } = useContext(EmpresaContext); // Agregar contexto de empresa
  const { setLocacionSeleccionada } = useContext(LocacionContext); // Agregar contexto de locación

  const [empresas, setEmpresas] = useState([]);
  const [locaciones, setLocaciones] = useState([]); // Estado para las locaciones

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await getEmpresas();
        setEmpresas(response.data); // Asigna solo las empresas creadas
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    const fetchLocaciones = async () => {
      try {
        const response = await getLocacion(); // Llama a getLocaciones
        setLocaciones(response.data); // Asigna las locaciones
      } catch (error) {
        console.error('Error al obtener locaciones:', error);
      }
    };

    fetchEmpresas();
    fetchLocaciones(); // Llama a la función para obtener locaciones
  }, []);

  return (
    <Box
      bg="white"
      w="calc(100% - 0px)" // Ajusta el ancho para dejar espacio para el Sidebar
      p={4}
      borderBottom="1px"
      borderColor="gray.200"
      position="fixed"
      top="0"
      left="0px" // Posiciona el Header a la derecha del Sidebar
      right="0px"
      zIndex="10" // Asegúrate de que el Header esté por encima del contenido
    >
      <Flex align="center" justify="space-between">
        {/* Logo aplicación */}
        <Box>
          <Link to="/">
            <img src=".MatrizApp/Backend/public/E_01.png" alt="Logo" style={{ height: '40px' }} />
          </Link>
        </Box>
        
        {/* Center Buttons */}
        <Flex align="center" gap={4}>
          <Button variant="link">Resumen de Actividades</Button>
          <Button variant="link">Estadísticas</Button>
        </Flex>

        {/* Notification and Message Icons */}
        <Flex align="center" gap={4}>
          <IconButton
            icon={<FaBell />}
            variant="ghost"
            aria-label="Notificaciones"
          />
          <IconButton
            icon={<FaEnvelope />}
            variant="ghost"
            aria-label="Mensajes"
          />
        </Flex>

        {/* User Menu */}
        <Flex align="center" gap={4}>
          <Menu>
            <MenuButton as={IconButton} icon={<Avatar size="sm" name="Usuario" />} variant="outline" rightIcon={<ChevronDownIcon />} />
            <MenuList>
              <MenuItem>Datos del Usuario</MenuItem>
              <MenuItem as={Link} to="/crear-usuarios">Crear Usuario</MenuItem>
            </MenuList>
          </Menu>

          {/* Menú Locaciones */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Locación
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/crear-locacion">Crear Locación</MenuItem>
              <MenuItem as={Link} to="/listar-locaciones">Seleccionar Locación</MenuItem>
              {locaciones.length > 0 ? (
                locaciones.map(locacion => (
                  <MenuItem key={locacion.id_locacion} onClick={() => {
                    setLocacionSeleccionada(locacion); // Actualiza el contexto de locación
                    onMenuSelect(locacion.id_locacion); // Mantener funcionalidad existente
                  }}>
                    {locacion.nombre}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>Sin locaciones creadas</MenuItem>
              )}
            </MenuList>
          </Menu>

          {/* Menú Empresas */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Empresa
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/crear-empresa">Crear Empresa</MenuItem>
              {empresas.length > 0 ? (
                empresas.map(empresa => (
                  <MenuItem key={empresa.id_empresa} onClick={() => {
                    setEmpresaSeleccionada(empresa); // Actualiza el contexto de empresa
                    onMenuSelect(empresa.id_empresa); // Mantener funcionalidad existente
                  }}>
                    {empresa.nombre_empresa}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>Sin empresas creadas</MenuItem>
              )}
            </MenuList>
          </Menu>

          {/* Logo empresa cliente */}
          <Box>
            <img src=".MatrizApp/Backend/public/C_02.png" alt="Logo" style={{ height: '40px' }} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
