import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando población de base de datos...');

  // Limpiar productos existentes (opcional, cuidado en prod)
  await prisma.product.deleteMany({});

  const products = [
    // --- MUJER ---
    {
      nombre: "Vestido Floral Bohemio",
      descripcion: "Vestido largo con estampado floral, ideal para tardes de verano. Tela fresca y ligera.",
      precio: 85000,
      categoria: "MUJER",
      stock: 15,
      imagenes: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800"],
      tallas: ["S", "M", "L"],
      colores: ["Azul", "Rojo"]
    },
    {
      nombre: "Blazer Elegante Negro",
      descripcion: "Blazer de corte estructurado con botones dorados. Perfecto para la oficina o eventos.",
      precio: 120000,
      categoria: "MUJER",
      stock: 10,
      imagenes: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"],
      tallas: ["S", "M", "L", "XL"],
      colores: ["Negro"]
    },
    {
      nombre: "Jeans Mom Fit Azul",
      descripcion: "Jeans de tiro alto con corte clásico mom fit. Mezclilla de alta durabilidad.",
      precio: 95000,
      categoria: "MUJER",
      stock: 20,
      imagenes: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800"],
      tallas: ["6", "8", "10", "12"],
      colores: ["Azul Claro", "Azul Oscuro"]
    },
    {
      nombre: "Top de Seda Blanco",
      descripcion: "Top delicado de seda con tirantes ajustables. Elegancia minimalista.",
      precio: 45000,
      categoria: "MUJER",
      stock: 25,
      imagenes: ["https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=800"],
      tallas: ["S", "M", "L"],
      colores: ["Blanco", "Champagne"]
    },
    {
      nombre: "Falda Plisada Midi",
      descripcion: "Falda plisada de largo midi con acabado satinado. Movimiento fluido.",
      precio: 75000,
      categoria: "MUJER",
      stock: 12,
      imagenes: ["https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=800"],
      tallas: ["S", "M"],
      colores: ["Rosa", "Verde Esmeralda"]
    },

    // --- HOMBRE ---
    {
      nombre: "Camisa Oxford Blanca",
      descripcion: "Camisa clásica Oxford 100% algodón. Un básico indispensable.",
      precio: 65000,
      categoria: "HOMBRE",
      stock: 30,
      imagenes: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800"],
      tallas: ["S", "M", "L", "XL"],
      colores: ["Blanco", "Azul Cielo"]
    },
    {
      nombre: "Pantalón Chino Beige",
      descripcion: "Pantalón de corte slim fit en algodón con stretch. Comodidad y estilo.",
      precio: 89000,
      categoria: "HOMBRE",
      stock: 18,
      imagenes: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800"],
      tallas: ["30", "32", "34", "36"],
      colores: ["Beige", "Azul Turquí"]
    },
    {
      nombre: "Chaqueta de Cuero Sintético",
      descripcion: "Chaqueta tipo biker con cremalleras metálicas. Look rebelde y moderno.",
      precio: 155000,
      categoria: "HOMBRE",
      stock: 8,
      imagenes: ["https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=800"],
      tallas: ["M", "L", "XL"],
      colores: ["Negro", "Café"]
    },
    {
      nombre: "Saco de Lana Gris",
      descripcion: "Suéter de lana tejido con cuello redondo. Ideal para climas fríos.",
      precio: 78000,
      categoria: "HOMBRE",
      stock: 14,
      imagenes: ["https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=800"],
      tallas: ["S", "M", "L"],
      colores: ["Gris Melange", "Azul Marino"]
    },
    {
      nombre: "Camiseta Básica Premium",
      descripcion: "Camiseta de algodón pima de alto gramaje. No se deforma con el lavado.",
      precio: 35000,
      categoria: "HOMBRE",
      stock: 50,
      imagenes: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800"],
      tallas: ["S", "M", "L", "XL", "XXL"],
      colores: ["Negro", "Blanco", "Gris", "Vino"]
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product as any
    });
  }

  console.log('✅ Base de datos poblada exitosamente con 10 productos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
