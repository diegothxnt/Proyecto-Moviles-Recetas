import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import * as usuarioApi from '../../api/usuarioApi';
import CampoTexto from '../../componentes/CampoTexto';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado, radios } from '../../tema/colores';

const LIMITES = {
  nombreMin: 2,
  nombreMax: 60,
  correoMax: 100,
  contrasenaMin: 8,
  contrasenaMax: 50,
};

const PantallaPerfil = ({ navigation }) => {
  const { usuario, actualizarUsuario, cerrarSesion } = useAutenticacion();
  const { mostrarAlerta, mostrarConfirmacion } = useAlerta();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [correo, setCorreo] = useState(usuario?.correo || '');
  const [contrasena, setContrasena] = useState('');


  useFocusEffect(
    useCallback(() => {
      const alPresionarAtras = () => {
        if (Platform.OS !== 'android') return false;

        mostrarConfirmacion({
          titulo: 'Cerrar sesión',
          mensaje: '¿Seguro que quieres cerrar sesión en App Recetas?',
          textoConfirmar: 'Cerrar sesión',
          textoCancelar: 'Cancelar',
          tipo: 'advertencia',
        }).then((confirmado) => {
          if (confirmado) cerrarSesion();
        });

        return true;
      };

      const suscripcion = BackHandler.addEventListener(
        'hardwareBackPress',
        alPresionarAtras
      );
      return () => suscripcion.remove();
    }, [mostrarConfirmacion, cerrarSesion])
  );

  const manejarGuardar = async () => {
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (!nombreLimpio || !correoLimpio) {
      mostrarAlerta(
        'Campos incompletos',
        'Nombre y correo son obligatorios.',
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

    if (contrasena) {
      if (contrasena.length < LIMITES.contrasenaMin) {
        mostrarAlerta(
          'Contraseña muy corta',
          `La contraseña debe tener al menos ${LIMITES.contrasenaMin} caracteres.`,
          'advertencia'
        );
        return;
      }
      if (contrasena.length > LIMITES.contrasenaMax) {
        mostrarAlerta(
          'Contraseña muy larga',
          `La contraseña no puede superar ${LIMITES.contrasenaMax} caracteres.`,
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
    }

    setGuardando(true);
    try {
      const datos = {
        nombre: nombreLimpio,
        correo: correoLimpio,
      };
      if (contrasena) datos.contrasena = contrasena;

      const { usuario: actualizado } = await usuarioApi.actualizarMiPerfil(datos);
      await actualizarUsuario(actualizado);

      setNombre(actualizado.nombre);
      setCorreo(actualizado.correo);
      setContrasena('');
      setModoEdicion(false);
      mostrarAlerta('¡Actualizado!', 'Tu perfil se guardó correctamente.', 'exito');
    } catch (error) {
      mostrarAlerta(
        'Error al guardar',
        error.response?.data?.mensaje || 'No se pudo actualizar el perfil',
        'error'
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarCancelar = () => {
    setNombre(usuario?.nombre || '');
    setCorreo(usuario?.correo || '');
    setContrasena('');
    setModoEdicion(false);
  };

  const manejarCerrarSesion = async () => {
    const confirmado = await mostrarConfirmacion({
      titulo: 'Cerrar sesión',
      mensaje: '¿Seguro que quieres salir de tu cuenta?',
      textoConfirmar: 'Cerrar sesión',
      textoCancelar: 'Cancelar',
      tipo: 'advertencia',
    });
    if (confirmado) cerrarSesion();
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const inicial = usuario?.nombre?.charAt(0)?.toUpperCase() || '?';

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
      <View style={estilos.cabecera}>
        <TouchableOpacity
          style={estilos.botonConfig}
          onPress={() => navigation.navigate('Configuracion')}
        >
          <Ionicons name="settings-outline" size={22} color={colores.texto} />
        </TouchableOpacity>

        <View style={estilos.avatarPlaceholder}>
          <Text style={estilos.avatarInicial}>{inicial}</Text>
        </View>
        <Text style={estilos.nombreCabecera}>{usuario?.nombre}</Text>
        <Text style={estilos.correoCabecera}>{usuario?.correo}</Text>
      </View>

      {!modoEdicion ? (
        <View style={estilos.tarjeta}>
          <Text style={estilos.seccionTitulo}>Información personal</Text>

          <FilaInfo
            icono="person-outline"
            etiqueta="Nombre"
            valor={usuario?.nombre}
          />
          <FilaInfo
            icono="mail-outline"
            etiqueta="Correo"
            valor={usuario?.correo}
          />
          <FilaInfo
            icono="calendar-outline"
            etiqueta="Miembro desde"
            valor={formatearFecha(usuario?.createdAt)}
          />

          <TouchableOpacity
            style={estilos.botonPrimario}
            onPress={() => setModoEdicion(true)}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={estilos.botonPrimarioTexto}>Editar perfil</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={estilos.tarjeta}>
          <Text style={estilos.seccionTitulo}>Editar información</Text>

          <CampoTexto
            etiqueta={`Nombre (${nombre.length}/${LIMITES.nombreMax})`}
            icono="person-outline"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            sinEspaciosIniciales
            maxDigitos={LIMITES.nombreMax}
          />

          <CampoTexto
            etiqueta={`Correo (${correo.length}/${LIMITES.correoMax})`}
            icono="mail-outline"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            sinEspacios
            maxDigitos={LIMITES.correoMax}
          />

          <CampoTexto
            etiqueta={`Nueva contraseña (opcional, mín. ${LIMITES.contrasenaMin})`}
            icono="lock-closed-outline"
            value={contrasena}
            onChangeText={setContrasena}
            placeholder="Dejar vacío para no cambiar"
            esContrasena
            sinEspacios
            maxDigitos={LIMITES.contrasenaMax}
          />

          <View style={estilos.filaBotones}>
            <TouchableOpacity
              style={[estilos.botonSecundario, { flex: 1 }]}
              onPress={manejarCancelar}
              disabled={guardando}
            >
              <Text style={estilos.botonSecundarioTexto}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                estilos.botonPrimario,
                { flex: 1, marginTop: 0 },
                guardando && estilos.botonDeshabilitado,
              ]}
              onPress={manejarGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={estilos.botonPrimarioTexto}>Guardar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={estilos.botonCerrarSesion}
        onPress={manejarCerrarSesion}
      >
        <Ionicons name="log-out-outline" size={20} color={colores.advertencia} />
        <Text style={estilos.botonCerrarSesionTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const FilaInfo = ({ icono, etiqueta, valor }) => (
  <View style={estilos.filaInfo}>
    <Ionicons name={icono} size={22} color={colores.primario} />
    <View style={estilos.filaInfoTextos}>
      <Text style={estilos.filaInfoEtiqueta}>{etiqueta}</Text>
      <Text style={estilos.filaInfoValor}>{valor || '—'}</Text>
    </View>
  </View>
);

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoGris },
  scroll: { padding: espaciado.md, paddingBottom: espaciado.xl },
  cabecera: { alignItems: 'center', paddingVertical: espaciado.lg },
  botonConfig: {
    position: 'absolute',
    top: espaciado.md,
    right: espaciado.md,
    padding: espaciado.sm,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espaciado.md,
  },
  avatarInicial: { fontSize: 42, fontWeight: 'bold', color: '#fff' },
  nombreCabecera: { fontSize: 22, fontWeight: 'bold', color: colores.texto },
  correoCabecera: {
    fontSize: 14,
    color: colores.textoGris,
    marginTop: espaciado.xs,
  },
  tarjeta: {
    backgroundColor: colores.fondo,
    borderRadius: radios.lg,
    padding: espaciado.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: espaciado.sm,
    borderBottomWidth: 1,
    borderBottomColor: colores.fondoGris,
  },
  filaInfoTextos: { marginLeft: espaciado.md, flex: 1 },
  filaInfoEtiqueta: { fontSize: 12, color: colores.textoGris },
  filaInfoValor: {
    fontSize: 15,
    color: colores.texto,
    fontWeight: '500',
    marginTop: 2,
  },
  filaBotones: {
    flexDirection: 'row',
    gap: espaciado.sm,
    marginTop: espaciado.lg,
  },
  botonPrimario: {
    backgroundColor: colores.primario,
    borderRadius: radios.md,
    paddingVertical: 14,
    paddingHorizontal: espaciado.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: espaciado.xs,
    marginTop: espaciado.lg,
  },
  botonPrimarioTexto: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  botonSecundario: {
    backgroundColor: colores.fondoGris,
    borderRadius: radios.md,
    paddingVertical: 14,
    paddingHorizontal: espaciado.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonSecundarioTexto: {
    color: colores.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonCerrarSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    backgroundColor: '#FBF1DD',
    paddingVertical: 14,
    paddingHorizontal: espaciado.md,
    borderRadius: radios.md,
    marginTop: espaciado.md,
  },
  botonCerrarSesionTexto: {
    color: colores.advertencia,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default PantallaPerfil;