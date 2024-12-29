// src/app/main/dashboard/page.jsx
'use client';

import { useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import useLeadsStore from '@/store/useLeadsStore';
import { useAuth } from '@/components/AuthProvider';

function DashboardPage() {
  const { user } = useAuth();
  const { fetchBusinesses, businesses, contacts } = useLeadsStore();

  useEffect(() => {
    if (user) {
      fetchBusinesses(user);
    }
  }, [user, fetchBusinesses]);

  // Añadir logs
  console.log('Dashboard Page - User:', user);
  console.log('Dashboard Page - Businesses:', businesses);
  console.log('Dashboard Page - Contacts:', contacts);

  return <Dashboard leads={businesses} />;
}

export default DashboardPage;