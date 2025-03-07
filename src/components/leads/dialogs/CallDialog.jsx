'use client';

import { useCallDialogStore } from '@/store/useCallDialogStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Phone } from 'lucide-react';

export default function CallDialog() {
  const { isOpen, business, closeDialog } = useCallDialogStore();
  const { theme } = useCompanyTheme();
  const destination = useCallStore((state) => state.destination);
  const userCall = useCallStore((state) => state.userCall);
  const number = business?.phone;

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
        dest: number, // Número marcado
      };

      try {
        console.log(data);
        const response = await axios.post(
          'https://api.nevtis.com/fusionpbx/users/serv2/click-to-call/c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376',
          data,
          { headers: { 'Content-Type': 'application/json' } }
        );
        const clickToCallUrl = response.data.clickToCallUrl;
      } catch (error) {
        console.error('Error initiating the call:', error);
        alert('Failed to initiate the call.');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="p-6 rounded-lg w-[450px]">
        {/* Header */}
        <DialogHeader className="flex flex-row justify-between items-center pt-1">
          <DialogTitle className="text-md font-semibold flex flex-col items-start">
            <span className="text-sm">Call to </span>
            <div>
              <span style={{ color: theme.base2 }} className="font-bold">
                {business?.name}
              </span>
              :
              <span
                className="text-sm px-2 py-1 rounded-lg ml-2 text-white"
                style={{ backgroundColor: theme.base1 }}
              >
                {business?.phone.slice(0, 3)}-{business?.phone.slice(3, 6)}-
                {business?.phone.slice(6)}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <DialList />
        </DialogHeader>

        {/* Botón de llamada */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleCall}
            disabled={!number || !destination}
            className={`w-2/3 h-10 flex items-center justify-center gap-2 rounded-xl text-white transition-all ${
              number && destination
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            <Phone className="h-5 w-5" />
            <span>Call</span>
          </button>
        </div>

        {/* Formulario de notas */}
        <form className="grid w-full gap-3 mt-4 border border-gray-300 shadow-sm rounded-md p-4 bg-gray-50">
          <Input
            placeholder="Call title"
            className="w-full border-gray-300 rounded-md px-3 py-2"
          />
          <Textarea
            placeholder="Write a transcript of the call here."
            className="w-full h-24 border-gray-300 rounded-md px-3 py-2 resize-none"
          />
          <Button
            type="submit"
            className="w-full py-2 mt-2 text-white rounded-md transition-all hover:opacity-90"
            style={{ backgroundColor: theme.base2 }}
          >
            Save Note
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
