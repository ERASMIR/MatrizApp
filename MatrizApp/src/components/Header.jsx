import React, { useEffect, useState, useContext } from 'react';
import { Box, Flex, IconButton, Menu, MenuButton, MenuList, MenuItem, Button, Avatar } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import { getEmpresas, getLocacion } from '@services/apiServices'; 
import { Link } from 'react-router-dom'; 
import { EmpresaContext } from '@context/EmpresaContext'; 
import { LocacionContext } from '@context/LocacionContext'; 
import { CheckIcon } from '@chakra-ui/icons'; // Importar el ícono de tilde

const Header = ({ onMenuSelect }) => {
  const { setEmpresaSeleccionada } = useContext(EmpresaContext); 

  const [empresas, setEmpresas] = useState([]); // Estado de empresas
  const [selectedEmpresa, setSelectedEmpresa] = useState(null); // Estado para empresa seleccionada

  // Usar el contexto de locación con las funciones adecuadas
  // Agrego `setLocaciones` que faltaba en el código original
  const { locaciones = [], locacionSeleccionada, setLocacionSeleccionada, setLocaciones } = useContext(LocacionContext);

  // useEffect para obtener empresas y locaciones
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await getEmpresas();
        setEmpresas(response.data); // Actualiza el estado de empresas
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    const fetchLocaciones = async () => {
      try {
        const response = await getLocacion(); 
        setLocaciones(response.data); // Actualiza el estado de locaciones
      } catch (error) {
        console.error('Error al obtener locaciones:', error);
      }
    };

    fetchEmpresas();  // Llamar a la función para obtener empresas
    fetchLocaciones(); // Llamar a la función para obtener locaciones
  }, [setLocaciones]); // Asegurarse de que el efecto use el setter adecuado

  return (
    <Box
      bg="white"
      w="calc(100% - 0px)" 
      p={4}
      borderBottom="1px"
      borderColor="gray.200"
      position="fixed"
      top="0"
      left="0px" 
      right="0px"
      zIndex="10"
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Link to="/">
            <img src=".MatrizApp/Backend/public/E_01.png" alt="Logo" style={{ height: '40px' }} />
          </Link>
        </Box>
        
        <Flex align="center" gap={4}>
          <Button variant="link">Planner</Button>
          <Button variant="link">Tablero</Button>
        </Flex>

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

        <Flex align="center" gap={4}>
          {/* Menú del usuario */}
          <Menu>
            <MenuButton as={IconButton} icon={<Avatar size="sm" name="Usuario" />} variant="outline" rightIcon={<ChevronDownIcon />} />
            <MenuList>
              <MenuItem>Datos del Usuario</MenuItem>
              <MenuItem as={Link} to="/crear-usuarios">Crear Usuario</MenuItem>
            </MenuList>
          </Menu>

          {/* Menú de Locaciones */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Locación
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/crear-locacion">Crear Locación</MenuItem>

              {/* Verificar si locaciones tiene elementos antes de mapear */}
              {locaciones?.length > 0 ? (
                locaciones.map(locacion => (
                  <MenuItem 
                    key={locacion.id} 
                    onClick={() => {
                      setLocacionSeleccionada(locacion); // Actualiza el contexto de locación
                      console.log("Locación seleccionada:", locacion.id_locacion); 
                    }} 
                    bg={locacionSeleccionada?.id === locacion.id ? 'gray.100' : 'white'} // Cambiar color de fondo si está seleccionada
                  >
                    {locacionSeleccionada?.id === locacion.id && <CheckIcon color="green.500" style={{ marginRight: '8px' }} />}
                    {locacion.nombre}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>Sin locaciones creadas</MenuItem>
              )}
            </MenuList>
          </Menu>

          {/* Menú de Empresas */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Empresa
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/crear-empresa">Crear Empresa</MenuItem>

              {/* Verificar si empresas tiene elementos antes de mapear */}
              {empresas?.length > 0 ? (
                empresas.map(empresa => (
                  <MenuItem 
                    key={empresa.id} 
                    onClick={() => {
                      setEmpresaSeleccionada(empresa); // Actualiza el contexto de empresa
                      setSelectedEmpresa(empresa.id); // Establece la empresa seleccionada
                      if (typeof onMenuSelect === 'function') {
                        onMenuSelect(empresa.id); // Ejecutar función pasada para manejar el cambio
                      }
                    }} 
                    bg={selectedEmpresa === empresa.id ? 'gray.100' : 'white'} // Cambiar color de fondo si está seleccionada
                  >
                    {selectedEmpresa === empresa.id && <CheckIcon color="green.500" style={{ marginRight: '8px' }} />}
                    {empresa.nombre_empresa}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>Sin empresas creadas</MenuItem>
              )}
            </MenuList>
          </Menu>

          <Box>
            <img src=".MatrizApp/Backend/public/C_02.png" alt="Logo" style={{ height: '40px' }} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
