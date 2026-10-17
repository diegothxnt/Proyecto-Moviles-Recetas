import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as recetaApi from '../../api/recetaApi';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import TarjetaReceta from '../../componentes/TarjetaReceta';
import ModalSeleccionGrupos from '../../componentes/ModalSeleccionGrupos';
import EstadoVacio from '../../componentes/EstadoVacio';
import Cargando from '../../componentes/Cargando';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado, radios, sombras } from '../../tema/colores';

const PantallaRecetasGenerales = ({ navigation }) => {
  const { usuario } = useAutenticacion();
  const { mostrarAlerta, mostrarConfirmacion, mostrarOpciones } = useAlerta();

  const [recetas, setRecetas] = useState([]);
  const [recetasFiltradas, setRecetasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalGrupos, setModalGrupos] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  const cargar = async (silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const data = await recetaApi.obtenerRecetasGenerales();
      setRecetas(data);
      setRecetasFiltradas(data);
    } catch (error) {
      mostrarAlerta('Error', 'No se pudieron cargar las recetas', 'error');
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

  
  const manejarBusqueda = (texto) => {
    setBusqueda(texto);
    const t = texto.trim().toLowerCase();
    if (!t) {
      setRecetasFiltradas(recetas);
      return;
    }
    const filtradas = recetas.filter(
      (r) =>
        r.titulo.toLowerCase().includes(t) ||
        (r.descripcion && r.descripcion.toLowerCase().includes(t)) ||
        (r.categoria && r.categoria.toLowerCase().includes(t)) ||
        (r.etiquetas && r.etiquetas.some((e) => e.toLowerCase().includes(t)))
    );
    setRecetasFiltradas(filtradas);
  };

  const manejarLongPress = (receta) => {
    const esMia = receta.autor?._id?.toString() === usuario?._id?.toString();

    if (!esMia) {
      mostrarAlerta(
        receta.titulo,
        'Esta receta pertenece a otro usuario. Solo puedes verla.',
        'info'
      );
      return;
    }

    mostrarOpciones({
      titulo: receta.titulo,
      subtitulo: '¿Qué quieres hacer?',
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
      mensaje: `¿Seguro que quieres eliminar "${receta.titulo}"?`,
      textoConfirmar: 'Eliminar',
      textoCancelar: 'Cancelar',
      tipo: 'peligro',
    });
    if (!confirmado) return;

    try {
      await recetaApi.borrarReceta(receta._id);
      cargar(true);
      mostrarAlerta('Éxito', 'La receta se eliminó.', 'exito');
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo eliminar', 'error');
    }
  };

  if (cargando) return <Cargando mensaje="Cargando recetas..." />;

  return (
    <View style={estilos.contenedor}>
      {/*  Barra de búsqueda */}
      <View style={estilos.barraBusqueda}>
        <View style={estilos.inputBusqueda}>
          <Ionicons name="search" size={20} color={colores.textoGris} />
          <TextInput
            style={estilos.inputBusquedaTexto}
            placeholder="Buscar recetas..."
            placeholderTextColor={colores.textoClaro}
            value={busqueda}
            onChangeText={manejarBusqueda}
            selectionColor={colores.primario}
            cursorColor={colores.primario}
            caretHidden={false}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity
              onPress={() => manejarBusqueda('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colores.textoGris}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {recetas.length === 0 ? (
        <EstadoVacio
          icono="globe-outline"
          titulo="Sin recetas públicas"
          mensaje="Cuando alguien comparta una receta, aparecerá aquí."
        />
      ) : recetasFiltradas.length === 0 ? (
        <EstadoVacio
          icono="search-outline"
          titulo="Sin resultados"
          mensaje={`No encontramos recetas que coincidan con "${busqueda}".`}
        />
      ) : (
        <FlatList
          data={recetasFiltradas}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const esMia =
              item.autor?._id?.toString() === usuario?._id?.toString();
            return (
              <View>
                <TarjetaReceta
                  receta={item}
                  onPress={() =>
                    navigation.navigate('DetalleReceta', {
                      recetaId: item._id,
                    })
                  }
                  onLongPress={() => manejarLongPress(item)}
                />
                {item.autor?.nombre && (
                  <Text style={estilos.autor}>
                    {esMia ? 'Tu receta' : `por ${item.autor.nombre}`}
                  </Text>
                )}
              </View>
            );
          }}
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
  barraBusqueda: {
    backgroundColor: colores.fondo,
    paddingHorizontal: espaciado.md,
    paddingTop: espaciado.md,
    paddingBottom: espaciado.sm,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  inputBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    backgroundColor: colores.fondoGris,
    borderRadius: radios.md,
    paddingHorizontal: espaciado.md,
    minHeight: 46,
    ...sombras.suave,
  },
  inputBusquedaTexto: {
    flex: 1,
    fontSize: 15,
    color: colores.texto,
    paddingVertical: 10,
  },
  lista: { padding: espaciado.md },
  autor: {
    fontSize: 12,
    color: colores.textoGris,
    marginTop: -espaciado.xs,
    marginBottom: espaciado.sm,
    marginLeft: espaciado.md,
    fontStyle: 'italic',
  },
});

export default PantallaRecetasGenerales;