"use client";

import { useEffect, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePageTitle } from "../contexts/page-title-context";

interface MobileSubPageLayoutProps {
  title: string;
  children: ReactNode;
  backUrl?: string;
  desktopTitle?: string;
  rightAction?: ReactNode;
}

export default function MobileSubPageLayout({
  title,
  children,
  backUrl,
  desktopTitle,
  rightAction,
}: MobileSubPageLayoutProps) {
  const router = useRouter();
  const { setPageTitle, setShowBackButton, setBackUrl, setHideMobileHeader } =
    usePageTitle();

  useEffect(() => {
    setHideMobileHeader(true);
    setPageTitle(desktopTitle || title);
    setShowBackButton(true);
    setBackUrl(backUrl || null);

    return () => {
      setHideMobileHeader(false);
      setShowBackButton(false);
      setBackUrl(null);
    };
  }, [
    title,
    desktopTitle,
    backUrl,
    setHideMobileHeader,
    setPageTitle,
    setShowBackButton,
    setBackUrl,
  ]);

  return (
    <>
      <div className="lg:hidden bg-white min-h-screen">
        <div className="relative flex items-center justify-center px-4 py-4 border-b border-[#E6E6E6]">
          <button
            type="button"
            onClick={() => (backUrl ? router.push(backUrl) : router.back())}
            aria-label="Atgal"
            className="absolute left-4 h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#101827]" />
          </button>
          <h1 className="text-lg font-semibold text-[#101827] font-outfit">
            {title}
          </h1>
          {rightAction && (
            <div className="absolute right-4">{rightAction}</div>
          )}
        </div>
        {children}
      </div>

      <div className="hidden lg:block">{children}</div>
    </>
  );
}
