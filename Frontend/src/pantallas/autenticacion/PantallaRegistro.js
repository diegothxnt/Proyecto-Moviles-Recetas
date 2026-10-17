import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ImageBackground,
} from 'react-native';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import BotonAnimado from '../../componentes/BotonAnimado';
import CampoTexto from '../../componentes/CampoTexto';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado } from '../../tema/colores';

const LIMITES = {
  nombreMin: 2,
  nombreMax: 60,
  correoMax: 100,
  contrasenaMin: 8,
  contrasenaMax: 50,
};

const PantallaRegistro = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { registrar } = useAutenticacion();
  const { mostrarAlerta } = useAlerta();

  const fadeEntrada = useRef(new Animated.Value(0)).current;
  const slideEntrada = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeEntrada, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideEntrada, {
        toValue: 0,
        speed: 10,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const manejarRegistro = async () => {
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (!nombreLimpio || !correoLimpio || !contrasena) {
      mostrarAlerta(
        'Campos incompletos',
        'Completa todos los campos para crear tu cuenta.',
        'advertencia'
      );
      return;
    }
    if (nombreLimpio.length < LIMITES.nombreMin) {
      mostrarAlerta(
        'Nombre muy corto',
        `El nombre debe tener al menos ${LIMITES.nombreMin} caracteres.`,
        'advertencia'
      );
      return;
    }
    if (contrasena.length < LIMITES.contrasenaMin) {
      mostrarAlerta(
        'Contraseña muy corta',
        `La contraseña debe tener al menos ${LIMITES.contrasenaMin} caracteres.`,
        'advertencia'
      );
      return;
    }
    if (/\s/.test(contrasena)) {
      mostrarAlerta(
        'Contraseña inválida',
        'La contraseña no puede contener espacios.',
        'advertencia'
      );
      return;
    }
    if (contrasena !== confirmar) {
      mostrarAlerta(
        'Contraseñas distintas',
        'Las dos contraseñas no coinciden.',
        'advertencia'
      );
      return;
    }

    setEnviando(true);
    try {
      await registrar(nombreLimpio, correoLimpio, contrasena);
    } catch (error) {
      mostrarAlerta(
        'Error al registrar',
        error.response?.data?.mensaje || 'Intenta de nuevo más tarde.',
        'error'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/ee.png')}
      style={estilos.contenedor}
      resizeMode="cover"
    >
      <View style={estilos.overlay} />

      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View
            style={{
              opacity: fadeEntrada,
              transform: [{ translateY: slideEntrada }],
            }}
          >
            <Text style={estilos.titulo}>Crear cuenta</Text>
            <Text style={estilos.subtitulo}>
              Únete y empieza a guardar tus recetas
            </Text>

            <CampoTexto
              icono="person-outline"
              placeholder="Tu nombre"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
              sinEspaciosIniciales
              maxDigitos={LIMITES.nombreMax}
            />

            <CampoTexto
              icono="mail-outline"
              placeholder="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              sinEspacios
              maxDigitos={LIMITES.correoMax}
            />

            <CampoTexto
              icono="lock-closed-outline"
              placeholder={`Contraseña (mín. ${LIMITES.contrasenaMin} caracteres)`}
              value={contrasena}
              onChangeText={setContrasena}
              esContrasena
              sinEspacios
              maxDigitos={LIMITES.contrasenaMax}
            />

            <CampoTexto
              icono="shield-checkmark-outline"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChangeText={setConfirmar}
              esContrasena
              sinEspacios
              maxDigitos={LIMITES.contrasenaMax}
            />

            <BotonAnimado
              titulo="Crear cuenta"
              icono="person-add-outline"
              onPress={manejarRegistro}
              cargando={enviando}
              style={{ marginTop: espaciado.sm }}
            />

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={estilos.linkContenedor}
              activeOpacity={0.7}
            >
              <Text style={estilos.linkTexto}>
                ¿Ya tienes cuenta?{' '}
                <Text style={estilos.linkResaltado}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoCremoso },
  flex: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232, 239, 224, 0.55)',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: espaciado.lg,
    paddingBottom: espaciado.xxl,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.5,
    marginBottom: espaciado.xs,
  },
  subtitulo: {
    fontSize: 14,
    color: colores.textoSuave,
    marginBottom: espaciado.lg,
    fontWeight: '600',
  },
  linkContenedor: { marginTop: espaciado.lg, alignItems: 'center' },
  linkTexto: { fontSize: 15, color: colores.textoSuave },
  linkResaltado: { color: colores.primario, fontWeight: '700' },
});

export default PantallaRegistro;