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

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-3 w-[75vw] max-w-[240px] bg-white/75 backdrop-blur-3xl border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 origin-top-right">
            <div className="px-5 py-4 border-b border-black/5 bg-white/30">
              <p className="text-[8px] sm:text-[9px] text-slate-500 font-black uppercase tracking-[0.1em] mb-0.5">Account</p>
              <p className="text-xs sm:text-sm text-slate-900 font-black truncate">{session?.user?.email}</p>
            </div>
            
            <div className="p-2">
              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all">
                <span className="text-base sm:text-lg">👤</span> Profile
              </Link>
              <Link href="/preferences" className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all">
                <span className="text-base sm:text-lg">⚙️</span> Settings
              </Link>
            </div>

            <div className="p-2 border-t border-black/5">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-xl transition-all font-black text-left"
              >
                <span className="text-lg">🚪</span> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}