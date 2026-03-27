"use client";

export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        className="w-full border rounded px-2 py-1"
        {...props}
      />
    </div>
  );
}