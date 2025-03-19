import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = Cookies.get('token');
      if (!token) {
        router.replace('/login');
      } else {
        setIsLoading(false);
      }
    }, []);

    if (isLoading) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
          {/* Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#224f5a] border-solid mb-4"></div>

          {/* Mensaje de redirección */}
          <h2 className="text-xl font-semibold">Unauthorized Access</h2>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
