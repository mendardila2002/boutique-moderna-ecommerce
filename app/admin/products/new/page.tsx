'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/app/admin/actions';
import { toast } from 'sonner';
import { ChevronLeft, Upload, Loader2, Save } from 'lucide-react';
import Image from 'next/image';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        toast.success('Imagen subida correctamente');
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error('Error al subir la imagen a Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error('Debes subir al menos una imagen');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const tallas = formData.get('tallas')?.toString().split(',').map(s => s.trim()).filter(s => s !== '') || [];
    const colores = formData.get('colores')?.toString().split(',').map(s => s.trim()).filter(s => s !== '') || [];

    const data = {
      nombre: formData.get('nombre'),
      precio: formData.get('precio'),
      stock: formData.get('stock'),
      categoria: formData.get('categoria'),
      descripcion: formData.get('descripcion'),
      imagenes: [imageUrl],
      tallas,
      colores,
    };

    const result = await createProduct(data);

    if (result.success) {
      toast.success('Producto creado exitosamente');
      router.push('/admin');
    } else {
      toast.error(result.error || 'Error al crear producto');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Nueva Prenda</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Imagen Upload */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Foto del Producto</label>
            <div className="relative aspect-square w-48 mx-auto bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group hover:border-black transition-all">
              {imageUrl ? (
                <>
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                    Cambiar Imagen
                  </div>
                </>
              ) : (
                <div className="space-y-2 text-gray-400">
                  {uploading ? <Loader2 className="animate-spin mx-auto" /> : <Upload className="mx-auto" />}
                  <p className="text-[10px] font-bold uppercase">Subir Foto</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </div>
          </section>

          {/* Detalles */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre de la Prenda</label>
              <input name="nombre" required className="w-full mt-2 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precio (COP)</label>
              <input name="precio" type="number" required className="w-full mt-2 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Inicial</label>
              <input name="stock" type="number" required className="w-full mt-2 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" />
            </div>

            <div className="col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categoría</label>
              <select name="categoria" required className="w-full mt-2 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descripción</label>
              <textarea name="descripcion" rows={3} className="w-full mt-2 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all resize-none" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tallas (Separadas por coma)</label>
              <input name="tallas" placeholder="S, M, L, XL" className="w-full mt-2 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Colores (Separados por coma)</label>
              <input name="colores" placeholder="Negro, Blanco, Azul" className="w-full mt-2 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all" />
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isSubmitting ? 'Guardando...' : 'Publicar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}
