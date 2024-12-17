// middleware.js
import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user') ? JSON.parse(request.cookies.get('user').value) : null;

  // Redirigir a login si no hay token
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proteger ruta de company
  if (request.nextUrl.pathname.startsWith('/main/company')) {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return NextResponse.redirect(new URL('/main/leads', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};