// types/index.ts

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'HOMBRE' | 'MUJER';
  stock: number;
  sizeStock?: { talla: string; cantidad: number }[];
  imagenes: string[];
  tallas?: string[];
  colores?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  product: Product;
  cantidad: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CustomerData {
  nombre: string;
  celular: string;
  direccion?: string;
}

// Representa el payload que el frontend enviará para crear una orden
export interface CreateOrderPayload {
  cliente: CustomerData;
  productos: {
    productId: string;
    cantidad: number;
  }[];
  tipoEntrega: 'PICKUP' | 'DELIVERY';
  metodoPago: 'CASH' | 'NEQUI';
  comprobantePago?: string;
}
