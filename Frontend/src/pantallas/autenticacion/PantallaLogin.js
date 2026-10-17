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
  Image,
  ImageBackground,
} from 'react-native';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import BotonAnimado from '../../componentes/BotonAnimado';
import CampoTexto from '../../componentes/CampoTexto';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado } from '../../tema/colores';

const PantallaLogin = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { iniciarSesion } = useAutenticacion();
  const { mostrarAlerta } = useAlerta();

  const fadeEntrada = useRef(new Animated.Value(0)).current;
  const slideLogo = useRef(new Animated.Value(30)).current;
  const escalaLogo = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeEntrada, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideLogo, {
        toValue: 0,
        speed: 8,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.spring(escalaLogo, {
        toValue: 1,
        speed: 8,
        bounciness: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const manejarLogin = async () => {
    if (!correo.trim() || !contrasena) {
      mostrarAlerta(
        'Campos vacíos',
        'Completa tu correo y contraseña para continuar.',
        'advertencia'
      );
      return;
    }
    setEnviando(true);
    try {
      await iniciarSesion(correo.trim().toLowerCase(), contrasena);
    } catch (error) {
      mostrarAlerta(
        'No pudimos iniciar sesión',
        error.response?.data?.mensaje || 'Revisa tus datos e intenta de nuevo.',
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
      {/* Velo semitransparente para mejorar legibilidad */}
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
            style={[
              estilos.logoContenedor,
              {
                opacity: fadeEntrada,
                transform: [{ translateY: slideLogo }, { scale: escalaLogo }],
              },
            ]}
          >
            <Image
              source={require('../../../assets/images/no.png')}
              style={estilos.logoImagen}
              resizeMode="contain"
            />
            <Text style={estilos.titulo}>Recetas</Text>
            <Text style={estilos.subtitulo}>Cocina, guarda y comparte</Text>
          </Animated.View>

          <Animated.View style={[estilos.formulario, { opacity: fadeEntrada }]}>
            <CampoTexto
              icono="mail-outline"
              placeholder="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              sinEspacios
              maxDigitos={100}
            />

            <CampoTexto
              icono="lock-closed-outline"
              placeholder="Contraseña"
              value={contrasena}
              onChangeText={setContrasena}
              esContrasena
              textContentType="password"
              sinEspacios
              maxDigitos={50}
            />

            <BotonAnimado
              titulo="Iniciar sesión"
              icono="log-in-outline"
              onPress={manejarLogin}
              cargando={enviando}
              style={{ marginTop: espaciado.sm }}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('Registro')}
              style={estilos.linkContenedor}
              activeOpacity={0.7}
            >
              <Text style={estilos.linkTexto}>
                ¿No tienes cuenta?{' '}
                <Text style={estilos.linkResaltado}>Regístrate</Text>
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
  logoContenedor: { alignItems: 'center', marginBottom: espaciado.xl },
  logoImagen: {
    width: 120,
    height: 120,
    borderRadius: 28,
    marginBottom: espaciado.md,
  },
  titulo: {
    fontSize: 34,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.8,
  },
  subtitulo: {
    fontSize: 14,
    color: colores.textoSuave,
    marginTop: espaciado.xs,
    fontWeight: '600',
  },
  formulario: { width: '100%' },
  linkContenedor: { marginTop: espaciado.lg, alignItems: 'center' },
  linkTexto: { fontSize: 15, color: colores.textoSuave },
  linkResaltado: { color: colores.primario, fontWeight: '700' },
});

export default PantallaLogin;