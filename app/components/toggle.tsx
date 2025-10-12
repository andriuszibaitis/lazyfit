"use client";

import { useState, useEffect } from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Toggle({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  className = ""
}: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  // Update internal state when checked prop changes
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const sizeClasses = {
    sm: {
      container: "w-10 h-6",
      circle: "w-4 h-4",
      translate: "translate-x-4"
    },
    md: {
      container: "w-12 h-7",
      circle: "w-5 h-5",
      translate: "translate-x-5"
    },
    lg: {
      container: "w-14 h-8",
      circle: "w-6 h-6",
      translate: "translate-x-6"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      className={`
        ${currentSize.container}
        relative inline-flex items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:ring-offset-2
        ${isChecked
          ? "bg-[#60988E]"
          : "bg-gray-200"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      <span
        className={`
          ${currentSize.circle}
          inline-block rounded-full bg-white shadow-sm
          transition-transform duration-200 ease-in-out
          ${isChecked ? currentSize.translate : "translate-x-1"}
        `}
      />
    </button>
  );
}