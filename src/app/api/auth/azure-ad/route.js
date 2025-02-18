// app/api/auth/azure-ad/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirectTo') || '';

  const params = new URLSearchParams({
    client_id: process.env.AZURE_AD_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.AZURE_AD_REDIRECT_URI, // debe ser exactamente el mismo que registraste en Azure
    response_mode: 'query',
    scope: 'https://graph.microsoft.com/Mail.Send', // scope para enviar correo
    state: redirectTo, // para regresar a la UI
  });

  // Usamos el tenant configurado; para cuentas personales suele ser "consumers"
  const authUrl = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/authorize?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
