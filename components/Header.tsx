'use client';

import { ShoppingBag, Search, Menu, Heart, X } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useWishlist } from '@/store/useWishlist';
import { useState, useEffect, useRef } from 'react';
import CartDrawer from './CartDrawer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const cartItems = useCart((state) => state.items);
  const wishlistItems = useWishlist((state) => state.items);
  const router = useRouter();

  // Calcular conteos
  const itemCount = mounted ? cartItems.reduce((acc, item) => acc + item.cantidad, 0) : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Búsqueda en vivo
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 md:hidden hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-1 md:flex-none text-center">
            <h1 className="text-xl font-bold tracking-tighter uppercase italic">Boutique</h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">Colección</Link>
            <Link href="/about" className="hover:text-black transition-colors">Nosotros</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contacto</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-4">
            <div className="relative" ref={searchContainerRef}>
              <div className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 bg-white rounded-[2rem] border border-gray-100 shadow-xl",
                isSearchOpen ? "w-[280px] md:w-[400px] opacity-100" : "w-0 opacity-0 pointer-events-none border-none"
              )}>
                <div className="w-full flex flex-col relative">
                  <form onSubmit={handleSearch} className="w-full flex items-center px-4 py-3">
                    <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Buscar por nombre o categoría..."
                      className="w-full bg-transparent border-none outline-none text-sm pr-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching && (
                      <div className="absolute right-12 w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    )}
                  </form>

                  {/* LIVE RESULTS DROPDOWN */}
                  {isSearchOpen && (searchQuery.length >= 2) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden z-50">
                      {searchResults.length > 0 ? (
                        <div className="p-2 max-h-[350px] overflow-y-auto">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => {
                                router.push(`/product/${product.id}`);
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="w-full flex items-center gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors text-left group"
                            >
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-none">
                                <img 
                                  src={product.imagenes[0]} 
                                  alt={product.nombre}
                                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-tighter">
                                  {product.nombre}
                                </p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                  {product.categoria}
                                </p>
                              </div>
                              <div className="text-xs font-black pr-2">
                                ${product.precio.toLocaleString('es-CO')}
                              </div>
                            </button>
                          ))}
                          <div 
                            onClick={handleSearch}
                            className="mt-2 p-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black cursor-pointer border-t border-gray-50 transition-colors"
                          >
                            Ver todos los resultados
                          </div>
                        </div>
                      ) : !isSearching && (
                        <div className="p-8 text-center text-xs text-gray-400 italic">
                          No se encontraron piezas para "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (!isSearchOpen) setSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative z-10"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>
            
            <Link 
              href="/favorites" 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Heart size={22} className={wishlistCount > 0 ? "text-red-500 fill-current" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-full max-w-[280px] bg-white h-full shadow-2xl flex flex-col p-8 space-y-12 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase italic tracking-tighter">Menú</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-6 text-lg font-medium uppercase tracking-[0.2em] text-gray-500">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-black transition-colors">Colección</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-black transition-colors">Nosotros</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-black transition-colors">Contacto</Link>
              <div className="h-px w-full bg-gray-100 my-4" />
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-xs text-gray-400">Acceso Admin</Link>
            </nav>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
