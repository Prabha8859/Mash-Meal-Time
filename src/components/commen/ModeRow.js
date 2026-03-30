"use client";

export default function ModeRow({ selectedMode, showResult, suggestedFood, spinning, onModeSelect }) {
  const modeBtn = (mode, label, activeClass) => (
    <button
      onClick={() => onModeSelect(mode)}
      className={`
        px-[18px] py-[9px] rounded-full flex-shrink-0
        font-[Outfit] font-bold text-[11px] tracking-[0.06em] uppercase
        border backdrop-blur-xl
        transition-all duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
        shadow-[0_2px_8px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.22)]
        ${selectedMode === mode
          ? activeClass
          : "bg-white/[0.07] border-white/[0.18] text-white/60 hover:bg-white/[0.14] hover:text-white hover:-translate-y-0.5"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full flex items-center gap-2 mb-3">
      {modeBtn(
        "online", "🛵 Online",
        "bg-blue-400/20 border-blue-400/55 text-blue-200 shadow-[0_4px_20px_rgba(96,165,250,0.25)] -translate-y-px"
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
            <div className="h-px w-4 bg-white/15" />
            <div
              className="w-[5px] h-[5px] rounded-full transition-all duration-400"
              style={{
                background: selectedMode === "online" ? "#60a5fa" : selectedMode === "self-cooking" ? "#4ade80" : "rgba(255,255,255,0.2)",
                boxShadow: selectedMode ? `0 0 8px ${selectedMode === "online" ? "#60a5fa" : "#4ade80"}` : "none",
              }}
            />
            <div className="h-px w-4 bg-white/15" />
          </div>
        )}
      </div>

      {modeBtn(
        "self-cooking", "🍳 Self",
        "bg-green-500/20 border-green-400/50 text-green-200 shadow-[0_4px_20px_rgba(34,197,94,0.25)] -translate-y-px"
      )}
    </div>
  );
}