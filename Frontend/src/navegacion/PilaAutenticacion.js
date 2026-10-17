import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantallaLogin from '../pantallas/autenticacion/PantallaLogin';
import PantallaRegistro from '../pantallas/autenticacion/PantallaRegistro';

const Stack = createNativeStackNavigator();

const PilaAutenticacion = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={PantallaLogin} />
      <Stack.Screen name="Registro" component={PantallaRegistro} />
    </Stack.Navigator>
  );
};

export default PilaAutenticacion;