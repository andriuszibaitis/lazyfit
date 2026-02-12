"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "default" | "danger";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Patvirtinti",
  cancelText = "Atšaukti",
  isLoading = false,
  variant = "default",
}: ConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 transition-all duration-200 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-[#6B7280]" />
        </button>

        {/* Content */}
        <div className="text-center pt-4">
          <h2
            className="text-[#101827] text-[28px] font-semibold mb-4"
            style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
          >
            {title}
          </h2>
          <p className="text-[#6B7280] text-sm font-[Outfit] mb-8">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-full border border-[#E6E6E6] text-[#101827] font-medium hover:bg-gray-50 transition-colors font-[Outfit] disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-6 py-3 rounded-full font-medium transition-colors font-[Outfit] disabled:opacity-50 ${
                variant === "danger"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-[#60988E] text-white hover:bg-[#34786C]"
              }`}
            >
              {isLoading ? "Kraunama..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
