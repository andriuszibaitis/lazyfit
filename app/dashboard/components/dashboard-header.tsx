"use client";

import SearchInput from "../../components/search-input";
import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  pageTitle?: string;
}

export default function DashboardHeader({
  onSearch,
  searchPlaceholder = "Ieškoti...",
  pageTitle
}: DashboardHeaderProps) {
  return (
    <header className="bg-[#F7F7F7] border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        {/* Page Title */}
        <div className="flex-1">
          {pageTitle && (
            <h1 className="text-[48px] font-[mango] text-[#101827]">
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Right side - Search and Notifications */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="max-w-md">
            <SearchInput
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              className="w-full"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-6 w-6 text-black" />
              {/* Red dot for notifications */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}