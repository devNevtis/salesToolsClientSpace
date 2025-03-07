//src/components/Sidebar/DialerPad.jsx
'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useCompanyTheme from '@/store/useCompanyTheme';
import { Phone, X, Delete } from 'lucide-react'; // Importamos ícono Delete
import useCallStore from '@/store/useCallStore';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const DialerButton = ({ number, letters, onClick }) => (
  <div className="relative flex flex-col items-center">
    <button
      onClick={() => onClick(number)}
      className="w-14 h-14 rounded-full flex flex-col items-center justify-center bg-white hover:bg-slate-200 transition-colors relative shadow-md"
    >
      <span className="font-medium text-2xl">{number}</span>
      {letters && <span className="text-xs text-slate-500">{letters}</span>}
    </button>
  </div>
);

const DialerPad = () => {
  const [number, setNumber] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useCompanyTheme();
  const { toast } = useToast();

  const setDialedNumber = useCallStore((state) => state.setDialedNumber);
  const destination = useCallStore((state) => state.destination);
  const userCall = useCallStore((state) => state.userCall);

  const buttons = [
    { number: '1', letters: '' },
    { number: '2', letters: 'ABC' },
    { number: '3', letters: 'DEF' },
    { number: '4', letters: 'GHI' },
    { number: '5', letters: 'JKL' },
    { number: '6', letters: 'MNO' },
    { number: '7', letters: 'PQRS' },
    { number: '8', letters: 'TUV' },
    { number: '9', letters: 'WXYZ' },
    { number: '*', letters: '' },
    { number: '0', letters: '+' },
    { number: '#', letters: '' },
  ];

  const handleNumberClick = (value) => {
    if (number.length < 15) {
      setNumber((prev) => prev + value);
      setDialedNumber((prev) => prev + value);
    }
  };

  const handleDelete = () => {
    setNumber((prev) => prev.slice(0, -1));
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (number && destination) {
      setIsDialogOpen(true);

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
        const response = await axios.post(
          'https://api.nevtis.com/fusionpbx/users/serv2/click-to-call/c401dee4-4ecf-4cc6-9fbd-5dddb3e1a376',
          data,
          { headers: { 'Content-Type': 'application/json' } }
        );
        const clickToCallUrl = response.data.clickToCallUrl;
        if (clickToCallUrl) {
          toast({
            title: 'Call initiated successfully!',
            description: `to: ${number}`,
          });
        }
      } catch (error) {
        console.error('Error initiating the call:', error);
        alert('Failed to initiate the call.');
      }
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      {/* Display Number */}
      <div className="w-full px-4 mb-2">
        <div className="bg-white rounded-xl h-12 flex items-center justify-center border-b border-slate-200 shadow-md text-2xl font-mono tracking-wider px-4">
          {number || (
            <span className="text-gray-400 text-base">Enter a number</span>
          )}
        </div>
      </div>

      {/* Dialer Grid */}
      <div className="grid grid-cols-3 gap-3 px-4">
        {buttons.map((btn) => (
          <DialerButton
            key={btn.number}
            number={btn.number}
            letters={btn.letters}
            onClick={handleNumberClick}
          />
        ))}
      </div>

      <div className="w-full flex flex-row justify-center items-center ml-4 mr-4">
        {/* Nueva ubicación del botón de borrar */}
        {number && (
          <button
            onClick={handleDelete}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-3 shadow-md transition-all flex items-center gap-2"
          >
            <Delete className="w-6 h-6" />
            {/* <span className="text-sm font-medium">Del</span> */}
          </button>
        )}

        {/* Call Button */}
        <div className="px-4 mt-4 w-full">
          <button
            onClick={handleCall}
            disabled={!number || !destination}
            className="w-full h-12 rounded-full flex items-center justify-center gap-2 transition-colors"
            style={{
              backgroundColor: number && destination ? theme.base1 : 'white',
              color: number && destination ? 'white' : 'rgb(100, 116, 139)',
            }}
          >
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialerPad;
