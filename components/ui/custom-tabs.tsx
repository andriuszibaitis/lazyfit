"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

interface CustomTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pill";
  fullWidth?: boolean;
  className?: string;
}

export function CustomTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  fullWidth = false,
  className,
}: CustomTabsProps) {
  const getTabClasses = (isActive: boolean) => {
    if (variant === "pill") {
      return cn(
        "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg border-2",
        fullWidth && "flex-1 text-center",
        isActive
          ? "bg-[#FFF7DF] text-black border-[#FFD16E]"
          : "text-black hover:text-gray-800 hover:bg-gray-100 border-transparent"
      );
    }

    return cn(
      "px-6 py-3 text-base font-medium transition-all duration-200 border-b-2",
      fullWidth && "flex-1 text-center",
      isActive
        ? "text-black border-black"
        : "text-[#9FA4B0] border-transparent hover:text-gray-600"
    );
  };

  return (
    <div className={cn("w-full overflow-x-auto scrollbar-hide", className)}>
      <div
        className={cn(
          variant === "pill" ? "flex gap-2" : "flex border-b border-gray-200",
          "min-w-max"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(getTabClasses(activeTab === tab.id), "whitespace-nowrap")}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
