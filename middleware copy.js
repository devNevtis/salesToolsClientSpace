import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value

  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['main/:path*','leads/:path*', '/dashboard/:path*', '/api/:path*'],
}