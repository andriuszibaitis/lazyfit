"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  url?: string | null;
  size?: "sm" | "md";
  className?: string;
}

export default function BackButton({ url = null, size = "md", className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (url) {
      router.push(url);
    } else {
      router.back();
    }
  };

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
  };

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
  };

  return (
    <button
      onClick={handleGoBack}
      className={`flex items-center justify-center border border-gray-200 bg-gray-50 rounded-md transition-colors hover:bg-gray-100 flex-shrink-0 ${sizeClasses[size]} ${className}`}
      aria-label="Grįžti atgal"
    >
      <ChevronLeft className={`${iconSizes[size]} text-gray-600`} />
    </button>
  );
}
