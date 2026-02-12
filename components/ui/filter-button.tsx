"use client";

import { FilterIcon } from "@/components/icons";

interface FilterButtonProps {
  onClick?: () => void;
  badgeCount?: number;
  className?: string;
}

export function FilterButton({ onClick, badgeCount, className }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-white border border-[#CCCED3] rounded-full pl-3 pr-4 py-3 text-[#101827] font-medium text-base leading-[120%] font-[Outfit] hover:bg-gray-50 transition-colors ${className || ""}`}
    >
      <FilterIcon size={24} />
      <span>Filtras</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="bg-[#E74043] text-white text-xs font-medium rounded-full w-[18px] h-[18px] flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </button>
  );
}
