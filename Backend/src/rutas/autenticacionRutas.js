import express from 'express';
import {
  registrar,
  login,
  obtenerPerfil,
} from '../controladores/autenticacionControlador.js';
import { proteger } from '../middlewares/autenticacionMiddleware.js';

const router = express.Router();

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', proteger, obtenerPerfil);  

export default router;