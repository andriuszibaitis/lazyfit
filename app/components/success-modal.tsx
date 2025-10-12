"use client";

import { SuccessBadgeIcon } from "./icons";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttonText: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  buttonText
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>

        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <SuccessBadgeIcon width={110} height={110} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#101827] mb-6 font-['mango']">
          {title}
        </h2>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-lg font-semibold bg-[#60988E] text-white hover:bg-[#4a7168] transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}