// src/app/main/dashboard/page.jsx
'use client';

import { useEffect } from 'react';
import withAuth from '@/components/withAuth';
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

  return <Dashboard leads={businesses} />;
}

export default withAuth(DashboardPage);
