'use client';

import { useState } from 'react';
import { X, User, Phone, MapPin, Mail, CreditCard, Truck, ExternalLink, Package, MessageSquare, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  order: any;
  onClose: () => void;
  onStatusChange: (id: string, status: string, observaciones?: string) => void;
  isUpdating: boolean;
}

export default function OrderDetailsModal({ isOpen, order, onClose, onStatusChange, isUpdating }: Props) {
  const [obs, setObs] = useState(order?.observaciones || '');

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-black text-white p-8 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/20 rounded">Orden #{order.id.slice(-6).toUpperCase()}</span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
                order.estado === 'PENDIENTE' && "bg-yellow-500 text-black",
                order.estado === 'CONFIRMADO' && "bg-blue-500 text-white",
                order.estado === 'ENTREGADO' && "bg-green-500 text-white",
                order.estado === 'CANCELADO' && "bg-red-500 text-white"
              )}>
                {order.estado}
              </span>
            </div>
            <h2 className="text-2xl font-serif">Detalles del Pedido</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          {/* Cliente Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User size={14} /> Información del Cliente
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-gray-900">{order.cliente.nombre}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={14} /> {order.cliente.email || 'N/A'}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={14} /> {order.cliente.celular}
                  </div>
                  <a 
                    href={`https://wa.me/57${order.cliente.celular.replace(/\s+/g, '')}?text=Hola%20${order.cliente.nombre},%20te%20contacto%20de%20Boutique%20Moderna%20sobre%20tu%20orden%20%23${order.id.slice(-6).toUpperCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 hover:text-green-700 transition-colors bg-green-50 px-3 py-1.5 rounded-full"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <MapPin size={14} /> Entrega & Pago
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                  <Truck size={14} className="text-gray-400" /> {order.tipoEntrega}
                </div>
                <p className="text-xs text-gray-500 pl-6 italic">{order.cliente.direccion}</p>
                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium mt-2">
                  <CreditCard size={14} className="text-gray-400" /> {order.metodoPago}
                </div>
                {order.comprobantePago && (
                  <a 
                    href={order.comprobantePago} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:underline pl-6 mt-1"
                  >
                    Ver Comprobante <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Package size={14} /> Productos
            </h3>
            <div className="bg-gray-50 rounded-3xl p-4 space-y-2">
              {order.productos.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black">
                      {item.cantidad}x
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.nombre}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {item.talla && `Talla: ${item.talla}`} {item.color && `• Color: ${item.color}`}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-sm">${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                </div>
              ))}
              <div className="flex justify-between items-center p-4 pt-6 mt-4 border-t border-gray-200">
                <span className="text-sm font-black uppercase tracking-widest text-gray-400">Total Pagado</span>
                <span className="text-2xl font-black text-black">${order.total.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <MessageSquare size={14} /> Observaciones Internas / Notas para el cliente
            </h3>
            <textarea 
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Escribe aquí el motivo de la cancelación o detalles del envío..."
              className="w-full bg-gray-50 rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-black transition-all resize-none min-h-[100px]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-gray-50 flex flex-col sm:flex-row gap-6 justify-between items-center border-t border-gray-100 shrink-0">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Acciones de Estado</span>
            <div className="flex flex-wrap gap-2">
              {['CONFIRMADO', 'ENTREGADO', 'CANCELADO'].map((status) => (
                <button
                  key={status}
                  disabled={isUpdating || order.estado === status}
                  onClick={() => onStatusChange(order.id, status, obs)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    order.estado === status 
                      ? "bg-black text-white" 
                      : status === 'CANCELADO'
                        ? "bg-white text-red-400 border border-red-50 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                        : "bg-white text-gray-400 border border-transparent hover:bg-white hover:text-black hover:shadow-md disabled:opacity-30"
                  )}
                >
                  {status === 'CONFIRMADO' ? '✓ Confirmar Pago' : status.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-200 text-gray-700 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-300 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
