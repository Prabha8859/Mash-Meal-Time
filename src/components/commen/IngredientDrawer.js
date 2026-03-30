"use client";

export default function IngredientDrawer({ visible, onClose, ingredients, checkedIngredients, onToggle }) {
  if (!visible) return null;

  const selectedCount = Object.values(checkedIngredients).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/55 backdrop-blur-sm flex justify-end"
      style={{ animation: "fadeIn 0.2s ease" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideRight { from { transform: translateX(100%); opacity: 0.6 } to { transform: translateX(0); opacity: 1 } }
        .drawer-scroll::-webkit-scrollbar { width: 3px; }
        .drawer-scroll::-webkit-scrollbar-track { background: transparent; }
        .drawer-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      <div
        className="
          w-[310px] max-w-[90vw] h-full flex flex-col gap-5
          bg-black/65 backdrop-blur-[40px]
          border-l border-white/20
          shadow-[-16px_0_60px_rgba(0,0,0,0.55),inset_1px_0_0_rgba(255,255,255,0.12)]
          px-5 pt-7 pb-6
        "
        style={{ animation: "slideRight 0.32s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-extrabold text-green-400 tracking-[0.2em] uppercase font-[Outfit]">
              What's in your kitchen?
            </p>
            <h3 className="font-[Playfair_Display] text-2xl font-black text-white mt-1 leading-tight">
              Ingredients
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
        <div className="flex-1 overflow-y-auto drawer-scroll flex flex-wrap gap-2 content-start pr-1">
          {ingredients.map((item) => {
            const on = !!checkedIngredients[item.id];
            return (
              <label
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`
                  px-3.5 py-[7px] rounded-full text-[12px] font-semibold font-[Outfit]
                  cursor-pointer select-none flex items-center gap-1.5
                  border transition-all duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  hover:scale-[1.04]
                  ${on
                    ? "bg-green-500/20 border-green-400/55 text-green-100 shadow-[0_0_14px_rgba(34,197,94,0.2)]"
                    : "bg-white/[0.06] border-white/[0.14] text-white/55 hover:bg-white/10 hover:text-white/80"
                  }
                `}
              >
                <input type="checkbox" className="hidden" readOnly checked={on} />
                {on && <span className="text-[10px]">✓</span>}
                {item.label}
              </label>
            );
          })}
        </div>

        {/* Apply button */}
        <button
          onClick={onClose}
          className="
            w-full py-3.5 rounded-full flex-shrink-0
            font-[Outfit] text-[12px] font-extrabold tracking-[0.09em] uppercase
            bg-gradient-to-br from-green-500/35 to-green-700/28
            border border-green-400/50 text-green-200
            shadow-[0_4px_20px_rgba(34,197,94,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]
            backdrop-blur-xl
            transition-all duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
            hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(34,197,94,0.35)]
            active:scale-[0.97]
          "
        >
          Apply {selectedCount > 0 ? `(${selectedCount} selected)` : "Selection"}
        </button>
      </div>
    </div>
  );
}