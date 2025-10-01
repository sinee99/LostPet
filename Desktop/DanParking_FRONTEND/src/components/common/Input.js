import React from 'react';

export const Input = ({ label, value, onChange, placeholder, type = "text", rightIcon }) => (
  <label className="block text-sm mb-4">
    <div className="text-gray-700 mb-2">{label}</div>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
  </label>
);