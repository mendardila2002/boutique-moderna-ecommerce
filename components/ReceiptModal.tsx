'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

interface ReceiptModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptModal({ imageUrl, isOpen, onClose }: ReceiptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
      <div className="relative max-w-lg w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-serif italic text-xl">Comprobante</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={imageUrl}
              alt="Comprobante de Pago"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="p-8 text-center bg-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
            Verifica los detalles del pago
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
}
