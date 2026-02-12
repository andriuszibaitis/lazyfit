"use client";

import { ReactNode } from "react";

interface ToggleOption {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface ToggleButtonGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ToggleButtonGroup({
  options,
  value,
  onChange,
  className = "",
}: ToggleButtonGroupProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            value === option.id
              ? "bg-[#FFF7DF] text-[#101827] border-2 border-[#FFD16E]"
              : "bg-[#E6E6E6] text-[#101827] hover:bg-[#D9D9D9]"
          }`}
        >
          {option.icon && <span className="mr-2">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}
