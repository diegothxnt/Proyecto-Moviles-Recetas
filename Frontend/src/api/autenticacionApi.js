import clienteAxios from './clienteAxios';

export const registrarUsuario = async (datos) => {
  const { data } = await clienteAxios.post('/auth/registro', datos);
  return data;
};

export const iniciarSesion = async (datos) => {
  const { data } = await clienteAxios.post('/auth/login', datos);
  return data;
};