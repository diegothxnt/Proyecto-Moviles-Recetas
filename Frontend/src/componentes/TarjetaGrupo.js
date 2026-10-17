import React, { useRef } from 'react';
import { Animated, Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios, sombras } from '../tema/colores';

const TarjetaGrupo = ({ grupo, onPress, onLongPress }) => {
  const escala = useRef(new Animated.Value(1)).current;

  const alEntrar = () =>
    Animated.spring(escala, {
      toValue: 0.97,
      speed: 50,
      useNativeDriver: true,
    }).start();

  const alSalir = () =>
    Animated.spring(escala, {
      toValue: 1,
      speed: 50,
      useNativeDriver: true,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale: escala }] }}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={400}
        onPressIn={alEntrar}
        onPressOut={alSalir}
        style={estilos.tarjeta}
      >
        <View style={estilos.iconoContenedor}>
          <Ionicons name="folder" size={26} color={colores.primario} />
        </View>

        <View style={estilos.contenido}>
          <Text style={estilos.nombre} numberOfLines={1}>
            {grupo.nombre}
          </Text>
          {grupo.descripcion ? (
            <Text style={estilos.descripcion} numberOfLines={1}>
              {grupo.descripcion}
            </Text>
          ) : (
            <Text style={estilos.sinDescripcion}>Sin descripción</Text>
          )}
          <View style={estilos.contador}>
            <Ionicons
              name="restaurant-outline"
              size={13}
              color={colores.textoGris}
            />
            <Text style={estilos.contadorTexto}>
              {grupo.cantidadRecetas ?? 0}{' '}
              {(grupo.cantidadRecetas ?? 0) === 1 ? 'receta' : 'recetas'}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color={colores.textoClaro}
        />
      </Pressable>
    </Animated.View>
  );
};

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    borderRadius: radios.lg,
    padding: espaciado.md,
    marginBottom: espaciado.sm,
    ...sombras.suave,
  },
  iconoContenedor: {
    width: 48,
    height: 48,
    borderRadius: radios.md,
    backgroundColor: colores.primarioSuave,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
  },
  contenido: { flex: 1 },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
    marginBottom: 2,
  },
  descripcion: {
    fontSize: 13,
    color: colores.textoGris,
    marginBottom: 4,
  },
  sinDescripcion: {
    fontSize: 13,
    color: colores.textoClaro,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  contador: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  contadorTexto: {
    fontSize: 12,
    color: colores.textoGris,
    marginLeft: 4,
  },
});

export default TarjetaGrupo;