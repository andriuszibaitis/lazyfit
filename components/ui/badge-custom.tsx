"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "light" | "dark";
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, variant = "light", icon, className }: BadgeProps) {
  const variants = {
    light: "bg-white/20 border-white/40 text-white",
    dark: "bg-[#1F2937] border-[#1F2937] text-white",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm font-[Outfit] ${variants[variant]} ${className || ""}`}
    >
      {icon}
      {children}
    </span>
  );
}
