"use client";

import { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  href?: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: "default" | "sub";
}

export default function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onTabChange,
  className = "",
  variant = "default"
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const getTabClasses = (isActive: boolean) => {
    if (variant === "sub") {
      return `px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full border-2 ${
        isActive
          ? "bg-[#FFF7DF] text-black border-[#FFD16E]"
          : "text-black hover:text-gray-800 hover:bg-gray-100 border-transparent"
      }`;
    }

    return `px-6 py-3 text-base font-medium transition-all duration-200 border-b-2 ${
      isActive
        ? "text-black border-black"
        : "text-black border-transparent hover:text-gray-600"
    }`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      <div className={variant === "sub" ? "flex gap-2" : "flex border-b border-gray-200"}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={getTabClasses(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? "block" : "hidden"}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}