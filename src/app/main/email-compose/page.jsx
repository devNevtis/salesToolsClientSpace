// app/main/email-compose/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SiGmail } from 'react-icons/si';
import { PiMicrosoftOutlookLogoFill } from 'react-icons/pi';
import useCompanyTheme from '@/store/useCompanyTheme';
import { toast } from '@/hooks/use-toast';
import { useAuth } from "@/components/AuthProvider";

export default function EmailCompose() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useCompanyTheme();
  const { user } = useAuth();

  // Pre-carga el destinatario desde la URL (?to=...)
  const initialTo = searchParams.get('to') || '';
  // Si ya se autorizó, la URL tendrá provider (ej.: provider=gmail)
  const initialProvider = searchParams.get('provider') || '';

  // Estado para el proveedor seleccionado
  const [selectedProvider, setSelectedProvider] = useState(initialProvider);
  // Estado para los datos del email
  const [emailData, setEmailData] = useState({
    to: initialTo,
    subject: '',
    body: '',
  });

  // Restaurar emailData (subject y body) desde localStorage si existen
  useEffect(() => {
    const savedData = localStorage.getItem('emailComposeData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setEmailData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved email data:', error);
      }
      localStorage.removeItem('emailComposeData');
    }
  }, []);

  // Actualizar el proveedor si cambia el query param (por ejemplo, tras OAuth)
  useEffect(() => {
    const prov = searchParams.get('provider');
    if (prov) {
      setSelectedProvider(prov);
    }
  }, [searchParams]);

  // Función para iniciar el flujo OAuth según el proveedor seleccionado
  const handleProviderSelection = (provider) => {
    if (provider === 'gmail') {
      // Guardamos los datos actuales (subject y body) en localStorage
      localStorage.setItem('emailComposeData', JSON.stringify(emailData));
      // Construimos la URL actual con el destinatario precargado
      const currentUrl = `${window.location.origin}/main/email-compose?to=${encodeURIComponent(
        emailData.to
      )}`;
      // Se incluye el parámetro provider para indicar que se usará Gmail
      const redirectTo = currentUrl + '&provider=gmail';
      // Redirige al endpoint de OAuth de Gmail, pasándole la URL de retorno
      router.push(`/api/auth/google?redirectTo=${encodeURIComponent(redirectTo)}`);
    } else if (provider === 'microsoft') {
      toast({
        title: 'Microsoft integration',
        description: 'Microsoft integration coming soon',
        variant: 'destructive',
      });
      // Opcionalmente, podrías setear el proveedor para microsoft:
      // setSelectedProvider('microsoft');
    }
  };

  // Función para enviar el email
  const handleSendEmail = async () => {
    if (!selectedProvider) {
      toast({
        title: 'Select an email provider',
        variant: 'destructive',
      });
      return;
    }
    try {
      // Agregar firma dinámica usando el nombre del usuario
      const signature = user && user.name ? `\n\nRegards,\n${user.name}` : '';
      // Se concatena la firma al cuerpo del correo sin modificar el estado original
      const fullBody = emailData.body + signature;
      const emailDataWithSignature = { ...emailData, body: fullBody };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider, emailData: emailDataWithSignature }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: 'Email sent successfully',
          description: 'Your email has been sent.',
          variant: 'success',
        });
        // Redirige a /main/leads tras 2 segundos
        setTimeout(() => {
          router.push('/main/leads');
        }, 2000);
      } else {
        toast({
          title: 'Error sending email',
          description: data.error || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error sending email',
        description: 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="border shadow-lg rounded-lg m-6 p-6">
      <h1 className="text-center font-bold text-xl" style={{ color: theme.base1 }}>
        Write your Email
      </h1>

      <div className="flex gap-10 mb-2">
        <label>To:</label>
        <input
          type="email"
          placeholder="Recipient(s) email, separated by commas"
          value={emailData.to}
          onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
          className="shadow-md w-full px-2 py-1 rounded-sm"
        />
      </div>

      <div className="flex gap-1 mb-2">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subject:</label>
        <input
          type="text"
          value={emailData.subject}
          onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
          className="shadow-md w-full px-2 py-1 rounded-sm"
        />
      </div>

      <div className="mb-4">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Message:</label>
        <textarea
          className="border shadow-sm rounded-sm"
          value={emailData.body}
          onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', height: '200px' }}
        />
      </div>

      <div className="flex gap-1 mb-4">
        <p>Select your email provider:</p>
        <button
          className="border rounded-md px-8 py-2 shadow-lg"
          onClick={() => handleProviderSelection('gmail')}
        >
          <SiGmail size={25} className="text-red-600" />
        </button>
        <button
          className="border rounded-md px-8 py-2 shadow-lg"
          onClick={() => handleProviderSelection('microsoft')}
        >
          <PiMicrosoftOutlookLogoFill size={25} className="text-blue-600" />
        </button>
      </div>

      <div>
        <button
          onClick={handleSendEmail}
          disabled={!selectedProvider}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 'bolder',
            backgroundColor: !selectedProvider ? 'gray' : theme.base2,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: !selectedProvider ? 'not-allowed' : 'pointer',
          }}
        >
          Send Email
        </button>
      </div>
    </div>
  );
}
