import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const pathname = usePathname(); // Obtener la ruta actual
    const [isLoading, setIsLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
      const token = Cookies.get('token');

      if (!token) {
        // 🔹 Si el usuario NO tiene sesión y NO está en /login, redirigirlo y mostrar "Unauthorized"
        if (pathname !== '/login') {
          setIsRedirecting(true);
          router.replace('/login');
        }
      } else {
        setIsLoading(false); // 🔹 Si tiene sesión, cargamos la app
      }
    }, []);

    // 🔹 Si estamos verificando sesión después del login, mostrar "Loading..."
    if (isLoading && !isRedirecting) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#224f5a] border-solid mb-4"></div>
          <h2 className="text-xl font-semibold">Validating...</h2>
        </div>
      );
    }

    // 🔹 Si el usuario no tiene sesión y está intentando entrar, mostrar "Unauthorized Access"
    if (isRedirecting) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 border-solid mb-4"></div>
          <h2 className="text-xl font-semibold text-red-600">
            Unauthorized Access
          </h2>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
