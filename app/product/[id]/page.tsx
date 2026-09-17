'use server';

import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  // Convertimos el producto de Prisma a un objeto plano para el cliente
  const plainProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />
      
      <main className="container mx-auto px-4 pt-12">
        <ProductDetailClient product={plainProduct} />
      </main>
    </div>
  );
}
