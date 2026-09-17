'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usamos una API route simple para setear la cookie de forma segura
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success('Acceso concedido');
        router.push('/admin');
        router.refresh(); // Para que el middleware reconozca la nueva cookie
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch (error) {
      toast.error('Error al intentar ingresar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-serif italic">Boutique Admin</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Panel de Control Privado</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contraseña Maestra</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all text-center text-xl tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Ingresar al Dashboard'}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-300 uppercase tracking-tighter">
          Solo personal autorizado. Todas las acciones son registradas.
        </p>
      </div>
    </div>
  );
}
