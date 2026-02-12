"use client";

import { useState, useRef, useEffect } from "react";

interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Pasirinkite...",
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Select button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-lg border border-[#E6E6E6] bg-white text-left flex items-center justify-between text-sm text-[#101827] font-[Outfit] hover:border-[#CCCED3] transition-colors"
      >
        <span className={selectedOption ? "text-[#101827]" : "text-[#9FA4B0]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="#6B7280"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm font-[Outfit] transition-colors hover:bg-[#F7F7F7] ${
                value === option.id ? "bg-[#FFF7DF]" : ""
              }`}
            >
              <span className="text-[#101827] font-medium">{option.label}</span>
              {option.description && (
                <p className="text-[#6B7280] text-xs mt-0.5">{option.description}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
