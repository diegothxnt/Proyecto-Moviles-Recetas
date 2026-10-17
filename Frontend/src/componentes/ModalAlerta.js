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


const CONFIG = {
  info: { icono: 'information-circle', color: colores.secundario, bg: colores.secundarioSuave },
  exito: { icono: 'checkmark-circle', color: colores.exito, bg: colores.exitoSuave },
  error: { icono: 'alert-circle', color: colores.error, bg: colores.errorSuave },
  advertencia: { icono: 'warning', color: colores.advertencia, bg: colores.advertenciaSuave },
};

const ModalAlerta = ({ visible, titulo, mensaje, tipo = 'info', onCerrar }) => {
  const cfg = CONFIG[tipo] || CONFIG.info;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCerrar}
    >
      <Pressable style={estilos.overlay} onPress={onCerrar}>
        <Pressable style={estilos.caja} onPress={(e) => e.stopPropagation()}>
          <View style={[estilos.iconoCirculo, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icono} size={32} color={cfg.color} />
          </View>

          {titulo ? <Text style={estilos.titulo}>{titulo}</Text> : null}
          {mensaje ? <Text style={estilos.mensaje}>{mensaje}</Text> : null}

          <TouchableOpacity
            style={[estilos.boton, { backgroundColor: cfg.color }]}
            onPress={onCerrar}
            activeOpacity={0.85}
          >
            <Text style={estilos.botonTexto}>Entendido</Text>
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
    padding: espaciado.xl,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    ...sombras.media,
  },
  iconoCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espaciado.lg,
  },
  titulo: {
    fontSize: 19,
    fontWeight: '800',
    color: colores.texto,
    textAlign: 'center',
    marginBottom: espaciado.sm,
    letterSpacing: -0.2,
  },
  mensaje: {
    fontSize: 15,
    color: colores.textoSuave,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: espaciado.lg,
  },
  boton: {
    paddingVertical: 14,
    paddingHorizontal: espaciado.xl,
    borderRadius: radios.md,
    width: '100%',
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ModalAlerta;