import mongoose from 'mongoose';

const conectarBD = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI);
    console.log(` MongoDB conectado: ${conexion.connection.host}`);
  } catch (error) {
    console.error(' Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};

export default conectarBD;