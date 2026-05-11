"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabItem } from "@/components/ui/custom-tabs";

interface TabDropdownProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabDropdown({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLabel =
    tabs.find((t) => t.id === activeTab)?.label ?? tabs[0]?.label ?? "";

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (id: string) => {
    onTabChange(id);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 text-left"
      >
        <span className="text-[28px] lg:text-[36px] font-semibold font-[mango] text-[#101827] leading-[90%]">
          {activeLabel}
        </span>
        <span
          className={cn(
            "flex items-center justify-center h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-[#E3F0EC] text-[#34786C] transition-transform",
            isOpen && "rotate-180"
          )}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-2 z-50 min-w-[220px] rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(tab.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "text-[#101827] font-medium"
                    : "text-[#4B5563] hover:bg-gray-50"
                )}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <Check className="h-4 w-4 text-[#60988E] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
