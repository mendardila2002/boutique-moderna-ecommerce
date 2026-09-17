'use client';

import { useState, useEffect } from 'react';
import { updateProduct, createProduct } from '@/app/admin/actions';
import { toast } from 'sonner';
import { X, Upload, Loader2, Save, Plus } from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
}

export default function EditProductModal({ isOpen, product, onClose }: EditProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const isNew = product && !product.id;

  useEffect(() => {
    if (product) {
      setImageUrl(product.imagenes?.[0] || null);
    } else {
      setImageUrl(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

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
        toast.success('Imagen cargada');
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const tallas = formData.get('tallas')?.toString().split(',').map(s => s.trim()).filter(s => s !== '') || [];
    const colores = formData.get('colores')?.toString().split(',').map(s => s.trim()).filter(s => s !== '') || [];

    const data = {
      nombre: formData.get('nombre'),
      precio: formData.get('precio'),
      categoria: formData.get('categoria'),
      descripcion: formData.get('descripcion'),
      imagenes: imageUrl ? [imageUrl] : [],
      tallas,
      colores,
      stock: isNew ? 0 : product.stock, // Inicializar en 0 si es nuevo, luego se edita en la tabla
    };

    if (!imageUrl && isNew) {
      toast.error('Por favor sube una imagen');
      setIsSubmitting(false);
      return;
    }

    const result = isNew 
      ? await createProduct(data)
      : await updateProduct(product.id, data);

    if (result.success) {
      toast.success(isNew ? 'Producto creado exitosamente' : 'Producto actualizado exitosamente');
      onClose();
    } else {
      toast.error(result.error || 'Error en la operación');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] my-auto">
        
        {/* Header */}
        <div className="p-8 flex justify-between items-center border-b border-gray-50">
          <div>
            <h2 className="text-2xl font-serif italic text-gray-900">
              {isNew ? 'Nueva Prenda' : 'Editar Prenda'}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
              {isNew ? 'Añadir pieza a la colección' : `ID: ${product.id.slice(-8).toUpperCase()}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Imagen Section */}
            <div className="flex flex-col items-center gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Imagen del Producto</label>
              <div className="relative w-48 h-48 rounded-[2rem] overflow-hidden group shadow-xl bg-white border border-gray-100">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/40 px-4 py-2 rounded-full">Cambiar</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                    <Upload size={32} />
                    <span className="text-[10px] font-black uppercase">Subir Imagen</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="animate-spin text-black" size={32} />
                  </div>
                )}
              </div>
            </div>

            {/* Detalles */}
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                <input name="nombre" defaultValue={product.nombre || ''} required className="w-full mt-2 px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all font-medium" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio (COP)</label>
                <input name="precio" type="number" defaultValue={product.precio || ''} required className="w-full mt-2 px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all font-medium" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                <select name="categoria" defaultValue={product.categoria || 'MUJER'} required className="w-full mt-2 px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all appearance-none font-medium">
                  <option value="HOMBRE">Hombre</option>
                  <option value="MUJER">Mujer</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
                <textarea name="descripcion" defaultValue={product.descripcion || ''} rows={3} className="w-full mt-2 px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all resize-none font-medium" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tallas</label>
                <input name="tallas" defaultValue={product.tallas?.join(', ') || ''} placeholder="S, M, L" className="w-full mt-2 px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all font-medium" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Colores</label>
                <input name="colores" defaultValue={product.colores?.join(', ') || ''} placeholder="Negro, Blanco" className="w-full mt-2 px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all font-medium" />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50 flex gap-4 bg-gray-50/50 rounded-b-[2.5rem]">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-white transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="edit-product-form"
            disabled={isSubmitting || uploading}
            className="flex-[2] bg-black text-white py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 disabled:bg-gray-300"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (isNew ? <Plus size={16} /> : <Save size={16} />)}
            {isSubmitting ? (isNew ? 'Creando...' : 'Guardando...') : (isNew ? 'Crear Prenda' : 'Actualizar Producto')}
          </button>
        </div>
      </div>
    </div>
  );
}
