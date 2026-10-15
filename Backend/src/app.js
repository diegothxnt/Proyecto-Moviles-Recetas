import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import autenticacionRutas from './rutas/autenticacionRutas.js';
import usuarioRutas from './rutas/usuarioRutas.js';
import grupoRutas from './rutas/grupoRutas.js';
import recetaRutas from './rutas/recetaRutas.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de recetas funcionando ' });
});

app.use('/api/auth', autenticacionRutas);
app.use('/api/usuarios', usuarioRutas);
app.use('/api/grupos', grupoRutas);
app.use('/api/recetas', recetaRutas);

export default app;