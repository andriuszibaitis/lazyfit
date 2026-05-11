"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Apple, BookOpen, User } from "lucide-react";

const navItems = [
  { name: "Apžvalga", href: "/dashboard/apzvalga", icon: Home },
  { name: "Sportas", href: "/dashboard/sportas", icon: Dumbbell },
  { name: "Mityba", href: "/dashboard/mityba", icon: Apple },
  { name: "Mokymai", href: "/dashboard/mokymai", icon: BookOpen },
  { name: "Profilis", href: "/dashboard/asmenine-paskyra", icon: User },
];

const HIDE_ON_PATHS = ["/dashboard/training/"];

export default function BottomNavigation() {
  const pathname = usePathname();

  if (HIDE_ON_PATHS.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard/apzvalga") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/apzvalga");
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E6E6] z-30 pb-7">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1"
            >
              <div
                className={`flex items-center justify-center w-14 h-10 rounded-xl transition-colors ${
                  active ? "bg-[#e6f2f0]" : ""
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    active ? "text-[#101827]" : "text-gray-500"
                  }`}
                />
              </div>
              <span
                className={`text-[11px] leading-none font-[outfit] ${
                  active ? "text-[#101827] font-medium" : "text-[#555B65]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
