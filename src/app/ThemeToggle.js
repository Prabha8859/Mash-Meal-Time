"use client";
import { useTheme } from "@/app/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center">
      <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="theme-toggle"
            className="sr-only"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
          <div
            className={`dot absolute left-1 top-1 bg-[var(--bg-color)] w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
              theme === "dark" ? "translate-x-full bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
}