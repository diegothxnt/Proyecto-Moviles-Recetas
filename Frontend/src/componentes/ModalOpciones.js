import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios, sombras } from '../tema/colores';

const ModalOpciones = ({ visible, titulo, subtitulo, opciones = [], onCancelar }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <Pressable style={estilos.overlay} onPress={onCancelar}>
        <Pressable style={estilos.caja} onPress={(e) => e.stopPropagation()}>
          {/* Cabecera */}
          {(titulo || subtitulo) && (
            <View style={estilos.header}>
              {titulo ? (
                <Text style={estilos.titulo} numberOfLines={2}>
                  {titulo}
                </Text>
              ) : null}
              {subtitulo ? (
                <Text style={estilos.subtitulo}>{subtitulo}</Text>
              ) : null}
            </View>
          )}

          {/* Opciones */}
          {opciones.map((op, i) => (
            <TouchableOpacity
              key={i}
              style={[
                estilos.opcion,
                op.destructivo && estilos.opcionDestructiva,
                i === opciones.length - 1 && { marginBottom: 0 },
              ]}
              onPress={() => {
                onCancelar(); 
                setTimeout(() => op.onPress?.(), 150); 
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  estilos.opcionIcono,
                  {
                    backgroundColor: op.destructivo
                      ? colores.errorSuave
                      : colores.primarioSuave,
                  },
                ]}
              >
                <Ionicons
                  name={op.icono || 'ellipse'}
                  size={22}
                  color={op.destructivo ? colores.error : colores.primario}
                />
              </View>
              <Text
                style={[
                  estilos.opcionTexto,
                  op.destructivo && { color: colores.error },
                ]}
              >
                {op.texto}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colores.textoClaro}
              />
            </TouchableOpacity>
          ))}

          {/* Cancelar */}
          <TouchableOpacity
            style={estilos.botonCancelar}
            onPress={onCancelar}
            activeOpacity={0.7}
          >
            <Text style={estilos.botonCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaciado.lg,
  },
  caja: {
    backgroundColor: colores.fondo,
    borderRadius: radios.lg,
    padding: espaciado.lg,
    width: '100%',
    maxWidth: 400,
    ...sombras.media,
  },
  header: {
    marginBottom: espaciado.lg,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.2,
    marginBottom: espaciado.xs,
  },
  subtitulo: {
    fontSize: 14,
    color: colores.textoGris,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondoGris,
    borderRadius: radios.md,
    padding: espaciado.md,
    marginBottom: espaciado.sm,
  },
  opcionDestructiva: {
    backgroundColor: colores.errorSuave,
  },
  opcionIcono: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
  },
  opcionTexto: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colores.texto,
  },
  botonCancelar: {
    marginTop: espaciado.sm,
    paddingVertical: espaciado.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  botonCancelarTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.textoGris,
  },
});

export default ModalOpciones;