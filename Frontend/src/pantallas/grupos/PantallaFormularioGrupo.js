import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as grupoApi from '../../api/grupoApi';
import CampoTexto from '../../componentes/CampoTexto';
import BotonAnimado from '../../componentes/BotonAnimado';
import Cargando from '../../componentes/Cargando';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado } from '../../tema/colores';

const LIMITES = {
  nombreMin: 2,
  nombreMax: 80,
  descripcionMax: 300,
};

const PantallaFormularioGrupo = ({ route, navigation }) => {
  const grupoId = route.params?.grupoId;
  const esEdicion = !!grupoId;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(esEdicion);

  const { mostrarAlerta } = useAlerta();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: esEdicion ? 'Editar grupo' : 'Nuevo grupo',
    });
  }, [esEdicion, navigation]);

  useEffect(() => {
    const cargar = async () => {
      if (!esEdicion) {
        return;
      }
      try {
        const { grupo } = await grupoApi.obtenerGrupo(grupoId);
        setNombre(grupo.nombre);
        setDescripcion(grupo.descripcion || '');
      } catch (error) {
        mostrarAlerta('Error', 'No se pudo cargar el grupo', 'error');
        navigation.goBack();
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [grupoId]);

  const manejarGuardar = async () => {
    const nombreLimpio = nombre.trim();
    const descripcionLimpia = descripcion.trim();

    if (!nombreLimpio) {
      mostrarAlerta('Falta el nombre', 'El nombre es obligatorio.', 'advertencia');
      return;
    }
    if (nombreLimpio.length < LIMITES.nombreMin) {
      mostrarAlerta(
        'Nombre muy corto',
        `El nombre debe tener al menos ${LIMITES.nombreMin} caracteres.`,
        'advertencia'
      );
      return;
    }

    setGuardando(true);
    try {
      if (esEdicion) {
        await grupoApi.actualizarGrupo(grupoId, {
          nombre: nombreLimpio,
          descripcion: descripcionLimpia,
        });
      } else {
        await grupoApi.crearGrupo({
          nombre: nombreLimpio,
          descripcion: descripcionLimpia,
        });
      }
      navigation.goBack();
    } catch (error) {
      mostrarAlerta(
        'Error',
        error.response?.data?.mensaje || 'No se pudo guardar el grupo',
        'error'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Cargando grupo..." />;

  return (
    <View style={estilos.contenedor}>
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <Text style={estilos.titulo}>
          {esEdicion ? 'Editar grupo' : 'Crear nuevo grupo'}
        </Text>
        <Text style={estilos.subtitulo}>
          {esEdicion
            ? 'Modifica el nombre o la descripción'
            : 'Agrupa tus recetas por categoría'}
        </Text>

        <CampoTexto
          etiqueta={`Nombre del grupo (${nombre.length}/${LIMITES.nombreMax})`}
          icono="folder-outline"
          placeholder="Ej: Postres"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="sentences"
          sinEspaciosIniciales
          maxDigitos={LIMITES.nombreMax}
        />

        <CampoTexto
          etiqueta={`Descripción (opcional) (${descripcion.length}/${LIMITES.descripcionMax})`}
          icono="document-text-outline"
          placeholder="Ej: Recetas dulces para el postre"
          value={descripcion}
          onChangeText={setDescripcion}
          autoCapitalize="sentences"
          maxDigitos={LIMITES.descripcionMax}
          multiline
          numberOfLines={3}
        />

        <BotonAnimado
          titulo={esEdicion ? 'Guardar cambios' : 'Crear grupo'}
          icono={esEdicion ? 'checkmark' : 'add-circle-outline'}
          onPress={manejarGuardar}
          cargando={guardando}
          style={{ marginTop: espaciado.lg }}
        />
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoCremoso },
  scroll: { padding: espaciado.lg, paddingBottom: espaciado.xxl },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: colores.texto,
    marginBottom: espaciado.xs,
    letterSpacing: -0.3,
  },
  subtitulo: {
    fontSize: 14,
    color: colores.textoGris,
    marginBottom: espaciado.lg,
  },
});

export default PantallaFormularioGrupo;