import clienteAxios from './clienteAxios';

export const obtenerMiPerfil = async () => {
  const { data } = await clienteAxios.get('/usuarios/perfil');
  return data;
};

export const actualizarMiPerfil = async (datos) => {
  const { data } = await clienteAxios.put('/usuarios/perfil', datos);
  return data;
};

export const borrarMiCuenta = async () => {
  const { data } = await clienteAxios.delete('/usuarios/perfil');
  return data;
};