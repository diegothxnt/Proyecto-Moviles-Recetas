import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Animated,
  BackHandler,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as grupoApi from '../../api/grupoApi';
import TarjetaGrupo from '../../componentes/TarjetaGrupo';
import ModalSeleccionRecetas from '../../componentes/ModalSeleccionRecetas';
import EstadoVacio from '../../componentes/EstadoVacio';
import Cargando from '../../componentes/Cargando';
import { useAlerta } from '../../contexto/AlertasContexto';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import { vibrarMedio } from '../../utilidades/haptics';
import { colores, espaciado, sombras } from '../../tema/colores';

const PantallaListaGrupos = ({ navigation }) => {
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalRecetas, setModalRecetas] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

  const fadeFab = useRef(new Animated.Value(1)).current;
  const { mostrarAlerta, mostrarConfirmacion, mostrarOpciones } = useAlerta();
  const { cerrarSesion } = useAutenticacion();

  const cargarGrupos = async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const data = await grupoApi.obtenerMisGrupos();
      setGrupos(data);
    } catch (error) {
      mostrarAlerta(
        'Error al cargar',
        error.response?.data?.mensaje || 'No se pudieron cargar los grupos.',
        'error'
      );
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarGrupos();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const alPresionarAtras = () => {
        if (Platform.OS !== 'android') return false;
        mostrarConfirmacion({
          titulo: 'Cerrar sesión',
          mensaje: '¿Seguro que quieres cerrar sesión en Recetas?',
          textoConfirmar: 'Cerrar sesión',
          textoCancelar: 'Cancelar',
          tipo: 'advertencia',
        }).then((confirmado) => {
          if (confirmado) cerrarSesion();
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

  const alRefrescar = () => {
    setRefrescando(true);
    cargarGrupos(true);
  };

  const irACrearGrupo = () => {
    navigation.navigate('FormularioGrupo');
  };

  
  const manejarLongPress = (grupo) => {
    vibrarMedio();
    mostrarOpciones({
      titulo: grupo.nombre,
      subtitulo: '¿Qué quieres hacer con este grupo?',
      opciones: [
        {
          texto: 'Editar grupo',
          icono: 'create-outline',
          onPress: () =>
            navigation.navigate('FormularioGrupo', { grupoId: grupo._id }),
        },
        {
          texto: 'Agregar recetas',
          icono: 'add-circle-outline',
          onPress: () => {
            setGrupoSeleccionado(grupo);
            setModalRecetas(true);
          },
        },
        {
          texto: 'Borrar grupo',
          icono: 'trash-outline',
          destructivo: true,
          onPress: () => confirmarBorrar(grupo),
        },
      ],
    });
  };

  const confirmarBorrar = async (grupo) => {
    try {
      const preview = await grupoApi.previsualizarBorradoGrupo(grupo._id);
      const { totalRecetas, recetasTambienEnOtrosGrupos } = preview;

      let mensaje = 'Esta acción no se puede deshacer.\n\n';
      if (totalRecetas > 0) {
        mensaje += `Se eliminarán ${totalRecetas} ${
          totalRecetas === 1 ? 'receta' : 'recetas'
        } de este grupo.\n`;
        if (recetasTambienEnOtrosGrupos > 0) {
          mensaje += `⚠️ ${recetasTambienEnOtrosGrupos} también ${
            recetasTambienEnOtrosGrupos === 1 ? 'está' : 'están'
          } en otros grupos, y también ${
            recetasTambienEnOtrosGrupos === 1 ? 'será eliminada' : 'serán eliminadas'
          } de ahí.`;
        }
      } else {
        mensaje += 'El grupo está vacío.';
      }

      const confirmado = await mostrarConfirmacion({
        titulo: 'Eliminar grupo',
        mensaje,
        textoConfirmar: 'Eliminar',
        textoCancelar: 'Cancelar',
        tipo: 'peligro',
      });
      if (!confirmado) return;

      await grupoApi.borrarGrupo(grupo._id);
      cargarGrupos(true);
      mostrarAlerta('Grupo eliminado', 'Se eliminó correctamente.', 'exito');
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo eliminar el grupo', 'error');
    }
  };

  if (cargando) return <Cargando mensaje="Cargando grupos..." />;

  return (
    <View style={estilos.contenedor}>
      {grupos.length === 0 ? (
        <EstadoVacio
          icono="folder-open-outline"
          titulo="Sin grupos todavía"
          mensaje="Crea tu primer grupo para organizar tus recetas por categorías."
        />
      ) : (
        <FlatList
          data={grupos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TarjetaGrupo
              grupo={item}
              onPress={() =>
                navigation.navigate('DetalleGrupo', {
                  grupoId: item._id,
                  nombreInicial: item.nombre,
                })
              }
              onLongPress={() => manejarLongPress(item)}
            />
          )}
          contentContainerStyle={estilos.lista}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={alRefrescar}
              colors={[colores.primario]}
              tintColor={colores.primario}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <Animated.View
        style={[
          estilos.fab,
          { opacity: fadeFab, transform: [{ scale: fadeFab }] },
        ]}
      >
        <TouchableOpacity
          style={estilos.fabBoton}
          onPress={irACrearGrupo}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <ModalSeleccionRecetas
        visible={modalRecetas}
        grupo={grupoSeleccionado}
        onCerrar={() => {
          setModalRecetas(false);
          setGrupoSeleccionado(null);
        }}
        onGuardado={() => cargarGrupos(true)}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoGris },
  lista: { padding: espaciado.md, paddingBottom: 100 },
  fab: {
    position: 'absolute',
    right: espaciado.lg,
    bottom: espaciado.lg,
  },
  fabBoton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    ...sombras.fuerte,
  },
});

export default PantallaListaGrupos;