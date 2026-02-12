"use client";

import SearchInput from "../../components/search-input";
import { Bell, ChevronLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMobileMenu } from "../contexts/mobile-menu-context";

interface DashboardHeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  pageTitle?: string;
  showBackButton?: boolean;
  backUrl?: string | null;
}

export default function DashboardHeader({
  onSearch,
  searchPlaceholder = "Ieškoti...",
  pageTitle,
  showBackButton = false,
  backUrl = null
}: DashboardHeaderProps) {
  const router = useRouter();
  const { openMenu } = useMobileMenu();

  const handleGoBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <header className="bg-[#F7F7F7] border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full gap-4">
        {/* Left side - Mobile menu button, Logo (mobile), Back button, Title */}
        <div className="flex-1 flex items-center gap-3 lg:gap-4 min-w-0">
          {/* Hamburger menu - mobile only */}
          <button
            onClick={openMenu}
            className="lg:hidden flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Atidaryti meniu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          {/* Logo - mobile only */}
          <Link href="/dashboard" className="lg:hidden flex-shrink-0">
            <Image src="/images/logo.png" alt="LazyFit" width={100} height={32} />
          </Link>

          {/* Back button - desktop */}
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="hidden lg:flex items-center justify-center border border-gray-200 bg-gray-50 rounded-md w-12 h-12 transition-colors hover:bg-gray-100 flex-shrink-0"
              aria-label="Grįžti atgal"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {/* Page title - desktop only */}
          {pageTitle && (
            <h1 className="hidden lg:block text-[36px] font-semibold font-[mango] text-[#101827] truncate" style={{ lineHeight: "90%" }}>
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Right side - Search and Notifications */}
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          {/* Search - hidden on small mobile, shown on larger screens */}
          <div className="hidden sm:block w-48 lg:w-64 xl:w-80">
            <SearchInput
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              className="w-full"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-black" />
              {/* Red dot for notifications */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile page title - shown below header content */}
      {pageTitle && (
        <div className="lg:hidden mt-3 flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center border border-gray-200 bg-gray-50 rounded-md w-10 h-10 transition-colors hover:bg-gray-100 flex-shrink-0"
              aria-label="Grįžti atgal"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-[28px] font-semibold font-[mango] text-[#101827] truncate" style={{ lineHeight: "90%" }}>
            {pageTitle}
          </h1>
        </div>
      )}

      {/* Mobile search - shown on very small screens */}
      <div className="sm:hidden mt-3">
        <SearchInput
          placeholder={searchPlaceholder}
          onSearch={onSearch}
          className="w-full"
        />
      </div>
    </header>
  );
}
