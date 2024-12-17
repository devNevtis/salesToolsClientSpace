// src/hooks/useCompanyData.js
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import useCompanyTheme from '@/store/useCompanyTheme';
import useCompanyStages from '@/store/useCompanyStages';
import axios from '@/lib/axios';
import { env } from '@/config/env';

export const useCompanyData = () => {
  const { user } = useAuth();
  const { setTheme } = useCompanyTheme();
  const { setStages } = useCompanyStages();

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (user?.companyId) {
        try {
          const response = await axios.get(env.endpoints.company.getById(user.companyId));
          const { configuration } = response.data;
          
          if (configuration?.theme) {
            setTheme(configuration.theme);
          }

          if (configuration?.stages) {
            setStages(configuration.stages);
          }
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      }
    };

    fetchCompanyData();
  }, [user?.companyId, setTheme, setStages]);
};