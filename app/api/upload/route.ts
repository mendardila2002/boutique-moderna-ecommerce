import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    // Convertir el archivo a base64 para Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    const imageUrl = await uploadImage(base64Image);

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}
