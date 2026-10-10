import Usuario from '../modelos/Usuario.js';
import generarToken from '../utilidades/generarToken.js';

export const registrar = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        mensaje: 'Nombre, correo y contraseña son obligatorios',
      });
    }

    const existe = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (existe) {
      if (!existe.activo) {
        return res.status(400).json({
          mensaje:
            'Ya existe una cuenta con ese correo. Inicia sesión para reactivarla.',
        });
      }
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const usuario = await Usuario.create({ nombre, correo, contrasena });
    const token = generarToken(usuario._id);

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        avatarUrl: usuario.avatarUrl,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error en registrar:', error);

    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios',
      });
    }

    const usuario = await Usuario.findOne({
      correo: correo.toLowerCase(),
    }).select('+contrasena');

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const coincide = await usuario.compararContrasena(contrasena);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    
    let reactivada = false;
    if (!usuario.activo) {
      usuario.activo = true;
      usuario.fechaEliminacion = null;
      await usuario.save();
      reactivada = true;
    }

    const token = generarToken(usuario._id);

    res.json({
      mensaje: reactivada
        ? 'Cuenta reactivada. Bienvenido de vuelta'
        : 'Login exitoso',
      token,
      reactivada,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        avatarUrl: usuario.avatarUrl,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


export const obtenerPerfil = async (req, res) => {
  res.json({ usuario: req.usuario });
};