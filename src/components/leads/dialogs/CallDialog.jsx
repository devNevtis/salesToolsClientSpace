// src/components/leads/dialogs/CallDialog.jsx
'use client';

import { useState, useEffect } from 'react';
import { useCallDialogStore } from '@/store/useCallDialogStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Mantener si se usa, si no, se puede quitar
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DialList from '@/components/Sidebar/DialList'; // Asumiendo que este ya es responsivo (w-full)
import axiosInstance from '@/lib/axios';
import { env } from '@/config/env';
import axios from 'axios'; // Revisa si necesitas ambos axios y axiosInstance
import useCompanyTheme from '@/store/useCompanyTheme';
import useCallStore from '@/store/useCallStore';
import { Phone, Loader2 } from 'lucide-react'; // Añadido Loader2 para el botón de submit
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import CompanyLogo from '@/components/Sidebar/CompanyLogo';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import useLeadsStore from '@/store/useLeadsStore';
import { useRouter } from 'next/navigation';

export default function CallDialog() {
  const { isOpen, business, closeDialog } = useCallDialogStore();
  const { theme } = useCompanyTheme();
  const destination = useCallStore((state) => state.destination);
  const userCall = useCallStore((state) => state.userCall);
  const number = business?.phone;
  const { user } = useAuth();
  const { getContactsForBusiness } = useLeadsStore();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false); // Para estado de guardado
  const [contacts, setContacts] = useState([]);

  // Resetea el formulario cuando el diálogo se cierra o cambia el negocio
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setTags('');
      setLoading(false); // Resetea loading también
    } else if (business?._id) {
      const fetchedContacts = getContactsForBusiness(business._id);
      setContacts(fetchedContacts);
      // Opcional: Podrías pre-rellenar el título si quieres
      // setTitle(`Call to ${business?.name}`);
    }
  }, [isOpen, business, getContactsForBusiness]);

  // --- Lógica handleCall y handleSubmit sin cambios funcionales ---
  const handleCall = async () => {
    // ... (tu lógica existente)
    if (number && destination && userCall) {
      // Añadir chequeo de userCall
      const data = {
        /* ... tu objeto data ... */
        destination: {
          domain_uuid: userCall.domain_uuid,
          destination_uuid: destination.destination_uuid,
          dialplan_uuid: destination.dialplan_uuid,
          destination_type: 'inbound',
          destination_number: destination.destination_number,
          destination_number_regex: destination.destination_number_regex,
          destination_caller_id_name: destination.destination_caller_id_name,
          destination_caller_id_number:
            destination.destination_caller_id_number,
          insert_date: destination.insert_date,
          insert_user: destination.insert_user,
          destination_actions: [
            {
              destination_app: 'transfer',
              destination_data: '2001 XML nevtishq.nevtisvoice.com',
            },
          ],
        },
        extension: {
          extension_uuid: userCall.extension_uuid,
          domain_uuid: userCall.domain_uuid,
          extension: userCall.extension,
          password: userCall.password,
          accountcode: userCall.accountcode,
          effective_caller_id_name: userCall.effective_caller_id_name,
          effective_caller_id_number: userCall.effective_caller_id_number,
          outbound_caller_id_name: userCall.outbound_caller_id_name,
          outbound_caller_id_number: userCall.outbound_caller_id_number,
          directory_first_name: userCall.directory_first_name,
          directory_last_name: userCall.directory_last_name,
        },
        dest: number,
      };
      try {
        await axios.post(
          /* ... tu URL ... */ 'https://api.nevtis.com/fusionpbx/users/serv2/click-to-call/c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376',
          data,
          { headers: { 'Content-Type': 'application/json' } }
        );
        toast({ title: 'Call initiated', description: `Calling ${number}...` }); // Usar toast
      } catch (error) {
        console.error('Error initiating the call:', error);
        toast({
          variant: 'destructive',
          title: 'Call Error',
          description: 'Failed to initiate the call.',
        }); // Usar toast
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Missing Info',
        description: 'Cannot initiate call. Check number and destination.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitterName = e.nativeEvent.submitter?.name;
    const isSaveAndRecord = submitterName === 'saveAndRecord';
    const isNoteEmpty =
      title.trim() === '' && description.trim() === '' && tags.trim() === '';

    if (!isSaveAndRecord && isNoteEmpty) {
      toast({
        variant: 'warning',
        title: 'Empty note',
        description: 'Please fill in some details before saving.',
      });
      return;
    }
    if (isSaveAndRecord && isNoteEmpty) {
      closeDialog();
      router.push('/main/video-rec');
      return;
    }

    const contactsForBusiness = getContactsForBusiness(business._id);
    const data = {
      user: user?._id,
      lead: contactsForBusiness?.[0]?._id, // Safe access
      business: business?._id,
      destination: destination?.destination_number,
      extension: userCall?.extension, // Safe access
      dest: number,
      title,
      description,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean), // Filtra tags vacíos
    };

    // Chequeos básicos de datos necesarios
    if (!data.user || !data.business) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing user or business ID.',
      });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(env.endpoints.callNotes.create, data);
      toast({
        title: 'Note saved',
        description: 'The note has been saved successfully.',
      });
      closeDialog();
      if (isSaveAndRecord) {
        router.push('/main/video-rec');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save note.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppCall = () => {
    // ... (tu lógica existente)
    if (!number) return;
    const phoneNumber = number.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      {/* --- AJUSTES RESPONSIVOS DialogContent --- */}
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl p-0 rounded-lg overflow-hidden">
        {/* --- FIN AJUSTES --- */}

        {/* --- AJUSTES RESPONSIVOS DialogHeader --- */}
        <DialogHeader
          // Apilado vertical en móvil, fila en md+, padding ajustado, gap
          className="flex flex-col items-center gap-4 p-4 text-center md:flex-row md:justify-between md:text-left md:gap-6 md:p-6"
          style={{ backgroundColor: theme.base1 || '#224F5A' }} // Aplicar color tema
        >
          {/* Logo: Oculto en extra pequeño, tamaño controlado */}
          <div className="hidden sm:block w-auto max-w-[80px] md:max-w-[100px] shrink-0">
            <CompanyLogo />
          </div>

          {/* Título: Ocupa espacio flexible */}
          <div className="flex-1">
            <DialogTitle className="text-white font-semibold text-lg md:text-xl">
              Call to {business?.name || 'Business'}
            </DialogTitle>
            {contacts.length > 0 && (
              // Descripción debajo del título
              <DialogDescription className="text-xs md:text-sm font-normal text-white/80 mt-1">
                {contacts[0].name} : {business?.phone || 'No phone'}
              </DialogDescription>
            )}
          </div>

          {/* Grupo DialList y Botones de Llamada */}
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4 shrink-0">
            {/* DialList ahora toma ancho completo dentro de su contenedor */}
            <div className="w-full md:w-auto md:max-w-[180px]">
              <DialList />
            </div>
            {/* Botones con tamaño responsivo */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon" // Usamos size="icon" para control más fácil
                onClick={handleCall}
                disabled={!number || !destination || !userCall}
                className={`rounded-full border-2 p-2 md:p-3 transition-all ${
                  // Padding responsivo
                  number && destination && userCall
                    ? 'text-white hover:bg-white hover:text-[var(--theme-base1)] border-white'
                    : 'text-gray-400 border-gray-400 cursor-not-allowed'
                }`}
                title="Call via Phone System"
              >
                <FiPhoneCall className="h-5 w-5 md:h-6" />{' '}
                {/* Icono responsivo */}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWhatsAppCall}
                disabled={!number}
                className={`rounded-full border-2 p-2 md:p-3 transition-all ${
                  // Padding responsivo
                  number
                    ? 'text-green-400 hover:bg-green-400 hover:text-white border-green-400' // Colores ajustados
                    : 'text-gray-400 border-gray-400 cursor-not-allowed'
                }`}
                title="Call via WhatsApp"
              >
                <FaWhatsapp className="h-5 w-5 md:h-6" />{' '}
                {/* Icono responsivo */}
              </Button>
            </div>
          </div>
        </DialogHeader>
        {/* --- FIN AJUSTES HEADER --- */}

        {/* --- AJUSTES RESPONSIVOS Formulario --- */}
        <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex-1 space-y-3">
              {' '}
              {/* Usamos space-y para separar inputs */}
              <Input
                placeholder="Call title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-gray-300 rounded-md" // Simplificado
              />
              <Textarea
                placeholder="Write a transcript or notes of the call here."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // Altura base + min-h, mayor en md+
                className="w-full mt-2 h-32 min-h-[128px] md:h-48 md:min-h-[192px] border-gray-300 rounded-md resize-y" // Permitir resize vertical
              />
              <Input
                placeholder="Tags (comma separated, optional)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border-gray-300 rounded-md" // Simplificado
              />
            </div>
            {/* Botones: Apilados en móvil, fila en md+, alineados a la derecha en md+ */}
            <div className="flex flex-col md:flex-row gap-2 md:justify-end">
              <Button
                type="submit"
                name="save" // Mantenemos name para la lógica de submit
                value="save"
                disabled={loading} // Deshabilitar mientras carga
                // Quitamos flex-1, ajustamos padding/ancho
                className="w-full md:w-auto px-6 py-2 text-white rounded-md transition-all hover:opacity-90"
                style={{ backgroundColor: theme.base1 || '#224F5A' }}
              >
                {loading && submitterName === 'save' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}{' '}
                {/* Indicador de carga */}
                Save Note
              </Button>
              <Button
                type="submit"
                name="saveAndRecord" // Mantenemos name
                value="saveAndRecord"
                disabled={loading}
                // Quitamos flex-1, ajustamos padding/ancho
                className="w-full md:w-auto px-6 py-2 text-white rounded-md transition-all hover:opacity-90"
                style={{ backgroundColor: theme.base1 || '#224F5A' }}
              >
                {loading && submitterName === 'saveAndRecord' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}{' '}
                {/* Indicador de carga */}
                Save & Record Video
              </Button>
            </div>
          </form>
        </div>
        {/* --- FIN AJUSTES FORMULARIO --- */}
      </DialogContent>
    </Dialog>
  );
}
