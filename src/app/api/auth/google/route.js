// app/api/auth/google/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  // Recibimos un parámetro opcional "redirectTo" desde la UI
  const redirectTo = searchParams.get('redirectTo') || '';

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI, // ej.: http://localhost:3000/api/auth/google/callback
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/gmail.send',
    access_type: 'offline', // Para obtener refresh_token
    prompt: 'consent', // Forzar el consentimiento (útil en desarrollo)
    state: redirectTo, // Lo usaremos para redirigir de vuelta a la página de redacción
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
