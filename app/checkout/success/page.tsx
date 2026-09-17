'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, MessageCircle, Home } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('orderId');
  const name = searchParams.get('name');
  const total = searchParams.get('total');

  const handleWhatsApp = () => {
    const phone = "573001234567"; // Tu número de WhatsApp del negocio
    const message = encodeURIComponent(
      `¡Hola! Acabo de realizar un pedido en la Boutique.\n\n` +
      `📌 *Pedido:* #${orderId?.slice(-6)}\n` +
      `👤 *Nombre:* ${name}\n` +
      `💰 *Total:* $${Number(total).toLocaleString('es-CO')}\n\n` +
      `Adjunto el comprobante (si aplica).`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-green-50 p-6 rounded-full mb-6">
        <CheckCircle2 size={64} className="text-green-500" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">¡Pedido Recibido!</h1>
      <p className="text-gray-500 mb-8 max-w-xs">
        Gracias por tu compra, <strong>{name}</strong>. Tu pedido está siendo procesado.
      </p>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-green-100"
        >
          <MessageCircle size={24} />
          Informar por WhatsApp
        </button>

        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all"
        >
          <Home size={20} />
          Volver a la Tienda
        </button>
      </div>

      <p className="mt-12 text-xs text-gray-400">
        ID de Orden: {orderId}
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
