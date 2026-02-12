"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Settings, ChevronDown, LayoutDashboard, Shield } from "lucide-react";

function getInitials(name: string | null | undefined): string {
  if (!name) return "VR";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/prisijungti"
          className="border border-[#101827] text-[#101827] font-bold italic text-base rounded-lg px-6 py-3 hover:bg-[#EFEFEF] hover:text-[#101827] transition"
        >
          Prisijungti
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#60988E]">
          {session.user.image ? (
            <Image
              src={session.user.image || "/placeholder.svg"}
              alt={session.user.name || "User"}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#60988E] flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(session.user.name)}
            </div>
          )}
        </div>
        <span className="hidden md:block font-medium">{session.user.name}</span>
        <ChevronDown size={16} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-gray-500 truncate">
              {session.user.email}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard size={16} className="mr-2" />
            Mano apžvalga
          </Link>
          <Link
            href="/dashboard/asmenine-paskyra"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} className="mr-2" />
            Asmeninė paskyra
          </Link>
          <Link
            href="/nustatymai"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} className="mr-2" />
            Nustatymai
          </Link>
          {session.user.role === "admin" && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Shield size={16} className="mr-2" />
              Administravimas
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Atsijungti
          </button>
        </div>
      )}
    </div>
  );
}
