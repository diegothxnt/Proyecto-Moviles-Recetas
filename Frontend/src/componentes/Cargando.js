import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';
import { colores, espaciado } from '../tema/colores';

const Cargando = ({ mensaje = 'Cargando...' }) => {
  const fade = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={estilos.contenedor}>
      <ActivityIndicator size="large" color={colores.primario} />
      <Animated.Text style={[estilos.texto, { opacity: fade }]}>
        {mensaje}
      </Animated.Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaciado.lg,
  },
  texto: {
    marginTop: espaciado.md,
    fontSize: 14,
    color: colores.textoGris,
    fontWeight: '500',
  },
});

export default Cargando;