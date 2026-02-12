"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface CustomInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  suffix?: string;
  className?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, suffix, className = "", ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label
            className="block text-[14px] font-normal text-[#555B65] mb-2 font-[Outfit]"
            style={{ lineHeight: "140%", letterSpacing: "-0.28px" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            className="w-full px-4 py-3 rounded-lg border border-[#E6E6E6] bg-white text-sm text-[#101827] font-[Outfit] hover:border-[#CCCED3] focus:border-[#60988E] focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9FA4B0] font-[Outfit] pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
