'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { updateOrderStatus, updateProductStock, deleteProduct, deleteMessage } from './actions';
import ReceiptModal from '@/components/ReceiptModal';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import EditProductModal from '@/components/EditProductModal';
import ConfirmModal from '@/components/ConfirmModal';
import { 
  Package, 
  ShoppingCart, 
  Eye, 
  Save, 
  CheckCircle, 
  Clock, 
  Truck,
  AlertCircle,
  Plus,
  Trash2,
  LogOut,
  Mail,
  Edit,
  Search,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  initialOrders: any[];
  initialProducts: any[];
  initialMessages: any[];
}

export default function AdminDashboardClient({ initialOrders, initialProducts, initialMessages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Persistir pestaña en la URL
  const activeTab = searchParams.get('tab') as 'orders' | 'inventory' | 'messages' || 'orders';
  
  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Estado local para ediciones de inventario por producto
  const [localStocks, setLocalStocks] = useState<Record<string, any[]>>({});

  const handleLocalStockChange = (productId: string, talla: string, cantidad: number) => {
    const product = initialProducts.find(p => p.id === productId);
    if (!product) return;

    const currentStock = localStocks[productId] || product.sizeStock || [];
    const newStock = [...currentStock];
    const idx = newStock.findIndex((s: any) => s.talla === talla);
    
    if (idx >= 0) {
      newStock[idx] = { ...newStock[idx], cantidad };
    } else {
      newStock.push({ talla, cantidad });
    }

    setLocalStocks(prev => ({ ...prev, [productId]: newStock }));
  };

  const handleStatusChange = async (id: string, newStatus: string, observaciones?: string) => {
    setUpdatingId(id);
    const res = await updateOrderStatus(id, newStatus, observaciones);
    if (res.success) {
      toast.success(`Orden ${newStatus.toLowerCase()}`);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, estado: newStatus, observaciones });
      }
      router.refresh();
    } else {
      toast.error(res.error || 'Error al actualizar');
    }
    setUpdatingId(null);
  };

  const handleStockUpdate = async (id: string) => {
    const newSizeStock = localStocks[id];
    if (!newSizeStock) return;

    setUpdatingId(id);
    const res = await updateProductStock(id, newSizeStock);
    if (res.success) {
      toast.success('Inventario actualizado');
      // Limpiar estado local tras éxito
      setLocalStocks(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      router.refresh();
    } else {
      toast.error(res.error || 'Error al actualizar');
    }
    setUpdatingId(null);
  };

  const handleDelete = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Eliminar Prenda',
      message: '¿Estás seguro de que quieres eliminar esta prenda de la colección? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setUpdatingId(id);
        const result = await deleteProduct(id);
        if (result.success) {
          toast.success('Producto eliminado');
          router.refresh();
        } else {
          toast.error(result.error || 'Error al eliminar');
        }
        setUpdatingId(null);
      }
    });
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleDeleteMessage = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Eliminar Mensaje',
      message: '¿Estás seguro de que quieres eliminar este mensaje? Se borrará permanentemente de tu bandeja de entrada.',
      onConfirm: async () => {
        const result = await deleteMessage(id);
        if (result.success) {
          toast.success('Mensaje eliminado');
          router.refresh();
        } else {
          toast.error(result.error);
        }
      }
    });
  };

  const isAnyModalOpen = !!editingProduct || !!selectedOrder || !!selectedReceipt || confirmConfig.isOpen;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header moved here for better stacking control */}
      <header className={cn(
        "bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 h-20 sticky top-0 flex items-center justify-between transition-all",
        isAnyModalOpen ? "z-0" : "z-[50]"
      )}>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold italic uppercase tracking-tighter">Panel de Control</h1>
          <span className="text-[10px] bg-black text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Admin</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 space-y-12">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-serif italic text-gray-900">Boutique Dashboard</h2>
        </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
          {[
            { id: 'orders', icon: ShoppingCart, label: 'Órdenes' },
            { id: 'inventory', icon: Package, label: 'Inventario' },
            { id: 'messages', icon: Mail, label: 'Mensajes' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar - Solo se muestra en Inventario */}
        {activeTab === 'inventory' && (
          <div className="relative w-full md:max-w-md animate-in slide-in-from-right duration-500">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="Buscar por nombre de prenda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-100 h-14 pl-16 pr-8 rounded-2xl text-sm font-bold shadow-xl shadow-gray-200/40 outline-none focus:border-black transition-all"
            />
          </div>
        )}
      </div>

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <tr>
                  <th className="px-8 py-6">Cliente</th>
                  <th className="px-8 py-6">Fecha</th>
                  <th className="px-8 py-6">Total</th>
                  <th className="px-8 py-6">Estado</th>
                  <th className="px-8 py-6">Pago</th>
                  <th className="px-8 py-6 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {initialOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-900">{order.cliente.nombre}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{order.cliente.email || order.cliente.celular}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-black">${order.total.toLocaleString('es-CO')}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1.5 rounded-full border",
                        order.estado === 'PENDIENTE' && "bg-yellow-50 text-yellow-700 border-yellow-100",
                        order.estado === 'CONFIRMADO' && "bg-blue-50 text-blue-700 border-blue-100",
                        order.estado === 'ENTREGADO' && "bg-green-50 text-green-700 border-green-100",
                        order.estado === 'CANCELADO' && "bg-red-50 text-red-700 border-red-100"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          order.estado === 'PENDIENTE' && "bg-yellow-500",
                          order.estado === 'CONFIRMADO' && "bg-blue-500",
                          order.estado === 'ENTREGADO' && "bg-green-500",
                          order.estado === 'CANCELADO' && "bg-red-500"
                        )} />
                        {order.estado}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase px-2 py-1 bg-gray-100 rounded-lg text-gray-600">
                          {order.metodoPago}
                        </span>
                        {order.comprobantePago && <CheckCircle size={14} className="text-blue-500" />}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl transition-all shadow-sm active:scale-95"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {initialOrders.length === 0 && (
            <div className="p-24 text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="text-gray-200" size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-serif italic text-gray-400">Sin órdenes por el momento</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Tu boutique está lista para recibir ventas</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventory Section */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Botón Nueva Pieza (Primero) */}
          <button 
            onClick={() => setEditingProduct({ nombre: '', precio: 0, categoria: 'MUJER', descripcion: '', tallas: [], colores: [], imagenes: [] })}
            className="border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 gap-6 hover:border-black hover:bg-gray-50 transition-all group min-h-[300px]"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white group-hover:rotate-90 transition-all duration-500">
              <Plus size={32} />
            </div>
            <div className="text-center space-y-1">
              <span className="block text-sm font-black uppercase tracking-[0.2em] text-gray-900">Nueva Pieza</span>
              <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest">Añadir a la colección</span>
            </div>
          </button>

          {initialProducts
            .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((product) => (
            <div key={product.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6 flex flex-col group hover:border-black transition-all duration-500">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {product.imagenes?.[0] && (
                    <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                      <img src={product.imagenes[0]} alt={product.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{product.nombre}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-1">{product.categoria}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="p-2 text-gray-300 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                    title="Editar detalles"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Eliminar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Existencias por Talla</label>
                  <span className={cn(
                    "text-[8px] font-black px-2 py-1 rounded-full border",
                    product.stock > 5 ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                  )}>
                    {product.stock > 0 ? `${product.stock} TOTAL` : 'AGOTADO'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(product.tallas || []).map((talla: string) => {
                    const originalStock = product.sizeStock?.find((s: any) => s.talla === talla)?.cantidad || 0;
                    const editedStock = localStocks[product.id]?.find((s: any) => s.talla === talla)?.cantidad;
                    const displayStock = editedStock !== undefined ? editedStock : originalStock;
                    
                    return (
                      <div key={talla} className="group/item flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-transparent hover:bg-white hover:border-black hover:shadow-lg transition-all duration-300">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 group-hover/item:bg-black group-hover/item:text-white rounded-xl text-[10px] font-black transition-colors">{talla}</span>
                        <input 
                          type="number"
                          value={displayStock}
                          onChange={(e) => handleLocalStockChange(product.id, talla, parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent border-none outline-none text-sm font-black p-0 text-gray-700"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex gap-4">
                <button 
                  onClick={() => handleStockUpdate(product.id)}
                  disabled={!localStocks[product.id] || updatingId === product.id}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    localStocks[product.id] 
                      ? "bg-black text-white hover:bg-gray-800" 
                      : "bg-gray-50 text-gray-300 cursor-not-allowed"
                  )}
                >
                  {updatingId === product.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {updatingId === product.id ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages Section */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialMessages.map((msg) => (
            <div key={msg.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 space-y-6 relative overflow-hidden group">
              <button 
                onClick={() => handleDeleteMessage(msg.id)}
                className="absolute top-8 right-8 p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all z-10 group-hover:text-gray-300"
                title="Eliminar mensaje"
              >
                <Trash2 size={20} />
              </button>
              <div className="flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold uppercase text-sm shadow-xl shadow-black/20">
                  {msg.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{msg.nombre}</h3>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{msg.email}</p>
                    {msg.celular && (
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-1">
                        <MessageCircle size={10} /> {msg.celular}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-[1.5rem] text-sm text-gray-600 leading-relaxed italic relative border border-gray-100/50">
                "{msg.mensaje}"
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">
                  {new Date(msg.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}
                </span>
                <div className="flex gap-4">
                  {msg.celular && (
                    <a 
                      href={`https://wa.me/57${msg.celular.replace(/\s+/g, '')}?text=Hola%20${msg.nombre},%20recibimos%20tu%20mensaje%20en%20Boutique%20Moderna...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 flex items-center gap-1.5"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  )}
                  <a 
                    href={`mailto:${msg.email}?subject=Respuesta de Boutique Moderna`}
                    className="text-[10px] font-black uppercase tracking-widest text-black hover:underline underline-offset-4 flex items-center gap-1.5"
                  >
                    <Mail size={14} /> Email
                  </a>
                </div>
              </div>
            </div>
          ))}
          {initialMessages.length === 0 && (
            <div className="col-span-full p-32 text-center space-y-6 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <Mail className="mx-auto opacity-10 text-black" size={64} />
              <div className="space-y-2">
                <p className="text-xl font-serif italic text-gray-400">Sin mensajes nuevos</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Tus clientes se contactarán pronto</p>
              </div>
            </div>
          )}
        </div>
      )}

      </main>

      {/* Modals outside for perfect stacking */}
      {editingProduct && (
        <EditProductModal 
          product={editingProduct}
          isOpen={true}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          isUpdating={!!updatingId}
        />
      )}

      {selectedReceipt && (
        <ReceiptModal 
          imageUrl={selectedReceipt}
          isOpen={true}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText="Eliminar permanentemente"
      />
    </div>
  );
}
