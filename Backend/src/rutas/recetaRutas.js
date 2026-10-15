import express from 'express';
import {
  obtenerMisRecetas,
  obtenerRecetasGenerales,
  obtenerRecetaPorId,
  crearReceta,
  actualizarReceta,
  borrarReceta,
  agregarRecetaAGrupo,
  quitarRecetaDeGrupo,
} from '../controladores/recetaControlador.js';
import { proteger } from '../middlewares/autenticacionMiddleware.js';

const router = express.Router();

router.use(proteger);


router.get('/mias', obtenerMisRecetas);
router.get('/', obtenerRecetasGenerales);
router.post('/', crearReceta);

router.get('/:id', obtenerRecetaPorId);
router.put('/:id', actualizarReceta);
router.delete('/:id', borrarReceta);

router.post('/:id/grupos/:grupoId', agregarRecetaAGrupo);
router.delete('/:id/grupos/:grupoId', quitarRecetaDeGrupo);

export default router;