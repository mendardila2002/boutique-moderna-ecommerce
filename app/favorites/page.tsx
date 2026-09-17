'use client';

import Header from '@/components/Header';
import { useWishlist } from '@/store/useWishlist';
import ProductCard from '@/components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FavoritesPage() {
  const { items, removeItem } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-4xl font-serif">Mis Favoritos</h1>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em]">
              Tu selección curada de piezas de autor
            </p>
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Continuar comprando
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
              <Heart size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif">Tu lista está vacía</h2>
              <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                Parece que aún no has guardado ninguna pieza. Explora nuestra colección y guarda lo que más te guste.
              </p>
            </div>
            <Link 
              href="/" 
              className="bg-black text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
            >
              Explorar Colección
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {items.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button 
                  onClick={() => removeItem(product.id)}
                  className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  title="Eliminar de favoritos"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-32 border-t py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h3 className="font-serif italic text-2xl">Boutique Moderna</h3>
          <p className="text-xs text-gray-400 uppercase tracking-[0.3em]">
            © 2026 Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Re-importing X icon for this file since I used it but didn't import it in the initial CodeContent thinking it was elsewhere
import { X } from 'lucide-react';
