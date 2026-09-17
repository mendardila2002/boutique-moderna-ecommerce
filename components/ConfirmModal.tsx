'use client';

import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar',
  isDanger = true 
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100000] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="p-8 md:p-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
              isDanger ? "bg-red-50 text-red-500 shadow-red-100" : "bg-blue-50 text-blue-500 shadow-blue-100"
            )}>
              <AlertTriangle size={28} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-gray-900">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all border border-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn(
                "flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl",
                isDanger ? "bg-red-500 hover:bg-red-600 shadow-red-200" : "bg-black hover:bg-gray-800 shadow-gray-200"
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
