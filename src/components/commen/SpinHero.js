"use client";

export default function SpinHero({ timeLeft, onClearFilters, onOpenFilters }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        .filter-spin:hover { transform: scale(1.1) rotate(18deg); }
      `}</style>

      <div className="flex items-start justify-between gap-3 ">
        {/* Left: title */}
        <div className="flex flex-col">
          {/* eyebrow */}
          <span className="text-[9px] font-[Outfit] font-bold tracking-[0.22em] uppercase text-white/40">
            🍽 Food Engine
          </span>

          <h2
            className="font-[Playfair_Display] leading-[1.05] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(26px,6.5vw,36px)", fontWeight: 900, textShadow: "0 2px 20px rgba(0,0,0,0.45)" }}
          >
            Let fate{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg,#fcd34d,#f97316 60%,#ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              decide
            </span>
          </h2>

          <p className="text-[10px] font-[Outfit] text-white/60 font-normal mt-0.5 leading-snug max-w-[200px]">
            Spin the wheel — no more indecision!
          </p>
        </div>

        {/* Right: filter + timer */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button
            onClick={onOpenFilters}
            className="cursor-pointer filter-spin w-11 h-11 rounded-full bg-white/[0.18] backdrop-blur-xl border border-white/35 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-250"
            title="Filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>

          {timeLeft != null && timeLeft > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/[0.18] border border-amber-300/45 backdrop-blur-xl shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
              <span className="text-[11px] font-[Outfit] font-bold text-amber-300">⏳ {timeLeft}s</span>
              <button
                onClick={onClearFilters}
                className="text-amber-400 hover:text-amber-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}