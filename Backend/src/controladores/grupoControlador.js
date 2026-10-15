import Grupo from '../modelos/Grupo.js';
import Receta from '../modelos/Receta.js';

export const obtenerMisGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.find({ propietario: req.usuario._id })
      .collation({ locale: 'es', strength: 2 })
      .sort({ nombre: 1 });

    const gruposConConteo = await Promise.all(
      grupos.map(async (g) => {
        const cantidad = await Receta.countDocuments({ grupos: g._id });
        return { ...g.toObject(), cantidadRecetas: cantidad };
      })
    );

    res.json({ grupos: gruposConConteo });
  } catch (error) {
    console.error('Error en obtenerMisGrupos:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const obtenerGrupoPorId = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }

    
    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes acceso a este grupo' });
    }

    const recetas = await Receta.find({ grupos: grupo._id })
      .collation({ locale: 'es', strength: 2 })
      .sort({ titulo: 1 })
      .select('titulo descripcion imagenUrl tiempoPreparacion porciones');

    res.json({ grupo, recetas });
  } catch (error) {
    console.error('Error en obtenerGrupoPorId:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const crearGrupo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body || {};

    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    const grupo = await Grupo.create({
      nombre,
      descripcion,
      propietario: req.usuario._id,
    });

    res.status(201).json({ mensaje: 'Grupo creado', grupo });
  } catch (error) {
    console.error('Error en crearGrupo:', error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ mensaje: 'Ya tienes un grupo con ese nombre' });
    }
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }

    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


export const actualizarGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes acceso a este grupo' });
    }

    const { nombre, descripcion } = req.body || {};
    if (nombre !== undefined) grupo.nombre = nombre;
    if (descripcion !== undefined) grupo.descripcion = descripcion;

    const actualizado = await grupo.save();

    res.json({ mensaje: 'Grupo actualizado', grupo: actualizado });
  } catch (error) {
    console.error('Error en actualizarGrupo:', error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ mensaje: 'Ya tienes un grupo con ese nombre' });
    }
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }

    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const previsualizarBorradoGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes acceso a este grupo' });
    }

    const recetasDelGrupo = await Receta.find({ grupos: grupo._id }).select(
      'grupos'
    );

    
    let tambienEnOtrosGrupos = 0;
    for (const r of recetasDelGrupo) {
      const otrosGrupos = r.grupos.filter(
        (gid) => gid.toString() !== grupo._id.toString()
      );
      if (otrosGrupos.length > 0) tambienEnOtrosGrupos++;
    }

    res.json({
      grupo: { _id: grupo._id, nombre: grupo.nombre },
      totalRecetas: recetasDelGrupo.length,
      recetasQueSeBorran: recetasDelGrupo.length, 
      recetasTambienEnOtrosGrupos: tambienEnOtrosGrupos,
    });
  } catch (error) {
    console.error('Error en previsualizarBorradoGrupo:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const borrarGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    if (grupo.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes acceso a este grupo' });
    }

    const grupoId = grupo._id;

    
    const recetas = await Receta.find({ grupos: grupoId }).select('_id');
    const idsRecetas = recetas.map((r) => r._id);

   
    if (idsRecetas.length > 0) {
      await Receta.deleteMany({ _id: { $in: idsRecetas } });
    }


    await Grupo.findByIdAndDelete(grupoId);

    res.json({
      mensaje: 'Grupo eliminado',
      recetasBorradas: idsRecetas.length,
    });
  } catch (error) {
    console.error('Error en borrarGrupo:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};