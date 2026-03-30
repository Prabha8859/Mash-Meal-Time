"use client";

export default function MultiReuse({ type, title, name, options, selected, onChange }) {
  const isCheckbox = type === "checkbox";

  return (
    <div className="w-full">
      {title && <h3 className="text-white/80 font-bold mb-4 uppercase tracking-widest text-xs">{title}</h3>}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {options.map((item) => (
          <label 
            key={item} 
            className={`
              relative flex items-center justify-center p-4 sm:p-5 rounded-[1.5rem] 
              cursor-pointer transition-all duration-300 border font-dm font-bold capitalize text-sm
              hover:translate-y-[-2px] active:scale-[0.95]
              ${(isCheckbox ? selected.includes(item) : selected === item)
                ? "bg-green-500/20 border-green-400/60 text-white shadow-[0_0_20px_rgba(74,222,128,0.15)]"
                : "bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/[0.08] hover:text-white/70"
              }
            `}
          >
            <input
              type={type}
              name={name}
              value={item}
              checked={isCheckbox ? selected.includes(item) : selected === item}
              onChange={onChange}
              className="hidden"
            />
            <span className="text-center">{item.replace(/-/g, " ")}</span>
            {(isCheckbox ? selected.includes(item) : selected === item) && (
              <span className="absolute top-2 right-3 text-[10px] text-green-400">●</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}