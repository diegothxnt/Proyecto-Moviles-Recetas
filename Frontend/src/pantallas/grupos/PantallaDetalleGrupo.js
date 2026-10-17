import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as grupoApi from '../../api/grupoApi';
import * as recetaApi from '../../api/recetaApi';
import TarjetaReceta from '../../componentes/TarjetaReceta';
import EstadoVacio from '../../componentes/EstadoVacio';
import Cargando from '../../componentes/Cargando';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado } from '../../tema/colores';

const PantallaDetalleGrupo = ({ route, navigation }) => {
  const { grupoId } = route.params;
  const [grupo, setGrupo] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const { mostrarAlerta, mostrarConfirmacion, mostrarOpciones } = useAlerta();

  const cargarGrupo = async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const { grupo, recetas } = await grupoApi.obtenerGrupo(grupoId);
      setGrupo(grupo);
      setRecetas(recetas);
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo cargar el grupo', 'error');
      navigation.goBack();
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarGrupo();
    }, [grupoId])
  );

  // Header con botones editar y borrar
  useLayoutEffect(() => {
    navigation.setOptions({
      title: grupo?.nombre || 'Grupo',
      headerRight: () => (
        <View style={estilos.headerBotones}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FormularioGrupo', { grupoId })
            }
            style={estilos.headerBoton}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color={colores.primario}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmarBorrado}
            style={estilos.headerBoton}
          >
            <Ionicons name="trash-outline" size={22} color={colores.error} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, grupo]);

  const confirmarBorrado = async () => {
    try {
      const preview = await grupoApi.previsualizarBorradoGrupo(grupoId);
      const { totalRecetas, recetasTambienEnOtrosGrupos } = preview;

      let mensaje = 'Esta acción no se puede deshacer.\n\n';
      if (totalRecetas > 0) {
        mensaje += `Se eliminarán ${totalRecetas} ${
          totalRecetas === 1 ? 'receta' : 'recetas'
        } de este grupo.\n`;
        if (recetasTambienEnOtrosGrupos > 0) {
          mensaje += ` ${recetasTambienEnOtrosGrupos} de ${
            recetasTambienEnOtrosGrupos === 1 ? 'ella está' : 'ellas están'
          } también en otros grupos, y también ${
            recetasTambienEnOtrosGrupos === 1
              ? 'será eliminada'
              : 'serán eliminadas'
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

      const resultado = await grupoApi.borrarGrupo(grupoId);
      mostrarAlerta(
        'Grupo eliminado',
        `Se eliminaron ${resultado.recetasBorradas} receta(s).`,
        'exito'
      );
      navigation.goBack();
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo eliminar el grupo', 'error');
    }
  };

  const manejarLongPress = (receta) => {
    mostrarOpciones({
      titulo: receta.titulo,
      subtitulo: '¿Qué quieres hacer con esta receta?',
      opciones: [
        {
          texto: 'Editar receta',
          icono: 'create-outline',
          onPress: () =>
            navigation.navigate('Recetas', {
              screen: 'FormularioReceta',
              params: { recetaId: receta._id },
            }),
        },
        {
          texto: 'Quitar de este grupo',
          icono: 'exit-outline',
          onPress: () => confirmarQuitarDeGrupo(receta),
        },
        {
          texto: 'Eliminar receta',
          icono: 'trash-outline',
          destructivo: true,
          onPress: () => confirmarEliminarReceta(receta),
        },
      ],
    });
  };

  const confirmarQuitarDeGrupo = async (receta) => {
    const confirmado = await mostrarConfirmacion({
      titulo: 'Quitar del grupo',
      mensaje: `"${receta.titulo}" se desvinculará de "${grupo.nombre}" pero no se eliminará.`,
      textoConfirmar: 'Quitar',
      textoCancelar: 'Cancelar',
      tipo: 'advertencia',
    });
    if (!confirmado) return;

    try {
      await recetaApi.quitarRecetaDeGrupo(receta._id, grupoId);
      cargarGrupo(true);
      mostrarAlerta('Receta quitada', 'La receta ya no está en este grupo.', 'exito');
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo quitar del grupo', 'error');
    }
  };

  const confirmarEliminarReceta = async (receta) => {
    const confirmado = await mostrarConfirmacion({
      titulo: 'Eliminar receta',
      mensaje: `¿Seguro que quieres eliminar "${receta.titulo}"? Se eliminará de TODOS los grupos donde esté.`,
      textoConfirmar: 'Eliminar',
      textoCancelar: 'Cancelar',
      tipo: 'peligro',
    });
    if (!confirmado) return;

    try {
      await recetaApi.borrarReceta(receta._id);
      cargarGrupo(true);
      mostrarAlerta('Receta eliminada', 'Se eliminó correctamente.', 'exito');
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo eliminar la receta', 'error');
    }
  };

  if (cargando) return <Cargando mensaje="Cargando grupo..." />;

  return (
    <View style={estilos.contenedor}>
      {grupo?.descripcion ? (
        <View style={estilos.cabecera}>
          <Text style={estilos.descripcion}>{grupo.descripcion}</Text>
          <View style={estilos.contadorFila}>
            <Ionicons
              name="restaurant-outline"
              size={14}
              color={colores.textoGris}
            />
            <Text style={estilos.contadorTexto}>
              {recetas.length} {recetas.length === 1 ? 'receta' : 'recetas'}
            </Text>
          </View>
        </View>
      ) : recetas.length > 0 ? (
        <View style={estilos.cabecera}>
          <View style={estilos.contadorFila}>
            <Ionicons
              name="restaurant-outline"
              size={14}
              color={colores.textoGris}
            />
            <Text style={estilos.contadorTexto}>
              {recetas.length} {recetas.length === 1 ? 'receta' : 'recetas'}
            </Text>
          </View>
        </View>
      ) : null}

      {recetas.length === 0 ? (
        <EstadoVacio
          icono="restaurant-outline"
          titulo="Grupo vacío"
          mensaje="Agrega recetas a este grupo desde el detalle de cada receta o manteniéndolas presionadas en Mis Recetas."
        />
      ) : (
        <FlatList
          data={recetas}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TarjetaReceta
              receta={item}
              onPress={() =>
                navigation.navigate('Recetas', {
                  screen: 'DetalleReceta',
                  params: { recetaId: item._id },
                })
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
                cargarGrupo(true);
              }}
              colors={[colores.primario]}
              tintColor={colores.primario}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoGris },
  cabecera: {
    padding: espaciado.md,
    backgroundColor: colores.fondo,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  descripcion: {
    fontSize: 14,
    color: colores.textoSuave,
    lineHeight: 20,
    marginBottom: espaciado.sm,
  },
  contadorFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contadorTexto: {
    fontSize: 12,
    color: colores.textoGris,
    fontWeight: '600',
  },
  lista: { padding: espaciado.md },
  headerBotones: { flexDirection: 'row', gap: espaciado.sm },
  headerBoton: { padding: espaciado.xs },
});

export default PantallaDetalleGrupo;