import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as autenticacionApi from '../api/autenticacionApi';
import * as usuarioApi from '../api/usuarioApi';
import {
  guardarToken,
  obtenerToken,
  guardarUsuario,
  obtenerUsuario,
  limpiarSesion,
} from '../utilidades/almacenamiento';

const CLAVE_BACKGROUND = '@app_recetas:was_backgrounded';

const AutenticacionContexto = createContext();

export const useAutenticacion = () => useContext(AutenticacionContexto);

export const AutenticacionProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        // La app fue minimizada → marcamos
        AsyncStorage.setItem(CLAVE_BACKGROUND, 'true').catch(() => {});
      } else if (nextState === 'active') {
        
        AsyncStorage.removeItem(CLAVE_BACKGROUND).catch(() => {});
      }
    });
    return () => suscripcion.remove();
  }, []);

  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        
        const fueCerrada = await AsyncStorage.getItem(CLAVE_BACKGROUND);
        if (fueCerrada === 'true') {
          await AsyncStorage.removeItem(CLAVE_BACKGROUND);
          await limpiarSesion();
          setUsuario(null);
          setCargando(false);
          return;
        }

       
        const token = await obtenerToken();
        if (!token) {
          setCargando(false);
          return;
        }

        
        const usuarioGuardado = await obtenerUsuario();
        if (usuarioGuardado) {
          setUsuario(usuarioGuardado);
        }

       
        try {
          const { usuario: usuarioFresco } = await usuarioApi.obtenerMiPerfil();
          setUsuario(usuarioFresco);
          await guardarUsuario(usuarioFresco);
        } catch (error) {
        
          if (error.response?.status === 401) {
            await limpiarSesion();
            setUsuario(null);
          }
        
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
      } finally {
        setCargando(false);
      }
    };

    restaurarSesion();
  }, []);

  const iniciarSesion = async (correo, contrasena) => {
    const data = await autenticacionApi.iniciarSesion({ correo, contrasena });
    await guardarToken(data.token);
    await guardarUsuario(data.usuario);
    setUsuario(data.usuario);
    return data;
  };

  const registrar = async (nombre, correo, contrasena) => {
    const data = await autenticacionApi.registrarUsuario({
      nombre,
      correo,
      contrasena,
    });
    await guardarToken(data.token);
    await guardarUsuario(data.usuario);
    setUsuario(data.usuario);
    return data;
  };

  const cerrarSesion = async () => {
    await limpiarSesion();
    setUsuario(null);
  };

  const actualizarUsuario = async (usuarioActualizado) => {
    await guardarUsuario(usuarioActualizado);
    setUsuario(usuarioActualizado);
  };

  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    registrar,
    cerrarSesion,
    actualizarUsuario,
  };

  return (
    <AutenticacionContexto.Provider value={valor}>
      {children}
    </AutenticacionContexto.Provider>
  );
};