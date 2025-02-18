// app/api/auth/microsoft/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirectTo') || '';

  const params = new URLSearchParams({
    client_id: process.env.AZURE_AD_CLIENT_ID, 
    response_type: 'code',
    redirect_uri: process.env.MICROSOFT_REDIRECT_URI, // Ej: http://localhost:3000/api/auth/microsoft/callback
    response_mode: 'query',
    scope: 'https://graph.microsoft.com/Mail.Send',
    state: redirectTo, // para redirigir de vuelta a la UI
  });

  // Como tu tenant es "consumers" para cuentas personales, se usa ese valor
  const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
