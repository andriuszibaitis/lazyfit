"use client";

import SearchInput from "../../components/search-input";
import { Bell, Bookmark, Menu, Search } from "lucide-react";
import BackButton from "./back-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMobileMenu } from "../contexts/mobile-menu-context";

interface MobileGreeting {
  userName: string;
  userImage?: string | null;
}

interface DashboardHeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  pageTitle?: string;
  showBackButton?: boolean;
  backUrl?: string | null;
  mobileGreeting?: MobileGreeting | null;
  hideMobileHeader?: boolean;
}

function getFormattedDate(): string {
  const now = new Date();
  const days = ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"];
  const months = ["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rgp", "Rgs", "Spa", "Lap", "Grd"];
  return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

export default function DashboardHeader({
  onSearch,
  searchPlaceholder = "Ieškoti...",
  pageTitle,
  showBackButton = false,
  backUrl = null,
  mobileGreeting = null,
  hideMobileHeader = false
}: DashboardHeaderProps) {
  const { openMenu } = useMobileMenu();
  const router = useRouter();

  const firstName = mobileGreeting?.userName?.split(" ")[0] || "";
  const lastInitial = mobileGreeting?.userName?.split(" ")[1]?.[0] || "";
  const greetingName = lastInitial ? `${firstName} ${lastInitial}.` : firstName;

  return (
    <header className={`px-4 lg:px-6 py-3 lg:py-4 font-outfit ${hideMobileHeader ? 'hidden lg:block' : ''} ${mobileGreeting ? 'bg-transparent' : showBackButton ? 'bg-[#F7F7F7]' : 'bg-[#F7F7F7] border-b border-gray-200'} lg:bg-[#F7F7F7] lg:border-b lg:border-gray-200`}>
      {/* Mobile greeting header - shown only on mobile when mobileGreeting is set */}
      {mobileGreeting && (
        <div className="lg:hidden max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h1 className="text-[36px] font-semibold font-[mango] text-[#101827]" style={{ lineHeight: "90%" }}>
              Sveiki, {firstName}!
            </h1>
            <button className="p-1.5 bg-gray-200 rounded-[8px] hover:bg-gray-300 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.8537 6.64664L9.85371 1.64664C9.78382 1.57668 9.69475 1.529 9.59777 1.50966C9.50078 1.49031 9.40024 1.50016 9.30886 1.53796C9.21747 1.57576 9.13934 1.63981 9.08436 1.72201C9.02938 1.80421 9.00001 1.90087 8.99996 1.99977V4.52164C7.37871 4.66039 5.58809 5.45414 4.11496 6.70352C2.34121 8.20852 1.23684 10.1479 1.00496 12.1641C0.986842 12.3209 1.01863 12.4794 1.09579 12.617C1.17295 12.7547 1.29157 12.8645 1.43475 12.9308C1.57793 12.9971 1.73838 13.0166 1.89328 12.9865C2.04817 12.9563 2.18961 12.8781 2.29746 12.7629C2.98496 12.031 5.43121 9.71664 8.99996 9.51289V11.9998C9.00001 12.0987 9.02938 12.1953 9.08436 12.2775C9.13934 12.3597 9.21747 12.4238 9.30886 12.4616C9.40024 12.4994 9.50078 12.5092 9.59777 12.4899C9.69475 12.4705 9.78382 12.4229 9.85371 12.3529L14.8537 7.35289C14.9472 7.25916 14.9997 7.13217 14.9997 6.99977C14.9997 6.86737 14.9472 6.74038 14.8537 6.64664ZM9.99996 10.7929V8.99977C9.99996 8.86716 9.94728 8.73998 9.85351 8.64621C9.75975 8.55245 9.63257 8.49977 9.49996 8.49977C7.74496 8.49977 6.03559 8.95789 4.41934 9.86227C3.59618 10.3249 2.82922 10.8811 2.13371 11.5198C2.49621 10.0298 3.40996 8.61289 4.76184 7.46602C6.21309 6.23539 7.98434 5.49977 9.49996 5.49977C9.63257 5.49977 9.75975 5.44709 9.85351 5.35332C9.94728 5.25955 9.99996 5.13238 9.99996 4.99977V3.20727L13.7931 6.99977L9.99996 10.7929Z" fill="#555B65"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bookmark className="h-5 w-5 text-[#101827]" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="h-5 w-5 text-[#101827]" />
            </button>
            <div className="relative">
              <button onClick={() => router.push("/dashboard/asmenine-paskyra?tab=reports")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="h-5 w-5 text-[#101827]" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F7F7F7]"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standard mobile header - shown on mobile when NO mobileGreeting and NO backButton */}
      {!mobileGreeting && !showBackButton && (
        <div className="lg:hidden flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={openMenu}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Atidaryti meniu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <Link href="/dashboard" className="flex-shrink-0">
              <Image src="/images/logo.png" alt="LazyFit" width={100} height={32} />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block w-48">
              <SearchInput
                placeholder={searchPlaceholder}
                onSearch={onSearch}
                className="w-full"
              />
            </div>
            <div className="relative">
              <button onClick={() => router.push("/dashboard/asmenine-paskyra?tab=reports")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="h-5 w-5 text-black" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop header - always shown on lg+ */}
      <div className="hidden lg:flex max-w-7xl mx-auto items-center justify-between w-full gap-4">
        {/* Left side - Back button, Title */}
        <div className="flex-1 flex items-center gap-4 min-w-0">
          {showBackButton && (
            <BackButton url={backUrl} size="md" />
          )}
          {pageTitle && (
            <h1 className="text-[36px] font-semibold font-[mango] text-[#101827] truncate" style={{ lineHeight: "90%" }}>
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Right side - Search and Notifications */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="w-64 xl:w-80">
            <SearchInput
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              className="w-full"
            />
          </div>
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-6 w-6 text-black" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile page title with back button centered - shown when backButton is set */}
      {!mobileGreeting && showBackButton && pageTitle && (
        <div className="lg:hidden relative flex items-center justify-center">
          <BackButton url={backUrl} size="sm" className="absolute left-0" />
          <h1 className="text-[28px] font-semibold text-[#101827] font-[mango] italic">
            {pageTitle}
          </h1>
        </div>
      )}

      {/* Mobile page title without back button */}
      {!mobileGreeting && !showBackButton && pageTitle && (
        <div className="lg:hidden mt-3 flex items-center gap-3">
          <h1 className="text-[28px] font-semibold font-[mango] text-[#101827] truncate" style={{ lineHeight: "90%" }}>
            {pageTitle}
          </h1>
        </div>
      )}

      {/* Mobile search - shown on very small screens when NO mobileGreeting and NO backButton */}
      {!mobileGreeting && !showBackButton && (
        <div className="sm:hidden mt-3">
          <SearchInput
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            className="w-full"
          />
        </div>
      )}
    </header>
  );
}
