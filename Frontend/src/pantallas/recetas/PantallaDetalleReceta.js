import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as recetaApi from '../../api/recetaApi';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import { useAlerta } from '../../contexto/AlertasContexto';
import Cargando from '../../componentes/Cargando';
import { colores, espaciado, radios, sombras } from '../../tema/colores';

const PREVIEW_INGREDIENTES = 4;
const PREVIEW_PASOS = 3;

const PantallaDetalleReceta = ({ route, navigation }) => {
  const { recetaId } = route.params;
  const { usuario } = useAutenticacion();
  const { mostrarAlerta, mostrarConfirmacion } = useAlerta();
  const [receta, setReceta] = useState(null);
  const [cargando, setCargando] = useState(true);

  const esAutor =
    receta?.autor?._id?.toString() === usuario?._id?.toString();

  const cargar = async () => {
    try {
      const data = await recetaApi.obtenerReceta(recetaId);
      setReceta(data);
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo cargar la receta', 'error');
      navigation.goBack();
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [recetaId])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: receta?.titulo || 'Receta',
      headerRight: () =>
        esAutor ? (
          <View style={estilos.headerBotones}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FormularioReceta', { recetaId })
              }
              style={estilos.headerBoton}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={colores.primario}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmarBorrado}
              style={estilos.headerBoton}
            >
              <Ionicons name="trash-outline" size={22} color={colores.error} />
            </TouchableOpacity>
          </View>
        ) : null,
    });
  }, [navigation, receta, esAutor]);

  const confirmarBorrado = async () => {
    const confirmado = await mostrarConfirmacion({
      titulo: 'Borrar receta',
      mensaje: `¿Seguro que quieres borrar "${receta.titulo}"? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Borrar',
      textoCancelar: 'Cancelar',
      tipo: 'peligro',
    });
    if (!confirmado) return;

    try {
      await recetaApi.borrarReceta(recetaId);
      navigation.goBack();
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo borrar la receta', 'error');
    }
  };

  if (cargando) return <Cargando mensaje="Cargando receta..." />;
  if (!receta) return null;

  const tieneEtiquetas =
    receta.dificultad || receta.categoria || (receta.etiquetas?.length > 0);

  const tieneMeta =
    receta.tiempoPreparacion > 0 ||
    receta.tiempoCoccion > 0 ||
    receta.porciones > 0 ||
    receta.calorias > 0;

  const ingredientesPreview = receta.ingredientes.slice(0, PREVIEW_INGREDIENTES);
  const pasosPreview = receta.pasos.slice(0, PREVIEW_PASOS);
  const hayMasIngredientes = receta.ingredientes.length > PREVIEW_INGREDIENTES;
  const hayMasPasos = receta.pasos.length > PREVIEW_PASOS;

  return (
    <ScrollView
      style={estilos.contenedor}
      contentContainerStyle={estilos.scroll}
      showsVerticalScrollIndicator={false}
    >
      {receta.imagenUrl ? (
        <Image source={{ uri: receta.imagenUrl }} style={estilos.imagen} />
      ) : (
        <View style={estilos.imagenPlaceholder}>
          <Ionicons name="restaurant" size={72} color={colores.primario} />
        </View>
      )}

      <View style={estilos.contenido}>
        <View style={estilos.filaTitulo}>
          <Text style={estilos.titulo}>{receta.titulo}</Text>
          {receta.esPublica && (
            <View style={estilos.badgePublica}>
              <Ionicons
                name="globe-outline"
                size={12}
                color={colores.secundario}
              />
              <Text style={estilos.badgePublicaTexto}>Pública</Text>
            </View>
          )}
        </View>

        {receta.descripcion ? (
          <Text style={estilos.descripcion}>{receta.descripcion}</Text>
        ) : null}

        {tieneEtiquetas && (
          <View style={estilos.tagsRow}>
            {receta.dificultad && (
              <View style={estilos.tag}>
                <Ionicons
                  name="speedometer-outline"
                  size={12}
                  color={colores.secundario}
                />
                <Text style={estilos.tagTexto}>{receta.dificultad}</Text>
              </View>
            )}
            {receta.categoria && (
              <View style={estilos.tag}>
                <Ionicons
                  name="pricetag-outline"
                  size={12}
                  color={colores.secundario}
                />
                <Text style={estilos.tagTexto}>{receta.categoria}</Text>
              </View>
            )}
            {receta.etiquetas?.map((t) => (
              <View key={t} style={estilos.tag}>
                <Text style={estilos.tagTexto}>#{t}</Text>
              </View>
            ))}
          </View>
        )}

        {tieneMeta && (
          <View style={estilos.metaCard}>
            {receta.tiempoPreparacion > 0 && (
              <View style={estilos.metaItem}>
                <View style={estilos.metaIcono}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={colores.primario}
                  />
                </View>
                <Text style={estilos.metaLabel}>Prep.</Text>
                <Text style={estilos.metaValor}>
                  {receta.tiempoPreparacion} min
                </Text>
              </View>
            )}
            {receta.tiempoCoccion > 0 && (
              <View style={estilos.metaItem}>
                <View style={estilos.metaIcono}>
                  <Ionicons
                    name="flame-outline"
                    size={20}
                    color={colores.primario}
                  />
                </View>
                <Text style={estilos.metaLabel}>Cocción</Text>
                <Text style={estilos.metaValor}>
                  {receta.tiempoCoccion} min
                </Text>
              </View>
            )}
            {receta.porciones > 0 && (
              <View style={estilos.metaItem}>
                <View style={estilos.metaIcono}>
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color={colores.primario}
                  />
                </View>
                <Text style={estilos.metaLabel}>Porciones</Text>
                <Text style={estilos.metaValor}>{receta.porciones}</Text>
              </View>
            )}
            {receta.calorias > 0 && (
              <View style={estilos.metaItem}>
                <View style={estilos.metaIcono}>
                  <Ionicons
                    name="nutrition-outline"
                    size={20}
                    color={colores.primario}
                  />
                </View>
                <Text style={estilos.metaLabel}>Calorías</Text>
                <Text style={estilos.metaValor}>{receta.calorias} kcal</Text>
              </View>
            )}
          </View>
        )}

        {receta.autor?.nombre && !esAutor && (
          <View style={estilos.autorFila}>
            <Ionicons
              name="person-circle-outline"
              size={18}
              color={colores.textoGris}
            />
            <Text style={estilos.autor}>Receta de {receta.autor.nombre}</Text>
          </View>
        )}

        {receta.grupos?.length > 0 && (
          <View style={estilos.seccion}>
            <Text style={estilos.seccionTitulo}>Grupos</Text>
            <View style={estilos.gruposWrap}>
              {receta.grupos.map((g) => (
                <View key={g._id} style={estilos.chipGrupo}>
                  <Ionicons name="folder" size={12} color={colores.primario} />
                  <Text style={estilos.chipGrupoTexto}>{g.nombre}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/*  Ingredientes PREVIEW */}
        <View style={estilos.seccion}>
          <View style={estilos.seccionHeader}>
            <Text style={estilos.seccionTitulo}>Ingredientes</Text>
            <View style={estilos.contadorBadge}>
              <Text style={estilos.contadorTexto}>
                {receta.ingredientes.length}
              </Text>
            </View>
          </View>

          {ingredientesPreview.map((ing, i) => (
            <View key={i} style={estilos.ingrediente}>
              <View style={estilos.bullet} />
              <View style={estilos.ingredienteTextos}>
                <View style={estilos.ingredienteLinea}>
                  {(ing.cantidad || ing.unidadMedida) && (
                    <Text style={estilos.ingredienteCantidad}>
                      {[ing.cantidad, ing.unidadMedida]
                        .filter(Boolean)
                        .join(' ')}
                      {'  '}
                    </Text>
                  )}
                  <Text style={estilos.ingredienteNombre}>{ing.nombre}</Text>
                </View>
                {ing.notas ? (
                  <Text style={estilos.ingredienteNotas}>{ing.notas}</Text>
                ) : null}
              </View>
            </View>
          ))}

          {hayMasIngredientes && (
            <TouchableOpacity
              style={estilos.botonVerTodos}
              onPress={() =>
                navigation.navigate('VerIngredientes', {
                  ingredientes: receta.ingredientes,
                  tituloReceta: receta.titulo,
                })
              }
              activeOpacity={0.7}
            >
              <Ionicons name="list" size={20} color={colores.primario} />
              <Text style={estilos.botonVerTodosTexto}>
                Ver los {receta.ingredientes.length} ingredientes
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colores.primario}
              />
            </TouchableOpacity>
          )}
        </View>

        {/*  Pasos PREVIEW */}
        <View style={estilos.seccion}>
          <View style={estilos.seccionHeader}>
            <Text style={estilos.seccionTitulo}>Preparación</Text>
            <View style={estilos.contadorBadge}>
              <Text style={estilos.contadorTexto}>{receta.pasos.length}</Text>
            </View>
          </View>

          {pasosPreview.map((paso, i) => (
            <View key={i} style={estilos.paso}>
              <View style={estilos.pasoNumero}>
                <Text style={estilos.pasoNumeroTexto}>{i + 1}</Text>
              </View>
              <Text style={estilos.pasoTexto} numberOfLines={3}>
                {paso}
              </Text>
            </View>
          ))}

          {hayMasPasos && (
            <TouchableOpacity
              style={estilos.botonVerTodos}
              onPress={() =>
                navigation.navigate('VerPasos', {
                  pasos: receta.pasos,
                  tituloReceta: receta.titulo,
                })
              }
              activeOpacity={0.7}
            >
              <Ionicons name="list" size={20} color={colores.primario} />
              <Text style={estilos.botonVerTodosTexto}>
                Ver los {receta.pasos.length} pasos
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colores.primario}
              />
            </TouchableOpacity>
          )}
        </View>

        {receta.notas ? (
          <View style={estilos.seccion}>
            <Text style={estilos.seccionTitulo}>Notas</Text>
            <View style={estilos.notasCard}>
              <Ionicons
                name="bulb-outline"
                size={18}
                color={colores.advertencia}
                style={{ marginRight: espaciado.sm }}
              />
              <Text style={estilos.notasTexto}>{receta.notas}</Text>
            </View>
          </View>
        ) : null}

        {receta.fuente ? (
          <View style={estilos.seccion}>
            <Text style={estilos.seccionTitulo}>Fuente</Text>
            <View style={estilos.fuenteFila}>
              <Ionicons
                name="link-outline"
                size={16}
                color={colores.textoGris}
              />
              <Text style={estilos.fuenteTexto}>{receta.fuente}</Text>
            </View>
          </View>
        ) : null}

        <View style={estilos.fechasContenedor}>
          <Text style={estilos.fechaTexto}>
            Creada el{' '}
            {new Date(receta.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          {receta.updatedAt !== receta.createdAt && (
            <Text style={estilos.fechaTexto}>
              Última edición:{' '}
              {new Date(receta.updatedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoGris },
  scroll: { paddingBottom: espaciado.xxl },
  imagen: { width: '100%', height: 240 },
  imagenPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colores.primarioSuave,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenido: { padding: espaciado.lg },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    marginBottom: espaciado.sm,
    flexWrap: 'wrap',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: colores.texto,
    flexShrink: 1,
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  badgePublica: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colores.secundarioSuave,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 4,
    borderRadius: radios.full,
  },
  badgePublicaTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: colores.secundario,
  },
  descripcion: {
    fontSize: 15,
    color: colores.textoSuave,
    lineHeight: 22,
    marginBottom: espaciado.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.xs,
    marginBottom: espaciado.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colores.secundarioSuave,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 5,
    borderRadius: radios.full,
  },
  tagTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: colores.secundario,
  },
  metaCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colores.fondo,
    borderRadius: radios.lg,
    padding: espaciado.md,
    marginBottom: espaciado.md,
    ...sombras.suave,
  },
  metaItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: espaciado.sm,
  },
  metaIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colores.primarioSuave,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espaciado.xs,
  },
  metaLabel: {
    fontSize: 11,
    color: colores.textoGris,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValor: {
    fontSize: 14,
    fontWeight: '700',
    color: colores.texto,
    marginTop: 2,
  },
  autorFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: espaciado.md,
  },
  autor: {
    fontSize: 13,
    color: colores.textoGris,
    fontStyle: 'italic',
  },
  seccion: { marginTop: espaciado.lg },
  seccionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    marginBottom: espaciado.md,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: colores.texto,
    letterSpacing: -0.2,
  },
  contadorBadge: {
    backgroundColor: colores.primarioSuave,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 2,
    borderRadius: radios.full,
    minWidth: 24,
    alignItems: 'center',
  },
  contadorTexto: {
    fontSize: 11,
    fontWeight: '800',
    color: colores.primario,
  },
  gruposWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: espaciado.sm },
  chipGrupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colores.primarioSuave,
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.xs,
    borderRadius: radios.full,
  },
  chipGrupoTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.primario,
  },
  ingrediente: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: espaciado.sm,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colores.primario,
    marginTop: 8,
    marginRight: espaciado.sm,
  },
  ingredienteTextos: { flex: 1 },
  ingredienteLinea: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ingredienteCantidad: {
    fontSize: 14,
    color: colores.primario,
    fontWeight: '700',
  },
  ingredienteNombre: {
    fontSize: 15,
    color: colores.texto,
    fontWeight: '500',
  },
  ingredienteNotas: {
    fontSize: 12,
    color: colores.textoGris,
    fontStyle: 'italic',
    marginTop: 2,
  },
  paso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: espaciado.md,
  },
  pasoNumero: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
  },
  pasoNumeroTexto: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  pasoTexto: {
    flex: 1,
    fontSize: 15,
    color: colores.texto,
    lineHeight: 22,
    paddingTop: 5,
  },
  botonVerTodos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaciado.sm,
    backgroundColor: colores.primarioSuave,
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.md,
    marginTop: espaciado.md,
  },
  botonVerTodosTexto: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colores.primario,
  },
  notasCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colores.advertenciaSuave,
    borderRadius: radios.md,
    padding: espaciado.md,
  },
  notasTexto: {
    flex: 1,
    fontSize: 14,
    color: colores.texto,
    lineHeight: 20,
  },
  fuenteFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
  },
  fuenteTexto: {
    fontSize: 14,
    color: colores.textoSuave,
    fontStyle: 'italic',
    flex: 1,
  },
  fechasContenedor: {
    marginTop: espaciado.xl,
    paddingTop: espaciado.md,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  fechaTexto: {
    fontSize: 11,
    color: colores.textoClaro,
    textAlign: 'center',
    marginBottom: 2,
  },
  headerBotones: { flexDirection: 'row', gap: espaciado.sm },
  headerBoton: { padding: espaciado.xs },
});

export default PantallaDetalleReceta;