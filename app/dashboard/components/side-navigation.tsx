"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  Home,
  Dumbbell,
  Apple,
  BookOpen,
  Zap,
  HelpCircle,
  User,
  ChevronUp,
  LogOut,
  Shield,
  X,
} from "lucide-react";
import { useMobileMenu } from "../contexts/mobile-menu-context";

// Custom icons
function RunningShoeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.747 7.5C14.3546 7.5 13.0192 6.9469 12.0346 5.9623C11.0501 4.9777 10.497 3.6424 10.497 2.25L3.2782 7.7259C3.1965 7.792 3.1297 7.8745 3.0819 7.9681C3.0342 8.0617 3.0066 8.1643 3.0011 8.2692C2.9955 8.3741 3.012 8.479 3.0496 8.5771C3.0872 8.6753 3.1449 8.7644 3.2191 8.8387L13.8776 19.5H20.997C21.1959 19.5 21.3866 19.421 21.5273 19.2803C21.6679 19.1397 21.747 18.9489 21.747 18.75V16.9631C21.7469 16.824 21.7081 16.6875 21.6349 16.5692C21.5617 16.4508 21.457 16.3551 21.3326 16.2928L18.6532 14.9512C17.7803 14.5158 17.0461 13.8457 16.5327 13.0163C16.0194 12.1868 15.7473 11.2308 15.747 10.2553V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.1213 10.5011L5.0234 6.4023" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 16.5H6.6375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 19.5H9.6375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HeartOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C12 21 4 15 4 9C4 6.5 6 4 9 4C10.5 4 11.5 4.5 12 5.5C12.5 4.5 13.5 4 15 4C18 4 20 6.5 20 9C20 15 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L2 9L12 14L22 9L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 11V16C6 16 8 19 12 19C16 19 18 16 18 16V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 9V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "VR";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

function getDisplayName(name: string | null | undefined): string {
  if (!name) return "Vartotojas";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0];
  }
  return `${words[0]} ${words[1][0]}.`;
}

export default function SideNavigation({ user }: { user: any }) {
  const pathname = usePathname();
  const { isOpen, closeMenu } = useMobileMenu();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRutinaOpen, setIsRutinaOpen] = useState(true);

  // Uždaryti meniu kai pasikeičia pathname
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Užrakinti scroll kai meniu atidarytas
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const mainNavItems = [
    { name: "Apžvalga", href: "/dashboard/apzvalga", icon: Home },
    { name: "Sportas", href: "/dashboard/sportas", icon: Dumbbell },
    { name: "Mityba", href: "/dashboard/mityba", icon: Apple },
    { name: "Mokymai", href: "/dashboard/mokymai", icon: BookOpen },
    { name: "Iššūkiai", href: "/dashboard/issukiai", icon: Zap },
    { name: "Klausimai", href: "/dashboard/klausimai", icon: HelpCircle },
  ];

  const rutinaItems = [
    { name: "Sporto programos", href: "/dashboard/mano-rutina/sporto-programos" },
    { name: "Mityba", href: "/dashboard/mano-rutina/mityba" },
    { name: "Iššūkiai", href: "/dashboard/mano-rutina/issukiai" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (href === "/dashboard/mokymai") {
      return pathname === "/dashboard/mokymai" || (pathname.startsWith("/dashboard/mokymai/") && !pathname.startsWith("/dashboard/mano-mokymai"));
    }
    return pathname.startsWith(href) && href !== "/dashboard";
  };

  const isRutinaActive = rutinaItems.some(item => isActive(item.href));
  const isMokymaiActive = pathname.startsWith("/dashboard/mano-mokymai");

  const navigationContent = (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <Link href="/dashboard" onClick={closeMenu}>
          <Image src="/images/logo.png" alt="LazyFit" width={120} height={40} />
        </Link>
        {/* Close button - mobile only */}
        <button
          onClick={closeMenu}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Uždaryti meniu"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200 relative">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-full flex items-center justify-between space-x-3 p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-0">
              {user.image && user.image.trim() !== "" ? (
                <img
                  src={user.image}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border-0 outline-none ring-0"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#60988E] flex items-center justify-center border-0 outline-none">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user.name)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm text-left">{getDisplayName(user.name)}</p>
            </div>
          </div>
          <ChevronUp className={`h-5 w-5 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 space-y-1 z-50">
            <Link
              href="/dashboard/asmenine-paskyra"
              className="flex items-center space-x-2 px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md mx-1"
              onClick={() => {
                setIsUserMenuOpen(false);
                closeMenu();
              }}
            >
              <User className="h-5 w-5" />
              <span>Mano paskyra</span>
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md mx-1"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  closeMenu();
                }}
              >
                <Shield className="h-5 w-5" />
                <span>Administravimas</span>
              </Link>
            )}
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                closeMenu();
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-base text-red-600 hover:bg-gray-100 rounded-md text-left mx-1"
            >
              <LogOut className="h-5 w-5" />
              <span>Atsijungti</span>
            </button>
          </div>
        )}
      </div>

      {/* Pagrindinis Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMenu}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
                isActive(item.href)
                  ? "bg-[#e6f2f0] text-[#60988e]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive(item.href) ? "text-[#60988e]" : "text-gray-400"
                }`}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mano sekcija */}
      <div className="p-4 pt-0 flex-1">
        <div className="border-t border-gray-200 mb-4"></div>
        <nav className="space-y-1">
          {/* Mano rutina - collapsible */}
          <div>
            <button
              onClick={() => setIsRutinaOpen(!isRutinaOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isRutinaActive
                  ? "bg-[#e6f2f0] text-[#60988e]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <RunningShoeIcon className={`mr-3 h-5 w-5 ${isRutinaActive ? "text-[#60988e]" : "text-gray-400"}`} />
                <span>Mano rutina</span>
              </div>
              <ChevronUp className={`h-4 w-4 text-gray-400 transition-transform ${isRutinaOpen ? '' : 'rotate-180'}`} />
            </button>
            {isRutinaOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {rutinaItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-[#e6f2f0] text-[#60988e]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mano pamėgti */}
          <Link
            href="/dashboard/pamegti"
            onClick={closeMenu}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/dashboard/pamegti")
                ? "bg-[#e6f2f0] text-[#60988e]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HeartOutlineIcon className={`mr-3 h-5 w-5 ${isActive("/dashboard/pamegti") ? "text-[#60988e]" : "text-gray-400"}`} />
            <span>Mano pamėgti</span>
          </Link>

          {/* Mano mokymai */}
          <Link
            href="/dashboard/mano-mokymai"
            onClick={closeMenu}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isMokymaiActive
                ? "bg-[#e6f2f0] text-[#60988e]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <GraduationCapIcon className={`mr-3 h-5 w-5 ${isMokymaiActive ? "text-[#60988e]" : "text-gray-400"}`} />
            <span>Mano mokymai</span>
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex flex-wrap gap-x-4">
          <Link href="/privatumo-politika" className="hover:text-gray-700" onClick={closeMenu}>
            PRIVATUMO POLITIKA
          </Link>
          <Link href="/salygos" className="hover:text-gray-700" onClick={closeMenu}>
            TERMINAI IR SĄLYGOS
          </Link>
        </div>
        <div className="mt-2">
          © {new Date().getFullYear()} LazyFit. Visos teisės saugomos.
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex-col z-20">
        {navigationContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 w-80 max-w-[85vw] bg-white h-full overflow-y-auto flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navigationContent}
      </aside>
    </>
  );
}
