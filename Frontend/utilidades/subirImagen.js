import * as FileSystem from 'expo-file-system/legacy';

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;


if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn(
    'Faltan variables de Cloudinary en el .env (EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME, EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET).'
  );
}

/**
 * Sube una imagen a Cloudinary usando Base64.
 * @param {object} asset - { uri, fileName?, mimeType? }
 * @returns {Promise<string>} URL pública
 */
export const subirImagenACloudinary = async (asset) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Configuración de imágenes incompleta');
  }

  const uri = asset.uri;
  const match = /\.(\w+)$/.exec(uri);
  let extension = match ? match[1].toLowerCase() : 'jpg';
  if (extension === 'jpeg') extension = 'jpg';

  const mime =
    asset.mimeType || `image/${extension === 'jpg' ? 'jpeg' : extension}`;

  // Leer como base64 (API legacy de expo-file-system)
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const dataUri = `data:${mime};base64,${base64}`;

  const formData = new FormData();
  formData.append('file', dataUri);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'recetas');

  const respuesta = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!respuesta.ok) {
    let mensaje = 'Error al subir la imagen';
    try {
      const errorJson = await respuesta.json();
      mensaje = errorJson.error?.message || errorJson.message || mensaje;
    } catch (e) {}
    throw new Error(mensaje);
  }

  const data = await respuesta.json();
  return data.secure_url;
};