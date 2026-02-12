"use client";

import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg border border-[#E6E6E6] bg-white text-sm text-[#101827] font-[Outfit] ${className || ""}`}
    >
      {children}
    </span>
  );
}
