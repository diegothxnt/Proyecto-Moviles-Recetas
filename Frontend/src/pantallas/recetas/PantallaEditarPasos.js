import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EntradaPaso from '../../componentes/EntradaPaso';
import BotonAnimado from '../../componentes/BotonAnimado';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado, sombras } from '../../tema/colores';

const MAX_PASOS = 50;

const PantallaEditarPasos = ({ route, navigation }) => {
  const iniciales = route.params?.pasos || [''];
  const onSave = route.params?.onSave;

  const [pasos, setPasos] = useState(iniciales);
  const { mostrarAlerta } = useAlerta();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Pasos (${pasos.length})`,
    });
  }, [navigation, pasos.length]);

  const agregar = () => {
    if (pasos.length >= MAX_PASOS) {
      mostrarAlerta(
        'Límite alcanzado',
        `Máximo ${MAX_PASOS} pasos.`,
        'advertencia'
      );
      return;
    }
    setPasos([...pasos, '']);
  };

  const actualizar = (i, val) => {
    const copia = [...pasos];
    copia[i] = val;
    setPasos(copia);
  };

  const eliminar = (i) => {
    if (pasos.length === 1) {
      mostrarAlerta('Aviso', 'Debes tener al menos un paso.', 'advertencia');
      return;
    }
    setPasos(pasos.filter((_, idx) => idx !== i));
  };

  const guardarYVolver = () => {
    const conTexto = pasos.filter((p) => p.trim());
    if (conTexto.length === 0) {
      mostrarAlerta(
        'Sin pasos',
        'Agrega al menos un paso con descripción.',
        'advertencia'
      );
      return;
    }

    if (typeof onSave === 'function') {
      onSave(pasos);
    }
    navigation.goBack();
  };

  return (
    <View style={estilos.contenedor}>
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.header}>
          <Text style={estilos.titulo}>Pasos de preparación</Text>
          <Text style={estilos.subtitulo}>
            {pasos.length}/{MAX_PASOS}
          </Text>
        </View>

        {pasos.map((paso, i) => (
          <EntradaPaso
            key={i}
            index={i}
            paso={paso}
            onChange={(val) => actualizar(i, val)}
            onEliminar={() => eliminar(i)}
          />
        ))}

        <TouchableOpacity style={estilos.botonAgregar} onPress={agregar}>
          <Ionicons name="add-circle" size={22} color={colores.primario} />
          <Text style={estilos.botonAgregarTexto}>Agregar paso</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={estilos.footer}>
        <BotonAnimado
          titulo="Listo"
          icono="checkmark-circle-outline"
          onPress={guardarYVolver}
        />
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoGris },
  scroll: { padding: espaciado.md, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.md,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.3,
  },
  subtitulo: { fontSize: 13, color: colores.textoGris, fontWeight: '600' },
  botonAgregar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    paddingVertical: espaciado.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colores.primario,
    borderStyle: 'dashed',
    marginTop: espaciado.md,
  },
  botonAgregarTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.primario,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: espaciado.md,
    backgroundColor: colores.fondo,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
    ...sombras.media,
  },
});

export default PantallaEditarPasos;