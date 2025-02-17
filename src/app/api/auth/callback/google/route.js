// app/api/auth/callback/google/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '';

  if (!code) {
    return NextResponse.json({ error: 'No se recibió el código de autorización' }, { status: 400 });
  }

  // Intercambiar el código por tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error }, { status: 400 });
  }

  // Aquí guardamos el access_token en una cookie
  const response = NextResponse.redirect(state || '/email-compose?provider=gmail');
  // La cookie se establece para toda la aplicación (path: '/')
  // maxAge se fija en segundos (usamos tokenData.expires_in o 3600 segundos por defecto)
  response.cookies.set('google_access_token', tokenData.access_token, { 
    path: '/',
    maxAge: tokenData.expires_in || 3600,
    // En desarrollo no uses secure; en producción usa secure: true y HttpOnly para mayor seguridad.
    // secure: process.env.NODE_ENV === 'production',
    // httpOnly: true, // Si lo activas, el cliente no podrá leerlo con JS, pero el servidor sí.
  });
  return response;
}
