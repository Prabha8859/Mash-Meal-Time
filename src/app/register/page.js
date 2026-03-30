"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from "next-auth/react";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are necessary.');
      return;
    }

    try {
      // Check if user already exists
      const resUserExists = await fetch('/api/userExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError('User with this email already exists.');
        return;
      }

      // Create new user
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (!signInRes?.error) {
          router.push("/");
        } else {
          setError("Registration successful, but login failed.");
        }
} else {
  setError("User registration failed.");
}
    } catch (error) {
      console.error('Error during registration: ', error);
      setError('Something went wrong.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-black selection:bg-orange-500/30">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-40 scale-105"
          alt="Register background"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-950/40 via-black/10 to-black/10" />
      </div>

      <div className="glass-card relative z-10 w-full max-w-md p-8 sm:p-6 rounded-[3rem] flex flex-col shadow-2xl border border-white/10 backdrop-blur-xl">
        <div className="mb-2">
          <h1 className="font-syne text-4xl font-black text-white mb-2 leading-none tracking-tight">Join Us</h1>
          <p className=" text-white/40 text-sm tracking-wide">Start your journey to better eating</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="space-y-1.5">
            <label className=" text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] ml-4">Full Name</label>
            <input 
              onChange={(e) => setName(e.target.value)} 
              type="text" 
              placeholder="Your Name" 
              className="w-full bg-white/[0.05] border border-white/10 px-4 py-3 rounded-2xl text-white  focus:outline-none focus:border-orange-400/50 focus:bg-white/[0.08] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className=" text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] ml-4">Email Address</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              placeholder="email@example.com" 
              className="w-full bg-white/[0.05] border border-white/10 px-4 py-3 rounded-2xl text-white  focus:outline-none focus:border-orange-400/50 focus:bg-white/[0.08] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className=" text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] ml-4">Create Password</label>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-white/[0.05] border border-white/10 px-4 py-3 rounded-2xl text-white  focus:outline-none focus:border-orange-400/50 focus:bg-white/[0.08] transition-all"
            />
          </div>

          <button className="w-full mt-1 bg-orange-500 hover:bg-orange-400 text-white font-syne font-extrabold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-[0_8px_30px_rgb(249,115,22,0.3)] cursor-pointer">
            Create Account
          </button>

          <div className="flex items-center my-2">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="px-4 text-white/20 text-[10px] font-bold uppercase tracking-widest">or</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10  font-bold px-6 py-4 rounded-2xl transition-all cursor-pointer"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Google
          </button>

          {error && <div className="bg-red-500/20 text-red-200 text-xs font-bold py-3.5 px-4 rounded-xl text-center border border-red-500/20">{error}</div>}

          <div className=" text-center">
            <Link className=" text-sm text-white/30 group" href={'/login'}>
              Already a chef? <span className="text-orange-400 font-bold group-hover:underline">Login here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}