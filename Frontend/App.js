import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  LogBox,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  Animated,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  AutenticacionProvider,
  useAutenticacion,
} from './src/contexto/AutenticacionContexto';
import { AlertasProvider } from './src/contexto/AlertasContexto';
import NavegadorApp from './src/navegacion/NavegadorApp';
import { colores } from './src/tema/colores';

SplashScreen.preventAutoHideAsync().catch(() => {});

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Method readAsStringAsync imported from "expo-file-system" is deprecated',
  'ImagePicker.MediaTypeOptions have been deprecated',
]);


const Splash = () => {
  const logoDrop = useRef(new Animated.Value(-250)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const tituloY = useRef(new Animated.Value(30)).current;
  const tituloOpacity = useRef(new Animated.Value(0)).current;
  const subtituloY = useRef(new Animated.Value(20)).current;
  const subtituloOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(logoDrop, {
          toValue: 0,
          speed: 12,
          bounciness: 12,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(tituloY, {
          toValue: 0,
          speed: 14,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.timing(tituloOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(subtituloY, {
          toValue: 0,
          speed: 14,
          bounciness: 6,
          useNativeDriver: true,
        }),
        Animated.timing(subtituloOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require('./assets/images/ee.png')}
      style={estilos.splash}
      resizeMode="cover"
    >
      {/* Overlay para suavizar el patrón */}
      <View style={estilos.splashOverlay} />

      <View style={estilos.splashContenido}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ translateY: logoDrop }],
          }}
        >
          <Image
            source={require('./assets/images/no.png')}
            style={estilos.splashLogo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text
          style={[
            estilos.splashTitulo,
            {
              opacity: tituloOpacity,
              transform: [{ translateY: tituloY }],
            },
          ]}
        >
          Recetas
        </Animated.Text>

        <Animated.Text
          style={[
            estilos.splashSubtitulo,
            {
              opacity: subtituloOpacity,
              transform: [{ translateY: subtituloY }],
            },
          ]}
        >
          Cocina, guarda y comparte
        </Animated.Text>
      </View>
    </ImageBackground>
  );
};


const Contenido = () => {
  const { cargando } = useAutenticacion();
  const [tiempoMinimoListo, setTiempoMinimoListo] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    const timer = setTimeout(() => setTiempoMinimoListo(true), 3400);
    return () => clearTimeout(timer);
  }, []);

  const mostrarSplash = !tiempoMinimoListo || cargando;

  if (mostrarSplash) return <Splash />;

  return <NavegadorApp />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AutenticacionProvider>
        <AlertasProvider>
          <StatusBar style="dark" />
          <Contenido />
        </AlertasProvider>
      </AutenticacionProvider>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colores.fondoCremoso,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232, 239, 224, 0.55)',   
  },
  splashContenido: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  splashLogo: {
    width: 160,
    height: 160,
    borderRadius: 36,
    marginBottom: 32,
  },
  splashTitulo: {
    fontSize: 42,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  splashSubtitulo: {
    fontSize: 15,
    color: colores.textoSuave,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontWeight: '600',
  },
});