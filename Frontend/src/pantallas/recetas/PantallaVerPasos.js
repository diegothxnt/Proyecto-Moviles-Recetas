import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios, sombras } from '../../tema/colores';

const PantallaVerPasos = ({ route }) => {
  const { pasos = [], tituloReceta } = route.params || {};
  const [marcados, setMarcados] = useState([]);

  const toggleMarcado = (index) => {
    setMarcados((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const limpiar = () => setMarcados([]);

  const totalMarcados = marcados.length;
  const total = pasos.length;
  const progreso = total > 0 ? (totalMarcados / total) * 100 : 0;

  return (
    <View style={estilos.contenedor}>
      {/* Encabezado con progreso */}
      <View style={estilos.encabezado}>
        {tituloReceta ? (
          <Text style={estilos.tituloReceta} numberOfLines={1}>
            {tituloReceta}
          </Text>
        ) : null}
        <View style={estilos.progresoFila}>
          <Text style={estilos.progresoTexto}>
            {totalMarcados} de {total} completados
          </Text>
          {totalMarcados > 0 && (
            <TouchableOpacity onPress={limpiar} style={estilos.botonLimpiar}>
              <Ionicons name="refresh" size={14} color={colores.primario} />
              <Text style={estilos.botonLimpiarTexto}>Reiniciar</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={estilos.barraFondo}>
          <View style={[estilos.barraRelleno, { width: `${progreso}%` }]} />
        </View>
      </View>

      {/* Lista */}
      <ScrollView
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
      >
        {pasos.map((paso, i) => {
          const marcado = marcados.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[estilos.item, marcado && estilos.itemMarcado]}
              onPress={() => toggleMarcado(i)}
              activeOpacity={0.7}
            >
              <View
                style={[estilos.checkbox, marcado && estilos.checkboxMarcado]}
              >
                {marcado ? (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                ) : (
                  <Text style={estilos.numeroTexto}>{i + 1}</Text>
                )}
              </View>

              <Text
                style={[estilos.pasoTexto, marcado && estilos.textoTachado]}
              >
                {paso}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoGris },
  encabezado: {
    backgroundColor: colores.fondo,
    padding: espaciado.lg,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
    ...sombras.suave,
  },
  tituloReceta: {
    fontSize: 13,
    color: colores.textoGris,
    fontStyle: 'italic',
    marginBottom: espaciado.xs,
  },
  progresoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.sm,
  },
  progresoTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: colores.texto,
  },
  botonLimpiar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 4,
    borderRadius: radios.full,
    backgroundColor: colores.primarioSuave,
  },
  botonLimpiarTexto: {
    fontSize: 12,
    color: colores.primario,
    fontWeight: '700',
  },
  barraFondo: {
    height: 6,
    backgroundColor: colores.fondoGris,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%',
    backgroundColor: colores.primario,
    borderRadius: 3,
  },
  lista: { padding: espaciado.md, paddingBottom: espaciado.xxl },

  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colores.fondo,
    borderRadius: radios.md,
    padding: espaciado.md,
    marginBottom: espaciado.sm,
    borderWidth: 1.5,
    borderColor: colores.borde,
    ...sombras.suave,
  },
  itemMarcado: {
    backgroundColor: colores.primarioSuave,
    borderColor: colores.primarioClaro,
    opacity: 0.85,
  },
 
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colores.bordeFuerte,
    backgroundColor: colores.fondo,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
    marginTop: 2,
  },
  checkboxMarcado: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  numeroTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: colores.textoGris,
  },
  pasoTexto: {
    flex: 1,
    fontSize: 15,
    color: colores.texto,
    lineHeight: 22,
    paddingTop: 4,
  },
  textoTachado: {
    textDecorationLine: 'line-through',
    color: colores.textoGris,
  },
});

export default PantallaVerPasos;