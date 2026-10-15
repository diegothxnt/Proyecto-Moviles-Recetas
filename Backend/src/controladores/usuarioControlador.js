import Usuario from '../modelos/Usuario.js';


export const obtenerMiPerfil = async (req, res) => {
  res.json({ usuario: req.usuario });
};


export const actualizarMiPerfil = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        mensaje: 'Debes enviar al menos un campo para actualizar',
      });
    }

    const { nombre, correo, contrasena, avatarUrl } = req.body;

    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (correo && correo.toLowerCase() !== usuario.correo) {
      const existe = await Usuario.findOne({ correo: correo.toLowerCase() });
      if (existe) {
        return res
          .status(400)
          .json({ mensaje: 'Ese correo ya está registrado por otro usuario' });
      }
      usuario.correo = correo;
    }

    if (nombre) usuario.nombre = nombre;
    if (avatarUrl !== undefined) usuario.avatarUrl = avatarUrl;
    if (contrasena && contrasena.length >= 6) {
      usuario.contrasena = contrasena;
    }

    const actualizado = await usuario.save();

    res.json({
      mensaje: 'Perfil actualizado',
      usuario: {
        _id: actualizado._id,
        nombre: actualizado.nombre,
        correo: actualizado.correo,
        avatarUrl: actualizado.avatarUrl,
        createdAt: actualizado.createdAt,
        updatedAt: actualizado.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error en actualizarMiPerfil:', error);

    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Ese correo ya está en uso' });
    }
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

export const borrarMiCuenta = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.activo = false;
    usuario.fechaEliminacion = new Date();
    await usuario.save();

    res.json({
      mensaje:
        'Cuenta desactivada. Tus datos se conservan por si deseas volver. Solo inicia sesión con tus credenciales para reactivarla.',
    });
  } catch (error) {
    console.error('Error en borrarMiCuenta:', error);
    res.status(500).json({ mensaje: 'Error al desactivar la cuenta' });
  }
};