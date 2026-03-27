"use client";

import React from "react";

export default function CheckboxGroup({ options = [], value = [], onChange }) {
  const toggle = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <label key={opt} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
            className="form-checkbox"
          />
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  );
}