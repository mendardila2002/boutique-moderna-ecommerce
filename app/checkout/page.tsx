'use client';

import { useCart } from '@/store/useCart';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ShoppingBag, CreditCard, Truck, MapPin, Phone, User, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: '',
    direccion: '',
    tipoEntrega: 'DELIVERY',
    metodoPago: 'NEQUI'
  });
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      setComprobante(file);
      
      // Simular una pequeña carga para la animación y generar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setPreviewUrl(reader.result as string);
          setIsProcessingImage(false);
        }, 1200); // 1.2s de animación de "procesamiento" premium
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <ShoppingBag size={64} className="text-gray-200" />
          <h2 className="text-2xl font-serif">Tu carrito está vacío</h2>
          <button 
            onClick={() => router.push('/')}
            className="bg-black text-white px-8 py-3 rounded-full uppercase tracking-widest text-sm font-bold"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-xl shadow-green-100">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif">¡Pedido Recibido!</h1>
            <p className="text-gray-500 font-light">Tu orden <span className="font-bold text-black">#{orderId.slice(-6).toUpperCase()}</span> ha sido procesada con éxito.</p>
          </div>
          <div className="max-w-md bg-gray-50 p-6 rounded-3xl border border-gray-100 text-sm text-left space-y-4">
            <p>Hemos enviado un correo de confirmación a <strong>{formData.email}</strong>. Estamos validando tu pago y prepararemos tus piezas pronto.</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Te contactaremos por correo y WhatsApp para coordinar la entrega.</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="bg-black text-white px-12 py-4 rounded-full uppercase tracking-widest text-sm font-bold hover:scale-105 transition-transform"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.metodoPago === 'NEQUI' && !comprobante) {
      toast.error('Por favor, adjunta el comprobante de pago de Nequi.');
      return;
    }

    setIsSubmitting(true);

    try {
      let comprobanteUrl = '';
      
      // Subir comprobante si existe
      if (comprobante) {
        const uploadData = new FormData();
        uploadData.append('file', comprobante);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error('Error al subir comprobante');
        comprobanteUrl = uploadResult.url;
      }

      const orderData = {
        cliente: {
          nombre: formData.nombre,
          email: formData.email,
          celular: formData.celular,
          direccion: formData.tipoEntrega === 'DELIVERY' ? formData.direccion : 'Recogida en tienda'
        },
        productos: items.map(item => ({
          productId: item.product.id,
          nombre: item.product.nombre,
          precio: item.product.precio,
          cantidad: item.cantidad,
          talla: item.selectedSize,
          color: item.selectedColor
        })),
        total: getTotal(),
        tipoEntrega: formData.tipoEntrega,
        metodoPago: formData.metodoPago,
        comprobantePago: comprobanteUrl
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error('Error al procesar el pedido');

      const data = await res.json();
      setOrderId(data.orderId);
      setOrderCompleted(true);
      clearCart();
      toast.success('¡Pedido realizado con éxito!');
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al procesar tu pedido. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* Form Side */}
          <div className="flex-1 space-y-12">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Finalizar Compra</h1>
              <p className="text-gray-400 font-light italic">Completa tus datos para procesar el pedido.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Datos Personales */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">
                  <User size={16} /> Información del Cliente
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ej: Juan Perez"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black transition-all outline-none"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                    <input 
                      required
                      type="email" 
                      placeholder="tu@email.com"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black transition-all outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Celular / WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="300 123 4567"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black transition-all outline-none"
                      value={formData.celular}
                      onChange={(e) => setFormData({...formData, celular: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              {/* Entrega */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">
                  <Truck size={16} /> Método de Entrega
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, tipoEntrega: 'DELIVERY'})}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.tipoEntrega === 'DELIVERY' ? 'border-black bg-black text-white shadow-xl scale-105' : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Truck size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">A Domicilio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, tipoEntrega: 'PICKUP'})}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.tipoEntrega === 'PICKUP' ? 'border-black bg-black text-white shadow-xl scale-105' : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    <MapPin size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Recogida</span>
                  </button>
                </div>

                {formData.tipoEntrega === 'DELIVERY' && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Dirección de Envío</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Dirección, Barrio, Ciudad"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black transition-all outline-none"
                      value={formData.direccion}
                      onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    />
                  </div>
                )}
              </section>

              {/* Pago */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-4">
                  <CreditCard size={16} /> Método de Pago
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, metodoPago: 'NEQUI'})}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.metodoPago === 'NEQUI' ? 'border-black bg-black text-white shadow-xl scale-105' : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-black text-xs">N</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Nequi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, metodoPago: 'CASH'})}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.metodoPago === 'CASH' ? 'border-black bg-black text-white shadow-xl scale-105' : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    <CreditCard size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Efectivo</span>
                  </button>
                </div>

                {formData.metodoPago === 'NEQUI' && (
                  <div className="mt-8 p-8 bg-purple-50 rounded-[2.5rem] border border-purple-100 space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <span className="text-purple-600 font-black">QR</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tighter">Transferencia Nequi</p>
                        <p className="text-lg font-black text-purple-700">300 123 4567</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">Adjuntar Comprobante</label>
                      <div className="relative group min-h-[160px]">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        
                        <div className={`w-full h-full min-h-[160px] bg-white rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden relative ${
                          comprobante ? 'border-green-200' : 'border-purple-200 group-hover:border-purple-400'
                        }`}>
                          
                          {isProcessingImage ? (
                            <div className="flex flex-col items-center gap-4 animate-pulse">
                              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600">Procesando imagen...</span>
                            </div>
                          ) : previewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center group/preview">
                              <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain p-2" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/40 px-4 py-2 rounded-full pointer-events-none">Cambiar Imagen</span>
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setComprobante(null);
                                    setPreviewUrl(null);
                                  }}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-20"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-300">
                                <CheckCircle2 size={32} strokeWidth={1.5} />
                              </div>
                              <div className="text-center">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-900">Haz clic para subir</span>
                                <span className="block text-[8px] font-medium text-gray-400 uppercase tracking-widest mt-1">PNG, JPG hasta 5MB</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-gray-900 transition-all shadow-2xl shadow-black/10 disabled:bg-gray-300 mt-12 group"
              >
                {isSubmitting ? 'Procesando...' : (
                  <>
                    Confirmar Pedido <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Side */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-32 bg-gray-50 rounded-[3rem] p-8 border border-gray-100 space-y-8">
              <h2 className="text-xl font-serif tracking-tight border-b border-gray-200 pb-6 flex items-center justify-between">
                Resumen 
                <span className="bg-black text-white text-[10px] px-2 py-1 rounded-full font-bold">
                  {items.reduce((acc, i) => acc + i.cantidad, 0)} Items
                </span>
              </h2>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-white rounded-2xl overflow-hidden flex-none border border-gray-100">
                      <Image 
                        src={item.product.imagenes[0]} 
                        alt={item.product.nombre} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-xs font-bold uppercase tracking-tighter truncate">{item.product.nombre}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {item.cantidad} x ${item.product.precio.toLocaleString('es-CO')}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[8px] bg-white px-2 py-0.5 rounded-full border border-gray-100 font-black">
                          TALLA {item.selectedSize}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${getTotal().toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                  <span>Envío</span>
                  <span className="text-green-600 font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4">
                  <span>Total</span>
                  <span>${getTotal().toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
