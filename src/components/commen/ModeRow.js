"use client";

export default function ModeRow({ selectedMode, showResult, suggestedFood, spinning, onModeSelect }) {
  const modeBtn = (mode, label, activeClass) => (
    <button
      onClick={() => onModeSelect(mode)}
      className={` cursor-pointer
        relative z-10 px-5 py-2 rounded-2xl flex-shrink-0
         font-bold text-[11px] tracking-[0.06em] uppercase
        transition-all duration-300 active:scale-[0.95]
        ${!selectedMode ? (mode === "online" ? "mode-highlight-red" : "mode-highlight-green") : ""}
        ${selectedMode === mode
          ? activeClass
          : "text-[var(--text-muted)] hover:text-[var(--text-main)] bg-white/5 border border-white/10 hover:bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full flex items-center p-1.5 mb-2 bg-[var(--glass-bg)] backdrop-blur-[40px] border border-[var(--glass-border)] rounded-[2.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_35px_rgba(0,0,0,0.2)] relative overflow-hidden">
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
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.1); }
          50% { text-shadow: 0 0 20px rgba(255,255,255,0.3), 0 0 30px var(--glow-color, rgba(255,255,255,0.1)); }
        }
        .suggested-text-glow {
          animation: textGlow 3s ease-in-out infinite;
        }
      `}</style>
      
      {/* Liquid Glass Shine Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.1] z-0" />

      {/* Platform Selection */}
      {modeBtn(
        "online", "🛵 Online",
        "bg-red-500/25 text-red-400 border border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.3)]"
      )}

      {/* Center label */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center text-center px-1">
        {showResult && suggestedFood && !spinning ? (
          <>
            <p
              className="font-[Playfair_Display] font-black text-[var(--text-main)] leading-none break-words suggested-text-glow"
              style={{ fontSize: 13, '--glow-color': selectedMode === 'online' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)' }}
            >
              {suggestedFood.name}
            </p>
            <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-[var(--text-muted)] mt-1.5 opacity-50">
              Your Pick
            </p>
          </>
        ) : spinning ? (
          <span
            className="text-[9px] font-black tracking-[0.3em] uppercase text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            style={{ animation: "pulse 1s ease infinite" }}
          >
            spinning…
          </span>
        ) : (
          <div className="flex items-center gap-[5px]">
            <div className="h-px w-3 bg-[var(--glass-border)]" />
            <div
              className="w-1 h-1 rounded-full transition-all duration-700 cursor-pointer"
              style={{
                background: selectedMode === "online" ? "#ef4444" : selectedMode === "self-cooking" ? "#22c55e" : "rgba(255,255,255,0.2)",
                boxShadow: selectedMode ? `0 0 18px ${selectedMode === "online" ? "#ef4444" : "#22c55e"}` : "none",
              }}
            />
            <div className="h-px w-4 bg-white/10" />
          </div>
        )}
      </div>

      {modeBtn(
        "self-cooking", "🍳 Self",
        "bg-green-500/25 text-green-400 border border-green-500/40 shadow-[0_0_25px_rgba(34,197,94,0.3)]"
      )}
    </div>
  );
}