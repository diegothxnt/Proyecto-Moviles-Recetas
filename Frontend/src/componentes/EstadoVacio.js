import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado } from '../tema/colores';

const EstadoVacio = ({ icono, titulo, mensaje }) => {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.iconoCirculo}>
        <Ionicons name={icono} size={48} color={colores.primario} />
      </View>
      <Text style={estilos.titulo}>{titulo}</Text>
      {mensaje && <Text style={estilos.mensaje}>{mensaje}</Text>}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaciado.xl,
  },
  iconoCirculo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colores.primarioSuave,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espaciado.lg,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: colores.texto,
    textAlign: 'center',
    marginBottom: espaciado.xs,
  },
  mensaje: {
    fontSize: 14,
    color: colores.textoGris,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});

export default EstadoVacio;