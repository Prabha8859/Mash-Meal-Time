"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

function Login() {
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
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Enter your details</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
          <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Login</button>

          <div className="flex items-center my-2">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold cursor-pointer px-6 py-2 hover:bg-gray-50"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
            Login with Google
          </button>

          {error && <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>}
          <Link className="text-sm mt-3 text-right" href={'/register'}>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;