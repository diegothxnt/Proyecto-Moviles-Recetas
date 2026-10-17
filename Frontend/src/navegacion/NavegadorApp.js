import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import PilaAutenticacion from './PilaAutenticacion';
import TabsPrincipal from './TabsPrincipal';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colores } from '../tema/colores';

const NavegadorApp = () => {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? <TabsPrincipal /> : <PilaAutenticacion />}
    </NavigationContainer>
  );
};

const estilos = StyleSheet.create({
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
  },
});

export default NavegadorApp;