import React, { useRef } from 'react';
import { Animated, Pressable, View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios, sombras } from '../tema/colores';

const TarjetaReceta = ({ receta, onPress, onLongPress }) => {
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

  const tieneGrupos = receta.grupos && receta.grupos.length > 0;

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
        {/* 🖼️ Thumbnail o ícono placeholder */}
        {receta.imagenUrl ? (
          <Image
            source={{ uri: receta.imagenUrl }}
            style={estilos.thumbnail}
          />
        ) : (
          <View style={estilos.thumbnailPlaceholder}>
            <Ionicons name="restaurant" size={24} color={colores.primario} />
          </View>
        )}

        <View style={estilos.contenido}>
          <View style={estilos.filaTitulo}>
            <Text style={estilos.titulo} numberOfLines={1}>
              {receta.titulo}
            </Text>
            {receta.esPublica && (
              <Ionicons
                name="globe-outline"
                size={16}
                color={colores.secundario}
              />
            )}
          </View>

          {receta.descripcion ? (
            <Text style={estilos.descripcion} numberOfLines={1}>
              {receta.descripcion}
            </Text>
          ) : null}

          <View style={estilos.metaFila}>
            {receta.tiempoPreparacion > 0 && (
              <View style={estilos.chip}>
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={colores.textoGris}
                />
                <Text style={estilos.chipTexto}>
                  {receta.tiempoPreparacion} min
                </Text>
              </View>
            )}
            {receta.porciones > 0 && (
              <View style={estilos.chip}>
                <Ionicons
                  name="people-outline"
                  size={12}
                  color={colores.textoGris}
                />
                <Text style={estilos.chipTexto}>{receta.porciones} porc.</Text>
              </View>
            )}
            {tieneGrupos && (
              <View style={estilos.chip}>
                <Ionicons
                  name="folder-outline"
                  size={12}
                  color={colores.textoGris}
                />
                <Text style={estilos.chipTexto}>{receta.grupos.length}</Text>
              </View>
            )}
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colores.textoClaro} />
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
    padding: espaciado.sm,
    marginBottom: espaciado.sm,
    ...sombras.suave,
  },
 
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: radios.md,
    backgroundColor: colores.fondoGris,
    marginRight: espaciado.md,
  },
  thumbnailPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: radios.md,
    backgroundColor: colores.primarioSuave,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
  },
  contenido: { flex: 1, marginRight: espaciado.sm },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.xs,
    marginBottom: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
    flexShrink: 1,
  },
  descripcion: {
    fontSize: 13,
    color: colores.textoGris,
    marginBottom: 6,
  },
  metaFila: { flexDirection: 'row', gap: espaciado.sm, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colores.fondoGris,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 2,
    borderRadius: radios.full,
  },
  chipTexto: {
    fontSize: 11,
    color: colores.textoGris,
    fontWeight: '600',
  },
});

export default TarjetaReceta;