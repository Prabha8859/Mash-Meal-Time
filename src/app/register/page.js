"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from "next-auth/react";

function Register() {
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
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input onChange={(e) => setName(e.target.value)} type="text" placeholder="Full Name" />
          <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
          <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Register
          </button>

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
            Register with Google
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right" href={'/login'}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;