import Link from 'next/link';
import { ShoppingBag, ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif text-gray-50 opacity-50 select-none">
          404
        </div>
      </div>

      <div className="relative space-y-12 max-w-lg">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-black/20 animate-bounce">
            <ShoppingBag size={40} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl lg:text-6xl font-serif text-gray-900 italic">Pieza no encontrada</h1>
          <p className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] leading-relaxed">
            Parece que esta página ha sido retirada de nuestra colección actual.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/20 group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Link>
        </div>

        <div className="pt-20">
          <div className="h-px w-20 bg-gray-100 mx-auto mb-8" />
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em]">
            Boutique Moderna &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
