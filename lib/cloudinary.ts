import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary en la carpeta 'ecoomerce'.
 * @param fileData - Base64 string o buffer de la imagen.
 * @returns La URL segura de la imagen subida.
 */
export async function uploadImage(fileData: string) {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: 'ecoomerce',
      resource_type: 'auto',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Error al subir la imagen a la nube');
  }
}

export default cloudinary;
