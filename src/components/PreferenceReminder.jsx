"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "preferenceReminderHidden";

export default function PreferenceReminder({ visible }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!visible) {
      setHidden(false);
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setHidden(true);
    }
  }, [visible]);

  useEffect(() => {
    if (hidden) {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [hidden]);

  if (!visible) return null;

  if (hidden) {
    return (
      <div className="fixed right-4 top-20 z-30 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setHidden(false)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-300 bg-red-600 text-white shadow-xl shadow-red-500/40 animate-pulse transition hover:scale-105 focus:outline-none"
          aria-label="Show preference reminder"
        >
          <span className="text-xl">⚠️</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-20 z-30 flex items-end justify-end">
      <div className="relative flex flex-col items-end">
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-500 bg-transparent text-red-500 shadow-xl shadow-red-500/30 transition hover:scale-105 focus:outline-none dark:border-red-400 dark:text-red-400"
          aria-label="Dismiss preference reminder"
        >
          ✂️
        </button>

        <div className="max-w-[320px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-3xl text-white">
          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex-1 rounded-3xl bg-white/10 p-3 shadow-sm">
              <p className="text-sm font-bold">Preferences needed</p>
              <p className="mt-1 text-xs text-slate-200/90">Fill diet, allergies and goals for better meal suggestions.</p>
            </div>
            <Link
              href="/preferences"
              className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black shadow-lg shadow-orange-500/25 hover:bg-orange-400 transition"
            >
              Fill Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
