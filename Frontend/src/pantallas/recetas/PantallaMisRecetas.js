import React, { useState, useCallback, useLayoutEffect, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  BackHandler,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as recetaApi from '../../api/recetaApi';
import TarjetaReceta from '../../componentes/TarjetaReceta';
import ModalSeleccionGrupos from '../../componentes/ModalSeleccionGrupos';
import EstadoVacio from '../../componentes/EstadoVacio';
import Cargando from '../../componentes/Cargando';
import { useAlerta } from '../../contexto/AlertasContexto';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import { vibrarMedio } from '../../utilidades/haptics';
import { colores, espaciado, sombras } from '../../tema/colores';

const PantallaMisRecetas = ({ navigation }) => {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalGrupos, setModalGrupos] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  const { mostrarAlerta, mostrarConfirmacion, mostrarOpciones } = useAlerta();
  const { cerrarSesion } = useAutenticacion();

  
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideIn, {
        toValue: 0,
        speed: 12,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mis recetas',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('RecetasGenerales')}
          style={estilos.headerBoton}
        >
          <Ionicons name="globe-outline" size={22} color={colores.primario} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  
  useFocusEffect(
    useCallback(() => {
      const alPresionarAtras = () => {
        if (Platform.OS !== 'android') return false;

        mostrarConfirmacion({
          titulo: 'Cerrar sesión',
          mensaje: '¿Seguro que quieres cerrar sesión en App Recetas?',
          textoConfirmar: 'Cerrar sesión',
          textoCancelar: 'Cancelar',
          tipo: 'advertencia',
        }).then((confirmado) => {
          if (confirmado) {
            cerrarSesion();   
          }
        });

        return true;
      };

      const suscripcion = BackHandler.addEventListener(
        'hardwareBackPress',
        alPresionarAtras
      );
      return () => suscripcion.remove();
    }, [mostrarConfirmacion, cerrarSesion])
  );

  const cargar = async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const data = await recetaApi.obtenerMisRecetas();
      setRecetas(data);
    } catch (error) {
      mostrarAlerta(
        'Error al cargar',
        'No se pudieron cargar tus recetas. Intenta de nuevo.',
        'error'
      );
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const manejarLongPress = (receta) => {
    vibrarMedio();
    mostrarOpciones({
      titulo: receta.titulo,
      subtitulo: '¿Qué quieres hacer con esta receta?',
      opciones: [
        {
          texto: 'Editar',
          icono: 'create-outline',
          onPress: () =>
            navigation.navigate('FormularioReceta', { recetaId: receta._id }),
        },
        {
          texto: 'Agregar a grupo',
          icono: 'folder-outline',
          onPress: () => {
            setRecetaSeleccionada(receta);
            setModalGrupos(true);
          },
        },
        {
          texto: 'Eliminar',
          icono: 'trash-outline',
          destructivo: true,
          onPress: () => confirmarEliminar(receta),
        },
      ],
    });
  };

  const confirmarEliminar = async (receta) => {
    const confirmado = await mostrarConfirmacion({
      titulo: 'Eliminar receta',
      mensaje: `¿Seguro que quieres eliminar "${receta.titulo}"? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      textoCancelar: 'Cancelar',
      tipo: 'peligro',
    });
    if (!confirmado) return;

    try {
      await recetaApi.borrarReceta(receta._id);
      cargar(true);
      mostrarAlerta(
        'Receta eliminada',
        'La receta se eliminó correctamente.',
        'exito'
      );
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo eliminar la receta', 'error');
    }
  };

  if (cargando) return <Cargando mensaje="Cargando recetas..." />;

  return (
    <View style={estilos.contenedor}>
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeIn,
          transform: [{ translateY: slideIn }],
        }}
      >
        {recetas.length === 0 ? (
          <EstadoVacio
            icono="restaurant-outline"
            titulo="Sin recetas todavía"
            mensaje="Toca el botón + para crear tu primera receta."
          />
        ) : (
          <FlatList
            data={recetas}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TarjetaReceta
                receta={item}
                onPress={() =>
                  navigation.navigate('DetalleReceta', { recetaId: item._id })
                }
                onLongPress={() => manejarLongPress(item)}
              />
            )}
            contentContainerStyle={estilos.lista}
            refreshControl={
              <RefreshControl
                refreshing={refrescando}
                onRefresh={() => {
                  setRefrescando(true);
                  cargar(true);
                }}
                colors={[colores.primario]}
                tintColor={colores.primario}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>

      <TouchableOpacity
        style={estilos.fab}
        onPress={() => navigation.navigate('FormularioReceta')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <ModalSeleccionGrupos
        visible={modalGrupos}
        receta={recetaSeleccionada}
        onCerrar={() => {
          setModalGrupos(false);
          setRecetaSeleccionada(null);
        }}
        onGuardado={() => cargar(true)}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoGris },
  lista: { padding: espaciado.md, paddingBottom: 100 },
  headerBoton: { padding: espaciado.xs },
  fab: {
    position: 'absolute',
    right: espaciado.lg,
    bottom: espaciado.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    ...sombras.fuerte,
  },
});

export default PantallaMisRecetas;