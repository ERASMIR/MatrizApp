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
        justifyContent={collapsed ? 'left' : 'start'}
        variant="link"
        colorScheme="teal"
        leftIcon={icon}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!collapsed && label}
      </Button>

      {children && (
        <Collapse in={isOpen}>
          <VStack align="start" spacing={2} pl={collapsed ? 0 : 4} mt={2}>
            {children.map((item) => (
              <Link key={item.key} to={item.link} style={{ width: '100%' }}>
                <Button
                  width="100%"
                  variant="link"
                  colorScheme="teal"
                  justifyContent="start"
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
      {/* Sidebar */}
      <Box
        as="nav"
        width={collapsed ? '80px' : '250px'}
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
          <Box display="flex" justifyContent="space-between" mb={4}>
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

            <Button
              onClick={() => setCollapsed(!collapsed)}
              variant="ghost"
              colorScheme="teal"
              borderRadius="full"
              fontSize="5xl"
            >
              {collapsed ? (
                <LiaBarsSolid style={{ fontSize: '40px', padding: '0', margin: '0' }} />
              ) : (
                <HiArrowLeftStartOnRectangle />
              )}
            </Button>
          </Box>

          <Box>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                children={item.children}
                collapsed={collapsed}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Contenedor principal */}
      <Box flex="1" ml={collapsed ? '80px' : '250px'} p={4} transition="margin-left 0.3s">
        {/* Contenido principal */}
      </Box>
    </Box>
  );
};

export default Sidebar;
