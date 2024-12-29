// src/hooks/useCompanyData.js
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import useCompanyTheme from '@/store/useCompanyTheme';
import useCompanyStages from '@/store/useCompanyStages';
import axios from '@/lib/axios';
import { env } from '@/config/env';

// src/hooks/useCompanyData.js
export const useCompanyData = () => {
  const { user } = useAuth();
  const { setTheme } = useCompanyTheme();
  const { setStages } = useCompanyStages();

  useEffect(() => {
    //console.log('0. Hook effect ejecutado');
    //console.log('0.1 Estado actual de auth:', { user });

    // Añadir validación explícita
    if (!user) {
      console.log('0.2 No hay usuario aún, esperando...');
      return;
    }

    const fetchCompanyData = async () => {
      try {
        //console.log('1. Iniciando fetch con companyId:', user.companyId);
        //console.log('2. URL de fetch:', env.endpoints.company.getById(user.companyId));
        
        const response = await axios.get(env.endpoints.company.getById(user.companyId));
        //console.log('3. Respuesta recibida:', response.data);
        
        const { configuration } = response.data;
        
        if (configuration?.theme) {
          //console.log('4. Configurando theme:', configuration.theme);
          setTheme(configuration.theme);
        }

        if (configuration?.stages) {
          //console.log('5. Configurando stages:', configuration.stages);
          setStages(configuration.stages);
        }
      } catch (error) {
        console.error('Error en fetchCompanyData:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    };

    fetchCompanyData();
  }, [user, setTheme, setStages]); // Cambiamos la dependencia a user completo
};