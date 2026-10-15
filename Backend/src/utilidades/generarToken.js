import jwt from 'jsonwebtoken';

const generarToken = (idUsuario) => {
  return jwt.sign(
    { id: idUsuario },              
    process.env.JWT_SECRET,         
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );
};

export default generarToken;