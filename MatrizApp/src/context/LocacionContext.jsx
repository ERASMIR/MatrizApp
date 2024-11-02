import React, { createContext, useState } from 'react';

export const LocacionContext = createContext();

export const LocacionProvider = ({ children }) => {
  const [locaciones, setLocaciones] = useState([]); // Estado para las locaciones
  const [locacionSeleccionada, setLocacionSeleccionada] = useState(null); // Estado para la locación seleccionada

  return (
    <LocacionContext.Provider value={{ locaciones, setLocaciones, locacionSeleccionada, setLocacionSeleccionada }}>
      {children}
    </LocacionContext.Provider>
  );
};
