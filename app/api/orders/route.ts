import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmation } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cliente, productos, tipoEntrega, metodoPago, comprobantePago } = body;

    // 1. Validaciones básicas del payload
    if (!cliente || !cliente.nombre || !cliente.celular) {
      return NextResponse.json({ error: 'Datos del cliente incompletos' }, { status: 400 });
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: 'La orden debe contener al menos un producto' }, { status: 400 });
    }

    let totalCalculado = 0;
    const orderItems = [];

    // 2. Verificar stock iterando cada producto y calcular el total desde la base de datos
    // (Por seguridad, NUNCA confiamos en el precio que envía el frontend)
    for (const item of productos) {
      const productDb = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!productDb) {
        return NextResponse.json({ error: `Producto no encontrado: ${item.productId}` }, { status: 404 });
      }

      if (productDb.stock < item.cantidad) {
        return NextResponse.json(
          { error: `Stock insuficiente para el producto: ${productDb.nombre}. Stock actual: ${productDb.stock}` }, 
          { status: 400 }
        );
      }

      totalCalculado += productDb.precio * item.cantidad;
      
      // Construir el item que se guardará en la base de datos
      orderItems.push({
        productId: productDb.id,
        nombre: productDb.nombre,
        precio: productDb.precio, // Guardar precio histórico
        cantidad: item.cantidad
      });
    }

    // 3. Crear la orden y actualizar el stock (Transacción)
    // Prisma con MongoDB Replica Sets soporta transacciones. Esto asegura que si algo falla, no se descuenta el stock.
    const order = await prisma.$transaction(async (tx) => {
      
      // a. Crear la orden
      const newOrder = await tx.order.create({
        data: {
          cliente: {
            nombre: cliente.nombre,
            celular: cliente.celular,
            direccion: cliente.direccion || null,
          },
          productos: orderItems,
          total: totalCalculado,
          tipoEntrega,
          metodoPago,
          comprobantePago: comprobantePago || null,
          // estado: 'PENDIENTE' (se asume por defecto según el schema)
        }
      });

      // b. Reducir el stock de cada producto
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.cantidad
            }
          }
        });
      }

      return newOrder;
    });

    // 4. Enviar notificación por correo (opcional, no bloquea la respuesta)
    // Usamos el email del cliente si estuviera disponible, o al dueño.
    // Como en el schema actual no pedimos email al cliente, lo enviamos al dueño por ahora.
    try {
      await sendOrderConfirmation(process.env.EMAIL_USER || '', order);
    } catch (mailError) {
      console.error('Error enviando correo de confirmación:', mailError);
    }

    // 5. Retornar éxito
    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error('[ORDER_POST_ERROR]', error);
    return NextResponse.json({ error: 'Error interno del servidor al procesar la orden' }, { status: 500 });
  }
}
