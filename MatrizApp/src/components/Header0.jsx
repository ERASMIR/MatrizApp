import React, { useEffect, useState, useContext } from 'react';
import { Box, Flex, IconButton, Menu, MenuButton, MenuList, MenuItem, Button, Avatar } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import { getEmpresas, getLocacion } from '@services/apiServices'; 
import { Link } from 'react-router-dom'; 
import { EmpresaContext } from '@context/EmpresaContext'; 
import { LocacionContext } from '@context/LocacionContext'; 

const Header = ({ onMenuSelect }) => {
  const { setEmpresaSeleccionada } = useContext(EmpresaContext); 
  const { setLocacionSeleccionada } = useContext(LocacionContext); 

  const [empresas, setEmpresas] = useState([]);
  const [locaciones, setLocaciones] = useState([]); 

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await getEmpresas();
        setEmpresas(response.data); 
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    const fetchLocaciones = async () => {
      try {
        const response = await getLocacion(); 
        setLocaciones(response.data); 
      } catch (error) {
        console.error('Error al obtener locaciones:', error);
      }
    };

    fetchEmpresas();
    fetchLocaciones(); 
  }, []);

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
          <Button variant="link">Resumen de Actividades</Button>
          <Button variant="link">Estadísticas</Button>
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
              {locaciones.length > 0 ? (
                locaciones.map(locacion => (
                  <MenuItem key={locacion.id_locacion} onClick={() => {
                    setLocacionSeleccionada(locacion); // Actualiza el contexto de locación
                    if (typeof onMenuSelect === 'function') {
                        onMenuSelect(locacion.id_locacion); // Ejecutar función pasada para manejar el cambio
                    }
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
                    if (typeof onMenuSelect === 'function') {
                        onMenuSelect(empresa.id_empresa); // Ejecutar función pasada para manejar el cambio
                    }  
                  }}>
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