import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PantallaMisRecetas from '../pantallas/recetas/PantallaMisRecetas';
import PantallaRecetasGenerales from '../pantallas/recetas/PantallaRecetasGenerales';
import PantallaDetalleReceta from '../pantallas/recetas/PantallaDetalleReceta';
import PantallaFormularioReceta from '../pantallas/recetas/PantallaFormularioReceta';
import PantallaEditarIngredientes from '../pantallas/recetas/PantallaEditarIngredientes';
import PantallaEditarPasos from '../pantallas/recetas/PantallaEditarPasos';
import PantallaVerIngredientes from '../pantallas/recetas/PantallaVerIngredientes';
import PantallaVerPasos from '../pantallas/recetas/PantallaVerPasos';

import PantallaListaGrupos from '../pantallas/grupos/PantallaListaGrupos';
import PantallaDetalleGrupo from '../pantallas/grupos/PantallaDetalleGrupo';
import PantallaFormularioGrupo from '../pantallas/grupos/PantallaFormularioGrupo';

import PantallaPerfil from '../pantallas/perfil/PantallaPerfil';
import PantallaConfiguracion from '../pantallas/perfil/PantallaConfiguracion';

import { colores } from '../tema/colores';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const opcionesHeader = {
  headerStyle: { backgroundColor: colores.fondo },
  headerTitleStyle: { color: colores.texto, fontWeight: '700', fontSize: 17 },
  headerTintColor: colores.primario,
  headerShadowVisible: false,

  animation: 'slide_from_right',
  animationDuration: 250,
};

const StackRecetas = () => (
  <Stack.Navigator screenOptions={opcionesHeader}>
    <Stack.Screen name="MisRecetas" component={PantallaMisRecetas} options={{ title: 'Mis recetas' }} />
    <Stack.Screen name="RecetasGenerales" component={PantallaRecetasGenerales} options={{ title: 'Recetas generales' }} />
    <Stack.Screen name="DetalleReceta" component={PantallaDetalleReceta} options={{ title: 'Receta' }} />
    <Stack.Screen name="FormularioReceta" component={PantallaFormularioReceta} options={{ title: 'Receta', animation: 'slide_from_bottom' }} />
    <Stack.Screen name="EditarIngredientes" component={PantallaEditarIngredientes} options={{ title: 'Ingredientes' }} />
    <Stack.Screen name="EditarPasos" component={PantallaEditarPasos} options={{ title: 'Pasos' }} />
    <Stack.Screen name="VerIngredientes" component={PantallaVerIngredientes} options={{ title: 'Ingredientes' }} />
    <Stack.Screen name="VerPasos" component={PantallaVerPasos} options={{ title: 'Pasos' }} />
  </Stack.Navigator>
);

const StackGrupos = () => (
  <Stack.Navigator screenOptions={opcionesHeader}>
    <Stack.Screen name="ListaGrupos" component={PantallaListaGrupos} options={{ title: 'Mis grupos' }} />
    <Stack.Screen name="DetalleGrupo" component={PantallaDetalleGrupo} options={{ title: 'Grupo' }} />
    <Stack.Screen name="FormularioGrupo" component={PantallaFormularioGrupo} options={{ title: 'Grupo', animation: 'slide_from_bottom' }} />
  </Stack.Navigator>
);

const StackPerfil = () => (
  <Stack.Navigator screenOptions={opcionesHeader}>
    <Stack.Screen name="MiPerfil" component={PantallaPerfil} options={{ title: 'Mi perfil' }} />
    <Stack.Screen name="Configuracion" component={PantallaConfiguracion} options={{ title: 'Configuración' }} />
  </Stack.Navigator>
);

const TabsPrincipal = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoClaro,
        tabBarStyle: {
          backgroundColor: colores.fondo,
          borderTopWidth: 1,
          borderTopColor: colores.borde,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
        
        animation: 'shift',
        tabBarIcon: ({ color, focused }) => {
          let iconName = 'ellipse';
          if (route.name === 'Recetas')
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          if (route.name === 'Grupos')
            iconName = focused ? 'folder' : 'folder-outline';
          if (route.name === 'Perfil')
            iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Recetas" component={StackRecetas} />
      <Tab.Screen name="Grupos" component={StackGrupos} />
      <Tab.Screen name="Perfil" component={StackPerfil} />
    </Tab.Navigator>
  );
};

export default TabsPrincipal;