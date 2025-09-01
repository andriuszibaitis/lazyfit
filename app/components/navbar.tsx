"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import UserMenu from "./user-menu";
import { useInitialData } from "@/app/providers/auth-provider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const initialData = useInitialData();
  const menuItems = initialData?.menuItems || [];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const renderMenuItems = () => {
    return menuItems.map((item: any) => (
      <Link
        key={item.id}
        href={item.path}
        className="font-[var(--font-outfit)] uppercase text-sm text-[#101827] hover:text-[#60988E]"
        onClick={() => setMenuOpen(false)}
      >
        {item.title}
      </Link>
    ));
  };

  const renderMobileMenuItems = () => {
    return menuItems.map((item: any) => (
      <Link
        key={item.id}
        href={item.path}
        className="block text-[32px] font-['mango'] uppercase text-[#101827] hover:text-[#60988E]"
        onClick={() => setMenuOpen(false)}
      >
        {item.title}
      </Link>
    ));
  };

  return (
    <nav>
      <div className="container mx-auto flex justify-between items-center p-4">
        {}
        <Link
          href="/"
          className="relative z-60 flex items-center font-bold text-lg space-x-2"
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={120}
            height={71}
            className="hover:opacity-90 transition"
          />
          <span className="sr-only">Pagrindinis</span>
        </Link>

        {}
        <button
          id="menu-toggle"
          onClick={toggleMenu}
          className="relative z-60 lg:hidden w-12 h-12 bg-white border border-[#101827] rounded-lg shadow-[5px_5px_0px_0px_rgba(16,_24,_39,_1)] flex items-center justify-center hover:bg-gray-100 transition-all duration-300"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-[#101827]" />
          ) : (
            <Menu className="h-6 w-6 text-[#101827]" />
          )}
        </button>

        {}
        <div className="hidden lg:flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
          {}
          {menuItems.length > 0 ? (
            renderMenuItems()
          ) : (
            <>
              <Link
                href="/"
                className="font-[var(--font-outfit)] uppercase text-sm text-[#101827] hover:text-[#60988E]"
              >
                Pagrindinis
              </Link>
              <Link
                href="/apie"
                className="font-[var(--font-outfit)] uppercase text-sm text-[#101827] hover:text-[#60988E]"
              >
                Apie mus
              </Link>
              <Link
                href="/paslaugos"
                className="font-[var(--font-outfit)] uppercase text-sm text-[#101827] hover:text-[#60988E]"
              >
                Paslaugos
              </Link>
              <Link
                href="/kontaktai"
                className="font-[var(--font-outfit)] uppercase text-sm text-[#101827] hover:text-[#60988E]"
              >
                Kontaktai
              </Link>
            </>
          )}
        </div>

        {}
        <div className="hidden lg:flex items-center">
          <UserMenu />
        </div>
      </div>

      {}
      <div
        id="fullscreen-menu"
        className={`fixed inset-0 bg-white z-50 flex-col items-center justify-center transition-all duration-500 ${
          menuOpen ? "flex opacity-100 scale-100" : "hidden opacity-0 scale-95"
        }`}
      >
        <div className="text-center space-y-8">
          {}
          {menuItems.length > 0 ? (
            renderMobileMenuItems()
          ) : (
            <>
              <Link
                href="/"
                className="block text-[32px] font-['mango'] uppercase text-[#101827] hover:text-[#60988E]"
                onClick={() => setMenuOpen(false)}
              >
                Pagrindinis
              </Link>
              <Link
                href="/apie"
                className="block text-[32px] font-['mango'] uppercase text-[#101827] hover:text-[#60988E]"
                onClick={() => setMenuOpen(false)}
              >
                Apie mus
              </Link>
              <Link
                href="/paslaugos"
                className="block text-[32px] font-['mango'] uppercase text-[#101827] hover:text-[#60988E]"
                onClick={() => setMenuOpen(false)}
              >
                Paslaugos
              </Link>
              <Link
                href="/kontaktai"
                className="block text-[32px] font-['mango'] uppercase text-[#101827] hover:text-[#60988E]"
                onClick={() => setMenuOpen(false)}
              >
                Kontaktai
              </Link>
            </>
          )}

          <div className="mt-8 flex justify-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
