import dotenv from 'dotenv';
import app from './src/app.js';
import conectarBD from './src/config/baseDatos.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const iniciar = async () => {
  await conectarBD();
  app.listen(PORT, () => {
    console.log(` Servidor en puerto ${PORT}`);
  });
};

iniciar();