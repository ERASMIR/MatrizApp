// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { MdMail } from 'react-icons/md';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LegalMatrizAr from './components/LegalMatrizAr';
import FormularioEmpresa from './components/Form/FormularioEmpresa';
import FormularioLocacion from './components/Form/FormularioLocacion'; // Importa el formulario
import HomePage from './components/HomePage'; 
import FormularioUser from './components/Form/FormularioUser';
import { EmpresaProvider } from '@context/EmpresaContext'; // Importa el EmpresaProvider
import { LocacionProvider } from '@context/LocacionContext'; // Importa el LocacionProvider

const App = () => {
  const [collapsed, setCollapsed] = useState(true);

  const sidebarItems = [
    {
      key: 'sub1',
      label: 'Matriz Legal',
      icon: <MdMail />,
      children: [
        { key: '1', label: 'Requisitos Legales', link: '/matriz-legal-ar/normas' },
      ],
    },
  ];

  return (
    <EmpresaProvider> {/* Envolver la aplicación con EmpresaProvider */}
      <LocacionProvider> {/* Envolver la aplicación con LocacionProvider */}
        <Router>
          <Box display="flex" minHeight="100vh">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} sidebarItems={sidebarItems} />
             
            {/* Contenido principal */}
            <Box
              flex="1"
              ml={collapsed ? '1px' : '1px'}
              p={2}
              mt="60px"
              transition="margin-left 0.3s ease"
            >
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Ruta para el formulario de gestión de matriz legal */}
                <Route path="/matriz-legal-ar/normas" element={<LegalMatrizAr />} />
                {/* Ruta para el formulario de empresa */}
                <Route path="/crear-empresa" element={<FormularioEmpresa />} />
                {/* Ruta para el formulario de locación */}
                <Route path="/crear-locacion" element={<FormularioLocacion />} />      
                {/* Ruta para el formulario de usuario */}
                <Route path="/crear-usuarios" element={<FormularioUser />} />    
              </Routes>
            </Box>
          </Box>
        </Router>
      </LocacionProvider>
    </EmpresaProvider>
  );
};

export default App;
