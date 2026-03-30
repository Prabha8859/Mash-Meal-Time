"use client";

export default function StatusBar({ foods, error, spinning, selectedMode, checkedIngredients, remainingCount }) {
  const cfg = (() => {
    if (foods.length > 0) return {
      bg: "bg-green-500/[0.15]", border: "border-green-400/35",
      dot: "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]",
      text: "text-green-300",
      label: `${remainingCount} options ready`,
    };
    if (error) return {
      bg: "bg-red-500/[0.15]", border: "border-red-300/30",
      dot: "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.9)]",
      text: "text-red-300",
      label: error,
    };
    if (spinning) return {
      bg: "bg-amber-400/10", border: "border-amber-300/25",
      dot: "bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]",
      text: "text-amber-200",
      label: "Finding your food…",
    };
    if (selectedMode === "self-cooking" && !Object.values(checkedIngredients).some(Boolean)) return {
      bg: "bg-white/[0.05]", border: "border-white/10",
      dot: "bg-white/20",
      text: "text-white/40",
      label: "Pick ingredients first",
    };
    if (selectedMode) return {
      bg: "bg-white/[0.07]", border: "border-white/15",
      dot: selectedMode === "online" ? "bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" : "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]",
      text: "text-white/65",
      label: "Ready to spin!",
    };
    return {
      bg: "bg-white/[0.04]", border: "border-white/[0.08]",
      dot: "bg-white/20",
      text: "text-white/35",
      label: "Select a mode to begin",
    };
  })();

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-[7px] rounded-full border backdrop-blur-xl font-[Outfit] text-[10px] font-semibold tracking-[0.07em] whitespace-nowrap transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.18)] ${cfg.bg} ${cfg.border}`}>
      <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 transition-all duration-300 ${cfg.dot}`} />
      <span className={`transition-colors duration-300 ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
}