'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [filter, setFilter] = useState<'ALL' | 'HOMBRE' | 'MUJER'>('ALL');

  const filteredProducts = initialProducts.filter(
    (p) => filter === 'ALL' || p.categoria === filter
  );

  return (
    <div className="space-y-12">
      {/* Category Filter */}
      <div className="flex justify-center gap-4">
        {['ALL', 'HOMBRE', 'MUJER'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-8 py-2 text-xs uppercase tracking-[0.2em] transition-all border-b-2 ${
              filter === cat 
              ? 'border-black text-black font-bold' 
              : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            {cat === 'ALL' ? 'Todos' : cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg italic font-serif">No se encontraron piezas en esta categoría.</p>
          <p className="text-xs mt-2 uppercase tracking-widest">Vuelve pronto para nuevas colecciones</p>
        </div>
      )}
    </div>
  );
}
