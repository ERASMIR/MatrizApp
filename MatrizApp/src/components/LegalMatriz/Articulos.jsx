import React, { useContext, useEffect, useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr, Checkbox, Button, Stack, Box, Alert, AlertIcon } from '@chakra-ui/react';
import { EmpresaContext } from '@context/EmpresaContext';
import { LocacionContext } from '@context/LocacionContext';
import { getAplica, getValorAplica } from '../../services/apiServices';

const Articulos = ({ data = [], onSelectionChange, setSeleccionesParent, seleccionMasiva, setSeleccionesAplicaArticulos }) => {
  const { empresaSeleccionada } = useContext(EmpresaContext);
  const { locacionSeleccionada } = useContext(LocacionContext);

  const [filteredData, setFilteredData] = useState([]);
  const [aplicaOptions, setAplicaOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [selecciones, setSelecciones] = useState (seleccionMasiva || {}) //antes estaba definido así ({});
  const [previousSelecciones, setPreviousSelecciones] = useState(selecciones);

  // Filtrar datos según empresa y locación seleccionada
  useEffect(() => {
    if (empresaSeleccionada && locacionSeleccionada) {
      const filtered = data.filter(item =>
        item.empresaId === empresaSeleccionada.id_empresa &&
        item.locacionId === locacionSeleccionada.id_locacion
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]); // Limpiar si no hay selección
    }
  }, [empresaSeleccionada, locacionSeleccionada, data]);

  // Obtener las opciones de "Aplica"
  useEffect(() => {
    const fetchAplicaOptions = async () => {
      try {
        const response = await getAplica();
        const options = response.data.map(item => ({
          value: item.id,
          label: item.aplica_norma
        }));
        setAplicaOptions(options);
      } catch (error) {
        console.error('Error al obtener opciones de aplica:', error);
      }
    };
    fetchAplicaOptions();
  }, []);



  // Sincronizar selecciones con el padre solo si cambian
  useEffect(() => {
    // Aquí comprobamos si realmente hay cambios en las selecciones antes de llamar a `setSeleccionesParent`
    if (JSON.stringify(selecciones) !== JSON.stringify(previousSelecciones)) {
      console.log("Cambiaron las selecciones, actualizando componente padre...");
      setSeleccionesParent(selecciones);  // Sincroniza las selecciones con el padre solo si hay cambios
      setPreviousSelecciones(selecciones);
    }
  }, [selecciones, setSeleccionesParent]);
  
  // Definir el estado `previousSelecciones` para almacenar la versión anterior de las seleccione
  
  // Actualizar el estado de `previousSelecciones` solo cuando las selecciones cambien
  useEffect(() => {
    setPreviousSelecciones(selecciones);
  }, [selecciones]);
  

  

  useEffect(() => {
    setSelectedOption(prev => ({
      ...prev,
      ...seleccionMasiva // Reemplaza con los nuevos valores de la selección masiva
    }));
  }, [seleccionMasiva]);  // Asegúrate de que reaccionas al cambio de seleccionMasiva




  useEffect(() => {
    // Si hay una selección masiva, actualiza el estado local `selecciones`
    if (seleccionMasiva) {

      const nuevasSelecciones = { ...selecciones, ...seleccionMasiva };
        
      // Actualizar el estado local `selecciones`
      setSelecciones(nuevasSelecciones);


      // Actualizar también el estado `selectedOption` para reflejar en los checkboxes
      const nuevoSelectedOption = Object.keys(seleccionMasiva).reduce((acc, articuloId) => {
        acc[articuloId] = seleccionMasiva[articuloId].selectAplica;
        return acc;
      }, {});

      setSelectedOption(prevState => ({
        ...prevState,
        ...nuevoSelectedOption
      }));

      console.log("Selección masiva aplicada en el hijo:", nuevasSelecciones);
    }
}, [seleccionMasiva]);  // Reacciona al cambio en `seleccionMasiva`



  // VER SI ESTA USEEFFECT TRABAJA O REEMPLAZA EL DE MAS ABAJO
  //Obtener los valores de aplica para los artículos
  useEffect(() => {
    const fetchValoresAplica = async () => {
      if (empresaSeleccionada && locacionSeleccionada && filteredData.length > 0) {
        try {
          const nuevasSelecciones = {};
          const nuevoSelectedOption = {};  // Para mantener sincronizado el UI con los valores seleccionados
  
          for (const item of filteredData) {
            const articuloId = item.id;
  
            // Hacer la consulta para cada artículo
            const valorAplica = await getValorAplica(
              articuloId,
              locacionSeleccionada.id,
              empresaSeleccionada.id
            );




            // Mapea los datos al formato esperado
            const formattedSelection = {
              articuloId: articuloId,
              empresaId: valorAplica?.id_empresa,
              locacionId: valorAplica?.id_locacion,
              fechaRegistro: valorAplica?.fecha_registro?.split('T')[0], // Formatear fecha
              selectAplica: valorAplica?.select_aplica ?? 0, // Valor por defecto si es null
            };

            nuevasSelecciones[articuloId] = formattedSelection;
            nuevoSelectedOption[articuloId] = formattedSelection.selectAplica; // Sincroniza con UI
          }
  


          // Actualiza los estados
          setSelecciones(nuevasSelecciones); // Actualizar el estado local
          setSelectedOption(nuevoSelectedOption); // Sincronizar el UI con las selecciones guardadas
          setSeleccionesParent(nuevasSelecciones); // Actualizar el estado en el padre
          setSeleccionesAplicaArticulos(nuevasSelecciones); // Actualizar el estado en el padre

  
          console.log("Valores Aplica obtenidos:", nuevasSelecciones);
        } catch (error) {
          console.error('Error al obtener los valores de aplica:', error);
        }
      }
    };
  
    fetchValoresAplica();
  }, [empresaSeleccionada, locacionSeleccionada, filteredData]);




  // VERSION ANTERIOR DE ESTA FUNCIÓN
  // Manejar cambios de los checkboxes
  const handleCheckboxChange = (itemId, optionValue) => {
    if (!empresaSeleccionada || !locacionSeleccionada) {
      console.warn("Empresa o locación no seleccionada.");
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Fecha actual

    const newSelection = {
      articuloId: itemId,
      empresaId: empresaSeleccionada.id,
      locacionId: locacionSeleccionada.id,
      fechaRegistro: currentDate,
      selectAplica: optionValue
    };

    setSelecciones(prevState => {
      const updatedSelections = {
        ...prevState,
        [itemId]: newSelection
        //optionValue ? newSelection : undefined
      };


      

      onSelectionChange(updatedSelections); // Enviar al padre para almacenar en la BBDD
      console.log("Selecciones actualizadas:", updatedSelections);
      return updatedSelections;

      console.log("Selecciones actualizadas:", updatedSelections);

    
    });

    // Actualizar selectedOption para la UI
    setSelectedOption(prevState => ({
      ...prevState,
      [itemId]: optionValue //|| null
    }));
  };


  // Verificar si hay selección de empresa y locación
  if (!empresaSeleccionada || !locacionSeleccionada) {
    return (
      <Alert status="warning" mt={4}>
        <AlertIcon />
        Por favor, seleccione una empresa y una locación para gestionar la Matriz Legal.
      </Alert>
    );
  }

  const hasAnexo = filteredData.some(item => item.anexo);
  const hasTituloAnexo = filteredData.some(item => item.titulo_anexo);
  const hasCapituloAnexo = filteredData.some(item => item.capitulo_anexo);
  const hasArticuloAnexo = filteredData.some(item => item.articulo_anexo);
  const hasTextoArticulo = filteredData.some(item => item.texto_articulo);

  return (
    <Box overflowY="auto" maxHeight="600px" border="1px solid #ccc">
      <Table variant="simple" colorScheme="teal.500">
        <Thead position="sticky" top={0} bg="white" zIndex={1} boxShadow="md">
          <Tr>
            <Th>Aplica</Th>
            <Th>Artículo Norma</Th>
            {hasAnexo && <Th>Anexo</Th>}
            {hasTituloAnexo && <Th>Título Anexo</Th>}
            {hasCapituloAnexo && <Th>Capítulo Anexo</Th>}
            {hasArticuloAnexo && <Th>Artículo Anexo</Th>}
            {hasTextoArticulo && <Th>Texto del artículo</Th>}
            <Th>Gestión Artículo</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((item) => (
            <Tr key={item.id}>
              <Td>
                <Stack spacing={2}>
                    {aplicaOptions.map(option => (
                    <Checkbox
                        key={option.value}
                        isChecked={selectedOption[item.id] === option.value} // || selecciones[item.id]?.selectAplica === option.value}
                        onChange={() => handleCheckboxChange(item.id, option.value)}
                    >
                        {option.label}
                    </Checkbox>
                    ))}
                </Stack>
              </Td>
         
              <Td>{item.articulo_norma}</Td>
              {hasAnexo && <Td>{item.anexo || '-'}</Td>}
              {hasTituloAnexo && <Td>{item.titulo_anexo || '-'}</Td>}
              {hasCapituloAnexo && <Td>{item.capitulo_anexo || '-'}</Td>}
              {hasArticuloAnexo && <Td>{item.articulo_anexo || '-'}</Td>}
              {hasTextoArticulo && (
                <Td sx={{ textAlign: 'justify' }}>{item.texto_articulo || '-'}</Td>
              )}
              <Td>
                <Button size="sm" colorScheme="blue" onClick={() => handleGestionArticulo(item)}>
                  Gestión Artículo
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );

  const handleGestionArticulo = (articulo) => {
    console.log("Gestionar artículo:", articulo);
    console.log("Opción seleccionada para este artículo:", selectedOption[articulo.id]);
    console.log("Selecciones temporales:", selecciones);
  };
};

export default Articulos;
