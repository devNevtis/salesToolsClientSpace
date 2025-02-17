// app/email-compose/page.js
'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function EmailCompose() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Pre-cargar "Para" si viene en el query (ej.: ?to=correo@ejemplo.com)
  const initialTo = searchParams.get('to') || '';
  // Si ya se autorizó, la URL tendrá provider=gmail
  const initialProvider = searchParams.get('provider') || '';

  const [selectedProvider, setSelectedProvider] = useState(initialProvider);
  const [emailData, setEmailData] = useState({
    to: initialTo,
    subject: '',
    body: '',
  });
  const [message, setMessage] = useState('');

  // Maneja la selección de proveedor
  const handleProviderSelection = (provider) => {
    if (provider === 'gmail') {
      // Si el usuario elige Gmail, redirige al flujo OAuth.
      // Preparamos la URL actual con el email precargado y agregamos provider=gmail
      const currentUrl = `${window.location.origin}/email-compose?to=${encodeURIComponent(
        emailData.to
      )}`;
      // Agregamos el parámetro provider a la URL de retorno
      const redirectTo = currentUrl + '&provider=gmail';
      // Redirige al endpoint de OAuth de Gmail pasando redirectTo en el query
      router.push(`/api/auth/google?redirectTo=${encodeURIComponent(redirectTo)}`);
    } else if (provider === 'microsoft') {
      alert('Integración con Microsoft próximamente');
    }
  };

  // Función para enviar el email
  const handleSendEmail = async () => {
    if (!selectedProvider) {
      setMessage('Selecciona un proveedor antes de enviar');
      return;
    }
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider, emailData }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('¡Email enviado correctamente!');
      } else {
        setMessage(data.error || 'Error al enviar el email');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al enviar el email');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Redactar Email</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Para:
        </label>
        <input
          type="email"
          value={emailData.to}
          onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Asunto:
        </label>
        <input
          type="text"
          value={emailData.subject}
          onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Mensaje:
        </label>
        <textarea
          value={emailData.body}
          onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', height: '200px' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p>Selecciona el proveedor desde el cual enviar el email:</p>
        <button
          onClick={() => handleProviderSelection('gmail')}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          Enviar desde Gmail
        </button>
        <button
          onClick={() => handleProviderSelection('microsoft')}
          style={{ padding: '0.5rem 1rem' }}
        >
          Enviar desde Microsoft (próximamente)
        </button>
      </div>

      <div>
        <button
          onClick={handleSendEmail}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Enviar Email
        </button>
      </div>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
