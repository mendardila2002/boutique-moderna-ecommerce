'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/store/useCart';
import { ShoppingBag, ChevronLeft, Star, Share2, Heart, X, Ruler, Plus, Minus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/store/useWishlist';

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const selectedSizeStock = selectedSize 
    ? product.sizeStock?.find(s => s.talla === selectedSize)?.cantidad ?? 0
    : product.stock;

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromWishlist(product.id);
      toast.info('Eliminado de favoritos');
    } else {
      addToWishlist(product);
      toast.success('Agregado a favoritos');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.nombre,
      text: `Mira esta pieza de autor: ${product.nombre}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Enlace copiado al portapapeles');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleAddToCart = () => {
    if (product.tallas && product.tallas.length > 0 && !selectedSize) {
      toast.error('Por favor, selecciona una talla');
      return;
    }
    if (product.colores && product.colores.length > 0 && !selectedColor) {
      toast.error('Por favor, selecciona un color');
      return;
    }

    if (quantity > selectedSizeStock) {
      toast.error(`Lo sentimos, solo quedan ${selectedSizeStock} unidades de esta talla`);
      return;
    }

    addItem(product, selectedSize || undefined, selectedColor || undefined, quantity);
    toast.success('Producto añadido al carrito');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Botón de volver */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Volver al catálogo</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Lado Izquierdo: Galería de Imágenes */}
        <div className="space-y-4">
          <div className="aspect-[4/5] relative rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl shadow-gray-200/50">
            <Image
              src={product.imagenes[0] || '/placeholder-product.jpg'}
              alt={product.nombre}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button 
                onClick={toggleFavorite}
                className={cn(
                  "p-3 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-90",
                  isFavorite 
                    ? "bg-red-500 text-white hover:bg-red-600" 
                    : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
                )}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={handleShare}
                className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all text-gray-400 hover:text-black active:scale-90"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          {/* Miniaturas */}
          <div className="flex gap-4">
            {product.imagenes.map((img, idx) => (
              <div key={idx} className="w-20 aspect-square relative rounded-2xl overflow-hidden border border-gray-100">
                <Image src={img} alt={`${product.nombre} ${idx}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Lado Derecho: Información */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs font-black tracking-[0.3em] text-gray-400 uppercase">
              <span>{product.categoria}</span>
              <div className="h-px w-8 bg-gray-200" />
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={12} fill="currentColor" />
                <span className="text-gray-900 mt-0.5">4.9</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
              {product.nombre}
            </h1>
            
            <p className="text-3xl font-light text-black">
              ${product.precio.toLocaleString('es-CO')}
            </p>
          </div>

          <p className="text-gray-500 leading-relaxed font-light text-lg">
            {product.descripcion}
          </p>

          {/* Selección de Talla */}
          {product.tallas && product.tallas.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seleccionar Talla</label>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[10px] font-bold text-black underline underline-offset-4 flex items-center gap-1 hover:text-gray-600 transition-colors"
                >
                  <Ruler size={12} /> Guía de tallas (LATAM)
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.tallas.map((talla) => {
                  const sizeInfo = product.sizeStock?.find(s => s.talla === talla);
                  const stockAvailable = sizeInfo ? sizeInfo.cantidad : product.stock;
                  const isOutOfStock = stockAvailable <= 0;
                  
                  return (
                    <button
                      key={talla}
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedSize(talla);
                        setQuantity(1);
                      }}
                      className={cn(
                        "group relative min-w-[60px] h-14 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-0.5",
                        selectedSize === talla 
                          ? "border-black bg-black text-white shadow-lg" 
                          : isOutOfStock
                            ? "border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-gray-100 hover:border-gray-300 text-gray-600"
                      )}
                    >
                      <span className="text-sm font-bold">{talla}</span>
                      {!isOutOfStock && (
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-tighter",
                          selectedSize === talla ? "text-white/60" : "text-gray-400"
                        )}>
                          {stockAvailable} dispo.
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="text-[8px] font-black uppercase tracking-tighter text-red-400">Agotado</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selección de Color */}
          {product.colores && product.colores.length > 0 && (
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Color Disponible</label>
              <div className="flex flex-wrap gap-3">
                {product.colores.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-6 h-12 rounded-full border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                      selectedColor === color 
                        ? "border-black bg-black text-white shadow-lg" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Cantidad */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cantidad</label>
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                  disabled={quantity >= selectedSizeStock}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-20"
                >
                  <Plus size={18} />
                </button>
              </div>
              {selectedSize && (
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  {selectedSizeStock <= 3 && selectedSizeStock > 0 ? (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertTriangle size={14} /> ¡Solo quedan {selectedSizeStock}!
                    </span>
                  ) : (
                    <span>Disponibilidad: {selectedSizeStock} unidades</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botón de compra */}
          <div className="pt-6">
            <button
              onClick={handleAddToCart}
              disabled={selectedSizeStock <= 0}
              className={cn(
                "w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl shadow-black/20",
                selectedSizeStock > 0 
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              )}
            >
              <ShoppingBag size={24} />
              {selectedSizeStock > 0 ? 'Agregar a mi bolsa' : 'Agotado'}
            </button>
            <p className="text-center mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Envío gratis en compras superiores a $200.000
            </p>
          </div>
          
        </div>
      </div>

      {/* MODAL GUÍA DE TALLAS */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowSizeGuide(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-serif">Guía de Tallas</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Estándar Latinoamericano (cm)</p>
                </div>
                <button 
                  onClick={() => setShowSizeGuide(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">Talla</th>
                      <th className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">Pecho</th>
                      <th className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">Cintura</th>
                      <th className="py-4 font-black uppercase tracking-widest text-[10px] text-gray-400">Cadera</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="py-4 font-bold">S (Chica)</td>
                      <td className="py-4 text-gray-500">88 - 92</td>
                      <td className="py-4 text-gray-500">76 - 80</td>
                      <td className="py-4 text-gray-500">92 - 96</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold">M (Mediana)</td>
                      <td className="py-4 text-gray-500">96 - 100</td>
                      <td className="py-4 text-gray-500">84 - 88</td>
                      <td className="py-4 text-gray-500">100 - 104</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold">L (Grande)</td>
                      <td className="py-4 text-gray-500">104 - 108</td>
                      <td className="py-4 text-gray-500">92 - 96</td>
                      <td className="py-4 text-gray-500">108 - 112</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold">XL (XG)</td>
                      <td className="py-4 text-gray-500">112 - 116</td>
                      <td className="py-4 text-gray-500">100 - 104</td>
                      <td className="py-4 text-gray-500">116 - 120</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Consejo de Medición</p>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  * Las medidas están expresadas en centímetros. Para un ajuste perfecto, mide tu contorno con una cinta métrica flexible sin apretar demasiado.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
