"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Button from "@/components/commen/Button";
import Link from "next/link";

export default function LogoutButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const [timeLeft, setTimeLeft] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Clear the user cookie by setting its expiry date to the past
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "temp_filters=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    // Redirect to the login page and refresh to clear server-side cache
    window.location.href = "/login";
    localStorage.clear();
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    let loginTime = localStorage.getItem("loginTime");

    // If no loginTime found in storage, set it to now to ensure timer starts
    if (!loginTime) {
      console.log("Login time missing, initializing new session timer.");
      loginTime = Date.now().toString();
      localStorage.setItem("loginTime", loginTime);
    }

    if (loginTime) {
      const duration = 4 * 60 * 60 * 1000; // 4 hours
      const startTime = parseInt(loginTime, 10);
      const endTime = startTime + duration;

      let intervalId; // Declare variable to hold interval ID

      const updateTimer = () => {
        const now = Date.now();
        const remaining = endTime - now;

        // console.log("Time remaining:", remaining); // Uncomment for detailed debugging
        if (remaining <= 0) {
          clearInterval(intervalId); // Stop the timer immediately
          setTimeLeft(0);
          handleLogout();
        } else {
          setTimeLeft(remaining);
        }
      };

      // Run immediately to set initial state
      updateTimer();

      // Check every second using exact time difference
      intervalId = setInterval(updateTimer, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  const formatTime = (ms) => {
    if (ms === null || ms < 0) return null;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* User Avatar Circle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-0.5 rounded-full border-2 border-white/10 hover:border-white/40 transition-all active:scale-90"
      >
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt="User" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-neutral-700 to-neutral-900">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        
        {/* Status indicator */}
        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
      </button>

      {/* Compact Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-3 w-64 bg-black/40 backdrop-blur-3xl border border-white/15 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            <div className="px-6 py-5 border-b border-white/10 bg-white/5">
              <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">Session Active</p>
              <p className="text-xs text-white/90 font-bold truncate">{session?.user?.email}</p>
            </div>
            
            <div className="p-2 flex flex-col gap-1">
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                <span className="text-lg group-hover:scale-110 transition-transform">👤</span> Profile Details
              </Link>
              <Link href="/add-food" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                <span className="text-lg group-hover:scale-110 transition-transform">🍳</span> Add New Food
              </Link>
              <Link href="/preferences" className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                <span className="text-lg group-hover:rotate-45 transition-transform">⚙️</span> Settings
              </Link>
            </div>

            <div className="p-2 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all font-black text-left"
              >
                <span className="text-lg">🚪</span> Logout Account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
