"use client";
import StatusBar from "./StatusBar";

export default function ActionRow({
  showResult, suggestedFood, spinning, loading,
  onReject, onConfirm,
  foods, error, selectedMode, checkedIngredients, remainingCount
}) {
  if (showResult && suggestedFood && !spinning) {
    return (
      <div className="w-full flex items-center justify-between gap-2 mt-3 min-h-[44px]">
        {/* Reject */}
        <button
          onClick={onReject}
          className="
            px-5 py-2.5 rounded-full flex-shrink-0
            font-[Outfit] font-bold text-[11px] tracking-[0.06em] uppercase
            bg-red-500/10 dark:bg-red-500/[0.18] border border-red-300/60 dark:border-red-300/40 text-red-600 dark:text-red-300 backdrop-blur-xl
            shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]
            transition-all duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:bg-red-500/25 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(239,68,68,0.25)]
            active:scale-95
          "
        >
          ✕ Change
        </button>

        {/* Orb divider */}
        <div className="flex-1 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-300/30 dark:bg-white/[0.08]" />
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#f97316,#fbbf24)",
              boxShadow: "0 0 12px rgba(249,115,22,0.8)",
              animation: "orbPulse 2s ease infinite",
            }}
          />
          <div className="h-px flex-1 bg-gray-300/30 dark:bg-white/[0.08]" />
        </div>

        {/* Confirm */}
        <button
          onClick={onConfirm}
          className="
            px-5 py-2.5 rounded-full flex-shrink-0
            font-[Outfit] font-bold text-[11px] tracking-[0.06em] uppercase
            bg-green-500/10 dark:bg-gradient-to-br dark:from-green-500/30 dark:to-green-700/25 border border-green-500/40 dark:border-green-400/50 text-green-700 dark:text-green-200 backdrop-blur-xl
            shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.22)]
            transition-all duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:from-green-500/40 hover:to-green-700/35 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(34,197,94,0.35)]
            active:scale-95
          "
        >
          ✓ Yes, This!
        </button>

        <style>{`
          @keyframes orbPulse {
            0%,100%{box-shadow:0 0 8px rgba(249,115,22,0.6);transform:scale(1)}
            50%{box-shadow:0 0 18px rgba(249,115,22,0.95);transform:scale(1.18)}
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mt-3 min-h-[44px] items-center">
      <StatusBar
        foods={foods}
        error={error}
        spinning={spinning}
        loading={loading}
        selectedMode={selectedMode}
        checkedIngredients={checkedIngredients}
        remainingCount={remainingCount}
      />
    </div>
  );
}