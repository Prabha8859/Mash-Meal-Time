"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("All fields are necessary.");
    return;
  }

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError("Invalid Credentials");
      return;
    }

    router.push("/");

  } catch (error) {
    console.error("Login error:", error);
    setError("Something went wrong during login.");
  }
};

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-black selection:bg-green-500/30">
      {/* Background with subtle zoom animation */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-50 scale-110"
          alt="Culinary background"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-950/40 via-black/10 to-black/10" />
      </div>

      <div className="glass-card relative z-10 w-full max-w-md p-4 sm:p-6 rounded-[3rem] flex flex-col shadow-2xl border border-white/10 backdrop-blur-xl">
        <div className="mb-2 text-center">
          <h1 className="font-syne text-4xl font-black text-white mb-2 leading-none tracking-tight">Welcome</h1>
          <p className="font-dm text-white/40 text-sm tracking-wide text-left">Enter your kitchen credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <div className="space-y-1.5">
            <label className="font-dm text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] ml-4">Email Address</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              placeholder="chef@mealmind.com" 
              className="w-full bg-white/[0.05] border border-white/10 px-6 py-4 rounded-2xl text-white font-dm focus:outline-none focus:border-green-400/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-dm text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] ml-4">Password</label>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-white/[0.05] border border-white/10 px-6 py-4 rounded-2xl text-white font-dm focus:outline-none focus:border-green-400/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
            />
          </div>

          <button className="w-full mt-1 bg-green-500 hover:bg-green-400 text-black font-syne font-extrabold py-4.5 rounded-2xl transition-all active:scale-[0.98] shadow-[0_8px_30px_rgb(34,197,94,0.3)] cursor-pointer">
            Login to Kitchen
          </button>

          <div className="flex items-center ">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="px-4 text-white/20 text-[10px] font-bold uppercase tracking-widest">or</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-dm font-bold px-6 py-4 rounded-2xl transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-3.5 px-4 rounded-xl text-center animate-pulse">
              {error}
            </div>
          )}

          <div className="mt-2 text-center">
            <Link className="font-dm text-sm text-white/40 group" href={'/register'}>
              New here? <span className="text-green-400 font-bold group-hover:underline transition-all">Create an account</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}