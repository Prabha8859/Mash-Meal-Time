"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/commen/Button";

export default function LogoutButton() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(null);

  const handleLogout = () => {
    // Clear the user cookie by setting its expiry date to the past
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "temp_filters=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    // Redirect to the login page and refresh to clear server-side cache
    window.location.href = "/login";
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
    <div className="flex items-center gap-4">
      {/* <span className="text-sm font-mono text-red-700 bg-red-100 px-2 py-1 rounded-md">
        {timeLeft !== null && timeLeft > 0 
          ? `Auto-logout in: ${formatTime(timeLeft)}` 
          : "Session checking..."}
      </span> */}
      <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white shadow-md transition-all rounded-lg font-semibold px-5 py-2.5">
        Logout
      </Button>
    </div>
    
  );
}