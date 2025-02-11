// src/app/[token]/[email]/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import axios from "@/lib/axios";
import { env } from "@/config/env";

export default function TokenLogin({ params }) {
  const router = useRouter();
  const { login } = useAuth();
  
  useEffect(() => {
    const token = decodeURIComponent(window.location.pathname.split("/")[1]);
    const email = decodeURIComponent(window.location.pathname.split("/")[2]);
    
    if (!token || !email) {
      router.push("/login");
      return;
    }

    const authenticateUser = async () => {
      try {
        const response = await axios.post(env.endpoints.auth.login, {
          email,
          password: token, // Enviamos el token en lugar de la contraseña normal
        });

        const { user, token: newToken } = response.data;
        login(user); // Guardamos el usuario en el contexto
        router.push("/main/leads"); // Redirigimos a la pantalla principal
      } catch (error) {
        console.error("Error en la autenticación con token:", error);
        router.push("/login"); // Si el token es inválido, redirigir al login
      }
    };

    authenticateUser();
  }, [router, login]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
      </div>
      <p className="text-3xl text-teal-800 font-semibold">Verificando credenciales...</p>
    </div>
  );
}
