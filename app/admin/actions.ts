'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_TOKEN);

export async function updateOrderStatus(orderId: string, status: any, observaciones?: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) return { success: false, error: 'Orden no encontrada' };

    // Solo descontar stock si pasa a CONFIRMADO y no estaba confirmado antes
    if (status === 'CONFIRMADO' && order.estado !== 'CONFIRMADO') {
      for (const item of order.productos) {
        // Obtenemos el producto actual para modificar su stock por talla
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (product) {
          if (item.talla) {
            // Buscamos la talla específica en el array de sizeStock
            const updatedSizeStock = (product.sizeStock || []).map(s => {
              if (s.talla === item.talla) {
                return { ...s, cantidad: Math.max(0, s.cantidad - (item.cantidad || 0)) };
              }
              return s;
            });

            await prisma.product.update({
              where: { id: item.productId },
              data: {
                sizeStock: updatedSizeStock,
                stock: Math.max(0, product.stock - item.cantidad)
              }
            });
          } else {
            // Si no hay talla, descontamos del stock global
            await prisma.product.update({
              where: { id: item.productId },
              data: {
                stock: Math.max(0, product.stock - item.cantidad)
              }
            });
          }
        }
      }
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { 
        estado: status,
        observaciones: observaciones || undefined
      },
    });

    // Enviar correo de actualización al cliente
    if (order.cliente.email) {
      try {
        let subject = '';
        let title = '';
        let message = '';
        let color = '#000000';

        switch (status) {
          case 'CONFIRMADO':
            subject = '¡Pago Verificado! Tu pedido está en marcha';
            title = 'Pago Confirmado';
            message = 'Hemos verificado tu pago exitosamente. Estamos preparando tus piezas para que lleguen a tus manos lo antes posible.';
            color = '#3b82f6'; // Blue
            break;
          case 'ENTREGADO':
            subject = '¡Tu pedido ha sido entregado!';
            title = 'Entrega Exitosa';
            message = 'Esperamos que disfrutes tus nuevas piezas de Boutique Moderna. ¡Gracias por elegirnos!';
            color = '#22c55e'; // Green
            break;
          case 'CANCELADO':
            subject = 'Actualización sobre tu pedido';
            title = 'Pedido Cancelado';
            message = `Tu pedido ha sido cancelado. ${observaciones ? `Motivo: ${observaciones}` : 'Si tienes dudas, contáctanos vía WhatsApp.'}`;
            color = '#ef4444'; // Red
            break;
        }

        if (subject) {
          await resend.emails.send({
            from: 'Boutique Moderna <onboarding@resend.dev>',
            to: [order.cliente.email],
            subject: `${subject} #${order.id.slice(-6).toUpperCase()}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #1a1a1a; background-color: #ffffff; border: 1px solid #eee; border-radius: 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                  <h1 style="text-transform: uppercase; letter-spacing: 5px; font-weight: 900; margin: 0; font-size: 24px;">Boutique Moderna</h1>
                </div>
                
                <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 30px 0; margin-bottom: 30px;">
                  <h2 style="font-size: 20px; margin-top: 0; color: ${color};">${title}</h2>
                  <p style="line-height: 1.6; color: #444; font-size: 14px;">Hola, ${order.cliente.nombre}.</p>
                  <p style="line-height: 1.6; color: #444; font-size: 14px;">${message}</p>
                </div>

                <div style="font-size: 12px; color: #999; text-align: center;">
                  <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                </div>
              </div>
            `
          });
        }
      } catch (emailErr) {
        console.error('Error enviando notificación de estado:', emailErr);
      }
    }
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error: 'No se pudo actualizar la orden' };
  }
}

export async function updateProductStock(productId: string, sizeStock: any[]) {
  try {
    const totalStock = sizeStock.reduce((acc, curr) => acc + parseInt(curr.cantidad), 0);
    
    await prisma.product.update({
      where: { id: productId },
      data: { 
        sizeStock: sizeStock.map(s => ({ talla: s.talla, cantidad: parseInt(s.cantidad) })),
        stock: totalStock
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating stock:', error);
    return { success: false, error: 'No se pudo actualizar el stock' };
  }
}

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio),
        stock: parseInt(data.stock),
        categoria: data.categoria,
        imagenes: data.imagenes,
        tallas: data.tallas || [],
        colores: data.colores || [],
        sizeStock: (data.tallas || []).map((t: string) => ({
          talla: t,
          cantidad: data.tallas.length > 1 ? 0 : parseInt(data.stock)
        }))
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, product };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'No se pudo crear el producto' };
  }
}

export async function updateProduct(productId: string, data: any) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio),
        categoria: data.categoria,
        imagenes: data.imagenes,
        tallas: data.tallas || [],
        colores: data.colores || [],
      }
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'No se pudo actualizar el producto' };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'No se pudo eliminar el producto' };
  }
}
export async function deleteMessage(messageId: string) {
  try {
    await (prisma as any).message.delete({
      where: { id: messageId },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: 'No se pudo eliminar el mensaje' };
  }
}
