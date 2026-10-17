import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as recetaApi from '../../api/recetaApi';
import * as grupoApi from '../../api/grupoApi';
import CampoTexto from '../../componentes/CampoTexto';
import BotonAnimado from '../../componentes/BotonAnimado';
import SelectorImagen from '../../componentes/SelectorImagen';
import SelectorGrupos from '../../componentes/SelectorGrupos';
import Cargando from '../../componentes/Cargando';
import { useAlerta } from '../../contexto/AlertasContexto';
import { colores, espaciado, radios } from '../../tema/colores';

const CATEGORIAS = [
  'Postres',
  'Almuerzos',
  'Cenas',
  'Desayunos',
  'Bebidas',
  'Entradas',
  'Ensaladas',
  'Sopas',
  'Panadería',
  'Snacks',
  'Otros',
];
const DIFICULTADES = ['Fácil', 'Media', 'Difícil'];

const LIMITES = {
  tiempoPreparacion: 1440,
  tiempoCoccion: 4500,
  porciones: 100,
  calorias: 9999,
  etiquetas: 10,
  etiquetaChars: 20,
  tituloMax: 120,
  descripcionMax: 500,
  notasMax: 1000,
  fuenteMax: 200,
};

const PantallaFormularioReceta = ({ route, navigation }) => {
  const recetaId = route.params?.recetaId;
  const esEdicion = !!recetaId;

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempoPreparacion, setTiempoPreparacion] = useState('');
  const [tiempoCoccion, setTiempoCoccion] = useState('');
  const [porciones, setPorciones] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [esPublica, setEsPublica] = useState(false);
  const [dificultad, setDificultad] = useState('Fácil');
  const [categoria, setCategoria] = useState('Otros');
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetaInput, setEtiquetaInput] = useState('');
  const [calorias, setCalorias] = useState('');
  const [notas, setNotas] = useState('');
  const [fuente, setFuente] = useState('');

  const [ingredientes, setIngredientes] = useState([
    { nombre: '', cantidad: '', unidadMedida: '', notas: '' },
  ]);
  const [pasos, setPasos] = useState(['']);
  const [grupos, setGrupos] = useState([]);
  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [gruposPrevios, setGruposPrevios] = useState([]);

  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(esEdicion);

  const { mostrarAlerta } = useAlerta();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: esEdicion ? 'Editar receta' : 'Nueva receta',
    });
  }, [esEdicion, navigation]);

  
  useEffect(() => {
    const cargar = async () => {
      try {
        const misGrupos = await grupoApi.obtenerMisGrupos();
        setGrupos(misGrupos);

        if (esEdicion) {
          const receta = await recetaApi.obtenerReceta(recetaId);
          setTitulo(receta.titulo);
          setDescripcion(receta.descripcion || '');
          setTiempoPreparacion(receta.tiempoPreparacion?.toString() || '');
          setTiempoCoccion(receta.tiempoCoccion?.toString() || '');
          setPorciones(receta.porciones?.toString() || '');
          setImagenUrl(receta.imagenUrl || '');
          setEsPublica(receta.esPublica);
          setDificultad(receta.dificultad || 'Fácil');
          setCategoria(receta.categoria || 'Otros');
          setEtiquetas(receta.etiquetas || []);
          setCalorias(receta.calorias?.toString() || '');
          setNotas(receta.notas || '');
          setFuente(receta.fuente || '');
          setIngredientes(
            receta.ingredientes.length > 0
              ? receta.ingredientes.map((i) => ({
                  nombre: i.nombre || '',
                  cantidad: i.cantidad || '',
                  unidadMedida: i.unidadMedida || '',
                  notas: i.notas || '',
                }))
              : [{ nombre: '', cantidad: '', unidadMedida: '', notas: '' }]
          );
          setPasos(receta.pasos.length > 0 ? receta.pasos : ['']);
          const ids = receta.grupos.map((g) => g._id);
          setGruposSeleccionados(ids);
          setGruposPrevios(ids);
        }
      } catch (error) {
        mostrarAlerta('Error', 'No se pudo cargar la información', 'error');
        navigation.goBack();
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [recetaId]);

  
  useFocusEffect(
    useCallback(() => {
      const recargarGrupos = async () => {
        try {
          const misGrupos = await grupoApi.obtenerMisGrupos();
          setGrupos(misGrupos);
        } catch (error) {
          // silencioso
        }
      };
      recargarGrupos();
    }, [])
  );

  const irAEditarIngredientes = () => {
    navigation.navigate('EditarIngredientes', {
      ingredientes,
      onSave: (nuevosIngredientes) => setIngredientes(nuevosIngredientes),
    });
  };

  const irAEditarPasos = () => {
    navigation.navigate('EditarPasos', {
      pasos,
      onSave: (nuevosPasos) => setPasos(nuevosPasos),
    });
  };

  const toggleGrupo = (grupoId) => {
    setGruposSeleccionados((prev) =>
      prev.includes(grupoId)
        ? prev.filter((id) => id !== grupoId)
        : [...prev, grupoId]
    );
  };

  const agregarEtiqueta = () => {
    const t = etiquetaInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (!t) {
      // Si está vacío, no hace nada
      return;
    }
    if (etiquetas.includes(t)) {
      setEtiquetaInput('');
      return;
    }
    if (etiquetas.length >= LIMITES.etiquetas) {
      mostrarAlerta(
        'Límite alcanzado',
        `Máximo ${LIMITES.etiquetas} etiquetas por receta.`,
        'advertencia'
      );
      return;
    }
    setEtiquetas([...etiquetas, t]);
    setEtiquetaInput('');
  };

  const eliminarEtiqueta = (t) => {
    setEtiquetas(etiquetas.filter((e) => e !== t));
  };

  const manejarGuardar = async () => {
    if (!titulo.trim()) {
      mostrarAlerta(
        'Falta el título',
        'El título es obligatorio.',
        'advertencia'
      );
      return;
    }

    const ingLimpios = ingredientes.filter((i) => i.nombre.trim());
    if (ingLimpios.length === 0) {
      mostrarAlerta(
        'Sin ingredientes',
        'Agrega al menos un ingrediente.',
        'advertencia'
      );
      return;
    }

    for (const ing of ingLimpios) {
      const faltan = [];
      if (!ing.cantidad || !ing.cantidad.trim()) faltan.push('cantidad');
      if (!ing.unidadMedida || !ing.unidadMedida.trim()) faltan.push('unidad');

      if (faltan.length > 0) {
        const texto =
          faltan.length === 2
            ? 'la cantidad y la unidad de medida'
            : faltan[0] === 'cantidad'
            ? 'la cantidad'
            : 'la unidad de medida';
        mostrarAlerta(
          'Falta completar',
          `En el ingrediente "${ing.nombre}", ingresa ${texto}.`,
          'advertencia'
        );
        return;
      }
    }

    const pasosLimpios = pasos.filter((p) => p.trim());
    if (pasosLimpios.length === 0) {
      mostrarAlerta('Sin pasos', 'Agrega al menos un paso.', 'advertencia');
      return;
    }

    const tiempoPrep = parseInt(tiempoPreparacion) || 0;
    const tiempoCoc = parseInt(tiempoCoccion) || 0;
    const porc = parseInt(porciones) || 1;
    const kcal = parseInt(calorias) || 0;

    if (tiempoPrep > LIMITES.tiempoPreparacion) {
      mostrarAlerta(
        'Tiempo excedido',
        `Preparación no puede superar ${LIMITES.tiempoPreparacion / 60}h.`,
        'advertencia'
      );
      return;
    }
    if (tiempoCoc > LIMITES.tiempoCoccion) {
      mostrarAlerta(
        'Tiempo excedido',
        `Cocción no puede superar ${LIMITES.tiempoCoccion / 60}h.`,
        'advertencia'
      );
      return;
    }
    if (porc < 1 || porc > LIMITES.porciones) {
      mostrarAlerta(
        'Porciones inválidas',
        `Porciones entre 1 y ${LIMITES.porciones}.`,
        'advertencia'
      );
      return;
    }

    setGuardando(true);
    try {
      const datos = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        ingredientes: ingLimpios,
        pasos: pasosLimpios,
        tiempoPreparacion: tiempoPrep,
        tiempoCoccion: tiempoCoc,
        porciones: porc,
        dificultad,
        categoria,
        etiquetas,
        calorias: kcal,
        notas: notas.trim(),
        fuente: fuente.trim(),
        imagenUrl: imagenUrl.trim(),
        esPublica,
      };

      let recetaGuardada;
      if (esEdicion) {
        recetaGuardada = await recetaApi.actualizarReceta(recetaId, datos);
      } else {
        recetaGuardada = await recetaApi.crearReceta(datos);
      }

      const aAgregar = gruposSeleccionados.filter(
        (id) => !gruposPrevios.includes(id)
      );
      const aQuitar = gruposPrevios.filter(
        (id) => !gruposSeleccionados.includes(id)
      );

      await Promise.all([
        ...aAgregar.map((gId) =>
          recetaApi.agregarRecetaAGrupo(recetaGuardada._id, gId)
        ),
        ...aQuitar.map((gId) =>
          recetaApi.quitarRecetaDeGrupo(recetaGuardada._id, gId)
        ),
      ]);

      navigation.goBack();
    } catch (error) {
      mostrarAlerta(
        'Error al guardar',
        error.response?.data?.mensaje || 'No se pudo guardar la receta',
        'error'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Cargando receta..." />;

  const ingConNombre = ingredientes.filter((i) => i.nombre.trim()).length;
  const pasosConTexto = pasos.filter((p) => p.trim()).length;

  return (
    <KeyboardAvoidingView
      style={estilos.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.seccionTitulo}>Foto de la receta</Text>
        <SelectorImagen imagenUrl={imagenUrl} onChange={setImagenUrl} />

        <Text style={estilos.seccionTitulo}>Información básica</Text>

        <CampoTexto
          etiqueta={`Título * (${titulo.length}/${LIMITES.tituloMax})`}
          icono="restaurant-outline"
          placeholder="Ej: Torta de chocolate"
          value={titulo}
          onChangeText={setTitulo}
          sinEspaciosIniciales
          maxDigitos={LIMITES.tituloMax}
        />

        <CampoTexto
          etiqueta={`Descripción (${descripcion.length}/${LIMITES.descripcionMax})`}
          icono="document-text-outline"
          placeholder="Una breve descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          maxDigitos={LIMITES.descripcionMax}
          multiline
          numberOfLines={3}
        />

        <View style={estilos.filaDoble}>
          <View style={{ flex: 1 }}>
            <CampoTexto
              etiqueta="Prep. (min)"
              icono="time-outline"
              placeholder="30"
              value={tiempoPreparacion}
              onChangeText={setTiempoPreparacion}
              keyboardType="numeric"
              soloDigitos
              maxDigitos={4}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CampoTexto
              etiqueta="Cocción (min)"
              icono="flame-outline"
              placeholder="45"
              value={tiempoCoccion}
              onChangeText={setTiempoCoccion}
              keyboardType="numeric"
              soloDigitos
              maxDigitos={4}
            />
          </View>
        </View>

        <View style={estilos.filaDoble}>
          <View style={{ flex: 1 }}>
            <CampoTexto
              etiqueta="Porciones"
              icono="people-outline"
              placeholder="4"
              value={porciones}
              onChangeText={setPorciones}
              keyboardType="numeric"
              soloDigitos
              maxDigitos={3}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CampoTexto
              etiqueta="Calorías"
              icono="nutrition-outline"
              placeholder="250"
              value={calorias}
              onChangeText={setCalorias}
              keyboardType="numeric"
              soloDigitos
              maxDigitos={4}
            />
          </View>
        </View>

        <Text style={estilos.etiqueta}>Dificultad</Text>
        <View style={estilos.chipsRow}>
          {DIFICULTADES.map((d) => (
            <TouchableOpacity
              key={d}
              style={[estilos.chip, dificultad === d && estilos.chipActivo]}
              onPress={() => setDificultad(d)}
            >
              <Text
                style={[
                  estilos.chipTexto,
                  dificultad === d && estilos.chipTextoActivo,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={estilos.etiqueta}>Categoría</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.chipsScroll}
        >
          {CATEGORIAS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[estilos.chip, categoria === c && estilos.chipActivo]}
              onPress={() => setCategoria(c)}
            >
              <Text
                style={[
                  estilos.chipTexto,
                  categoria === c && estilos.chipTextoActivo,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/*  Etiquetas */}
        <Text style={estilos.etiqueta}>
          Etiquetas ({etiquetas.length}/{LIMITES.etiquetas})
        </Text>
        
        <View style={estilos.inputEtiquetaContenedor}>
          <RNTextInput
            style={estilos.inputEtiqueta}
            placeholder="Escribe una etiqueta"
            placeholderTextColor={colores.textoClaro}
            value={etiquetaInput}
            onChangeText={setEtiquetaInput}
            selectionColor={colores.primario}
            cursorColor={colores.primario}
            caretHidden={false}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={LIMITES.etiquetaChars}
            onSubmitEditing={agregarEtiqueta}
            blurOnSubmit={false}
            returnKeyType="done"
          />
          
          {/*  BOTÓN + CON VIDA */}
          <TouchableOpacity
            onPress={agregarEtiqueta}
            style={[
              estilos.botonAgregarEtiqueta,
              etiquetaInput.trim().length === 0 && { opacity: 0.5 } // Se apaga si está vacío
            ]}
            activeOpacity={0.6}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons 
              name="add-circle" 
              size={36} 
              color={colores.primario} 
            />
          </TouchableOpacity>
        </View>

        <Text style={estilos.contadorCaracteres}>
          {etiquetaInput.length}/{LIMITES.etiquetaChars} caracteres
        </Text>

        {etiquetas.length > 0 && (
          <View style={estilos.etiquetasWrap}>
            {etiquetas.map((t, index) => (
              <TouchableOpacity
                key={`${t}-${index}`}
                style={estilos.etiquetaChip}
                onPress={() => eliminarEtiqueta(t)}
                activeOpacity={0.7}
              >
                <Text style={estilos.etiquetaChipTexto}>{t}</Text>
                <Ionicons name="close" size={12} color={colores.primario} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/*  Ingredientes */}
        <Text style={estilos.seccionTitulo}>Ingredientes</Text>
        <TouchableOpacity
          style={estilos.botonSeccion}
          onPress={irAEditarIngredientes}
          activeOpacity={0.7}
        >
          <View style={estilos.botonSeccionIcono}>
            <Ionicons
              name="nutrition-outline"
              size={22}
              color={colores.primario}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={estilos.botonSeccionTitulo}>
              {ingConNombre === 0
                ? 'Agregar ingredientes'
                : 'Editar ingredientes'}
            </Text>
            <Text style={estilos.botonSeccionSub}>
              {ingConNombre === 0
                ? 'Toca para agregar'
                : `${ingConNombre} ${
                    ingConNombre === 1 ? 'ingrediente' : 'ingredientes'
                  } agregado${ingConNombre === 1 ? '' : 's'}`}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={colores.textoClaro}
          />
        </TouchableOpacity>

        {/*  Pasos */}
        <Text style={estilos.seccionTitulo}>Pasos</Text>
        <TouchableOpacity
          style={estilos.botonSeccion}
          onPress={irAEditarPasos}
          activeOpacity={0.7}
        >
          <View style={estilos.botonSeccionIcono}>
            <Ionicons name="list-outline" size={22} color={colores.primario} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={estilos.botonSeccionTitulo}>
              {pasosConTexto === 0 ? 'Agregar pasos' : 'Editar pasos'}
            </Text>
            <Text style={estilos.botonSeccionSub}>
              {pasosConTexto === 0
                ? 'Toca para agregar'
                : `${pasosConTexto} ${
                    pasosConTexto === 1 ? 'paso agregado' : 'pasos agregados'
                  }`}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={colores.textoClaro}
          />
        </TouchableOpacity>

        {/*  Detalles adicionales */}
        <Text style={estilos.seccionTitulo}>Detalles adicionales</Text>

        <CampoTexto
          etiqueta={`Fuente (${fuente.length}/${LIMITES.fuenteMax})`}
          icono="book-outline"
          placeholder="Ej: Receta de la abuela"
          value={fuente}
          onChangeText={setFuente}
          maxDigitos={LIMITES.fuenteMax}
        />

        <CampoTexto
          etiqueta={`Notas (${notas.length}/${LIMITES.notasMax})`}
          icono="bulb-outline"
          placeholder="Tips, variaciones..."
          value={notas}
          onChangeText={setNotas}
          multiline
          numberOfLines={4}
          maxDigitos={LIMITES.notasMax}
        />

        <View style={estilos.switchFila}>
          <View style={estilos.switchTexto}>
            <Text style={estilos.switchTitulo}>Compartir públicamente</Text>
            <Text style={estilos.switchSubtitulo}>
              Aparecerá en "Recetas generales"
            </Text>
          </View>
          <Switch
            value={esPublica}
            onValueChange={setEsPublica}
            trackColor={{ false: colores.borde, true: colores.primarioClaro }}
            thumbColor={esPublica ? colores.primario : '#fff'}
          />
        </View>

        {/*  Grupos */}
        <Text style={estilos.seccionTitulo}>Grupos (opcional)</Text>
        <Text style={estilos.seccionSubtitulo}>
          Puedes agregar esta receta a varios grupos a la vez
        </Text>

        <SelectorGrupos
          grupos={grupos}
          seleccionados={gruposSeleccionados}
          onToggle={toggleGrupo}
        />

        <BotonAnimado
          titulo={esEdicion ? 'Guardar cambios' : 'Crear receta'}
          icono={esEdicion ? 'checkmark' : 'add-circle-outline'}
          onPress={manejarGuardar}
          cargando={guardando}
          style={{ marginTop: espaciado.xl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondoCremoso },
  scroll: { padding: espaciado.lg, paddingBottom: espaciado.xxl },
  seccionTitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: colores.texto,
    marginTop: espaciado.lg,
    marginBottom: espaciado.xs,
    letterSpacing: -0.2,
  },
  seccionSubtitulo: {
    fontSize: 13,
    color: colores.textoGris,
    marginBottom: espaciado.md,
  },
  filaDoble: { flexDirection: 'row', gap: espaciado.md },
  etiqueta: {
    fontSize: 13,
    fontWeight: '700',
    color: colores.textoSuave,
    marginTop: espaciado.md,
    marginBottom: espaciado.xs,
    letterSpacing: 0.3,
  },
  chipsRow: { flexDirection: 'row', gap: espaciado.sm, flexWrap: 'wrap' },
  chipsScroll: { gap: espaciado.sm, paddingVertical: 4 },
  chip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: 8,
    borderRadius: radios.full,
    backgroundColor: colores.fondo,
    borderWidth: 1.5,
    borderColor: colores.borde,
    marginRight: espaciado.xs,
  },
  chipActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoSuave,
  },
  chipTextoActivo: { color: '#fff' },

  
  inputEtiquetaContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
  },
  inputEtiqueta: {
    flex: 1,
    backgroundColor: colores.fondo,
    borderRadius: radios.sm,
    borderWidth: 1.5,
    borderColor: colores.borde,
    paddingHorizontal: espaciado.md,
    paddingVertical: 12,
    fontSize: 14,
    color: colores.texto,
    minHeight: 50,
  },
  botonAgregarEtiqueta: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorCaracteres: {
    fontSize: 11,
    color: colores.textoClaro,
    textAlign: 'right',
    marginTop: 4,
    fontWeight: '600',
  },
  etiquetasWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.xs,
    marginTop: espaciado.sm,
  },
  etiquetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colores.primarioSuave,
    paddingHorizontal: espaciado.sm,
    paddingVertical: 5,
    borderRadius: radios.full,
  },
  etiquetaChipTexto: {
    fontSize: 12,
    color: colores.primario,
    fontWeight: '600',
  },

  // Switch
  switchFila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    padding: espaciado.md,
    borderRadius: radios.md,
    marginTop: espaciado.md,
    borderWidth: 1.5,
    borderColor: colores.borde,
  },
  switchTexto: { flex: 1 },
  switchTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.texto,
  },
  switchSubtitulo: {
    fontSize: 12,
    color: colores.textoGris,
    marginTop: 2,
  },

 
  botonSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    borderRadius: radios.md,
    padding: espaciado.md,
    marginBottom: espaciado.md,
    borderWidth: 1.5,
    borderColor: colores.borde,
  },
  botonSeccionIcono: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colores.primarioSuave,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espaciado.md,
  },
  botonSeccionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colores.texto,
  },
  botonSeccionSub: {
    fontSize: 12,
    color: colores.textoGris,
    marginTop: 2,
  },
});

export default PantallaFormularioReceta;