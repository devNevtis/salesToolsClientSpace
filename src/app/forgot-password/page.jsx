'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast'; // Usando la ruta que proporcionaste
import axios from 'axios';

const ForgotPasspage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Agregado formState para errores
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        'https://api.nevtis.com/dialtools/auth/forgot-password',
        {
          email: data.email,
        }
      );

      // Verificar la respuesta de la API incluso si la solicitud fue "exitosa"
      if (
        response.data &&
        typeof response.data === 'string' &&
        response.data.toLowerCase().includes('there is no user with that email')
      ) {
        // Caso específico: el usuario no existe
        console.log('User not found:', response.data);
        toast({
          title: 'User Not Found',
          description: response.data, // Mostrar el mensaje exacto de la API
          variant: 'destructive',
        });
      } else if (
        response.data &&
        response.data.message &&
        typeof response.data.message === 'string' &&
        response.data.message
          .toLowerCase()
          .includes('there is no user with that email')
      ) {
        // Otra forma común en que las APIs devuelven mensajes de error dentro de un objeto
        console.log('User not found (in message):', response.data.message);
        toast({
          title: 'User Not Found',
          description: response.data.message,
          variant: 'destructive',
        });
      }
      // Aquí podrías añadir más 'else if' si la API tiene otras respuestas "no exitosas" con status 200
      // Por ejemplo, si la API devuelve { success: false, message: "..." }
      // else if (response.data && response.data.success === false) { ... }
      else {
        // Si no es el caso de "usuario no encontrado" y no hubo otros errores HTTP, es un éxito real.
        console.log('Success:', response.data);
        toast({
          title: 'Request Submitted',
          description:
            'If your email is registered, you will receive an email to reset your password.',
          variant: 'success', // Manteniendo tu variante 'success'
        });
      }
    } catch (error) {
      // Este bloque catch manejará errores de red, o errores HTTP (4xx, 5xx) que axios lanza automáticamente.
      console.error('API Error:', error);
      let errorMessage = 'An error occurred while submitting your request.';

      if (error.response && error.response.data) {
        // Si el error es de Axios y tiene un cuerpo de respuesta
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
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
        {' '}
        {/* Añadido rounded-lg, shadow-xl, max-w-md */}
        <h1 className="text-center text-slate-100 font-bold text-2xl mb-3">
          {' '}
          {/* Ajuste de tamaño y margen */}
          Forgot Password
        </h1>
        <p className="text-center text-slate-200 mb-6 text-sm">
          {' '}
          {/* Ajuste de color, tamaño y margen */}
          Please enter your email address.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4" // Aumentado el gap
        >
          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
              className={`w-full px-4 py-2.5 rounded-md border ${
                errors.email
                  ? 'border-red-400 ring-1 ring-red-400'
                  : 'border-sky-400'
              } bg-sky-700 text-slate-50 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400`}
            />
            {errors.email && (
              <p className="text-red-300 text-xs mt-1.5">
                {' '}
                {/* Ajuste de color, tamaño y margen */}
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-slate-50 font-semibold rounded-md py-2.5 px-4 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75" // Estilos mejorados para el botón
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasspage;
