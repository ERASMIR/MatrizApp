// src/context/EmpresaContext.jsx
import React, { createContext, useState } from 'react';

export const LocacionContext = createContext();

//export const useLocacion = () => useContext(LocacionContext);

export const LocacionProvider = ({ children }) => {
  const [locacionSeleccionada, setLocacionSeleccionada] = useState(null);

  return (
    <LocacionContext.Provider value={{ locacionSeleccionada, setLocacionSeleccionada }}>
      {children}
    </LocacionContext.Provider>
  );
};
