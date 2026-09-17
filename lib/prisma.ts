import { PrismaClient } from '../prisma/generated/client';

// Patrón Singleton recomendado por Next.js para evitar la creación de 
// múltiples instancias de Prisma Client durante el desarrollo (hot-reloading).
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
