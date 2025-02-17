// app/api/send-email/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request) {
  const { provider, emailData } = await request.json();

  if (provider !== 'gmail') {
    return NextResponse.json({ error: 'Proveedor no soportado' }, { status: 400 });
  }

  // Aquí debes recuperar el token de acceso del usuario desde tu base de datos.
  // En este ejemplo, usaremos un token ficticio.
  const access_token = 'TOKEN_DEL_USUARIO_REAL';
  if (!access_token || access_token === 'TOKEN_DEL_USUARIO_REAL') {
    return NextResponse.json({ error: 'Token de acceso no disponible. Autoriza tu cuenta primero.' }, { status: 400 });
  }

  // Configuramos el cliente OAuth2
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Construir el mensaje de correo
  const messageParts = [
    `From: "Tu Nombre" <tu-email@tudominio.com>`, // Puedes modificarlo según tu lógica
    `To: ${emailData.to}`,
    `Subject: ${emailData.subject}`,
    '',
    emailData.body,
  ];
  const message = messageParts.join('\n');

  // Convertir el mensaje a Base64 URL-safe
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
    return NextResponse.json({ message: 'Email enviado exitosamente' });
  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
  }
}
