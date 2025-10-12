"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Home,
  Dumbbell,
  Apple,
  BookOpen,
  Zap,
  HelpCircle,
  Clock,
  Video,
  ChefHat,
  GraduationCap,
  User,
  ChevronUp,
  LogOut,
  Settings,
} from "lucide-react";

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const mainNavItems = [
    {
      name: "Apžvalga",
      href: "/dashboard/apzvalga",
      icon: Home,
    },
    {
      name: "Sportas",
      href: "/dashboard/sportas",
      icon: Dumbbell,
    },
    {
      name: "Mityba",
      href: "/dashboard/mityba",
      icon: Apple,
    },
    {
      name: "Mokymai",
      href: "/dashboard/mokymai",
      icon: BookOpen,
    },
    {
      name: "Iššūkiai",
      href: "/dashboard/issukiai",
      icon: Zap,
    },
    {
      name: "Klausimai",
      href: "/dashboard/klausimai",
      icon: HelpCircle,
    },
  ];

  const profileNavItems = [
    {
      name: "Treneruočių istorija",
      href: "/dashboard/treniruociu-istorija",
      icon: Clock,
    },
    {
      name: "Pamėgti video",
      href: "/dashboard/pamegti-video",
      icon: Video,
    },
    {
      name: "Pamėgti receptai",
      href: "/dashboard/pamegti-receptai",
      icon: ChefHat,
    },
    {
      name: "Mano mityba",
      href: "/dashboard/mano-mityba",
      icon: Apple,
    },
    {
      name: "Mano mokymai",
      href: "/dashboard/mano-mokymai",
      icon: GraduationCap,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return pathname.startsWith(href) && href !== "/dashboard";
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex flex-col">
      {}
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard">
          <Image src="/images/logo.png" alt="LazyFit" width={120} height={40} />
        </Link>
      </div>

      {}
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
              onClick={() => setIsUserMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Mano paskyra</span>
            </Link>
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
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

      {}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Pagrindinis
        </h3>
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
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

      {}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Profilis
        </h3>
        <nav className="space-y-1">
          {profileNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
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

      {}
      <div className="mt-auto p-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex flex-wrap gap-x-4">
          <Link href="/privatumo-politika" className="hover:text-gray-700">
            PRIVATUMO POLITIKA
          </Link>
          <Link href="/salygos" className="hover:text-gray-700">
            TERMINAI IR SĄLYGOS
          </Link>
        </div>
        <div className="mt-2">
          © {new Date().getFullYear()} LazyFit. Visos teisės saugomos.
        </div>
      </div>
    </aside>
  );
}
