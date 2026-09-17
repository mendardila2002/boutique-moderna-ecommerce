'use client';

import { useCart } from '@/store/useCart';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const total = getTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag size={22} />
            Tu Carrito
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Tu carrito está vacío</p>
              <button 
                onClick={onClose}
                className="text-black font-medium underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="flex gap-4 group">
                <div className="relative w-20 h-24 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.imagenes[0] || '/placeholder.jpg'}
                    alt={item.product.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium">{item.product.nombre}</h3>
                      <div className="flex gap-2 mt-1">
                        {item.selectedSize && (
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">
                            Talla: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">
                            {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.cantidad - 1, item.selectedSize, item.selectedColor)}
                        className="px-2 py-1 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm">{item.cantidad}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.cantidad + 1, item.selectedSize, item.selectedColor)}
                        className="px-2 py-1 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold">
                      ${(item.product.precio * item.cantidad).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
            <button 
              className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              onClick={() => {
                onClose();
                window.location.href = '/checkout';
              }}
            >
              Continuar al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
