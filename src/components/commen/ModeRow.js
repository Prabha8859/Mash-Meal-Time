"use client";

export default function ModeRow({ selectedMode, showResult, suggestedFood, spinning, onModeSelect }) {
  const modeBtn = (mode, label, activeClass) => (
    <button
      onClick={() => onModeSelect(mode)}
      className={`
        relative z-10 px-4 py-1.5 rounded-2xl flex-shrink-0
        font-[Outfit] font-bold text-[11px] tracking-[0.06em] uppercase
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${selectedMode === mode
          ? activeClass
          : "text-white/40 hover:text-white/90 hover:bg-white/5"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full flex items-center p-1.5 mb-2 bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] shadow-inner relative overflow-hidden">
      {/* Platform Selection */}
      {modeBtn(
        "online", "🛵 Online",
        "bg-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-blue-500/30"
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
              className="w-1 h-1 rounded-full transition-all duration-700"
              style={{
                background: selectedMode === "online" ? "#3b82f6" : selectedMode === "self-cooking" ? "#22c55e" : "rgba(255,255,255,0.1)",
                boxShadow: selectedMode ? `0 0 12px ${selectedMode === "online" ? "#3b82f6" : "#22c55e"}` : "none",
              }}
            />
            <div className="h-px w-4 bg-white/15" />
          </div>
        )}
      </div>

      {modeBtn(
        "self-cooking", "🍳 Self",
        "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)] border border-green-500/30"
      )}
    </div>
  );
}