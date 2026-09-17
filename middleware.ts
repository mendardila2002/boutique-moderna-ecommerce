import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminToken = request.cookies.get('admin_session');
  const isAuthenticated = adminToken?.value === process.env.ADMIN_PASSWORD;

  // 1. Si intenta ir al login pero YA ESTÁ logueado, mandarlo al dashboard
  if (pathname === '/admin/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 2. Si intenta ir a cualquier ruta de admin (que no sea login) pero NO ESTÁ logueado
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

// Especificamos en qué rutas debe actuar el middleware
export const config = {
  matcher: ['/admin/:path*'],
};
