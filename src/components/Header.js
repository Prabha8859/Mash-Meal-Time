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
      <div className="flex items-center justify-between py-3 px-4 sm:py-4 sm:px-8 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg">
        <Link href="/" className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl sm:text-4xl -rotate-12 transition-transform hover:scale-110">🍽️</span>
          <span className="font-syne">MealMind</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/add-food">
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md transition-all rounded-lg font-semibold px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-base whitespace-nowrap">
              Add <span className="hidden sm:inline">New</span> Food
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
