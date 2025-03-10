'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import axiosInstance from '@/lib/axios';
import { env } from '@/config/env';
import axios from 'axios';
import CallRecordsTab from './CallRecordsTab';

const CallRecords = ({ businessId }) => {
  const { user } = useAuth();
  console.log(user);
  console.log(businessId);
  const [callRecords, setCallRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCallRecords = async () => {
    if (!user?._id || !businessId) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        env.endpoints.callNotes.getByBusiness(businessId)
      );
      //const dataFiltered = data.filter((record) => record.lead === businessId);
      console.log(data);
      setCallRecords(data);
    } catch (error) {
      console.error('Error fetching call records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallRecords();
  }, [user, businessId]);

  return (
    <div>
      <CallRecordsTab callRecords={callRecords} />
    </div>
  );
};

export default CallRecords;
