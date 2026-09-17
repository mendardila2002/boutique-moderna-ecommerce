import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_TOKEN);

export async function POST(req: Request) {
  try {
    const { nombre, email, celular, mensaje } = await req.json();
    
    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Guardar en la base de datos
    try {
      console.log('API: Intentando guardar mensaje en DB...', { nombre, email });
      await (prisma as any).message.create({
        data: {
          nombre,
          email,
          celular: celular || null,
          mensaje,
          leido: false,
          createdAt: new Date()
        }
      });
      console.log('API: Mensaje guardado en DB exitosamente');
    } catch (dbError: any) {
      console.error('API Error DB:', dbError.message || dbError);
      return NextResponse.json({ 
        error: `Error de base de datos: ${dbError.message || 'Error desconocido'}`
      }, { status: 500 });
    }

    // Enviar correo al administrador
    try {
      console.log('API: Intentando enviar email via Resend...');
      const emailResult = await resend.emails.send({
        from: 'Boutique Moderna <onboarding@resend.dev>',
        to: process.env.EMAIL_USER || 'hola@boutiquemoderna.com',
        subject: `Nuevo mensaje de contacto de ${nombre}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #000; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nuevo Mensaje de Contacto</h2>
            <p><strong>De:</strong> ${nombre} (${email})</p>
            <p><strong>WhatsApp / Tel:</strong> ${celular || 'No proporcionado'}</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; margin-top: 10px;">
              <p><strong>Mensaje:</strong></p>
              <p>${mensaje}</p>
            </div>
            <p style="font-size: 10px; color: #999; margin-top: 20px;">Este mensaje fue enviado desde el formulario de contacto de Boutique Moderna.</p>
          </div>
        `,
      });
      
      if (emailResult.error) {
        console.error('API Error Resend details:', emailResult.error);
      } else {
        console.log('API: Email enviado exitosamente:', emailResult.data?.id);
      }
    } catch (err: any) {
      console.error('API Error Resend (catch):', err.message || err);
      // No bloqueamos el éxito si el email falla pero se guardó en DB
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error General:', error.message || error);
    return NextResponse.json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    }, { status: 500 });
  }
}
