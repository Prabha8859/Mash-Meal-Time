"use client";

export default function ModeRow({ selectedMode, showResult, suggestedFood, spinning, onModeSelect }) {
  const modeBtn = (mode, label, activeClass) => (
    <button
      onClick={() => onModeSelect(mode)}
      className={` cursor-pointer
        relative z-10 px-4 py-1.5 rounded-2xl flex-shrink-0
        font-[Outfit] font-bold text-[11px] tracking-[0.06em] uppercase
        transition-all duration-300 active:scale-[0.95]
        ${!selectedMode ? (mode === "online" ? "mode-highlight-red" : "mode-highlight-green") : ""}
        ${selectedMode === mode
          ? activeClass
          : "text-white/40 hover:text-white/90 bg-white/[0.03] border border-white/40 shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full flex items-center p-1.5 mb-2 bg-black/20 backdrop-blur-3xl border border-white/40 rounded-[1.5rem] shadow-inner relative overflow-hidden">
      <style>{`
        @keyframes modeRingRipple {
          0% { outline: 2px solid var(--ring-color); outline-offset: 0px; }
          100% { outline: 6px solid transparent; outline-offset: 15px; }
        }
        .mode-highlight-red {
          --ring-color: rgba(239, 68, 68, 0.6);
          border-radius: 1rem;
          animation: modeRingRipple 4s infinite cubic-bezier(0.25, 0, 0.2, 1);
        }
        .mode-highlight-green {
          --ring-color: rgba(34, 197, 94, 0.6);
          border-radius: 1rem;
          animation: modeRingRipple 4s infinite cubic-bezier(0.25, 0, 0.2, 1);
        }
      `}</style>

      {/* Platform Selection */}
      {modeBtn(
        "online", "🛵 Online",
        "bg-red-500/10 text-red-400 shadow-[inset_0_8px_20px_rgba(0,0,0,0.85),0_0_0_1.5px_rgba(239,68,68,0.3)] border-transparent"
      )}

      {/* Center label */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
        {showResult && suggestedFood && !spinning ? (
          <>
            <p
              className="font-[Playfair_Display] font-bold text-white leading-snug break-words"
              style={{ fontSize: 14, textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
            >
              {suggestedFood.name}
            </p>
            <p className="text-[8px] font-[Outfit] font-semibold tracking-[0.2em] uppercase text-white/45 mt-0.5">
              Your Pick
            </p>
          </>
        ) : spinning ? (
          <span
            className="text-[8px] font-[Outfit] font-extrabold tracking-[0.22em] uppercase text-amber-300"
            style={{ animation: "pulse 1s ease infinite" }}
          >
            spinning…
          </span>
        ) : (
          <div className="flex items-center gap-[5px]">
            <div className="h-px w-3 bg-white/10" />
            <div
              className="w-1 h-1 rounded-full transition-all duration-700 cursor-pointer"
              style={{
                background: selectedMode === "online" ? "#ef4444" : selectedMode === "self-cooking" ? "#22c55e" : "rgba(255,255,255,0.1)",
                boxShadow: selectedMode ? `0 0 12px ${selectedMode === "online" ? "#ef4444" : "#22c55e"}` : "none",
              }}
            />
            <div className="h-px w-4 bg-white/15" />
          </div>
        )}
      </div>

      {modeBtn(
        "self-cooking", "🍳 Self",
        " bg-green-500/10 text-green-400 shadow-[inset_0_8px_20px_rgba(0,0,0,0.85),0_0_0_1.5px_rgba(34,197,94,0.3)] border-transparent"
      )}
    </div>
  );
}