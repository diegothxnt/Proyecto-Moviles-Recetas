import clienteAxios from './clienteAxios';

export const obtenerMisRecetas = async () => {
  const { data } = await clienteAxios.get('/recetas/mias');
  return data.recetas;
};

export const obtenerRecetasGenerales = async () => {
  const { data } = await clienteAxios.get('/recetas');
  return data.recetas;
};

export const obtenerReceta = async (id) => {
  const { data } = await clienteAxios.get(`/recetas/${id}`);
  return data.receta;
};

export const crearReceta = async (datos) => {
  const { data } = await clienteAxios.post('/recetas', datos);
  return data.receta;
};

export const actualizarReceta = async (id, datos) => {
  const { data } = await clienteAxios.put(`/recetas/${id}`, datos);
  return data.receta;
};

export const borrarReceta = async (id) => {
  const { data } = await clienteAxios.delete(`/recetas/${id}`);
  return data;
};

export const agregarRecetaAGrupo = async (recetaId, grupoId) => {
  const { data } = await clienteAxios.post(
    `/recetas/${recetaId}/grupos/${grupoId}`
  );
  return data.receta;
};

export const quitarRecetaDeGrupo = async (recetaId, grupoId) => {
  const { data } = await clienteAxios.delete(
    `/recetas/${recetaId}/grupos/${grupoId}`
  );
  return data.receta;
};