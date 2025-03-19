// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('🚀 Middleware cargado en Next.js');

  console.log('🚀 Middleware ejecutándose en:', request.nextUrl.pathname);
  console.log('🍪 Cookies recibidas:', request.headers.get('cookie'));

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = new Map(cookieHeader.split('; ').map((c) => c.split('=')));

  const token = cookies.get('token');

  if (!token && request.nextUrl.pathname !== '/login') {
    console.log('🔴 Redirigiendo a /login (no hay token)');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 🔹 Aplicar middleware a todas las rutas
export const config = {
  matcher: '/:path*',
};
