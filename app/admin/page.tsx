import prisma from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Fetch inicial de datos en el servidor
  const [orders, products, messages] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      orderBy: { nombre: 'asc' },
    }),
    (prisma as any).message.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <AdminDashboardClient 
        initialOrders={JSON.parse(JSON.stringify(orders))} 
        initialProducts={JSON.parse(JSON.stringify(products))} 
        initialMessages={JSON.parse(JSON.stringify(messages))}
      />
    </div>
  );
}
