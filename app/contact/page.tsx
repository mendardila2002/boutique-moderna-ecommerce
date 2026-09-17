'use client';

import Header from '@/components/Header';
import { Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);

    const formData = new FormData(form);
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      celular: formData.get('celular'),
      mensaje: formData.get('mensaje'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al enviar');
      }

      toast.success('Mensaje enviado. Nos pondremos en contacto pronto.');
      form.reset();
    } catch (error: any) {
      console.error('Contact Error:', error);
      const errorMessage = error.message || 'Ocurrió un error al enviar el mensaje.';
      toast.error(errorMessage, {
        description: 'Por favor, intenta de nuevo o contacta por WhatsApp.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-serif">Contacto</h1>
              <p className="text-gray-500 font-light max-w-sm">
                ¿Tienes alguna pregunta sobre nuestras piezas o tu pedido? Estamos aquí para ayudarte.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl text-black">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Email</p>
                  <p className="font-medium">hola@boutiquemoderna.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl text-black">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">WhatsApp</p>
                  <p className="font-medium">+57 300 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl text-black">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Showroom</p>
                  <p className="font-medium text-sm">Calle de la Moda #123, Edificio Prisma.<br />Medellín, Colombia.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-6">Síguenos</p>
              <div className="flex gap-4">
                <a href="#" className="p-4 bg-black text-white rounded-full hover:scale-110 transition-transform">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-4 bg-gray-100 text-black rounded-full hover:scale-110 transition-transform">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-[3rem] border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tu Nombre</label>
                <input 
                  name="nombre"
                  required
                  type="text" 
                  placeholder="Ej: Juan Perez"
                  className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <input 
                  name="email"
                  required
                  type="email" 
                  placeholder="juan@ejemplo.com"
                  className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">WhatsApp / Teléfono</label>
                <input 
                  name="celular"
                  required
                  type="tel" 
                  placeholder="300 123 4567"
                  className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mensaje</label>
                <textarea 
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black transition-all outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-black/5 disabled:bg-gray-400"
              >
                <Send size={18} className={isSubmitting ? 'animate-pulse' : ''} /> 
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

        </div>
      </main>

      <footer className="py-16 text-center border-t border-gray-100">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Atención al cliente: Lun - Vie | 9:00 - 18:00</p>
      </footer>
    </div>
  );
}
