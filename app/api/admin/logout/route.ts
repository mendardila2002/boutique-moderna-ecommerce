import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Eliminamos la cookie de sesión
  cookies().delete('admin_session');
  return NextResponse.json({ success: true });
}
