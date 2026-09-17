import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, selectedSize?: string, selectedColor?: string, cantidad?: number) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, cantidad: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, selectedSize, selectedColor, cantidad = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => 
            item.product.id === product.id && 
            item.selectedSize === selectedSize && 
            item.selectedColor === selectedColor
        );

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.product.id === product.id && 
            item.selectedSize === selectedSize && 
            item.selectedColor === selectedColor
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, { product, cantidad, selectedSize, selectedColor }] });
        }
      },
      removeItem: (productId, size, color) => {
        set({ 
          items: get().items.filter((item) => 
            !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
          ) 
        });
      },
      updateQuantity: (productId, cantidad, size, color) => {
        if (cantidad <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((item) =>
            (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) 
              ? { ...item, cantidad } 
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((acc, item) => acc + item.product.precio * item.cantidad, 0);
      },
      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.cantidad, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
