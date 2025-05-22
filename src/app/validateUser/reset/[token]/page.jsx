'use client';
import React, {
  useState, // Eliminamos useState para error, ya que react-hook-form lo manejará
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast'; // Asegúrate que esta ruta sea correcta

const PasswordReset = ({ params }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Para observar el valor del campo password
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  // Observamos el valor del campo 'password' para la validación de 'confirmPassword'
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    // La validación de que las contraseñas coinciden ya se hace con react-hook-form
    // if (data.password !== data.confirmPassword) { // Esta validación se moverá a react-hook-form
    //   toast({
    //     title: 'Validation Error',
    //     description: 'Passwords do not match.',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    try {
      const response = await axios.put(
        'https://api.nevtis.com/dialtools/auth/reset-password',
        {
          token: params.token,
          password: data.password,
        }
      );
      console.log(response.data);
      toast({
        title: 'Success!',
        description: response.data.msg || 'New password created successfully!', // Asumiendo que la API devuelve un `msg`
        variant: 'success',
      });
      setTimeout(() => {
        router.push('/api/auth/signin'); // O la ruta de login que uses
      }, 1500);
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Error creating password.';
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.msg) {
          // Si tu API devuelve 'msg' en errores
          errorMessage = error.response.data.msg;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-900">
      <div className="bg-sky-600 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-center text-slate-100 font-bold text-2xl mb-3">
          Welcome to Sales Tools
        </h1>
        <h2 className="text-center text-slate-200 mb-6 text-sm">
          Please reset your password
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className={`shadow appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-red-400 ring-red-400'
                  : 'border-sky-400 focus:ring-teal-400 focus:border-teal-400'
              } bg-sky-700 placeholder-slate-300`}
              type="password"
              placeholder="Password..."
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6, // Ejemplo: Mínimo 6 caracteres
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-300 text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              className={`shadow appearance-none border rounded w-full py-2.5 px-3 text-gray-100 leading-tight focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? 'border-red-400 ring-red-400'
                  : 'border-sky-400 focus:ring-teal-400 focus:border-teal-400'
              } bg-sky-700 placeholder-slate-300`}
              type="password"
              placeholder="Confirm Password..."
              {...register('confirmPassword', {
                required: 'Confirming your password is required',
                validate: (value) =>
                  value === passwordValue || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-300 text-xs mt-1.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-teal-800 hover:bg-teal-600 text-slate-50 font-semibold rounded-md py-2.5 px-4 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 shadow-lg"
          >
            Create Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
