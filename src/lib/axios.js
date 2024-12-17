// src/lib/axios.js
import axios from 'axios';
import { env } from '@/config/env';

const axiosInstance = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;