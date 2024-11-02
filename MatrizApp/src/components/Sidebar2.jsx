import React, { useState } from 'react';
import { Box, Button, Collapse, VStack, useColorMode } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import { BsBoxArrowInLeft } from 'react-icons/bs';
import { LiaBarsSolid } from "react-icons/lia";
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";
import { Link } from 'react-router-dom';

// Componente SidebarItem que representa cada elemento del sidebar
const SidebarItem = ({ icon, label, children, collapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Button
        width="100%"
        // Justifica el contenido a la derecha cuando el menú está colapsado y a la izquierda cuando no lo está.
        justifyContent={collapsed ? 'left' : 'start'} // Cambia 'right' a 'left' para alinear los íconos a la izquierda cuando esté colapsado
        variant="link"
        colorScheme="teal"
        leftIcon={icon}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Muestra el label solo si el menú no está colapsado */}
        {!collapsed && label}
      </Button>

      {/* Colapso para los hijos del SidebarItem */}
      {children && (
        <Collapse in={isOpen}>
          <VStack align="start" spacing={2} pl={collapsed ? 0 : 4} mt={2}>
            {children.map((item) => (
              <Link key={item.key} to={item.link} style={{ width: '100%' }}>
                <Button
                  width="100%"
                  variant="link"
                  colorScheme="teal"
                  justifyContent="start" // Alinea los hijos a la izquierda
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </VStack>
        </Collapse>
      )}
    </Box>
  );
};

// Componente principal Sidebar
const Sidebar = ({ collapsed, setCollapsed, sidebarItems }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box display="flex" minHeight="100vh">
      <Box
        width={collapsed ? '80px' : '250px'} // Cambiar el tamaño aquí
        bg={colorMode === 'dark' ? 'gray.800' : 'gray.200'}
        color={colorMode === 'dark' ? 'white' : 'black'}
        position="fixed"
        top="70px"
        height="calc(100vh - 70px)"
        boxShadow="md"
        transition="width 0.3s"
        overflow="hidden"
      >
        <Box p={4}>
          {/* Contenedor para alinear los botones en la misma línea */}
          <Box display="flex" justifyContent="space-between" mb={4}>
            {/* Botón de cambio de modo de color, se oculta cuando está colapsado */}
            {!collapsed && (
              <Button
                onClick={toggleColorMode}
                variant="ghost"
                colorScheme="teal"
                borderRadius="full"
                fontSize="1x1"
              >
                {colorMode === 'light' ? '🌙' : '🌞'}
              </Button>
            )}

            {/* Botón para colapsar/expandir el Sidebar */}
            <Button
              onClick={() => setCollapsed(!collapsed)}
              variant="ghost"
              colorScheme="teal"
              borderRadius="full"
              //fontSize="lg"
              fontSize="5xl" // Tamaño más grande para la flecha
            >
            {collapsed ? <LiaBarsSolid  style={{ fontSize: '40px', padding: '0', margin: '0' }}/> : <HiArrowLeftStartOnRectangle />}
            </Button>
          </Box>

          {/* Mapeo de los elementos del Sidebar */}
          <Box>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                children={item.children}
                collapsed={collapsed} // Pasando el estado de colapsado a los SidebarItems
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box flex="1" ml={collapsed ? '80px' : '250px'} p={4}>
        {/* Contenido principal aquí */}
      </Box>
    </Box>
  );
};

export default Sidebar;
