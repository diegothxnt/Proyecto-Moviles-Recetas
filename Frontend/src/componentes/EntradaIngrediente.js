import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios } from '../tema/colores';

const UNIDADES = [
  'g', 'kg', 'mg',
  'ml', 'l',
  'taza', 'cucharada', 'cucharadita',
  'unidad', 'pizca',
  'libra', 'onza', 'al gusto',
];

const MAX_NOMBRE = 80;
const MAX_CANTIDAD = 6;
const MAX_NOTAS = 120;

const EntradaIngrediente = ({ ingrediente, onChange, onEliminar, index }) => {
  const [mostrarUnidades, setMostrarUnidades] = useState(false);

  const actualizar = (campo, valor) => {
    onChange({ ...ingrediente, [campo]: valor });
  };

  const actualizarNombre = (v) => {
    if (v.length > MAX_NOMBRE) v = v.slice(0, MAX_NOMBRE);
    actualizar('nombre', v);
  };

  const actualizarCantidad = (v) => {
    let limpio = v.replace(/[^0-9.]/g, '');
    const partes = limpio.split('.');
    if (partes.length > 2) {
      limpio = partes[0] + '.' + partes.slice(1).join('');
    }
    if (limpio.length > MAX_CANTIDAD) limpio = limpio.slice(0, MAX_CANTIDAD);
    actualizar('cantidad', limpio);
  };

  const actualizarNotas = (v) => {
    if (v.length > MAX_NOTAS) v = v.slice(0, MAX_NOTAS);
    actualizar('notas', v);
  };


  const sinNombre = ingrediente.nombre.length > 0 && !ingrediente.nombre.trim();
  const sinCantidad =
    ingrediente.nombre.trim() && !ingrediente.cantidad.trim();
  const sinUnidad =
    ingrediente.nombre.trim() &&
    ingrediente.cantidad.trim() &&
    !ingrediente.unidadMedida;

  return (
    <View
      style={[
        estilos.fila,
        (sinCantidad || sinUnidad) && estilos.filaConError,
      ]}
    >
      <View style={estilos.cabecera}>
        <View style={estilos.numeroCirculo}>
          <Text style={estilos.numeroTexto}>{index + 1}</Text>
        </View>
        <TouchableOpacity
          onPress={onEliminar}
          style={estilos.botonEliminar}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={24} color={colores.error} />
        </TouchableOpacity>
      </View>

      {/* Nombre */}
      <View style={estilos.inputWrapper}>
        <TextInput
          style={estilos.input}
          placeholder="Nombre del ingrediente *"
          placeholderTextColor={colores.textoClaro}
          value={ingrediente.nombre}
          onChangeText={actualizarNombre}
          maxLength={MAX_NOMBRE}
          selectionColor={colores.primario}
          cursorColor={colores.primario}
          caretHidden={false}
        />
        <Text style={estilos.contador}>
          {ingrediente.nombre.length}/{MAX_NOMBRE}
        </Text>
      </View>

      {/* Cantidad + Unidad */}
      <View style={estilos.filaDoble}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={[estilos.input, sinCantidad && estilos.inputConError]}
            placeholder="Cantidad *"
            placeholderTextColor={
              sinCantidad ? colores.error : colores.textoClaro
            }
            value={ingrediente.cantidad}
            onChangeText={actualizarCantidad}
            keyboardType="numeric"
            maxLength={MAX_CANTIDAD}
            selectionColor={colores.primario}
            cursorColor={colores.primario}
            caretHidden={false}
          />
        </View>

        <View style={{ flex: 1.3 }}>
          <TouchableOpacity
            style={[
              estilos.selectorUnidad,
              sinUnidad && estilos.selectorUnidadConError,
            ]}
            onPress={() => setMostrarUnidades(!mostrarUnidades)}
          >
            <Text
              style={[
                estilos.selectorTexto,
                !ingrediente.unidadMedida && estilos.selectorTextoVacio,
              ]}
            >
              {ingrediente.unidadMedida || 'Unidad *'}
            </Text>
            <Ionicons
              name={mostrarUnidades ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={sinUnidad ? colores.error : colores.textoGris}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mensaje de error debajo */}
      {(sinCantidad || sinUnidad) && (
        <Text style={estilos.textoError}>
          {sinCantidad && sinUnidad
            ? ' Ingresa la cantidad y selecciona la unidad'
            : sinCantidad
            ? ' Ingresa la cantidad'
            : ' Selecciona la unidad de medida'}
        </Text>
      )}

      {/* Chips de unidades */}
      {mostrarUnidades && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={estilos.unidadesScroll}
          contentContainerStyle={estilos.unidadesContenido}
        >
          {UNIDADES.map((u) => (
            <TouchableOpacity
              key={u}
              style={[
                estilos.chip,
                ingrediente.unidadMedida === u && estilos.chipActivo,
              ]}
              onPress={() => {
                actualizar('unidadMedida', u);
                setMostrarUnidades(false);
              }}
            >
              <Text
                style={[
                  estilos.chipTexto,
                  ingrediente.unidadMedida === u && estilos.chipTextoActivo,
                ]}
              >
                {u}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Notas */}
      <View style={[estilos.inputWrapper, { marginTop: espaciado.xs }]}>
        <TextInput
          style={[estilos.input, estilos.inputNotas]}
          placeholder="Notas (ej: picado finamente)"
          placeholderTextColor={colores.textoClaro}
          value={ingrediente.notas}
          onChangeText={actualizarNotas}
          maxLength={MAX_NOTAS}
          selectionColor={colores.primario}
          cursorColor={colores.primario}
          caretHidden={false}
        />
        <Text style={estilos.contador}>
          {ingrediente.notas.length}/{MAX_NOTAS}
        </Text>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  fila: {
    backgroundColor: colores.fondo,
    borderRadius: radios.md,
    padding: espaciado.md,
    marginBottom: espaciado.sm,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  filaConError: {
    borderColor: '#E8C5C0',
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.sm,
  },
  numeroCirculo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colores.primarioSuave,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroTexto: { fontSize: 12, fontWeight: '700', color: colores.primario },
  botonEliminar: { padding: 2 },
  filaDoble: { flexDirection: 'row', gap: espaciado.sm, marginTop: espaciado.xs },
  inputWrapper: { position: 'relative' },
  input: {
    backgroundColor: colores.fondoGris,
    borderRadius: radios.sm,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 10,
    paddingRight: 50,
    fontSize: 14,
    color: colores.texto,
  },
  inputConError: {
    backgroundColor: '#FCEAE6',
  },
  inputNotas: { fontSize: 13 },
  contador: {
    position: 'absolute',
    right: espaciado.sm,
    top: '50%',
    marginTop: -7,
    fontSize: 10,
    color: colores.textoClaro,
    fontWeight: '600',
  },
  textoError: {
    fontSize: 11,
    color: colores.error,
    marginTop: espaciado.xs,
    fontWeight: '600',
  },
  selectorUnidad: {
    backgroundColor: colores.fondoGris,
    borderRadius: radios.sm,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  selectorUnidadConError: {
    backgroundColor: '#FCEAE6',
  },
  selectorTexto: { fontSize: 14, color: colores.texto, fontWeight: '600' },
  selectorTextoVacio: { color: colores.textoClaro, fontWeight: '400' },
  unidadesScroll: { marginTop: espaciado.sm },
  unidadesContenido: { gap: espaciado.xs },
  chip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: 6,
    borderRadius: radios.full,
    backgroundColor: colores.fondoGris,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: espaciado.xs,
  },
  chipActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  chipTexto: { fontSize: 13, color: colores.textoSuave, fontWeight: '600' },
  chipTextoActivo: { color: '#fff' },
});

export default EntradaIngrediente;