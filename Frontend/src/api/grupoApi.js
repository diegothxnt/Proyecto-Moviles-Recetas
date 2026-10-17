import clienteAxios from './clienteAxios';

export const obtenerMisGrupos = async () => {
  const { data } = await clienteAxios.get('/grupos');
  return data.grupos;
};

export const obtenerGrupo = async (id) => {
  const { data } = await clienteAxios.get(`/grupos/${id}`);
  return data; // { grupo, recetas }
};

export const crearGrupo = async (datos) => {
  const { data } = await clienteAxios.post('/grupos', datos);
  return data.grupo;
};

export const actualizarGrupo = async (id, datos) => {
  const { data } = await clienteAxios.put(`/grupos/${id}`, datos);
  return data.grupo;
};

export const previsualizarBorradoGrupo = async (id) => {
  const { data } = await clienteAxios.get(`/grupos/${id}/previsualizar-borrado`);
  return data;
};

export const borrarGrupo = async (id) => {
  const { data } = await clienteAxios.delete(`/grupos/${id}`);
  return data;
};