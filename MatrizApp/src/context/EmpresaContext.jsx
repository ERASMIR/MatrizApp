// src/context/EmpresaContext.jsx
import React, { createContext, useState } from 'react';

export const EmpresaContext = createContext();

//export const useEmpresa = () => useContext(EmpresaContext);

export const EmpresaProvider = ({ children }) => {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  return (
    <EmpresaContext.Provider value={{ empresaSeleccionada, setEmpresaSeleccionada }}>
      {children}
    </EmpresaContext.Provider>
  );
};
