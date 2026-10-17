import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios } from '../tema/colores';

const MAX_PASO = 500;

const EntradaPaso = ({ paso, onChange, onEliminar, index }) => {
  const manejarCambio = (texto) => {
    if (texto.length > MAX_PASO) {
      texto = texto.slice(0, MAX_PASO);
    }
    onChange(texto);
  };

  return (
    <View style={estilos.fila}>
      <View style={estilos.numeroCirculo}>
        <Text style={estilos.numeroTexto}>{index + 1}</Text>
      </View>

      <View style={estilos.inputWrapper}>
        <TextInput
          style={estilos.input}
          placeholder={`Describe el paso ${index + 1}...`}
          placeholderTextColor={colores.textoClaro}
          value={paso}
          onChangeText={manejarCambio}
          multiline
          maxLength={MAX_PASO}
          selectionColor={colores.primario}
          cursorColor={colores.primario}
        />
        <Text style={estilos.contador}>
          {paso.length}/{MAX_PASO}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onEliminar}
        style={estilos.botonEliminar}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close-circle" size={24} color={colores.error} />
      </TouchableOpacity>
    </View>
  );
};

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colores.fondo,
    borderRadius: radios.md,
    padding: espaciado.sm,
    marginBottom: espaciado.sm,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  numeroCirculo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.sm,
    marginTop: 6,
  },
  numeroTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  inputWrapper: { flex: 1 },
  input: {
    backgroundColor: colores.fondoGris,
    borderRadius: radios.sm,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 10,
    fontSize: 14,
    color: colores.texto,
    minHeight: 56,
    textAlignVertical: 'top',
  },
  contador: {
    fontSize: 10,
    color: colores.textoClaro,
    textAlign: 'right',
    marginTop: 2,
  },
  botonEliminar: { padding: espaciado.xs, marginTop: 4 },
});

export default EntradaPaso;