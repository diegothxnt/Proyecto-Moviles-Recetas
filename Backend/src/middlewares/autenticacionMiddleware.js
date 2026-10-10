import jwt from 'jsonwebtoken';
import Usuario from '../modelos/Usuario.js';

export const proteger = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.usuario = await Usuario.findById(decoded.id);

      if (!req.usuario) {
        return res.status(401).json({ mensaje: 'Usuario no encontrado' });
      }

      if (!req.usuario.activo) {
        return res
          .status(401)
          .json({ mensaje: 'Cuenta desactivada. Inicia sesión para reactivar.' });
      }

      next();
    } catch (error) {
      console.error('Error al verificar token:', error.message);
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
  } else {
    return res.status(401).json({ mensaje: 'No autorizado, falta el token' });
  }
};