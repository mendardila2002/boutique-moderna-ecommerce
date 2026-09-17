'use client';

import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/store/useCart';
import { Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
          <Image
            src={product.imagenes[0] || '/placeholder-product.jpg'}
            alt={product.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-4 space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-widest">{product.categoria}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.nombre}</h3>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-black">
              ${product.precio.toLocaleString('es-CO')}
            </p>
            {product.tallas && product.tallas.length > 0 && (
              <span className="text-[10px] text-gray-400 font-bold border border-gray-100 px-1.5 rounded">
                {product.tallas.join(' · ')}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          if ((product.tallas && product.tallas.length > 0) || (product.colores && product.colores.length > 0)) {
            router.push(`/product/${product.id}`);
            return;
          }
          addItem(product);
          toast.success(`${product.nombre} agregado`);
        }}
        className="absolute bottom-[4.5rem] right-4 p-3 bg-black text-white rounded-full opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-gray-800 z-10"
        aria-label="Agregar al carrito"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
