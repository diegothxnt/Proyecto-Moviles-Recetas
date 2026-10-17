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

const ModalConfirmacion = ({
  visible,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  tipo = 'advertencia', 
  onConfirmar,
  onCancelar,
}) => {
  const esPeligro = tipo === 'peligro';

  const colorPrincipal = esPeligro ? colores.error : colores.primario;
  const colorBg = esPeligro ? colores.errorSuave : colores.advertenciaSuave;
  const icono = esPeligro ? 'warning' : 'help-circle';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <Pressable style={estilos.overlay} onPress={onCancelar}>
        <Pressable style={estilos.caja} onPress={(e) => e.stopPropagation()}>
          <View style={[estilos.iconoCirculo, { backgroundColor: colorBg }]}>
            <Ionicons name={icono} size={32} color={colorPrincipal} />
          </View>

          {titulo ? <Text style={estilos.titulo}>{titulo}</Text> : null}
          {mensaje ? <Text style={estilos.mensaje}>{mensaje}</Text> : null}

          <View style={estilos.botones}>
            <TouchableOpacity
              style={[estilos.boton, estilos.botonCancelar]}
              onPress={onCancelar}
              activeOpacity={0.85}
            >
              <Text style={estilos.botonCancelarTexto}>{textoCancelar}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                estilos.boton,
                { backgroundColor: colorPrincipal },
              ]}
              onPress={onConfirmar}
              activeOpacity={0.85}
            >
              <Text style={estilos.botonConfirmarTexto}>{textoConfirmar}</Text>
            </TouchableOpacity>
          </View>
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
    ...sombras.media,
  },
  iconoCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espaciado.lg,
    alignSelf: 'center',
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
  botones: {
    flexDirection: 'row',
    gap: espaciado.sm,
  },
  boton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radios.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCancelar: {
    backgroundColor: colores.fondoGris,
    borderWidth: 1.5,
    borderColor: colores.borde,
  },
  botonCancelarTexto: {
    color: colores.texto,
    fontSize: 15,
    fontWeight: '700',
  },
  botonConfirmarTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ModalConfirmacion;