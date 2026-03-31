"use client";

export default function IngredientDrawer({ visible, onClose, ingredients, activeMealTiming, checkedIngredients, onToggle, onApply }) {
  if (!visible) return null;

  const selectedCount = Object.values(checkedIngredients).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/40 flex justify-end items-center "
      style={{ animation: "fadeIn 0.2s ease" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInCard { from { transform: translateX(30px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .drawer-scroll::-webkit-scrollbar { width: 3px; }
        .drawer-scroll::-webkit-scrollbar-track { background: transparent; }
        .drawer-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      <div
        className="
          w-full max-w-xs sm:max-w-sm md:max-w-md h-[70vh] flex flex-col gap-5
          bg-black/30 border border-white/40
          mr-6 rounded-[2.5rem]
          px-6 py-8 shadow-2xl
        "
        style={{ animation: "slideInCard 0.4s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-extrabold text-green-400 tracking-[0.2em] uppercase font-[Outfit]">
              What's in your kitchen?
            </p>
            <h3 className="font-[Playfair_Display] text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
              {activeMealTiming ? activeMealTiming.charAt(0).toUpperCase() + activeMealTiming.slice(1) : 'Meal'} Ingredients
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.15] text-white/55 flex items-center justify-center text-sm transition-all duration-200 hover:bg-white/15 hover:text-white hover:rotate-90 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent flex-shrink-0" />

        {/* Chips grid */}
        <div className="flex-1 overflow-y-auto drawer-scroll grid grid-cols-2 gap-3 content-start pr-1">
          {ingredients.map((item) => {
            const on = !!checkedIngredients[item.id];
            return (
              <label
                key={item.id}
                className={` 
                  p-2 rounded-xl text-[12px] sm:text-[13px] font-bold font-[Outfit]
                  cursor-pointer select-none flex flex-col items-center justify-center text-center gap-2
                  border transition-all duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  hover:scale-[1.04]
                  ${on
                    ? "bg-white/40 border-white/60 text-white"
                    : "bg-white/10 border-white/20 text-white/60 hover:bg-white/20 hover:text-white/90"
                  }
                `}
              >
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={on} 
                  onChange={() => onToggle(item.id)} 
                />
                {item.label}
              </label>
            );
          })}
        </div>

        {/* Apply button */}
        <button
          onClick={onApply || onClose}
          className="
            w-full py-3.5 rounded-full flex-shrink-0
            font-[Outfit] text-[12px] font-extrabold tracking-[0.09em] uppercase
            bg-gradient-to-br from-green-500/35 to-green-700/28
            border border-green-400/50 text-green-200
            backdrop-blur-xl
            transition-all duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:-translate-y-0.5 
            active:scale-[0.97]
          "
        >
          Apply {selectedCount > 0 ? `(${selectedCount} selected)` : "Selection"}
        </button>
      </div>
    </div>
  );
}