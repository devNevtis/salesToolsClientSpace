'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import axiosInstance from '@/lib/axios';
import { env } from '@/config/env';
import CallRecordsTab from './CallRecordsTab';

const CallRecords = ({ businessId }) => {
  const { user } = useAuth();
  const [callRecords, setCallRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCallRecords = async () => {
      if (!user?._id || !businessId) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          env.endpoints.callNotes.getByBusiness(businessId)
        );
        setCallRecords(data);
      } catch (error) {
        console.error('Error fetching call records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCallRecords();
  }, [user, businessId]);

  return (
    <div>
      <CallRecordsTab
        callRecords={callRecords}
        setCallRecords={setCallRecords}
      />
    </div>
  );
};

export default CallRecords;
