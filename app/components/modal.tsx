"use client";

import { ReactNode } from "react";
import Button from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: "default" | "delete";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = "default",
  confirmText = "Patvirtinti",
  cancelText = "Atšaukti",
  onConfirm,
  confirmDisabled = false,
  isLoading = false
}: ModalProps) {
  if (!isOpen) return null;

  const getConfirmVariant = () => {
    switch (variant) {
      case "delete":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-xl w-full mx-4 font-outfit">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          {children}
        </div>

        {onConfirm && (
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={confirmDisabled || isLoading}
              variant={getConfirmVariant()}
              size="lg"
              className="flex-1"
            >
              {isLoading ? "Vykdoma..." : confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}