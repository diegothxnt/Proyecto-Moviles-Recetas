import Receta from '../modelos/Receta.js';
import Grupo from '../modelos/Grupo.js';

export const obtenerMisRecetas = async (req, res) => {
  try {
    const recetas = await Receta.find({ autor: req.usuario._id })
      .collation({ locale: 'es', strength: 2 })
      .sort({ titulo: 1 })
      .populate('grupos', 'nombre');

    res.json({ recetas });
  } catch (error) {
    console.error('Error en obtenerMisRecetas:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const obtenerRecetasGenerales = async (req, res) => {
  try {
    const recetas = await Receta.find({ esPublica: true })
      .collation({ locale: 'es', strength: 2 })
      .sort({ titulo: 1 })
      .populate('autor', 'nombre avatarUrl')
      .populate('grupos', 'nombre');

    res.json({ recetas });
  } catch (error) {
    console.error('Error en obtenerRecetasGenerales:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const obtenerRecetaPorId = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id)
      .populate('autor', 'nombre avatarUrl')
      .populate('grupos', 'nombre');

    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }

    
    const esAutor = receta.autor._id.toString() === req.usuario._id.toString();
    if (!esAutor && !receta.esPublica) {
      return res.status(403).json({ mensaje: 'No tienes acceso a esta receta' });
    }

    res.json({ receta });
  } catch (error) {
    console.error('Error en obtenerRecetaPorId:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const crearReceta = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      ingredientes,
      pasos,
      tiempoPreparacion,
      tiempoCoccion,
      porciones,
      dificultad,
      categoria,
      etiquetas,
      calorias,
      notas,
      fuente,
      imagenUrl,
      esPublica,
    } = req.body || {};

    if (!titulo) {
      return res.status(400).json({ mensaje: 'El título es obligatorio' });
    }
    if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
      return res
        .status(400)
        .json({ mensaje: 'Debes incluir al menos un ingrediente' });
    }
    if (!Array.isArray(pasos) || pasos.length === 0) {
      return res.status(400).json({ mensaje: 'Debes incluir al menos un paso' });
    }

    const existe = await Receta.findOne({
      autor: req.usuario._id,
      titulo: titulo.trim(),
    }).collation({ locale: 'es', strength: 2 });

    if (existe) {
      return res.status(400).json({
        mensaje: `Ya tienes una receta con el título "${titulo}"`,
      });
    }

    const receta = await Receta.create({
      titulo: titulo.trim(),
      descripcion,
      ingredientes,
      pasos,
      tiempoPreparacion,
      tiempoCoccion,
      porciones,
      dificultad,
      categoria,
      etiquetas: etiquetas || [],
      calorias,
      notas,
      fuente,
      imagenUrl,
      esPublica: !!esPublica,
      autor: req.usuario._id,
      grupos: [],
    });

    res.status(201).json({ mensaje: 'Receta creada', receta });
  } catch (error) {
    console.error('Error en crearReceta:', error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ mensaje: 'Ya tienes una receta con ese título' });
    }
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const actualizarReceta = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    if (receta.autor.toString() !== req.usuario._id.toString()) {
      return res
        .status(403)
        .json({ mensaje: 'No eres el autor de esta receta' });
    }

    const {
      titulo,
      descripcion,
      ingredientes,
      pasos,
      tiempoPreparacion,
      tiempoCoccion,
      porciones,
      dificultad,
      categoria,
      etiquetas,
      calorias,
      notas,
      fuente,
      imagenUrl,
      esPublica,
    } = req.body || {};

    if (titulo && titulo.trim() !== receta.titulo) {
      const existe = await Receta.findOne({
        _id: { $ne: receta._id },
        autor: req.usuario._id,
        titulo: titulo.trim(),
      }).collation({ locale: 'es', strength: 2 });

      if (existe) {
        return res.status(400).json({
          mensaje: `Ya tienes otra receta con el título "${titulo}"`,
        });
      }
      receta.titulo = titulo.trim();
    }

    if (descripcion !== undefined) receta.descripcion = descripcion;
    if (Array.isArray(ingredientes) && ingredientes.length > 0)
      receta.ingredientes = ingredientes;
    if (Array.isArray(pasos) && pasos.length > 0) receta.pasos = pasos;
    if (tiempoPreparacion !== undefined)
      receta.tiempoPreparacion = tiempoPreparacion;
    if (tiempoCoccion !== undefined) receta.tiempoCoccion = tiempoCoccion;
    if (porciones !== undefined) receta.porciones = porciones;
    if (dificultad !== undefined) receta.dificultad = dificultad;
    if (categoria !== undefined) receta.categoria = categoria;
    if (etiquetas !== undefined) receta.etiquetas = etiquetas;
    if (calorias !== undefined) receta.calorias = calorias;
    if (notas !== undefined) receta.notas = notas;
    if (fuente !== undefined) receta.fuente = fuente;
    if (imagenUrl !== undefined) receta.imagenUrl = imagenUrl;
    if (esPublica !== undefined) receta.esPublica = !!esPublica;

    const actualizada = await receta.save();
    res.json({ mensaje: 'Receta actualizada', receta: actualizada });
  } catch (error) {
    console.error('Error en actualizarReceta:', error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ mensaje: 'Ya tienes una receta con ese título' });
    }
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const borrarReceta = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    if (receta.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No eres el autor de esta receta' });
    }

    await Receta.findByIdAndDelete(receta._id);

    res.json({ mensaje: 'Receta eliminada' });
  } catch (error) {
    console.error('Error en borrarReceta:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const agregarRecetaAGrupo = async (req, res) => {
  try {
    const { id, grupoId } = req.params;

    const receta = await Receta.findById(id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    if (receta.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No eres el autor de esta receta' });
    }

    const grupo = await Grupo.findById(grupoId);
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No eres el dueño de este grupo' });
    }

    const actualizada = await Receta.findByIdAndUpdate(
  id,
  { $addToSet: { grupos: grupoId } },
  { returnDocument: 'after' }   
).populate('grupos', 'nombre');

    res.json({ mensaje: `Receta añadida al grupo "${grupo.nombre}"`, receta: actualizada });
  } catch (error) {
    console.error('Error en agregarRecetaAGrupo:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Receta o grupo no encontrado' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const quitarRecetaDeGrupo = async (req, res) => {
  try {
    const { id, grupoId } = req.params;

    const receta = await Receta.findById(id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    if (receta.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No eres el autor de esta receta' });
    }

    const grupo = await Grupo.findById(grupoId);
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No eres el dueño de este grupo' });
    }

    const actualizada = await Receta.findByIdAndUpdate(
      id,
      { $pull: { grupos: grupoId } },
      { returnDocument: 'after' }
    ).populate('grupos', 'nombre');

    res.json({
      mensaje: `Receta quitada del grupo "${grupo.nombre}"`,
      receta: actualizada,
    });
  } catch (error) {
    console.error('Error en quitarRecetaDeGrupo:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Receta o grupo no encontrado' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};