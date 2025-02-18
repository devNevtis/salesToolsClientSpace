// app/api/auth/microsoft/callback/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '';

  if (!code) {
    return NextResponse.json({ error: 'No se recibió el código de autorización' }, { status: 400 });
  }

  // Intercambiar el código por tokens
  const tokenResponse = await fetch(`https://login.microsoftonline.com/consumers/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.AZURE_AD_CLIENT_ID,
      client_secret: process.env.AZURE_AD_CLIENT_SECRET,
      code,
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
  }

  // Guarda el token de acceso en una cookie
  const response = NextResponse.redirect(state || '/main/emailcompose/' + encodeURIComponent('') + '?provider=microsoft');
  response.cookies.set('microsoft_access_token', tokenData.access_token, {
    path: '/',
    maxAge: tokenData.expires_in || 3600,
  });

  return response;
}
