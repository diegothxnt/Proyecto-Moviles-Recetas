import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { subirImagenACloudinary } from '../utilidades/subirImagen';
import { useAlerta } from '../contexto/AlertasContexto';
import { colores, espaciado, radios, sombras } from '../tema/colores';

const SelectorImagen = ({ imagenUrl, onChange }) => {
  const [subiendo, setSubiendo] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errorImagen, setErrorImagen] = useState(false);
  
  const [previewLocal, setPreviewLocal] = useState(imagenUrl);

  const { mostrarAlerta, mostrarConfirmacion } = useAlerta();

  
  useEffect(() => {
    setPreviewLocal(imagenUrl);
  }, [imagenUrl]);

  const pedirPermisos = async () => {
    const { status: galeria } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galeria !== 'granted') {
      mostrarAlerta(
        'Permiso requerido',
        'Necesitamos acceso a tu galería para subir la foto.',
        'advertencia'
      );
      return false;
    }
    return true;
  };

  const elegirDeGaleria = async () => {
    setMostrarModal(false);
    const ok = await pedirPermisos();
    if (!ok) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      await subir(resultado.assets[0]);
    }
  };

  const tomarFoto = async () => {
    setMostrarModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      mostrarAlerta(
        'Permiso requerido',
        'Necesitamos acceso a tu cámara.',
        'advertencia'
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      await subir(resultado.assets[0]);
    }
  };

  const subir = async (asset) => {
   
    setPreviewLocal(asset.uri);
    setSubiendo(true);
    setErrorImagen(false);

    try {
      
      const url = await subirImagenACloudinary(asset);
      
      onChange(url);
      setPreviewLocal(url);
    } catch (error) {
      mostrarAlerta(
        'Error al subir',
        error.message || 'No se pudo subir la imagen. Intenta de nuevo.',
        'error'
      );
      
      setPreviewLocal(imagenUrl);
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarImagen = async () => {
    const confirmado = await mostrarConfirmacion({
      titulo: 'Quitar foto',
      mensaje: '¿Seguro que quieres eliminar la foto de la receta?',
      textoConfirmar: 'Quitar',
      textoCancelar: 'Cancelar',
      tipo: 'peligro',
    });
    if (confirmado) {
      setErrorImagen(false);
      setPreviewLocal('');
      onChange('');
    }
  };

  return (
    <>
      {previewLocal ? (
        <View style={estilos.preview}>
          <Image
            source={{ uri: previewLocal }}
            style={estilos.imagen}
            resizeMode="cover"
            onError={() => setErrorImagen(true)}
          />

          {/* Spinner pequeño mientras sube en 2do plano */}
          {subiendo && (
            <View style={estilos.loadingOverlay}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={estilos.loadingTexto}>Guardando...</Text>
            </View>
          )}

          {errorImagen && !subiendo && (
            <View style={estilos.imagenOverlayError}>
              <Ionicons
                name="alert-circle-outline"
                size={40}
                color={colores.error}
              />
              <Text style={estilos.imagenErrorTexto}>
                No se pudo cargar la imagen
              </Text>
            </View>
          )}

          {!subiendo && (
            <View style={estilos.accionesImagen}>
              <TouchableOpacity
                style={estilos.botonAccion}
                onPress={() => setMostrarModal(true)}
              >
                <Ionicons name="camera-outline" size={18} color="#fff" />
                <Text style={estilos.botonAccionTexto}>Cambiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[estilos.botonAccion, estilos.botonEliminar]}
                onPress={eliminarImagen}
              >
                <Ionicons name="trash-outline" size={18} color="#fff" />
                <Text style={estilos.botonAccionTexto}>Quitar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={estilos.placeholder}
          onPress={() => setMostrarModal(true)}
          activeOpacity={0.7}
        >
          <View style={estilos.iconoCirculo}>
            <Ionicons name="camera" size={32} color={colores.primario} />
          </View>
          <Text style={estilos.textoPlaceholder}>
            Agregar foto de la receta
          </Text>
          <Text style={estilos.textoHint}>
            Toca para elegir de tu galería o cámara
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={mostrarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarModal(false)}
      >
        <Pressable
          style={estilos.modalOverlay}
          onPress={() => setMostrarModal(false)}
        >
          <Pressable
            style={estilos.modalContenido}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={estilos.modalHeader}>
              <Text style={estilos.modalTitulo}>Foto de la receta</Text>
              <Text style={estilos.modalSubtitulo}>
                ¿De dónde quieres tomarla?
              </Text>
            </View>

            <TouchableOpacity
              style={estilos.modalOpcion}
              onPress={tomarFoto}
              activeOpacity={0.7}
            >
              <View
                style={[
                  estilos.modalOpcionIcono,
                  { backgroundColor: colores.primarioSuave },
                ]}
              >
                <Ionicons name="camera" size={24} color={colores.primario} />
              </View>
              <View style={estilos.modalOpcionTextos}>
                <Text style={estilos.modalOpcionTitulo}>Tomar foto</Text>
                <Text style={estilos.modalOpcionSub}>
                  Usar la cámara del dispositivo
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colores.textoClaro}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.modalOpcion}
              onPress={elegirDeGaleria}
              activeOpacity={0.7}
            >
              <View
                style={[
                  estilos.modalOpcionIcono,
                  { backgroundColor: colores.primarioSuave },
                ]}
              >
                <Ionicons name="images" size={24} color={colores.primario} />
              </View>
              <View style={estilos.modalOpcionTextos}>
                <Text style={estilos.modalOpcionTitulo}>
                  Elegir de galería
                </Text>
                <Text style={estilos.modalOpcionSub}>
                  Selecciona una foto existente
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colores.textoClaro}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.modalCancelar}
              onPress={() => setMostrarModal(false)}
              activeOpacity={0.7}
            >
              <Text style={estilos.modalCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const estilos = StyleSheet.create({
  placeholder: {
    backgroundColor: colores.fondo,
    borderRadius: radios.lg,
    borderWidth: 2,
    borderColor: colores.borde,
    borderStyle: 'dashed',
    padding: espaciado.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    marginBottom: espaciado.md,
  },
  iconoCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colores.primarioSuave,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espaciado.md,
  },
  textoPlaceholder: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
    marginBottom: espaciado.xs,
  },
  textoHint: {
    fontSize: 13,
    color: colores.textoGris,
    textAlign: 'center',
  },
  

  preview: {
    borderRadius: radios.lg,
    overflow: 'hidden',
    marginBottom: espaciado.md,
    ...sombras.media,
    position: 'relative',
    height: 200,
  },
  imagen: {
    width: '100%',
    height: '100%',
    backgroundColor: colores.fondoGris,
  },
  
  
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  imagenOverlayError: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: espaciado.sm,
  },
  imagenErrorTexto: {
    fontSize: 13,
    color: colores.error,
    fontWeight: '600',
  },

  accionesImagen: {
    position: 'absolute',
    bottom: espaciado.sm,
    right: espaciado.sm,
    flexDirection: 'row',
    gap: espaciado.sm,
  },
  botonAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(31,42,21,0.7)',
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: radios.full,
  },
  botonEliminar: {
    backgroundColor: 'rgba(178,58,46,0.9)',
  },
  botonAccionTexto: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31,42,21,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaciado.lg,
  },
  modalContenido: {
    backgroundColor: colores.fondo,
    borderRadius: radios.lg,
    padding: espaciado.lg,
    width: '100%',
    maxWidth: 400,
    ...sombras.media,
  },
  modalHeader: { marginBottom: espaciado.lg },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.3,
    marginBottom: espaciado.xs,
  },
  modalSubtitulo: { fontSize: 14, color: colores.textoGris },
  modalOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondoGris,
    borderRadius: radios.md,
    padding: espaciado.md,
    marginBottom: espaciado.sm,
  },
  modalOpcionIcono: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
  },
  modalOpcionTextos: { flex: 1 },
  modalOpcionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.texto,
    marginBottom: 2,
  },
  modalOpcionSub: { fontSize: 12, color: colores.textoGris },
  modalCancelar: {
    marginTop: espaciado.md,
    paddingVertical: espaciado.md,
    alignItems: 'center',
  },
  modalCancelarTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.textoGris,
  },
});

export default SelectorImagen;