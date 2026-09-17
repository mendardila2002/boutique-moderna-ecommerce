import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    // Seteamos la cookie de sesión por 7 días
    cookies().set('admin_session', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
