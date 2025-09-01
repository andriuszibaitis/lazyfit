"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

export default function SideNavigation({ user }: { user: any }) {
  const pathname = usePathname();

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
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex flex-col">
      {}
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard">
          <Image src="/images/logo.png" alt="LazyFit" width={120} height={40} />
        </Link>
      </div>

      {}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image || "/placeholder.svg"}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{user.name || "Vartotojas"}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
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
