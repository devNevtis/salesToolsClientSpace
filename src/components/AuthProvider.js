//src/components/AuthProvider.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Verificamos si hay un token de Google en las cookies
    const storedGoogleToken = Cookies.get('google_access_token');
    if (storedGoogleToken) {
      // El token de Google está presente, puedes hacer algo con él si es necesario
      console.log('Google token encontrado: ', storedGoogleToken);
    }
  }, []);

  const login = (userData, googleToken) => {
    setUser(userData);
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    if (googleToken) {
      Cookies.set('google_access_token', googleToken, { expires: 7 });
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('google_access_token'); // Remover el token de Google
  };

  const updateUserData = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
