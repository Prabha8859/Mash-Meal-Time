"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <style>{`
        @keyframes spin-refresh-active {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .is-refreshing-now {
          animation: spin-refresh-active 0.8s linear infinite;
        }
      `}</style>
      <button
        onClick={handleRefresh}
        disabled={isPending}
        className={`
          w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 group border
          /* Light (White) Mode Styles */
          bg-black/5 border-black/10 text-gray-500 hover:bg-black/10 hover:border-black/20 hover:text-black
          /* Dark Mode Styles */
          dark:bg-white/5 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white
          /* Process Management */
          ${isPending ? 'cursor-wait opacity-50' : 'cursor-pointer opacity-100'}
        `}
        title="Refresh Recommendations"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" height="18" 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`${isPending ? "is-refreshing-now" : "group-hover:rotate-45 transition-transform duration-300"}`}
        >
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
      </button>
    </>
  );
}