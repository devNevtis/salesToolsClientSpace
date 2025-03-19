// src/components/Login/Login.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FaLock } from "react-icons/fa6";
import { useAuth } from "@/components/AuthProvider";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { env } from "@/config/env";
import axios from "@/lib/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${env.endpoints.auth.login}`,
        { email, password }
      );
      
      const { token, user } = response.data;
      Cookies.set("token", token, { expires: 7 });
      login(user);
      router.push("/main/leads");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Hubo un error al iniciar sesión";
      alert(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-100 p-8 w-1/3 h-2/3 flex flex-col justify-center items-center gap-8 rounded-lg shadow-lg"
    >
      <div>
        <Image src="/DialToolProLogo.png" height={250} width={250} alt="logo" />
        <h1 className="text-sm font-semibold text-slate-600 flex gap-2 justify-center">
          <span className="text-[#224f5a]">Login</span>
          <FaLock className="text-[#29abe2]" />
        </h1>
      </div>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border border-slate-300 shadow-xl"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border border-slate-300 shadow-xl"
      />
      <Button type="submit" variant="dialtools">
        Session Start
      </Button>
      <Link
        href="/forgot-password"
        className="w-1/3 text-center mt-8 text-xs ml-80 md:ml-48 font-semibold text-[#224f5a] hover:text-[#29abe2cc] bg-[#29abe260] hover:bg-[#224f5a] px-1 py-0.5 rounded-lg shadow-lg shadow-slate-400 hover:shadow-[#29abe2]"
      >
        Forgot Password?
      </Link>
    </form>
  );
}