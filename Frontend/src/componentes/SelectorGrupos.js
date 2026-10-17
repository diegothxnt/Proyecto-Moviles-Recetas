import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios } from '../tema/colores';

const SelectorGrupos = ({ grupos, seleccionados, onToggle }) => {
  if (!grupos || grupos.length === 0) {
    return (
      <View style={estilos.vacio}>
        <Text style={estilos.textoVacio}>
          No tienes grupos todavía. Crea uno primero desde la pestaña Grupos.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {grupos.map((grupo) => {
        const activo = seleccionados.includes(grupo._id);
        return (
          <TouchableOpacity
            key={grupo._id}
            style={[estilos.item, activo && estilos.itemActivo]}
            onPress={() => onToggle(grupo._id)}
            activeOpacity={0.7}
          >
            <View
              style={[estilos.checkbox, activo && estilos.checkboxActivo]}
            >
              {activo && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <View style={estilos.textos}>
              <Text style={estilos.nombre}>{grupo.nombre}</Text>
              {grupo.descripcion ? (
                <Text style={estilos.descripcion} numberOfLines={1}>
                  {grupo.descripcion}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const estilos = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    borderRadius: radios.md,
    padding: espaciado.md,
    marginBottom: espaciado.sm,
    borderWidth: 1.5,
    borderColor: colores.borde,
  },
  itemActivo: {
    borderColor: colores.primario,
    backgroundColor: colores.primarioSuave,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colores.bordeFuerte,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
  },
  checkboxActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  textos: { flex: 1 },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.texto,
  },
  descripcion: {
    fontSize: 12,
    color: colores.textoGris,
    marginTop: 2,
  },
  vacio: {
    padding: espaciado.md,
    backgroundColor: colores.fondoGris,
    borderRadius: radios.md,
    alignItems: 'center',
  },
  textoVacio: {
    fontSize: 13,
    color: colores.textoGris,
    textAlign: 'center',
  },
});

export default SelectorGrupos;