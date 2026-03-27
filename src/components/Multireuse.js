"use client";

export default function MultiReuse({ type, title, name, options, selected, onChange }) {
  const isCheckbox = type === "checkbox";

  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className={isCheckbox ? "grid grid-cols-2 gap-2" : "flex gap-4"}>
        {options.map((item) => (
          <label key={item} className="flex items-center gap-2">
            <input
              type={type}
              name={name}
              value={item}
              checked={isCheckbox ? selected.includes(item) : selected === item}              onChange={onChange}
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}