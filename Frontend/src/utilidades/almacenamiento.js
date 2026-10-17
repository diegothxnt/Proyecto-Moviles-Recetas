import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_TOKEN = '@app_recetas:token';
const CLAVE_USUARIO = '@app_recetas:usuario';


export const guardarToken = async (token) => {
  try {
    await AsyncStorage.setItem(CLAVE_TOKEN, token);
  } catch (error) {
    console.error('Error al guardar token:', error);
  }
};

export const obtenerToken = async () => {
  try {
    return await AsyncStorage.getItem(CLAVE_TOKEN);
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

export const borrarToken = async () => {
  try {
    await AsyncStorage.removeItem(CLAVE_TOKEN);
  } catch (error) {
    console.error('Error al borrar token:', error);
  }
};

export const guardarUsuario = async (usuario) => {
  try {
    await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
};

export const obtenerUsuario = async () => {
  try {
    const json = await AsyncStorage.getItem(CLAVE_USUARIO);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

export const borrarUsuario = async () => {
  try {
    await AsyncStorage.removeItem(CLAVE_USUARIO);
  } catch (error) {
    console.error('Error al borrar usuario:', error);
  }
};

export const limpiarSesion = async () => {
  await borrarToken();
  await borrarUsuario();
};