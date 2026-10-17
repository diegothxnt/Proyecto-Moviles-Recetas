import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as recetaApi from '../api/recetaApi';
import * as grupoApi from '../api/grupoApi';
import { useAlerta } from '../contexto/AlertasContexto';
import { colores, espaciado, radios, sombras } from '../tema/colores';

const ModalSeleccionRecetas = ({ visible, grupo, onCerrar, onGuardado }) => {
  const [recetas, setRecetas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [originales, setOriginales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const { mostrarAlerta } = useAlerta();

  useEffect(() => {
    if (!visible || !grupo) return;

    const cargar = async () => {
      try {
        setCargando(true);
        
        const misRecetas = await recetaApi.obtenerMisRecetas();
    
        const { recetas: recetasDelGrupo } = await grupoApi.obtenerGrupo(grupo._id);
        const idsEnGrupo = recetasDelGrupo.map((r) => r._id);

        setRecetas(misRecetas);
        setSeleccionadas(idsEnGrupo);
        setOriginales(idsEnGrupo);
      } catch (error) {
        mostrarAlerta('Error', 'No se pudieron cargar las recetas', 'error');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [visible, grupo]);

  const toggle = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      const aAgregar = seleccionadas.filter((id) => !originales.includes(id));
      const aQuitar = originales.filter((id) => !seleccionadas.includes(id));

      await Promise.all([
        ...aAgregar.map((rId) =>
          recetaApi.agregarRecetaAGrupo(rId, grupo._id)
        ),
        ...aQuitar.map((rId) =>
          recetaApi.quitarRecetaDeGrupo(rId, grupo._id)
        ),
      ]);

      onGuardado?.();
      onCerrar();
    } catch (error) {
      mostrarAlerta('Error', 'No se pudieron actualizar las recetas', 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCerrar}
    >
      <Pressable style={estilos.overlay} onPress={onCerrar}>
        <Pressable style={estilos.contenedor} onPress={(e) => e.stopPropagation()}>
          <View style={estilos.header}>
            <View style={{ flex: 1 }}>
              <Text style={estilos.titulo}>Agregar recetas</Text>
              {grupo && (
                <Text style={estilos.subtitulo} numberOfLines={1}>
                  {grupo.nombre}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onCerrar} style={estilos.botonCerrar}>
              <Ionicons name="close" size={24} color={colores.texto} />
            </TouchableOpacity>
          </View>

          {cargando ? (
            <View style={estilos.centrado}>
              <ActivityIndicator color={colores.primario} />
            </View>
          ) : recetas.length === 0 ? (
            <View style={estilos.centrado}>
              <Ionicons
                name="restaurant-outline"
                size={48}
                color={colores.textoClaro}
              />
              <Text style={estilos.textoVacio}>
                No tienes recetas todavía
              </Text>
              <Text style={estilos.textoVacioSub}>
                Crea una receta primero para poder agregarla a este grupo.
              </Text>
            </View>
          ) : (
            <ScrollView style={estilos.lista}>
              {recetas.map((r) => {
                const activo = seleccionadas.includes(r._id);
                return (
                  <TouchableOpacity
                    key={r._id}
                    style={[estilos.item, activo && estilos.itemActivo]}
                    onPress={() => toggle(r._id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        estilos.checkbox,
                        activo && estilos.checkboxActivo,
                      ]}
                    >
                      {activo && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <View style={estilos.textos}>
                      <Text style={estilos.nombre} numberOfLines={1}>
                        {r.titulo}
                      </Text>
                      {r.descripcion ? (
                        <Text style={estilos.descripcion} numberOfLines={1}>
                          {r.descripcion}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={estilos.footer}>
            <TouchableOpacity
              style={[estilos.botonGuardar, guardando && { opacity: 0.6 }]}
              onPress={guardar}
              disabled={guardando || cargando || recetas.length === 0}
            >
              {guardando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={estilos.botonGuardarTexto}>Guardar cambios</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 42, 21, 0.55)',
    justifyContent: 'flex-end',
  },
  contenedor: {
    backgroundColor: colores.fondo,
    borderTopLeftRadius: radios.xl,
    borderTopRightRadius: radios.xl,
    maxHeight: '85%',
    paddingBottom: espaciado.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: espaciado.lg,
    paddingBottom: espaciado.md,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.3,
  },
  subtitulo: {
    fontSize: 13,
    color: colores.textoGris,
    marginTop: 2,
    fontStyle: 'italic',
  },
  botonCerrar: { padding: espaciado.xs },
  centrado: {
    padding: espaciado.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoVacio: {
    color: colores.textoSuave,
    fontSize: 15,
    fontWeight: '700',
    marginTop: espaciado.md,
    textAlign: 'center',
  },
  textoVacioSub: {
    color: colores.textoGris,
    fontSize: 13,
    marginTop: espaciado.xs,
    textAlign: 'center',
    paddingHorizontal: espaciado.lg,
  },
  lista: { paddingHorizontal: espaciado.lg },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondoGris,
    borderRadius: radios.md,
    padding: espaciado.md,
    marginBottom: espaciado.sm,
    borderWidth: 1.5,
    borderColor: colores.borde,
  },
  itemActivo: {
    borderColor: colores.primario,
    backgroundColor: colores.primarioSuave,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colores.bordeFuerte,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
  },
  checkboxActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  textos: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: '600', color: colores.texto },
  descripcion: { fontSize: 12, color: colores.textoGris, marginTop: 2 },
  footer: {
    paddingHorizontal: espaciado.lg,
    paddingTop: espaciado.sm,
  },
  botonGuardar: {
    backgroundColor: colores.primario,
    paddingVertical: 16,
    borderRadius: radios.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: espaciado.sm,
    ...sombras.fuerte,
  },
  botonGuardarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ModalSeleccionRecetas;