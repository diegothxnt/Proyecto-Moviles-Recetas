import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { vibrarLigero, vibrarMedio } from '../utilidades/haptics';
import { colores, espaciado, radios, sombras } from '../tema/colores';

const BotonAnimado = ({
  titulo,
  onPress,
  cargando = false,
  deshabilitado = false,
  icono,
  variante = 'primario',
  style,
}) => {
  const escala = useRef(new Animated.Value(1)).current;

  const alPresionarEntrada = () => {
    vibrarLigero();
    Animated.spring(escala, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const alPresionarSalida = () => {
    Animated.spring(escala, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const manejarPress = () => {
    vibrarMedio();
    onPress?.();
  };

  const inactivo = cargando || deshabilitado;

  return (
    <Animated.View style={[{ transform: [{ scale: escala }] }, style]}>
      <Pressable
        onPress={inactivo ? undefined : manejarPress}
        onPressIn={inactivo ? undefined : alPresionarEntrada}
        onPressOut={inactivo ? undefined : alPresionarSalida}
        style={[
          estilos.boton,
          estilos[variante],
          inactivo && estilos.inactivo,
        ]}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={estilos.contenido}>
            {icono && (
              <Ionicons
                name={icono}
                size={20}
                color={variante === 'fantasma' ? colores.primario : '#fff'}
                style={{ marginRight: espaciado.sm }}
              />
            )}
            <Text
              style={[
                estilos.texto,
                variante === 'fantasma' && estilos.textoFantasma,
              ]}
            >
              {titulo}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const estilos = StyleSheet.create({
  boton: {
    borderRadius: radios.md,
    paddingVertical: 16,
    paddingHorizontal: espaciado.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  contenido: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: colores.primario,
    ...sombras.fuerte,
  },
  secundario: {
    backgroundColor: colores.texto,
    ...sombras.media,
  },
  peligro: {
    backgroundColor: colores.error,
    ...sombras.media,
  },
  fantasma: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colores.primario,
  },
  inactivo: { opacity: 0.55 },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textoFantasma: { color: colores.primario },
});

export default BotonAnimado;