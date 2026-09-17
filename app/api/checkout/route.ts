import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_TOKEN);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cliente, productos, total, tipoEntrega, metodoPago, comprobantePago } = body;

    if (!cliente || !productos || !total || !tipoEntrega || !metodoPago) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        cliente,
        productos,
        total,
        tipoEntrega,
        metodoPago,
        comprobantePago,
        estado: 'PENDIENTE'
      }
    });

    // Enviar correo de confirmación al cliente
    try {
      console.log('Iniciando envío de email a:', cliente.email);
      const emailResponse = await resend.emails.send({
        from: 'Boutique Moderna <onboarding@resend.dev>',
        to: [cliente.email], // Usar array por seguridad
        subject: `Recibimos tu pedido - Boutique Moderna #${order.id.slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #1a1a1a; background-color: #ffffff; border: 1px solid #eee; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="text-transform: uppercase; letter-spacing: 5px; font-weight: 900; margin: 0; font-size: 24px;">Boutique Moderna</h1>
              <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 10px; color: #666; margin-top: 5px;">Colección Exclusiva</p>
            </div>
            
            <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 30px 0; margin-bottom: 30px;">
              <h2 style="font-size: 20px; margin-top: 0;">¡Hola, ${cliente.nombre}!</h2>
              <p style="line-height: 1.6; color: #444; font-size: 14px;">Hemos recibido tu pedido y estamos muy emocionados de que pronto forme parte de tu colección.</p>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 15px; margin: 25px 0;">
                <p style="margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Estado del Pedido</p>
                <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 16px;">Validando Pago</p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #555;">Nuestro equipo revisará el comprobante adjunto y verificará la disponibilidad de las prendas.</p>
              </div>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; color: #999;">Resumen de tu Orden</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${productos.map((p: any) => `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5;">
                      <p style="margin: 0; font-weight: bold; font-size: 14px;">${p.nombre}</p>
                      <p style="margin: 0; font-size: 12px; color: #777;">Cantidad: ${p.cantidad}</p>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; text-align: right; font-weight: bold;">
                      $${p.precio.toLocaleString('es-CO')}
                    </td>
                  </tr>
                `).join('')}
                <tr>
                  <td style="padding: 20px 0 0 0; font-weight: bold; font-size: 16px;">TOTAL</td>
                  <td style="padding: 20px 0 0 0; text-align: right; font-weight: 900; font-size: 18px;">$${total.toLocaleString('es-CO')}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #000; color: #fff; padding: 25px; border-radius: 20px; text-align: center;">
              <h4 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Próximos Pasos</h4>
              <p style="margin: 0; font-size: 13px; opacity: 0.8; line-height: 1.5;">Te contactaremos vía <strong>WhatsApp</strong> y <strong>Correo</strong> en las próximas horas para confirmar la entrega.</p>
            </div>
          </div>
        `
      });
      console.log('Respuesta de Resend:', emailResponse);
    } catch (emailErr) {
      console.error('Error detallado enviando email al cliente:', emailErr);
    }

    // Notificar al administrador
    try {
      await resend.emails.send({
        from: 'Boutique Moderna <onboarding@resend.dev>',
        to: [process.env.EMAIL_USER || 'hdtoledo@gmail.com'],
        subject: `NUEVA ORDEN - ${cliente.nombre} #${order.id.slice(-6).toUpperCase()}`,
        html: `
          <h1>Nueva Venta en Boutique Moderna</h1>
          <p><strong>Cliente:</strong> ${cliente.nombre}</p>
          <p><strong>WhatsApp:</strong> ${cliente.celular}</p>
          <p><strong>Total:</strong> $${total.toLocaleString('es-CO')}</p>
          <p><strong>Método de Pago:</strong> ${metodoPago}</p>
          <p><strong>Tipo de Entrega:</strong> ${tipoEntrega}</p>
          ${comprobantePago ? `<p><strong>Comprobante:</strong> <a href="${comprobantePago}">Ver Imagen</a></p>` : ''}
          <hr />
          <p>Revisa el panel de administración para más detalles.</p>
        `
      });
    } catch (adminErr) {
      console.error('Error enviando notificación al admin:', adminErr);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Error al procesar el pedido' }, { status: 500 });
  }
}
