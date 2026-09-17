import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import ProductList from '@/components/ProductList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({ 
  searchParams 
}: { 
  searchParams: { search?: string } 
}) {
  const search = searchParams.search;

  // Fetch real de productos desde MongoDB con filtro de búsqueda si existe
  const products = await prisma.product.findMany({
    where: search ? {
      OR: [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ]
    } : {},
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-20 text-center space-y-6">
          <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-gray-900">
            {search ? `Resultados para "${search}"` : 'Piezas de Autor'}
          </h2>
          <div className="h-px w-20 bg-black mx-auto" />
          <p className="text-gray-500 max-w-md mx-auto italic font-light text-lg">
            {search 
              ? `Hemos encontrado ${products.length} piezas que coinciden con tu búsqueda.`
              : 'Curaduría exclusiva de prendas atemporales para el estilo de vida contemporáneo.'}
          </p>
          {search && (
            <Link href="/" className="inline-block text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-colors">
              Limpiar búsqueda
            </Link>
          )}
        </div>

        <ProductList initialProducts={JSON.parse(JSON.stringify(products))} />

      </main>

      {/* Footer */}
      <footer className="mt-32 border-t py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h3 className="font-serif italic text-2xl">Boutique Moderna</h3>
          <p className="text-xs text-gray-400 uppercase tracking-[0.3em]">
            © 2026 Todos los derechos reservados.
          </p>
          <div className="pt-8 opacity-[0.03] hover:opacity-100 transition-opacity">
            <Link href="/admin" className="text-[10px] uppercase tracking-widest text-gray-400">
              Administración
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
