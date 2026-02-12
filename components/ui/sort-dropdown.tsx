"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@/components/icons";

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SortDropdown({
  options,
  value,
  onChange,
  className,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className || ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-4 bg-white border border-[#E6E6E6] rounded-lg pl-4 pr-2 h-12 min-w-[200px] text-[#101827] font-normal text-sm leading-[140%] tracking-[-0.28px] font-[Outfit] hover:bg-gray-50 transition-colors"
      >
        <span>{selectedOption?.label}</span>
        <ChevronDownIcon
          size={24}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg z-10 min-w-[200px] overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm font-[Outfit] hover:bg-gray-50 transition-colors ${
                value === option.value
                  ? "bg-gray-50 text-[#101827] font-medium"
                  : "text-[#101827]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
