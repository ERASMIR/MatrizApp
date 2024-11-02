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
  
  
// manejador de cambios en el desplegable para la selcción masiva
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

//maneja la actualización del estado de selectedOption en la selección masiva
  useEffect(() => {
    console.log("selectedOption ha cambiado:", selectedOption);
  }, [selectedOption]);

//maneja la actualización del estado de selectedOption en la selección masiva al momento de hacer clik
  const handleApplyClick = () => {
    // Asegúrate de que el estado de selectedOption esté actualizado
    setSelectedOption((prevOption) => {
      // Si el estado necesita cambiar de alguna manera, lo haces aquí
      const updatedOption = prevOption; // O algún cálculo si es necesario
      handleApplySelection(updatedOption); // Llama a handleApplySelection con el valor más reciente
      return updatedOption;
    });
  };

//maneja la actualización del estado de selectedOption en la selección masiva
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

    
    // **Aquí se asegura que el hijo refleje los cambios temporalmente**
    alert("Selección masiva exitosa.");
  };

//lee el scroll del mouse
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

//maneja la actualizacion del estado de seleccionesAplicaArticulos
  useEffect(() => {
    console.log('Estado actualizado, listo para guardar:', seleccionesAplicaArticulos);
  }, [seleccionesAplicaArticulos]);


//trae las opciones de si aplica o no desde la BBDD
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
            //maxWidth="1150px"
            //w="full"
            width="100%"
            p={1}
            display="flex"
            overflowY="auto"
            maxWidth={{ base: "100%", md: "calc(100% - 0px)" }} // Esto ajusta el contenedor cuando el sidebar tiene un ancho de 250px
          >
            <Box
              flex="2.4"
              mr={2}
              overflowY="auto"
              maxHeight="80px"  
              //maxWidth="1150px"        
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
                  Aplicar en toda la norma:
                </Text>
                <Select
                  placeholder="Seleccione"
                  fontSize="xs"
                  size="xs"
                  w="100px"
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
  
              <Box display="flex" overflowY="auto" mt={2} justifyContent="space-between" width="100%" align="right">
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


//Maneja el guardado de los datos de si aplica o no una norma en la BBDD
  const handleGuardarCambios = () => {
    if (isSaving) return; // Evitar multiples guardados, que se dispare dos veces el guardado si ya está en proceso
    setIsSaving(true); // Inicia el proceso de guardado
  };


//limpia la selección de si aplica o no un articulo
  const limpiarNewSelection = () => {
    setSeleccionesAplicaArticulos({});  // Limpiar las selecciones de los artículos
    setSelectedOption({});  // Limpiar cualquier opción seleccionada
};

 
  
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
        maxWidth="1215px"
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
