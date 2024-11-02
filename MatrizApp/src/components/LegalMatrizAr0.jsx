import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, HStack, VStack, Heading, Text, useDisclosure, Button, Select } from '@chakra-ui/react';
import { getCategorias, getNormas, getNormasByCategoria, getNormaById, getJurisdicciones, getNormasByJurisdiccion, getAplica, updateAplicaArticulo, getValorAplica } from '../services/apiServices';
import PopoverComponent from './LegalMatriz/PopoverComponent';
import Jurisdicciones from './LegalMatriz/Jurisdicciones';
import Articulos from './LegalMatriz/Articulos';
import Categorias from './LegalMatriz/Categorias';
import { handleSearchChange } from './LegalMatriz/Utils';
import { useNavigate } from 'react-router-dom'; // Cambia a useNavigate

const LegalMatrizAr = () => {
  const [categorias, setCategorias] = useState([]);
  const [normas, setNormas] = useState([]);
  const [jurisdicciones, setJurisdicciones] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [filteredNormas, setFilteredNormas] = useState([]);
  const [filteredJurisdicciones, setFilteredJurisdicciones] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedNorma, setSelectedNorma] = useState('');
  const [selectedJurisdiccion, setSelectedJurisdiccion] = useState('');
  const [selectedView, setSelectedView] = useState('normas');
  const [articuloData, setArticuloData] = useState([]);
  const [searchCategoria, setSearchCategoria] = useState('');
  const [searchNorma, setSearchNorma] = useState('');
  const [searchJurisdiccion, setSearchJurisdiccion] = useState('');
  const [resultText, setResultText] = useState('');
  const [isSticky, setIsSticky] = useState(false); // Estado para controlar si el subheader está fijo
  const subheaderRef = useRef(null); // Referencia al subheader
  const [aplicaOptions, setAplicaOptions] = useState([]); // Opciones obtenidas de la BBDD
  const [selectedOption, setSelectedOption] = useState(''); // Opción seleccionada
  const [seleccionesArticulos, setSeleccionesArticulos] = useState({}); //datos que vienen de Articulos.jsx para guadar los cambios
  const [seleccionesAplicaArticulos, setSeleccionesAplicaArticulos] = useState({}); //datos que vienen de Articulos.jsx para guadar los cambios
  const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
  const [seleccionesParent, setSeleccionesParent] = useState({});
  const navigate = useNavigate(); // Crear el objeto navigate
  const [seleccionesOriginales, setSeleccionesOriginales] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { isOpen: isCategoriaOpen, onOpen: onCategoriaOpen, onClose: onCategoriaClose } = useDisclosure();
  const { isOpen: isNormaOpen, onOpen: onNormaOpen, onClose: onNormaClose } = useDisclosure();
  const { isOpen: isJurisdiccionOpen, onOpen: onJurisdiccionOpen, onClose: onJurisdiccionClose } = useDisclosure();
  
  

  const handleSelectionChange = (event) => {
    //const value = parseInt(event.target.value, 10); // Obtiene el valor seleccionado // Convertir a número
    const value = event.target.value.trim(); // Eliminar espacios en blanco

    console.log("Selección recibida desde el desplegable:", value);

    setSelectedOption(value); // Almacena la selección del desplegable

    if (value === "") {
      console.error("El valor seleccionado es una cadena vacía.");
      return;
    }

    const parsedValue = parseInt(value, 10);
    console.log("Asignando valor a selectedOption:", parsedValue);
    setSelectedOption(parsedValue); // Asegurar que sea un número
  };


  // useEffect(() => {
  //   if (selectedOption !== "") {
  //     console.log("selectedOption ha cambiado, aplicando selección:", selectedOption);
  //     handleApplySelection();
  //   }
  // }, [selectedOption]);
  


  useEffect(() => {
    console.log("selectedOption ha cambiado:", selectedOption);
  }, [selectedOption]);


  // useEffect(() => {
  //   if (selectedOption !== undefined && selectedOption !== null) {
  //     handleApplySelection();
  //   }
  // }, [selectedOption]);


  const handleApplyClick = () => {
    // Asegúrate de que el estado de selectedOption esté actualizado
    setSelectedOption((prevOption) => {
      // Si el estado necesita cambiar de alguna manera, lo haces aquí
      const updatedOption = prevOption; // O algún cálculo si es necesario
      handleApplySelection(updatedOption); // Llama a handleApplySelection con el valor más reciente
      return updatedOption;
    });
  };


  const handleApplySelection = (selectedOption) => {
    if (!seleccionesParent || Object.keys(seleccionesParent).length === 0) {
        console.error("No hay selecciones disponibles para aplicar.");
        return;
    }

    // Crear una copia de `seleccionesParent` y modificar solo `selectAplica`
    const nuevasSelecciones = Object.keys(seleccionesParent).reduce((acc, articuloId) => {
      const articulo = seleccionesParent[articuloId];
        
      if (!articulo.articuloId == null || !articulo.empresaId == null || !articulo.locacionId == null) {
        console.error("Datos faltantes en el artículo:", articulo);
        return acc;
      }

      // Modificar el valor de `selectAplica` y mantener el resto de los datos
      acc[articuloId] = {
        ...articulo, 
        selectAplica: selectedOption //selectedOption // Solo modificar esta propiedad
      };

      return acc;
    }, {});

    console.log("Aplicando selección masiva:", nuevasSelecciones);

    // Actualizamos las selecciones manteniendo las individuales ya existentes
    setSeleccionesAplicaArticulos(prevState => ({
        ...prevState,
        ...nuevasSelecciones
    }));

    // Actualizar también el estado para que se refleje en el componente hijo
    setSeleccionesParent(prevState => ({
      ...prevState,
      ...nuevasSelecciones
    }));

    // // Ahora también actualizamos el componente hijo para que muestre el cambio en los checkboxes
    // setSeleccionesParent(nuevasSelecciones); // Esto ya sincroniza con el componente hijo

    // **Aquí se asegura que el hijo refleje los cambios temporalmente**
    alert("Selección masiva exitosa.");
  };




  // const handleApplySelection = () => {
  //   // Asegurarse de usar el valor más reciente de selectedOption
  //   setSelectedOption((prevSelectedOption) => {
  //     console.log("Opción seleccionada:", prevSelectedOption);
  
  //     if (prevSelectedOption === null || prevSelectedOption === undefined) {
  //       console.error("selectedOption es null o undefined.");
  //       return;
  //     }
  
  //     if (isNaN(prevSelectedOption)) {
  //       console.error("selectedOption no es un número válido.");
  //       return;
  //     }
  
  //     const opcionesValidas = [0, 1, 2, 'aplica', 'no_aplica', 'informativo'];
  //     if (!opcionesValidas.includes(prevSelectedOption)) {
  //       console.error(`selectedOption tiene un valor inesperado: ${prevSelectedOption}`);
  //       return;
  //     }
  
  //     // Continuar lógica de selección masiva...
  //     console.log("Aplicando selección con:", prevSelectedOption);
  //     return prevSelectedOption;
  //   });
  // };





// ULTIMA USADA
//   const handleApplySelection = () => {
//     if (!articuloData || articuloData.length === 0) {
//         console.error("No hay artículos disponibles para aplicar la selección.");
//         return;
//     }

//     const nuevasSelecciones = articuloData.reduce((acc, articulo) => {
//         const { articuloId, empresaId, locacionId, fechaRegistro } = articulo;

//         // Verifica que todos los campos necesarios estén presentes
//         if (!articuloId || !empresaId || !locacionId) {
//             console.error("Datos faltantes en el artículo:", articulo);
//             return acc; // No agrega este artículo al objeto acumulador
//         }

//         // Si los datos son válidos, agrega al acumulador
//         acc[articuloId] = {
//             articuloId,
//             empresaId,
//             locacionId,
//             selectAplica: selectedOption, // Aplicar la selección
//             fechaRegistro: fechaRegistro || new Date().toISOString(), // Evitar 'undefined'
//         };

//         return acc;
//     }, {});

//     console.log("Aplicando selección masiva:", nuevasSelecciones);

//     // Actualizamos las selecciones manteniendo las individuales ya existentes
//     setSeleccionesAplicaArticulos(prevState => ({
//         ...prevState,
//         ...nuevasSelecciones
//     }));

//     alert("Selección masiva exitosa.");
// };






  



  // const handleApplySelection = () => {

  //   console.log("Opción seleccionada:", selectedOption); // Verifica el valor de selectedOption


  //   if (!selectedOption && selectedOption !== 0) {
  //     console.error("selectedOption no es válido o es una cadena vacía.");
  //     return;
  //   }

  //   if (isNaN(selectedOption)) {
  //     console.error("El valor de selectedOption no es un número válido.");
  //     return;
  //   }


  //   // 2. Verificar si `selectedOption` es una cadena vacía o contiene solo espacios
  //   if (typeof selectedOption === 'string' && selectedOption.trim() === '') {
  //     console.error("selectedOption es una cadena vacía o solo tiene espacios.");
  //     return;
  //   }

  //   // 3. Verificar el tipo de dato de `selectedOption`
  //   if (typeof selectedOption !== 'string' && typeof selectedOption !== 'number') {
  //     console.error(`El tipo de selectedOption es inválido: ${typeof selectedOption}`);
  //     return;
  //   }


  //   const opcionesValidas = [1, 2, 3]; // Solo opciones numéricas permitidas
  //   if (!opcionesValidas.includes(Number(selectedOption))) {
  //     console.error(`selectedOption tiene un valor inesperado: ${selectedOption}`);
  //     return;
  //   }


  //   // 4. Validación específica para opciones esperadas (por ejemplo, si esperas valores de un conjunto fijo)
    
  //   if (!opcionesValidas.includes(selectedOption)) {
  //     console.error(`selectedOption tiene un valor inesperado: ${selectedOption}`);
  //     return;
  //   }


  //   // 5. Validar si hay datos de artículos disponibles
  //   if (!articuloData || articuloData.length === 0) {
  //     console.error("No hay artículos disponibles para aplicar la selección.");
  //     return;
  //   }
  

  //   // Mapeamos sobre los artículos para aplicar la selección masiva
  //   const nuevasSelecciones = articuloData.reduce((acc, articulo) => {

  //     const { articuloId, empresaId, locacionId, fechaRegistro } = articulo;

  //     if (articuloId && empresaId && locacionId) {
  //       acc[articuloId] = {
  //         articuloId,
  //         empresaId,
  //         locacionId,
  //         selectAplica: selectedOption, // Aplicar la selección
  //         fechaRegistro: fechaRegistro || new Date().toISOString(), // Evitar 'undefined'
  //       };
  //     } else {
  //       console.warn(`Datos faltantes en el artículo:`, articulo);
  //     }
  //     return acc;
      
  //   }, {});
  
  //   console.log("Aplicando selección masiva:", nuevasSelecciones);
      
  //   // antes estaba setSeleccionesArticulos / Actualizamos las selecciones manteniendo las individuales ya existentes
  //   setSeleccionesAplicaArticulos(prevState => ({
  //     ...prevState,
  //     ...nuevasSelecciones
  //   }));

  //   alert("Selección masiva exitosa."); // Mensaje de confirmación
  // };







  useEffect(() => {
    const handleScroll = () => {
      const subheader = subheaderRef.current;
      if (subheader) {
        const subheaderOffsetTop = subheader.offsetTop;

        // Si el scroll pasa el subheader, lo fijamos
        if (window.scrollY > subheaderOffsetTop) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    // Agregar el listener de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  useEffect(() => {
    console.log('Estado actualizado, listo para guardar:', seleccionesAplicaArticulos);
  }, [seleccionesAplicaArticulos]);



  useEffect(() => {
    // Obtener las opciones de "Aplica" desde la base de datos
    const fetchAplicaOptions = async () => {
      try {
        const response = await getAplica();
        const options = response.data.map(item => ({
          value: item.id, // O el identificador que uses en tu base de datos
          label: item.aplica_norma // Asume que `aplica_norma` es el nombre de la columna en la BBDD
        }));
        setAplicaOptions(options);
      } catch (error) {
        console.error('Error al obtener opciones de aplica:', error);
      }
    };

    fetchAplicaOptions();
  }, []);



  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, normasRes, jurisdiccionesRes] = await Promise.all([
          getCategorias(),
          getNormas(),
          getJurisdicciones()
        ]);
        setCategorias(categoriasRes.data);
        setNormas(normasRes.data);
        setJurisdicciones(jurisdiccionesRes.data);
        setFilteredCategorias(categoriasRes.data);
        setFilteredNormas(normasRes.data);
        setFilteredJurisdicciones(jurisdiccionesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  
// Resetear filtros al seleccionar una categoría
  useEffect(() => {
    if (selectedCategoria && categorias.length > 0) {
      // Resetear los otros filtros
      setSelectedJurisdiccion('');
      setSelectedNorma('');
      setFilteredNormas(normas); // Restaurar la lista de normas
      setFilteredJurisdicciones(jurisdicciones); // Restaurar la lista de jurisdicciones
      setArticuloData([]);
      setResultText('');
      setSelectedView('categorias');  // Cambiar a la vista de categorías

      const selectedCategoriaId = BigInt(selectedCategoria);
      const categoriaSeleccionada = categorias.find(categoria => BigInt(categoria.id) === selectedCategoriaId);

      if (categoriaSeleccionada) {
        getNormasByCategoria(selectedCategoriaId)
          .then((response) => {
            setFilteredCategorias(response.data);  // Actualizar la lista de normas filtradas
            setResultText(
              <Box>
                Se han encontrado <strong>{response.data.length}</strong> normas para la categoría <strong>{categoriaSeleccionada.categoria_norma}</strong>.
              </Box>
            );
            setSelectedView('categorias');
          })
          .catch((error) => {
            console.error('Error fetching normas by categoria:', error);
          });
      }
    }
  }, [selectedCategoria, categorias, normas, jurisdicciones]);

  // Resetear filtros al seleccionar una jurisdicción
  useEffect(() => {
    if (selectedJurisdiccion) {
      setSelectedCategoria('');
      setSelectedNorma('');
      setFilteredNormas(normas);  // Restaurar la lista de normas
      setFilteredCategorias(categorias);  // Restaurar la lista de categorías
      setArticuloData([]);
      setResultText('');
      setSelectedView('jurisdicciones');  // Cambiar a la vista de jurisdicciones

      getNormasByJurisdiccion(selectedJurisdiccion)
        .then((response) => {
          setFilteredJurisdicciones(response.data);
          const jurisdiccionNombre = jurisdicciones.find(jurisdiccion => jurisdiccion.id === selectedJurisdiccion)?.jurisdiccion || 'la jurisdicción seleccionada';
          setResultText(
            <Box>
              Se han encontrado <strong>{response.data.length}</strong> normas para la jurisdicción <strong>{jurisdiccionNombre}</strong>.
            </Box>
          );
          setSelectedView('jurisdicciones');
        })
        .catch((error) => {
          console.error('Error fetching normas by jurisdiccion:', error);
        });
    }
  }, [selectedJurisdiccion, categorias, normas, jurisdicciones]);

  useEffect(() => {
    if (selectedNorma) {
      setSelectedCategoria('');
      setSelectedJurisdiccion('');
      setFilteredCategorias(categorias); // Restaurar la lista de categorías
      setFilteredJurisdicciones(jurisdicciones); // Restaurar la lista de jurisdicciones
      setArticuloData([]);
      setResultText('');
      setSelectedView('articulos'); // Cambiar a la vista de artículos
  
      const selectedNormaDetail = filteredNormas.find(
        (norma) => BigInt(norma.id) === BigInt(selectedNorma)
      );
      if (selectedNormaDetail) {
        // Mostrar el detalle de la norma seleccionada
        setResultText(
          <Box
            maxWidth="1150px"
            w="full"
            p={2}
            display="flex"
          >
            <Box
              flex="2.4"
              mr={4}
              overflowY="auto"
              maxHeight="80px"
            >
              <Text mt={1} textAlign="justify" whiteSpace="normal" wordBreak="break-word" size="sm" fontSize="sm">
                <strong>Norma:</strong> {selectedNormaDetail.nombre}
              </Text>
              <Text mt={1} textAlign="justify" whiteSpace="normal" wordBreak="break-word" size="sm" fontSize="sm">
                <strong>Resumen:</strong> {selectedNormaDetail.resumen}
              </Text>
            </Box>
  
            <Box flex="1" display="flex" flexDirection="column" alignItems="flex-end">
              <Box display="flex" alignItems="right" mb={1}>
                <Text fontSize="sm" mr={1} mt={1} align="right">
                  Aplicar masivamente la selección:
                </Text>
                <Select
                  placeholder="Seleccione"
                  fontSize="sm"
                  size="sm"
                  w="150px"
                  onChange={handleSelectionChange}
                >
                  {aplicaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Button
                  ml={2}
                  size="sm"
                  colorScheme="blue"
                  onClick={handleApplyClick}
                  px={2}
                  py={1}
                  fontSize="10px"
                >
                  Aplicar
                </Button>
              </Box>
  
              <Box display="flex" mt={2} justifyContent="space-between" w="full" align="right">
                <Button
                  onClick={() => window.open(selectedNormaDetail.enlace_norma, '_blank')}
                  colorScheme="gray.100"
                  color="black"
                  size="xs"
                  variant="solid"
                  px={2}
                  py={1}
                  textDecoration="underline"
                  isDisabled={!selectedNormaDetail.enlace_norma}
                  fontSize="13px"
                >
                  Consultar Normativa
                </Button>
  
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={handleGuardarCambios} // Llamar a la función para guardar cambios
                  px={2}
                  py={1}
                  fontSize="12px"
                >
                  Guardar Cambios
                </Button>
              </Box>
            </Box>
          </Box>
        );
  
        // Obtener los artículos relacionados a la norma seleccionada
        getNormaById(selectedNorma)
          .then((response) => {
            setArticuloData(response.data);
            setSelectedView('articulos');
            // Actualiza el estado con el enlace de la norma para usarlo en el botón
            if (response.data.enlace_norma) {
              setEnlaceNorma(response.data.enlace_norma);
            }
          })
          .catch((error) => {
            console.error('Error fetching articulos by norma:', error);
          });
      }
    }
  }, [selectedNorma, filteredNormas, categorias, jurisdicciones]);




  

  // const handleRestaurarOriginales = () => {
  //   setSeleccionesAplicaArticulos(seleccionesOriginales);  // para restaurar los valores originales, se puede agregar un botón nuevo para ello

  // };

  //<button onClick={handleRestaurarOriginales}>Restaurar Selecciones Originales</button> se podría agregar este botón para revertir los cambios

  // Cuando cargues los datos de la API o desde alguna fuente de datos, asegúrate de guardar una copia de las selecciones originales:
  // useEffect(() => {
  //   if (articuloData) {
  //     const seleccionesIniciales = articuloData.reduce((acc, articulo) => {
  //       acc[articulo.articuloId] = {
  //         articuloId: articulo.articuloId,
  //         empresaId: articulo.empresaId,
  //         locacionId: articulo.locacionId,
  //         selectAplica: articulo.selectAplica,
  //         fechaRegistro: articulo.fechaRegistro
  //       };
  //       return acc;
  //     }, {});
      
  //     setSeleccionesOriginales(seleccionesIniciales);  // Guardamos las selecciones originales
  //   }
  // }, [articuloData]);



  // useEffect(() => {
  //   if (Object.keys(seleccionesParent).length > 0) { // antes estaba así (seleccionesParent && Object.keys(seleccionesParent).length > 0)
  //     console.log('Nuevas selecciones parent recibidas:', seleccionesParent);
  //     setSeleccionesAplicaArticulos(seleccionesParent); // Actualiza con seleccionesParent solo si tiene datos
  //   }
  // }, [seleccionesParent]);


  // useEffect(() => {
  //   console.log('SeleccionesAplicaArticulos actualizado:', seleccionesAplicaArticulos);
  // }, [seleccionesAplicaArticulos]);
  
  //esta función hace que guarde los datos cada vez que hay un cambio o una selección en un checkbox, evaluar al parece me conviene más
  // useEffect(() => {
  //   if (Object.keys(seleccionesAplicaArticulos).length > 0) {
  //     console.log('Listo para guardar:', seleccionesAplicaArticulos);
  //     handleGuardarCambios();
  //   }
  // }, [seleccionesAplicaArticulos]);
  

  

  
  //  // Limpiar las selecciones de los artículos y las opciones seleccionadas
  // const limpiarNewSelection = () => {
  //   setSeleccionesAplicaArticulos({});  // Limpiar las selecciones de los artículos
  //   setSelectedOption({});  // Limpiar cualquier opción seleccionada
  // };


  


  // Detectar cambios de selecciones desde el hijo
  useEffect(() => {
    if (Object.keys(seleccionesParent).length > 0) {
      console.log('Nuevas selecciones parent recibidas:', seleccionesParent);
      setSeleccionesAplicaArticulos(seleccionesParent); // Actualiza con seleccionesParent solo si tiene datos
    }
  }, [seleccionesParent]);




  // Guardar cambios al detectar un guardado en curso
  useEffect(() => {
    if (!isSaving || Object.keys(seleccionesAplicaArticulos).length === 0) return; // Evita el guardado si no hay datos o ya estamos guardando

    //console.log('Intentando guardar cambios...', seleccionesAplicaArticulos);
    console.log('Selecciones actuales:', seleccionesAplicaArticulos);

    const dataToSend = Object.values(seleccionesAplicaArticulos);
  //   if (dataToSend.length === 0) {
  //     console.error('No hay datos para enviar. Verifica las selecciones.');
  //     setIsSaving(false);  // Desbloquear si no hay datos
  //     return;
  // }

    const validData = dataToSend.every(articulo => 
      articulo.articuloId !== undefined &&
      articulo.empresaId !== undefined &&
      articulo.locacionId !== undefined &&
      articulo.fechaRegistro !== undefined &&
      articulo.selectAplica !== undefined
    );

    if (!validData) {
      console.error("Datos inválidos en seleccionesAplicaArticulos.");
      setIsSaving(false);  // Desbloquear si los datos no son válidos
      return;
    }

    console.log('Datos a enviar:', dataToSend);

    // Simulación del guardado: reemplaza esto con la lógica real de guardado
    updateAplicaArticulo(dataToSend)
      .then((response) => {
        console.log("Cambios guardados exitosamente:", response);
        limpiarNewSelection(); // Limpiar la selección después de guardar
        alert("Cambios guardados exitosamente."); // Mensaje de confirmación
        navigate('/matriz-legal-ar/normas'); // Cambia la ruta si es necesario
      })
      .catch((error) => {
        console.error("Error al guardar los cambios:", error);
      })
      .finally(() => {
        setIsSaving(false);  // Desbloquear después de guardar
      });

  }, [seleccionesAplicaArticulos, isSaving]);



  const handleGuardarCambios = () => {
    if (isSaving) return; // Evitar multiples guardados, que se dispare dos veces el guardado si ya está en proceso
    setIsSaving(true); // Inicia el proceso de guardado
  };

  const limpiarNewSelection = () => {
    setSeleccionesAplicaArticulos({});  // Limpiar las selecciones de los artículos
    setSelectedOption({});  // Limpiar cualquier opción seleccionada
};

 

  
 

 






  






//   const handleGuardarCambios = () => {
//     if (isSaving) return;  // Evitar guardar si ya está en proceso
  
//     setIsSaving(true);  // Bloquear hasta que termine de guardar
//     console.log('Intentando guardar cambios...');

//     Aquí tomamos el valor más actualizado de seleccionesAplicaArticulos
//     const currentSelections = seleccionesAplicaArticulos; // Captura el valor actual

//     console.log('Selecciones actuales:', currentSelections);
  
//     Validar que los datos contengan los campos necesarios antes de enviarlos
//     const dataToSend = Object.values(currentSelections);
  
//     if (!currentSelections || dataToSend.length === 0) {
//       console.error('No hay datos para enviar. Verifica las selecciones.');
//       setIsSaving(false);  // Desbloquear si no hay datos
//       return;
//     }
  
//     const validData = dataToSend.every(articulo => 
//       articulo.articuloId !== undefined && 
//       articulo.empresaId !== undefined && 
//       articulo.locacionId !== undefined && 
//       articulo.fechaRegistro !== undefined && 
//       articulo.selectAplica !== undefined
//     );
  
//     if (!validData) {
//       console.error("Datos inválidos en seleccionesAplicaArticulos.");
//       setIsSaving(false);  // Desbloquear si los datos no son válidos
//       return;
//     }
  
//     console.log('Datos a enviar:', dataToSend);
  
//     updateAplicaArticulo(dataToSend)
//       .then((response) => {
//         console.log("Cambios guardados exitosamente:", response);
//         limpiarNewSelection(); // Limpiar la selección después de guardar
//         alert("Cambios guardados exitosamente."); // Mensaje de confirmación
//         navigate('/matriz-legal-ar/normas'); // Cambia la ruta si es necesario
//       })
//       .catch((error) => {
//         console.error("Error al guardar los cambios:", error);
//       })
//       .finally(() => {
//         setIsSaving(false);  // Desbloquear después de guardar
//       });
// };




  // const handleGuardarCambios = () => {
  //   if (isSaving) return;  // Evitar guardar si ya está en proceso
  
  //   setIsSaving(true);  // Bloquear hasta que termine de guardar
  //   console.log('Intentando guardar cambios...');
  //   console.log('Selecciones actuales:', seleccionesAplicaArticulos);
  
  //   // Validar que los datos contengan los campos necesarios antes de enviarlos
  //   const dataToSend = Object.values(seleccionesAplicaArticulos);
  
  //   if (!seleccionesAplicaArticulos || dataToSend.length === 0) {
  //     console.error('No hay datos para enviar. Verifica las selecciones.');
  //     setIsSaving(false);  // Desbloquear si no hay datos
  //     return;
  //   }
  
  //   const validData = dataToSend.every(articulo => 
  //     articulo.articuloId !== undefined && 
  //     articulo.empresaId !== undefined && 
  //     articulo.locacionId !== undefined && 
  //     articulo.fechaRegistro !== undefined && 
  //     articulo.selectAplica !== undefined
  //   );
  
  //   if (!validData) {
  //     console.error("Datos inválidos en seleccionesAplicaArticulos.");
  //     setIsSaving(false);  // Desbloquear si los datos no son válidos
  //     return;
  //   }
  
  //   console.log('Datos a enviar:', dataToSend);
  
  //   updateAplicaArticulo(dataToSend)
  //     .then((response) => {
  //       console.log("Cambios guardados exitosamente:", response);
  //       limpiarNewSelection(); // Limpiar la selección después de guardar
  //       alert("Cambios guardados exitosamente."); // Mensaje de confirmación
  //       navigate('/matriz-legal-ar/normas'); // Cambia la ruta si es necesario
  //     })
  //     .catch((error) => {
  //       console.error("Error al guardar los cambios:", error);
  //     })
  //     .finally(() => {
  //       setIsSaving(false);  // Desbloquear después de guardar
  //     });
  // };


  
  














// version anterior
  // const handleGuardarCambios = useCallback(() => {

  //   if (isSaving) return;  // Evitar guardar si ya está en proceso, ver de sacarla si no funciona bien

  //   setIsSaving(true);  // Bloquear hasta que termine de guardar,  ver de sacarla si no funciona bien
  //   console.log('Intentando guardar cambios...');
  //   console.log('Selecciones actuales:', seleccionesAplicaArticulos);
  
  //   // Validar que los datos contengan los campos necesarios antes de enviarlos
  //   const dataToSend = Object.values(seleccionesAplicaArticulos);
  
  //   // Valida si el estado aún está vacío
  //   if (!seleccionesAplicaArticulos || dataToSend.length === 0) {
  //     console.error('No hay datos para enviar. Verifica las selecciones.');
  //     return;
  //   }
  
  //   const validData = dataToSend.every(articulo => 
  //     articulo.articuloId !== undefined && //!== undefined
  //     articulo.empresaId  !== undefined && //!== undefined
  //     articulo.locacionId !== undefined && //!== undefined
  //     articulo.fechaRegistro !== undefined && //!== undefined
  //     articulo.selectAplica !== undefined
  //   );
  
  //   if (!validData) {
  //     console.error("Datos inválidos en seleccionesAplicaArticulos.");
  //     setIsSaving(false);  // Desbloquear si los datos no son válidos
  //     return;
  //   }
  
  //   console.log('Datos a enviar:', dataToSend);
  
  //   // Llamada a la API para guardar los datos
  //   updateAplicaArticulo(dataToSend)
  //     .then((response) => {
  //       console.log("Cambios guardados exitosamente:", response);
          
  //       limpiarNewSelection(); // Limpiar la selección después de guardar
  //       alert("Cambios guardados exitosamente."); // Mensaje de confirmación
  //       navigate('/matriz-legal-ar/normas'); // Cambia '/ruta-inicial' por la ruta que desees
        
  
  //     })
  //     .catch((error) => {
  //       console.error("Error al guardar los cambios:", error);
  //     })

  //     .finally(() => {
  //       setIsSaving(false);  // Desbloquear después de guardar
  //     });
  
  // }, [seleccionesAplicaArticulos]);  // El segundo argumento es la dependencia

  
  // // Limpiar las selecciones de los artículos y las opciones seleccionadas
  // const limpiarNewSelection = () => {
  //   setSeleccionesAplicaArticulos({});  // Limpiar las selecciones de los artículos
  //   setSelectedOption({});  // Limpiar cualquier opción seleccionada
  // };
  


  
  const handleCategoriaSearchChange = (e) => {
    handleSearchChange(e, setSearchCategoria, setFilteredCategorias, categorias, 'categoria_norma');
  };

  const handleNormaSearchChange = (e) => {
    handleSearchChange(e, setSearchNorma, setFilteredNormas, normas, 'nombre');
  };

  const handleJurisdiccionSearchChange = (e) => {
    handleSearchChange(e, setSearchJurisdiccion, setFilteredJurisdicciones, jurisdicciones, 'jurisdiccion');
  };

  const handleCategoriaSelect = (id) => {
    const rawId = id.replace(/^cat/, '');
    setSelectedCategoria(BigInt(rawId));
    onCategoriaClose();
  };

  const handleNormaSelect = (id) => {
    const rawId = id.replace(/^norm/, '');
    setSelectedNorma(BigInt(rawId));
    onNormaClose();
  };

  const handleJurisdiccionSelect = (id) => {
    const rawId = id.replace(/^jur/, '');
    setSelectedJurisdiccion(BigInt(rawId));
    onJurisdiccionClose();
  };

  const handleSelectFromResults = async (id) => {
    try {
      // Ejecuta la consulta para obtener la norma por ID
      const response = await getNormaById(BigInt(id));
      
      if (response.data) {
        // Actualiza con los artículos obtenidos
        setArticuloData(response.data);
        setSelectedNorma(BigInt(id));  // Marca la norma seleccionada
        setSelectedView('articulos');  // Cambia a la vista de artículos
  
        // Encontrar los detalles de la norma seleccionada
        const selectedNormaDetail = response.data[0]; // Asumiendo que el primer resultado es el detalle de la norma
  
        // Actualizar el resultado con el nombre y el resumen de la norma
        if (selectedNormaDetail) {
          setResultText(
            <Box>
              <Text>
                <strong>Norma:</strong> {selectedNormaDetail.nombre_norma}
              </Text>
              <Text mt={2}>
                <strong>Resumen:</strong> {selectedNormaDetail.resumen_norma}
              </Text>
            </Box>
          );

          // Actualiza el estado con el enlace de la norma para usarlo en el botón
          setEnlaceNorma(selectedNormaDetail.enlace_norma); // Guardamos el enlace_norma
        }
  
        // Resetea las categorías o jurisdicciones, según corresponda
        if (selectedView === 'categorias') {
          setSelectedCategoria(BigInt(id));  // Actualiza la categoría seleccionada
          setSelectedJurisdiccion('');  // Limpia la jurisdicción seleccionada
          setResultText('');
        } else if (selectedView === 'jurisdicciones') {
          setSelectedJurisdiccion(BigInt(id));  // Actualiza la jurisdicción seleccionada
          setSelectedCategoria('');  // Limpia la categoría seleccionada
          setResultText('');
        }
  
      }
    } catch (error) {
      console.error('Error fetching normas:', error);
    }
  };


  




  //este elemento le corresponde a cuando se aplica de forma masiva la selección aplica o no en los articulos
  // const handleSelectionChange = (event) => {
  //   console.log("Selecciones recibidas desde Articulos:", selecciones);
  //   setSelectedOption(event.target.value); // Almacena la selección del desplegable
  // };


  
  


  
  


  



  const handleSelectionAplicaChange = (newSelection) => {
    if (!newSelection) return;
  
    // Normalizamos la estructura de newSelection
    const normalizedSelection = Object.keys(newSelection).reduce((acc, key) => {
      acc[key] = {
        ...newSelection[key],
        selectAplica: newSelection[key].selectAplica || newSelection[key].select_aplica // Unificar los campos
      };
      return acc;
    }, {});
  
    console.log("Nuevas selecciones individuales recibidas (normalizadas):", normalizedSelection);
  
    setSeleccionesAplicaArticulos(prevState => ({ //acá toqué setSeleccionesAplicaArticulos
      ...prevState,
      ...normalizedSelection
    }));
  };
  

  


  return (
    <Box>
      {/* Bloque de filtros y resultados como un subheader */}
      <Box
        ref={subheaderRef}
        position={isSticky ? 'fixed' : 'relative'}
        top={isSticky ? '0' : 'initial'}
        zIndex="100"
        bg="white"
        shadow={isSticky ? 'md' : 'none'}
        w="100%"
        p={2}
        size="sm"
        borderBottom="1px solid #e2e8f0"
        maxWidth="1150px"
      >
        {/* Mostrar u ocultar la sección de filtros dependiendo de isSticky */}
        {!isSticky && (
          <VStack align="start" spacing={2} mb={2} w="full">
            <HStack w="full" justifyContent="space-between">
              <Heading size="sd">Búsqueda de Normas Legales</Heading>
              <HStack spacing={2} size="sm">
                <PopoverComponent
                  isOpen={isCategoriaOpen}
                  onOpen={onCategoriaOpen}
                  onClose={onCategoriaClose}
                  searchValue={searchCategoria}
                  handleSearchChange={handleCategoriaSearchChange}
                  filteredItems={filteredCategorias}
                  handleSelect={handleCategoriaSelect}
                  placeholder="Buscar categoría"
                  selectedId={selectedCategoria}
                  itemKey="categoria_norma"
                  prefix="cat"
                />
                <PopoverComponent
                  isOpen={isNormaOpen}
                  onOpen={onNormaOpen}
                  onClose={onNormaClose}
                  searchValue={searchNorma}
                  handleSearchChange={handleNormaSearchChange}
                  filteredItems={filteredNormas}
                  handleSelect={handleNormaSelect}
                  placeholder="Buscar norma"
                  selectedId={selectedNorma}
                  itemKey="nombre"
                  prefix="norm"
                />
                <PopoverComponent
                  isOpen={isJurisdiccionOpen}
                  onOpen={onJurisdiccionOpen}
                  onClose={onJurisdiccionClose}
                  searchValue={searchJurisdiccion}
                  handleSearchChange={handleJurisdiccionSearchChange}
                  filteredItems={filteredJurisdicciones}
                  handleSelect={handleJurisdiccionSelect}
                  placeholder="Buscar jurisdicción"
                  selectedId={selectedJurisdiccion}
                  itemKey="jurisdiccion"
                  prefix="jur"
                />
              </HStack>
            </HStack>
          </VStack>
        )}
        {/* La sección que siempre debe mostrarse con el resultado de la normativa seleccionada */}
        {resultText && (
          <Box p={1} mt={1} bg="gray.100" borderRadius="md" w="full">
            {resultText}
          </Box>
        )}
      </Box>


      {/* Contenido que puede desplazarse */}
      <Box p={4}>
        {selectedView === 'categorias' && (
          <Categorias data={filteredCategorias} onSelectCategoria={handleSelectFromResults} />
        )}
        {selectedView === 'jurisdicciones' && (
          <Jurisdicciones data={filteredJurisdicciones} onSelectJurisdiccion={handleSelectFromResults} />
        )}
        {selectedView === 'articulos' && (
          <Articulos
          data={articuloData}
          onSelectionChange={handleSelectionAplicaChange}
          limpiarNewSelection={limpiarNewSelection}
          setSeleccionesParent={setSeleccionesParent} // PASAMOS ESTA FUNCIÓN
          setSeleccionesAplicaArticulos={setSeleccionesAplicaArticulos}  // Aquí pasas la prop
          seleccionMasiva={seleccionesParent} // Pasar la selección masiva
        />
        )}
      </Box>
    </Box>
  );
};

export default LegalMatrizAr;
