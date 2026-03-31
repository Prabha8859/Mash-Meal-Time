"use client";

import { useState } from "react";

// ─── Component ────────────────────────────────────────────────────────────────
export default function MultiReuse({ type, title, name, options, selected, onChange }) {
  const isCheckbox = type === "checkbox";

  return (
    <div className="w-full">
      {title && (
        <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.25em] text-white/70 flex items-center gap-2">
          <span className="inline-block w-4 h-[2px] bg-emerald-400 rounded-full" />
          {title}
          <span className="inline-block w-4 h-[2px] bg-emerald-400 rounded-full" />
        </h3>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {options.map((item) => {
          const active = isCheckbox ? selected.includes(item) : selected === item;
          return (
            <label
              key={item}
              className={`
                group relative flex items-center justify-center overflow-hidden
                rounded-2xl cursor-pointer select-none
                transition-all duration-300 ease-out
                hover:-translate-y-1 active:scale-[0.96]
                ${active
                  ? "shadow-[0_0_0_1.5px_rgba(52,211,153,0.7),0_8px_32px_rgba(52,211,153,0.25)]"
                  : "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.3)]"
                }
              `}
              style={{
                background: active
                  ? "linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.10) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
              }}
            >
              {/* Shimmer layer on hover */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s infinite linear",
                }}
              />

              {/* Active glow pulse */}
              {active && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.25) 0%, transparent 70%)",
                    animation: "pulseGlow 2.4s ease-in-out infinite",
                  }}
                />
              )}

              {/* Hidden input */}
              <input
                type={type}
                name={name}
                value={item}
                checked={active}
                onChange={onChange}
                className="hidden"
              />

              {/* Label text */}
              <span
                className={`
                  relative z-10 px-4 py-4 sm:py-5 text-center text-sm sm:text-base font-bold capitalize leading-snug tracking-wide
                  transition-colors duration-300
                  ${active ? "text-emerald-200" : "text-white/55 group-hover:text-white/90"}
                `}
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em" }}
              >
                {item.replace(/-/g, " ")}
              </span>

              {/* Active indicator dot */}
              {active && (
                <span
                  className="absolute top-2.5 right-3 w-[7px] h-[7px] rounded-full bg-emerald-400"
                  style={{
                    boxShadow: "0 0 6px 2px rgba(52,211,153,0.7)",
                    animation: "dotPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                  }}
                />
              )}
            </label>
          );
        })}
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes dotPop {
          0%   { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}


// ─── Demo wrapper (remove in production) ─────────────────────────────────────
export function Demo() {
  const [radio, setRadio] = useState("beginner");
  const [checks, setChecks] = useState(["strength", "cardio"]);

  const handleCheck = (e) => {
    const val = e.target.value;
    setChecks((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  return (
    // ── Full-page background ──
    <div
      className="min-h-screen flex items-center justify-center p-6 sm:p-10"
      style={{
        background: `
          radial-gradient(ellipse 90% 70% at 20% 30%, rgba(16,185,129,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 80% 70%, rgba(56,189,248,0.14) 0%, transparent 55%),
          linear-gradient(135deg, #030712 0%, #0a1628 50%, #040d1a 100%)
        `,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      {/* Card container */}
      <div
        className="relative w-full max-w-sm sm:max-w-md rounded-3xl p-6 sm:p-8 flex flex-col gap-8"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)",
          }}
        />

        <h2
          className="text-white text-xl font-black tracking-tight"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Customize your plan
        </h2>

        <MultiReuse
          type="radio"
          title="Experience level"
          name="level"
          options={["beginner", "intermediate", "advanced", "expert"]}
          selected={radio}
          onChange={(e) => setRadio(e.target.value)}
        />

        <MultiReuse
          type="checkbox"
          title="Focus areas"
          name="focus"
          options={["strength", "cardio", "flexibility", "mindfulness"]}
          selected={checks}
          onChange={handleCheck}
        />

        <button
          className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
          style={{
            background:
              "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          Get started →
        </button>
      </div>
    </div>
  );
}