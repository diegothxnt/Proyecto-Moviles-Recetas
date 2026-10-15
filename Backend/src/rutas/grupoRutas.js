import express from 'express';
import {
  obtenerMisGrupos,
  obtenerGrupoPorId,
  crearGrupo,
  actualizarGrupo,
  borrarGrupo,
  previsualizarBorradoGrupo,
} from '../controladores/grupoControlador.js';
import { proteger } from '../middlewares/autenticacionMiddleware.js';

const router = express.Router();

router.use(proteger);

router.get('/', obtenerMisGrupos);
router.post('/', crearGrupo);
router.get('/:id', obtenerGrupoPorId);
router.put('/:id', actualizarGrupo);
router.get('/:id/previsualizar-borrado', previsualizarBorradoGrupo);
router.delete('/:id', borrarGrupo);

export default router;