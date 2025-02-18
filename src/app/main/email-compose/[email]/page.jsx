// app/main/email-compose/[email]/page.jsx
'use client';

/* export const dynamic = 'force-dynamic';
export const prerender = false;
export const revalidate = 0; */

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SiGmail } from 'react-icons/si';
import { PiMicrosoftOutlookLogoFill } from 'react-icons/pi';
import { FaMicrosoft } from 'react-icons/fa'; // Opcional, para icono de Azure AD
import useCompanyTheme from '@/store/useCompanyTheme';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

export default function EmailCompose() {
  const { email } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useCompanyTheme();
  const { user } = useAuth();

  // Estado del formulario
  const [emailData, setEmailData] = useState({
    to: decodeURIComponent(email) || '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    if (email && email !== emailData.to) {
      setEmailData((prev) => ({ ...prev, to: decodeURIComponent(email) }));
    }
  }, [email]);

  // Estado para el proveedor seleccionado
  const [selectedProvider, setSelectedProvider] = useState('');

  // Cuando se retorne del OAuth, lee el query "provider"
  useEffect(() => {
    const provider = searchParams.get('provider');
    if (provider) {
      setSelectedProvider(provider);
    }
  }, [searchParams]);

  // Función para iniciar el flujo OAuth
  const handleProviderSelection = (provider) => {
    if (provider === 'gmail') {
      setSelectedProvider('gmail');
      const currentUrl = `${
        window.location.origin
      }/main/email-compose/${encodeURIComponent(emailData.to)}`;
      const redirectTo = currentUrl + '?provider=gmail';
      router.push(
        `/api/auth/google?redirectTo=${encodeURIComponent(redirectTo)}`
      );
    } else if (provider === 'azure-ad') {
      setSelectedProvider('azure-ad');
      const currentUrl = `${
        window.location.origin
      }/main/email-compose/${encodeURIComponent(emailData.to)}`;
      const redirectTo = currentUrl + '?provider=azure-ad';
      router.push(
        `/api/auth/azure-ad?redirectTo=${encodeURIComponent(redirectTo)}`
      );
    } else if (provider === 'microsoft') {
      // Si en algún momento deseas mantener otra opción de Microsoft (con un flujo distinto), puedes implementarlo.
      toast({
        title: 'Microsoft integration',
        description: 'Microsoft integration coming soon',
        variant: 'destructive',
      });
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
      const signature = user && user.name ? `\n\nRegards,\n${user.name}` : '';
      const fullBody = emailData.body + signature;
      const emailDataWithSignature = { ...emailData, body: fullBody };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          emailData: emailDataWithSignature,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: 'Email sent successfully',
          description: 'Your email has been sent.',
          variant: 'success',
        });
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
      <div className="flex justify-between">
        <h1
          className="text-center font-bold text-xl"
          style={{ color: theme.base1 }}
        >
          Write your Email
        </h1>
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-red-500 font-semibold">
            Select your email provider:
          </p>
          <div>
            <button
              className="border rounded-md px-8 py-2 shadow-lg"
              onClick={() => handleProviderSelection('gmail')}
            >
              <SiGmail size={25} className="text-red-600" />
            </button>
            <button
              className="border rounded-md px-8 py-2 shadow-lg"
              onClick={() => handleProviderSelection('azure-ad')}
            >
              <FaMicrosoft size={25} className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>

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
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Subject:
        </label>
        <input
          type="text"
          value={emailData.subject}
          onChange={(e) =>
            setEmailData({ ...emailData, subject: e.target.value })
          }
          className="shadow-md w-full px-2 py-1 rounded-sm"
        />
      </div>

      <div className="mb-4">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Message:
        </label>
        <textarea
          className="border shadow-sm rounded-sm"
          value={emailData.body}
          onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            height: '200px',
          }}
        />
      </div>

      {/*       <div className="flex gap-1 mb-4">
        <p>Select your email provider:</p>
        <button
          className="border rounded-md px-8 py-2 shadow-lg"
          onClick={() => handleProviderSelection('gmail')}
        >
          <SiGmail size={25} className="text-red-600" />
        </button>
        <button
          className="border rounded-md px-8 py-2 shadow-lg"
          onClick={() => handleProviderSelection('azure-ad')}
        >
          <FaMicrosoft size={25} className="text-blue-600" />
        </button>
      </div> */}

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
