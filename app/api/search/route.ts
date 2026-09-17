import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { nombre: { contains: q, mode: 'insensitive' } },
          { descripcion: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5, // Limitamos a 5 resultados para la vista previa
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagenes: true,
        categoria: true,
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error en la búsqueda' }, { status: 500 });
  }
}
