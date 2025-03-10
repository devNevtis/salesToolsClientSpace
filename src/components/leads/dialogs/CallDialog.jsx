'use client';

import { useState } from 'react';
import { useCallDialogStore } from '@/store/useCallDialogStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DialList from '@/components/Sidebar/DialList';
import axiosInstance from '@/lib/axios';
import { env } from '@/config/env';
import axios from 'axios';
import useCompanyTheme from '@/store/useCompanyTheme';
import useCallStore from '@/store/useCallStore';
import { Phone } from 'lucide-react';
import { FiPhoneCall } from 'react-icons/fi';
import CompanyLogo from '@/components/Sidebar/CompanyLogo';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import useLeadsStore from '@/store/useLeadsStore';

export default function CallDialog() {
  const { isOpen, business, closeDialog } = useCallDialogStore();
  const { theme } = useCompanyTheme();
  const destination = useCallStore((state) => state.destination);
  const userCall = useCallStore((state) => state.userCall);
  const number = business?.phone;
  const { user } = useAuth();
  const { getContactsForBusiness } = useLeadsStore();

  // Estados para capturar los datos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCall = async () => {
    if (number && destination) {
      const data = {
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
        console.log(data);
        await axios.post(
          'https://api.nevtis.com/fusionpbx/users/serv2/click-to-call/c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376',
          data,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error initiating the call:', error);
        alert('Failed to initiate the call.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contacts = getContactsForBusiness(business._id);
    // Construcción de la estructura de datos
    const data = {
      user: user?._id || '',
      lead: contacts[0]?._id || '',
      business: business?._id,
      destination: destination?.destination_number || '',
      extension: userCall.extension,
      dest: number,
      title,
      description,
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    try {
      setLoading(true);
      console.log('Enviando datos:', data);

      const response = await axiosInstance.post(
        env.endpoints.callNotes.create,
        data
      );

      console.log('Respuesta:', response.data);
      console.log('Datos enviados correctamente');
      toast({
        title: 'Note saved',
        description: 'The note has been saved successfully.',
      });
      closeDialog();
    } catch (error) {
      console.error('Error enviando los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  //console.log(business);

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="w-[50vw] max-w-[90%] p-0 rounded-lg overflow-hidden">
        {/* Franja superior */}
        <DialogHeader
          className="w-full flex flex-row items-center justify-evenly px-6 py-4"
          style={{ backgroundColor: theme.base1 }}
        >
          {/* Logo de la empresa */}
          <div className="w-1/6">
            <CompanyLogo />
          </div>
          {/* Nombre de la empresa */}
          <DialogTitle className="text-white font-semibold">
            Call to {business?.name}
          </DialogTitle>
          <DialogDescription></DialogDescription>

          {/* Selector de destino */}
          <div className="mx-6">
            <DialList />
          </div>

          {/* Botón de llamada */}
          <div className="bg-white rounded-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCall}
              disabled={!number || !destination}
              className={`rounded-full font-semibold border-2 p-6 transition-all ${
                number && destination
                  ? 'text-[var(--theme-base1)] hover:bg-[var(--theme-base1)] hover:text-white border-white'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <FiPhoneCall className=" font-semibold h-12 w-12" />
            </Button>
          </div>
        </DialogHeader>

        {/* Formulario de notas */}
        <div className="p-6 bg-gray-50 border-t border-gray-300">
          <form
            className="flex justify-start items-end gap-3"
            onSubmit={handleSubmit}
          >
            <div className="flex-1">
              <Input
                placeholder="Call title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-gray-300 rounded-md px-3 py-2"
              />
              <Textarea
                placeholder="Write a transcript of the call here."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-2 h-48 border-gray-300 rounded-md px-3 py-2 resize-none"
              />
              <Input
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <Button
              type="submit"
              className="ml-auto w-1/5 py-2 mt-2 text-white rounded-md transition-all hover:opacity-90"
              style={{ backgroundColor: theme.base1 }}
            >
              Save Note
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
