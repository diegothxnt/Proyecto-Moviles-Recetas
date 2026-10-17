import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import * as usuarioApi from '../../api/usuarioApi';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado, radios } from '../../tema/colores';

const PantallaConfiguracion = ({ navigation }) => {
  const { cerrarSesion } = useAutenticacion();
  const { mostrarAlerta, mostrarConfirmacion } = useAlerta();

  const manejarBorrarCuenta = async () => {
    const primera = await mostrarConfirmacion({
      titulo: ' Borrar cuenta',
      mensaje:
        'Esto eliminará PERMANENTEMENTE tu cuenta, tus recetas y tus grupos. No se puede deshacer.',
      textoConfirmar: 'Continuar',
      textoCancelar: 'Cancelar',
      tipo: 'peligro',
    });
    if (!primera) return;

    const segunda = await mostrarConfirmacion({
      titulo: '¿Estás completamente seguro?',
      mensaje: 'Esta acción es irreversible. Tu cuenta quedará desactivada.',
      textoConfirmar: 'Sí, borrar todo',
      textoCancelar: 'No, cancelar',
      tipo: 'peligro',
    });
    if (!segunda) return;

    try {
      await usuarioApi.borrarMiCuenta();
      await cerrarSesion();
    } catch (error) {
      mostrarAlerta(
        'Error',
        error.response?.data?.mensaje || 'No se pudo borrar la cuenta',
        'error'
      );
    }
  };

  const mostrarAcercaDe = () => {
    mostrarAlerta(
      'Acerca de App Recetas',
      'Versión 1.0.0\n\nProyecto de Programación de Dispositivos Móviles.',
      'info'
    );
  };

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
    >
      <View style={estilos.tarjeta}>
        <Text style={estilos.seccionTitulo}>Información</Text>

        <TouchableOpacity style={estilos.fila} onPress={mostrarAcercaDe}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colores.secundario}
          />
          <View style={estilos.filaTextos}>
            <Text style={estilos.filaTitulo}>Acerca de la app</Text>
            <Text style={estilos.filaSubtitulo}>Versión 1.0.0</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colores.textoGris} />
        </TouchableOpacity>
      </View>

      <View style={estilos.tarjetaPeligrosa}>
        <Text style={estilos.seccionTituloPeligrosa}>Zona peligrosa</Text>
        <Text style={estilos.descripcionPeligrosa}>
          Estas acciones son irreversibles. Tómalas con cuidado.
        </Text>

        <TouchableOpacity
          style={estilos.botonBorrar}
          onPress={manejarBorrarCuenta}
        >
          <Ionicons name="trash-outline" size={20} color={colores.error} />
          <Text style={estilos.botonBorrarTexto}>Borrar mi cuenta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoGris },
  scroll: { padding: espaciado.md },
  tarjeta: {
    backgroundColor: colores.fondo,
    borderRadius: radios.lg,
    padding: espaciado.lg,
    marginBottom: espaciado.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tarjetaPeligrosa: {
    backgroundColor: colores.fondo,
    borderRadius: radios.lg,
    padding: espaciado.lg,
    borderWidth: 1.5,
    borderColor: colores.errorSuave,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  seccionTituloPeligrosa: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.error,
    marginBottom: espaciado.xs,
  },
  descripcionPeligrosa: {
    fontSize: 13,
    color: colores.textoGris,
    marginBottom: espaciado.md,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
    paddingVertical: espaciado.sm,
  },
  filaTextos: { flex: 1 },
  filaTitulo: { fontSize: 15, color: colores.texto, fontWeight: '500' },
  filaSubtitulo: { fontSize: 12, color: colores.textoGris, marginTop: 2 },
  botonBorrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    backgroundColor: colores.errorSuave,
    paddingVertical: 14,
    paddingHorizontal: espaciado.md,
    borderRadius: radios.md,
  },
  botonBorrarTexto: {
    color: colores.error,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default PantallaConfiguracion;