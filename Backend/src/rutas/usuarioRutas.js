import express from 'express';
import {
  obtenerMiPerfil,
  actualizarMiPerfil,
  borrarMiCuenta,
} from '../controladores/usuarioControlador.js';
import { proteger } from '../middlewares/autenticacionMiddleware.js';

const router = express.Router();
router.use(proteger);

router.get('/perfil', obtenerMiPerfil);
router.put('/perfil', actualizarMiPerfil);
router.delete('/perfil', borrarMiCuenta);

export default router;