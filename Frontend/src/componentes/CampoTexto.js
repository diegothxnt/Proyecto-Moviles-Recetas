import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { vibrarLigero } from '../utilidades/haptics';
import { colores, espaciado, radios, sombras } from '../tema/colores';

const CampoTexto = ({
  etiqueta,
  icono,
  esContrasena = false,
  sinEspacios = false,
  sinEspaciosIniciales = false,
  soloDigitos = false,
  maxDigitos,
  style,
  onChangeText,
  value,
  ...props
}) => {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [enfocado, setEnfocado] = useState(false);

  const manejarCambio = (texto) => {
    let limpio = texto;

    if (sinEspaciosIniciales) {
      limpio = limpio.replace(/^\s+/, '');
    }
    if (sinEspacios) {
      limpio = limpio.replace(/\s/g, '');
    }
    if (soloDigitos) {
      limpio = limpio.replace(/[^0-9]/g, '');
    }
    if (maxDigitos && limpio.length > maxDigitos) {
      limpio = limpio.slice(0, maxDigitos);
    }

    onChangeText?.(limpio);
  };

  return (
    <View style={[estilos.wrapper, style]}>
      {etiqueta && <Text style={estilos.etiqueta}>{etiqueta}</Text>}

      <View
        style={[
          estilos.contenedor,
          enfocado && estilos.contenedorEnfocado,
        ]}
      >
        {icono && (
          <Ionicons
            name={icono}
            size={20}
            color={enfocado ? colores.primario : colores.textoGris}
            style={estilos.icono}
          />
        )}

        <TextInput
          style={estilos.input}
          value={value}
          onChangeText={manejarCambio}
          placeholderTextColor={colores.textoClaro}
          
          selectionColor={colores.primario}
          cursorColor={colores.primario}
          
          showSoftInputOnFocus={true}
          autoCorrect={false}
          maxLength={maxDigitos}
          onFocus={(e) => {
            vibrarLigero();
            setEnfocado(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setEnfocado(false);
            props.onBlur?.(e);
          }}
          secureTextEntry={esContrasena && !mostrarContrasena}
          {...props}
        />

        {esContrasena && (
          <TouchableOpacity
            onPress={() => {
              vibrarLigero();
              setMostrarContrasena((v) => !v);
            }}
            style={estilos.toggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={mostrarContrasena ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colores.textoGris}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  wrapper: { marginBottom: espaciado.lg },
  etiqueta: {
    fontSize: 13,
    fontWeight: '700',
    color: colores.textoSuave,
    marginBottom: espaciado.xs,
    letterSpacing: 0.3,
  },
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    borderRadius: radios.md,
    borderWidth: 1.5,
    borderColor: colores.borde,
    paddingHorizontal: espaciado.md,
    minHeight: 54,
    ...sombras.suave,
  },
  contenedorEnfocado: {
    borderColor: colores.primario,
    borderWidth: 2,
  },
  icono: { marginRight: espaciado.sm },
  input: {
    flex: 1,
    color: colores.texto,
    fontSize: 16,
    
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  toggle: { padding: espaciado.xs },
});

export default CampoTexto;