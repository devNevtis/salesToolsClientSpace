'use client';

import { useCallDialogStore } from '@/store/useCallDialogStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DialList from '@/components/Sidebar/DialList';
import axios from 'axios';
import useCompanyTheme from '@/store/useCompanyTheme';
import useCallStore from '@/store/useCallStore';
import { Phone, X } from 'lucide-react';

export default function CallDialog() {
  const { isOpen, business, closeDialog } = useCallDialogStore();
  const { theme } = useCompanyTheme();
  const destination = useCallStore((state) => state.destination);
  const userCall = useCallStore((state) => state.userCall);
  const number = business?.phone;

  const handleCall = async () => {
    if (number && destination) {
      // Crear el cuerpo de la solicitud POST (JSON)
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
        dest: number, // Número marcado
      };

      try {
        // Hacer el POST a la API
        console.log(data);
        const response = await axios.post(
          'https://api.nevtis.com/fusionpbx/users/serv2/click-to-call/c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376',
          data,
          {
            headers: {
              'Content-Type': 'application/json', // Aseguramos que estamos enviando JSON
            },
          }
        );
        const clickToCallUrl = response.data.clickToCallUrl;

        // Si la llamada fue exitosa, puedes hacer algo más (como mostrar un mensaje de éxito)
        //alert('Call initiated successfully!');
      } catch (error) {
        console.error('Error initiating the call:', error);
        alert('Failed to initiate the call.');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader
          className={'flex flex-row justify-between items-center pt-1'}
        >
          <DialogTitle>
            Call to {business?.name}:{' '}
            <span
              className="text-sm underline text-white px-1"
              style={{ backgroundColor: theme.base1 }}
            >
              {business?.phone}
            </span>
          </DialogTitle>
          <DialList />
        </DialogHeader>
        <div>
          <div className="w-full flex justify-center gap-2">
            <button
              onClick={handleCall}
              disabled={!number || !destination}
              className="w-1/3 h-8 rounded-full flex items-center justify-center gap-2 transition-colors"
              style={{
                backgroundColor: number && destination ? theme.base1 : 'white',
                color: number && destination ? 'white' : 'rgb(100, 116, 139)',
              }}
            >
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </button>
          </div>
          <form className="grid w-full gap-2 mt-2 border border-gray-300 shadow-md rounded-md p-3">
            <Input placeholder="Title" />
            <Textarea placeholder="Type your note here." />
            <Button type="submit" style={{ backgroundColor: theme.base2 }}>
              Submit
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
