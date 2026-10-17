import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EntradaIngrediente from '../../componentes/EntradaIngrediente';
import BotonAnimado from '../../componentes/BotonAnimado';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado, sombras } from '../../tema/colores';

const MAX_INGREDIENTES = 50;

const PantallaEditarIngredientes = ({ route, navigation }) => {
  const iniciales = route.params?.ingredientes || [
    { nombre: '', cantidad: '', unidadMedida: '', notas: '' },
  ];
  const onSave = route.params?.onSave;

  const [ingredientes, setIngredientes] = useState(iniciales);
  const { mostrarAlerta } = useAlerta();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Ingredientes (${ingredientes.length})`,
    });
  }, [navigation, ingredientes.length]);

  const agregar = () => {
    if (ingredientes.length >= MAX_INGREDIENTES) {
      mostrarAlerta(
        'Límite alcanzado',
        `Máximo ${MAX_INGREDIENTES} ingredientes por receta.`,
        'advertencia'
      );
      return;
    }
    setIngredientes([
      ...ingredientes,
      { nombre: '', cantidad: '', unidadMedida: '', notas: '' },
    ]);
  };

  const actualizar = (i, val) => {
    const copia = [...ingredientes];
    copia[i] = val;
    setIngredientes(copia);
  };

  const eliminar = (i) => {
    if (ingredientes.length === 1) {
      mostrarAlerta(
        'Aviso',
        'Debes tener al menos un ingrediente.',
        'advertencia'
      );
      return;
    }
    setIngredientes(ingredientes.filter((_, idx) => idx !== i));
  };

  const guardarYVolver = () => {

    const conNombre = ingredientes.filter((i) => i.nombre.trim());
    if (conNombre.length === 0) {
      mostrarAlerta(
        'Sin ingredientes',
        'Agrega al menos un ingrediente con nombre para continuar.',
        'advertencia'
      );
      return;
    }


    for (const ing of conNombre) {
      const faltan = [];
      if (!ing.cantidad || !ing.cantidad.trim()) faltan.push('cantidad');
      if (!ing.unidadMedida || !ing.unidadMedida.trim()) faltan.push('unidad');

      if (faltan.length > 0) {
        const texto =
          faltan.length === 2
            ? 'la cantidad y la unidad de medida'
            : faltan[0] === 'cantidad'
            ? 'la cantidad'
            : 'la unidad de medida';

        mostrarAlerta(
          'Falta completar',
          `En el ingrediente "${ing.nombre}", ingresa ${texto}.`,
          'advertencia'
        );
        return;
      }
    }


    if (typeof onSave === 'function') {
      onSave(ingredientes);
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
          <View>
            <Text style={estilos.titulo}>Ingredientes</Text>
            <Text style={estilos.subtitulo}>
              {ingredientes.length} de {MAX_INGREDIENTES}
            </Text>
          </View>
        </View>

        {ingredientes.map((ing, i) => (
          <EntradaIngrediente
            key={i}
            index={i}
            ingrediente={ing}
            onChange={(val) => actualizar(i, val)}
            onEliminar={() => eliminar(i)}
          />
        ))}

        <TouchableOpacity style={estilos.botonAgregar} onPress={agregar}>
          <Ionicons name="add-circle" size={22} color={colores.primario} />
          <Text style={estilos.botonAgregarTexto}>Agregar ingrediente</Text>
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
    fontSize: 22,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.3,
  },
  subtitulo: {
    fontSize: 13,
    color: colores.textoGris,
    fontWeight: '600',
    marginTop: 2,
  },
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

export default PantallaEditarIngredientes;