"use client";

export default function StatusBar({ foods, error, spinning, loading, selectedMode, checkedIngredients, remainingCount }) {
  const cfg = (() => {
    if (loading) return { // Loading state: fetching from API
      bg: "bg-orange-100/70 dark:bg-orange-500/[0.15]", border: "border-orange-300/70 dark:border-orange-400/35",
      dot: "animate-spin border-t-orange-500 border-2 border-orange-300/20",
      text: "text-orange-700 dark:text-orange-300",
      label: "Finding options…",
    };
    if (foods.length > 0) return { // Success state: foods available
      bg: "bg-green-100/70 dark:bg-green-500/[0.15]", border: "border-green-300/70 dark:border-green-400/35",
      dot: "bg-green-500 dark:bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]",
      text: "text-green-700 dark:text-green-300",
      label: `${remainingCount} options ready`,
    };
    if (error) return { // Error state
      bg: "bg-red-100/70 dark:bg-red-500/[0.15]", border: "border-red-300/70 dark:border-red-300/30",
      dot: "bg-red-500 dark:bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.9)]",
      text: "text-red-700 dark:text-red-300",
      label: error,
    };
    if (spinning) return { // Spinning state
      bg: "bg-amber-100/70 dark:bg-amber-400/10", border: "border-amber-300/70 dark:border-amber-300/25",
      dot: "bg-amber-500 dark:bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]",
      text: "text-amber-700 dark:text-amber-200",
      label: "Finding your food…",
    };
    if (selectedMode === "self-cooking" && !Object.values(checkedIngredients).some(Boolean)) return { // Ingredients needed state
      bg: "bg-gray-100/50 dark:bg-white/[0.05]", border: "border-gray-300/50 dark:border-white/10",
      dot: "bg-gray-400 dark:bg-white/20",
      text: "text-gray-600 dark:text-white/40",
      label: "Pick ingredients first",
    };
    if (selectedMode) return { // Ready to spin state
      bg: "bg-gray-100/70 dark:bg-white/[0.07]", border: "border-gray-300/70 dark:border-white/15",
      dot: selectedMode === "online" ? "bg-blue-500 dark:bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" : "bg-green-500 dark:bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]",
      text: "text-gray-700 dark:text-white/65",
      label: "Ready to spin!",
    };
    return { // Default state: select a mode
      bg: "bg-gray-100/40 dark:bg-white/[0.04]", border: "border-gray-300/40 dark:border-white/[0.08]",
      dot: "bg-gray-400 dark:bg-white/20",
      text: "text-gray-600 dark:text-white/35",
      label: "Select a mode to begin",
    };
  })();

  return (
    <div className={`inline-flex flex-row items-center gap-2 px-4 py-[7.5px] rounded-full border backdrop-blur-xl font-[Outfit] text-[10px] font-semibold tracking-[0.07em] whitespace-nowrap transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.18)] ${cfg.bg} ${cfg.border}`}>
      <span className={`rounded-full flex-shrink-0 transition-all duration-300 ${cfg.dot} ${loading ? 'w-3 h-3' : 'w-[5.5px] h-[5.5px]'}`} />
      <span className={`transition-colors duration-300 ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
}