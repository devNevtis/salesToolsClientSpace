// app/api/send-email/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

export async function POST(request) {
  const { provider, emailData } = await request.json();

  if (provider === 'gmail') {
    const token = request.cookies.get('google_access_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token de acceso no disponible. Autoriza tu cuenta primero.' }, { status: 400 });
    }
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const messageParts = [
      `From: "Tu Nombre" <tu-email@tudominio.com>`,
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      '',
      emailData.body,
    ];
    const message = messageParts.join('\n');

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
  } else if (provider === 'azure-ad' || provider === 'microsoft') {
    // Aquí tratamos tanto "azure-ad" como "microsoft" de la misma forma
    const token = request.cookies.get('azure_ad_access_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token de acceso no disponible. Autoriza tu cuenta primero.' }, { status: 400 });
    }
  
    // Configuramos el cliente de Microsoft Graph
    const client = Client.init({
      authProvider: (done) => {
        done(null, token);
      },
    });
  
    const emailMessage = {
      message: {
        subject: emailData.subject,
        body: {
          contentType: 'Text',
          content: emailData.body,
        },
        toRecipients: emailData.to.split(',').map(email => ({ emailAddress: { address: email.trim() } })),
      },
      saveToSentItems: 'true',
    };
  
    try {
      await client.api('/me/sendMail').post(emailMessage);
      return NextResponse.json({ message: 'Email enviado exitosamente' });
    } catch (error) {
      console.error('Error enviando email con Microsoft:', error);
      return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Proveedor no soportado' }, { status: 400 });
  }
}
