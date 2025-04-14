// src/components/Login/Login.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FaLock } from 'react-icons/fa6';
import { useAuth } from '@/components/AuthProvider';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { env } from '@/config/env';
import axios from '@/lib/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${env.endpoints.auth.login}`, {
        email,
        password,
      });

      const { token, user } = response.data;
      Cookies.set('token', token, { expires: 7 });
      login(user);
      router.push('/main/leads');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Hubo un error al iniciar sesión';
      alert(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-100 p-6 sm:p-8 w-11/12 max-w-md flex flex-col justify-center items-center gap-6 sm:gap-8 rounded-lg shadow-lg"
    >
      {/* Logo Container (optional, but good practice) */}
      <div className="mb-4">
        {' '}
        {/* Added margin-bottom */}
        <Image
          src="/DialToolProLogo.png"
          height={180}
          width={180}
          alt="logo"
          priority
        />
        <h1 className="text-sm font-semibold text-slate-600 flex gap-2 justify-center mt-2">
          {' '}
          {/* Added margin-top */}
          <span className="text-[#224f5a]">Login</span>
          <FaLock className="text-[#29abe2]" />
        </h1>
      </div>
      <div className="w-full px-4 sm:px-0">
        {' '}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border border-slate-300 shadow-xl w-full" // Ensure w-full
          required
        />
      </div>
      <div className="w-full px-4 sm:px-0">
        {' '}
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-slate-300 shadow-xl w-full" // Ensure w-full
          required
        />
      </div>

      <Button type="submit" variant="dialtools" className="w-full max-w-xs">
        {' '}
        Session Start
      </Button>
      <div className="w-full text-center mt-4">
        {' '}
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-[#224f5a] hover:text-[#29abe2cc] inline-block px-2 py-1 rounded-lg hover:bg-[#224f5a1a]"
        >
          Forgot Password?
        </Link>
      </div>
    </form>
  );
}
