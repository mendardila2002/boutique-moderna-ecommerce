import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_TOKEN);

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

/**
 * Servicio de envío de correos electrónicos usando Resend.
 */
export async function sendEmail({ to, subject, html }: SendEmailProps) {
  try {
    const data = await resend.emails.send({
      from: 'Boutique <onboarding@resend.dev>', // Cambiar por dominio verificado en producción
      to: [to],
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error al enviar el correo electrónico');
  }
}

/**
 * Plantilla base para confirmación de pedido.
 */
export async function sendOrderConfirmation(email: string, orderData: any) {
  const subject = `Confirmación de Pedido #${orderData.id.slice(-6)}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h1 style="color: #000;">¡Gracias por tu compra!</h1>
      <p>Hola ${orderData.cliente.nombre}, hemos recibido tu pedido correctamente.</p>
      <hr />
      <h3>Resumen del Pedido</h3>
      <p><strong>ID:</strong> ${orderData.id}</p>
      <p><strong>Total:</strong> $${orderData.total.toLocaleString('es-CO')}</p>
      <p><strong>Método de Entrega:</strong> ${orderData.tipoEntrega}</p>
      <hr />
      <p>Si elegiste transferencia, recuerda enviar el comprobante si no lo has hecho.</p>
      <p>Atentamente,<br /><strong>Boutique Moderna</strong></p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}
