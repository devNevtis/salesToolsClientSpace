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
import { Phone, X } from 'lucide-react';
import useCallStore from '@/store/useCallStore'; // Importamos el store
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const DialerButton = ({ number, letters, onClick }) => (
  <div className="relative flex flex-col items-center">
    <button
      onClick={() => onClick(number)}
      className="w-12 h-12 rounded-full flex flex-col items-center justify-center bg-white hover:bg-slate-200 transition-colors relative"
    >
      <span
        className={`font-medium text-xl mb-4 ${
          number === '*' ? 'text-3xl' : ''
        }`}
      >
        {number}
      </span>
      {letters && (
        <span className="absolute bottom-3 text-[9px] text-slate-500 tracking-wider">
          {letters}
        </span>
      )}
    </button>
  </div>
);

const DialerPad = () => {
  const [number, setNumber] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useCompanyTheme();
  const { toast } = useToast();

  const setDialedNumber = useCallStore((state) => state.setDialedNumber); // Usamos la función para actualizar el número marcado
  const destination = useCallStore((state) => state.destination); // Obtenemos el destino seleccionado
  const userCall = useCallStore((state) => state.userCall); // Obtenemos los datos de la llamada del store

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
      setDialedNumber((prev) => prev + value); // Actualizamos el número marcado en el store
    }
  };

  const handleDelete = () => {
    setNumber((prev) => prev.slice(0, -1));
    setDialedNumber((prev) => prev.slice(0, -1)); // Eliminamos el último número del store
  };

  const handleCall = async () => {
    if (number && destination) {
      setIsDialogOpen(true); // Abrir el modal para mostrar los detalles de la llamada

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

        // Mostrar la respuesta de la API (puedes ajustarlo según lo que necesites)
        /* console.log('Response from API:', response.data); */
        // Verificar si la respuesta contiene la URL y abrirla en una nueva pestaña
        const clickToCallUrl = response.data.clickToCallUrl;
        if (clickToCallUrl) {
          // Abre la URL en una nueva pestaña del navegador
          //window.open(clickToCallUrl, '_blank');
          const link = document.createElement('a');
          link.href = clickToCallUrl;
          link.target = '_self'; // No abrir una nueva pestaña
          //console.log(clickToCallUrl);
          // Simular el clic en el enlace sin redirigir
          link.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que el navegador cambie la página
            console.log('Simulating click on:', clickToCallUrl); // Solo para depuración
          });

          // Simular el clic en el enlace
          link.click();
          toast({
            title: 'Call initiated successfully!',
            description: `to: ${number}`,
          });
        }

        // Si la llamada fue exitosa, puedes hacer algo más (como mostrar un mensaje de éxito)
        //alert('Call initiated successfully!');
      } catch (error) {
        console.error('Error initiating the call:', error);
        alert('Failed to initiate the call.');
      }
    }
  };
  //console.log(destination);

  return (
    <div className="mt-4">
      {/* Display Number */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl relative h-10 flex items-center justify-between border-b border-slate-200 shadow-lg">
          <p className="text-xl font-mono tracking-wider flex-1 text-center mr-4">
            {number}
          </p>
          {number && (
            <button
              onClick={handleDelete}
              className="absolute right-0 flex items-center justify-center h-6"
            >
              <div className="relative flex items-center h-[22px] bg-black/80 hover:bg-black">
                {/* X dentro del rectángulo */}
                <div className="px-1">
                  <X className="h-3 w-3 text-white" />
                </div>
                {/* Forma triangular derecha */}
                <div className="absolute -left-[8px] h-full w-[11px] overflow-hidden">
                  <div className="absolute left-0 h-full w-[22px] bg-black/80 hover:bg-black transform -rotate-45"></div>
                </div>
              </div>
            </button>
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

      {/* Call Button */}
      <div className="px-4 mt-4">
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
  );
};

export default DialerPad;
