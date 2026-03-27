"use client";
import React from "react";
import Link from "next/link";
import Button from "./commen/Button";
import LogoutButton from "./LogoutButton";

export default function Header() {
  return (
    <header className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
      `}</style>
      <div className="flex items-center justify-between py-4 px-8  bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg ">
        <Link href="/" className="text-3xl font-bold text-gray-900 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-4xl -rotate-12 transition-transform hover:scale-110">🍽️</span>
          <span className="font-syne">MealMind</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/add-food">
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md transition-all rounded-lg font-semibold px-5 py-2.5">
              Add New Food
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
