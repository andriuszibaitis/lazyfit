"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl w-full max-w-[480px] mx-4 shadow-xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#101827] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Title */}
        <div className="pt-6 px-6 pb-4">
          <h2
            className="text-[24px] font-semibold text-[#101827] text-center font-[Outfit]"
            style={{ lineHeight: "120%" }}
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 pb-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmDisabled?: boolean;
}

export function ModalFooter({
  onCancel,
  onConfirm,
  cancelText = "Atšaukti",
  confirmText = "Patvirtinti",
  confirmDisabled = false,
}: ModalFooterProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-3 px-6 rounded-lg border border-[#E6E6E6] bg-white text-[#101827] font-medium font-[Outfit] hover:bg-[#F5F5F5] transition-colors"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled}
        className="flex-1 py-3 px-6 rounded-lg bg-[#60988E] text-white font-medium font-[Outfit] hover:bg-[#4A7A70] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {confirmText}
      </button>
    </div>
  );
}

// Success Badge Icon
const SuccessBadgeIcon = () => (
  <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M49.2684 3.31187C51.4922 -1.10191 57.7939 -1.10191 60.0177 3.31187C61.7791 6.80778 66.3565 7.71828 69.3217 5.16254C73.0653 1.93577 78.8873 4.3473 79.2528 9.27614C79.5423 13.18 83.4228 15.7729 87.1403 14.5464C91.8338 12.9979 96.2897 17.4538 94.7412 22.1473C93.5147 25.8648 96.1076 29.7453 100.011 30.0348C104.94 30.4003 107.352 36.2223 104.125 39.9659C101.569 42.9311 102.48 47.5085 105.976 49.2699C110.39 51.4937 110.39 57.7953 105.976 60.0192C102.48 61.7806 101.569 66.358 104.125 69.3231C107.352 73.0668 104.94 78.8887 100.011 79.2542C96.1076 79.5437 93.5147 83.4243 94.7412 87.1417C96.2897 91.8353 91.8338 96.2912 87.1403 94.7427C83.4228 93.5162 79.5423 96.1091 79.2528 100.013C78.8873 104.942 73.0653 107.353 69.3217 104.127C66.3565 101.571 61.7791 102.481 60.0177 105.977C57.7939 110.391 51.4922 110.391 49.2684 105.977C47.507 102.481 42.9296 101.571 39.9645 104.127C36.2208 107.353 30.3988 104.942 30.0334 100.013C29.7439 96.1091 25.8633 93.5162 22.1459 94.7427C17.4523 96.2912 12.9964 91.8353 14.5449 87.1417C15.7714 83.4243 13.1785 79.5437 9.27468 79.2542C4.34583 78.8887 1.9343 73.0668 5.16108 69.3231C7.71682 66.358 6.80632 61.7806 3.31041 60.0192C-1.10338 57.7953 -1.10338 51.4937 3.31041 49.2699C6.80632 47.5085 7.71682 42.9311 5.16108 39.9659C1.9343 36.2223 4.34583 30.4003 9.27468 30.0348C13.1785 29.7453 15.7714 25.8648 14.5449 22.1473C12.9964 17.4538 17.4523 12.9979 22.1459 14.5464C25.8633 15.7729 29.7439 13.18 30.0334 9.27614C30.3988 4.3473 36.2208 1.93577 39.9645 5.16254C42.9296 7.71828 47.507 6.80778 49.2684 3.31187Z" fill="#FFB700"/>
    <path d="M38 55L48 65L72 41" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Delete Badge Icon
const DeleteBadgeIcon = () => (
  <svg width="124" height="124" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M56.6253 10.6673C58.8492 6.25356 65.1508 6.25356 67.3747 10.6673C69.1361 14.1632 73.7135 15.0737 76.6786 12.518C80.4223 9.29124 86.2442 11.7028 86.6097 16.6316C86.8992 20.5355 90.7797 23.1283 94.4972 21.9019C99.1907 20.3533 103.647 24.8093 102.098 29.5028C100.872 33.2203 103.465 37.1008 107.368 37.3903C112.297 37.7558 114.709 43.5777 111.482 47.3214C108.926 50.2865 109.837 54.8639 113.333 56.6253C117.746 58.8492 117.746 65.1508 113.333 67.3747C109.837 69.1361 108.926 73.7135 111.482 76.6786C114.709 80.4223 112.297 86.2442 107.368 86.6097C103.465 86.8992 100.872 90.7797 102.098 94.4972C103.647 99.1907 99.1907 103.647 94.4972 102.098C90.7797 100.872 86.8992 103.465 86.6097 107.368C86.2442 112.297 80.4223 114.709 76.6786 111.482C73.7135 108.926 69.1361 109.837 67.3747 113.333C65.1508 117.746 58.8492 117.746 56.6253 113.333C54.8639 109.837 50.2865 108.926 47.3214 111.482C43.5777 114.709 37.7558 112.297 37.3903 107.368C37.1008 103.465 33.2203 100.872 29.5028 102.098C24.8093 103.647 20.3533 99.1907 21.9019 94.4972C23.1283 90.7797 20.5355 86.8992 16.6316 86.6097C11.7028 86.2442 9.29124 80.4223 12.518 76.6786C15.0737 73.7135 14.1632 69.1361 10.6673 67.3747C6.25356 65.1508 6.25356 58.8492 10.6673 56.6253C14.1632 54.8639 15.0737 50.2865 12.518 47.3214C9.29123 43.5777 11.7028 37.7558 16.6316 37.3903C20.5355 37.1008 23.1283 33.2203 21.9019 29.5028C20.3533 24.8093 24.8093 20.3533 29.5028 21.9019C33.2203 23.1283 37.1008 20.5355 37.3903 16.6316C37.7558 11.7028 43.5777 9.29123 47.3214 12.518C50.2865 15.0737 54.8639 14.1632 56.6253 10.6673Z" fill="#FDECEC"/>
    <path d="M76.1667 51.4453H48.6667" stroke="#E74043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M58.6667 58.9453V68.9453" stroke="#E74043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M66.1667 58.9453V68.9453" stroke="#E74043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M73.6667 51.4453V75.1953C73.6667 75.5268 73.5351 75.8448 73.3006 76.0792C73.0662 76.3136 72.7483 76.4453 72.4167 76.4453H52.4167C52.0852 76.4453 51.7673 76.3136 51.5329 76.0792C51.2984 75.8448 51.1667 75.5268 51.1667 75.1953V51.4453" stroke="#E74043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M68.6667 51.4453V48.9453C68.6667 48.2823 68.4034 47.6464 67.9345 47.1775C67.4657 46.7087 66.8298 46.4453 66.1667 46.4453H58.6667C58.0037 46.4453 57.3678 46.7087 56.899 47.1775C56.4301 47.6464 56.1667 48.2823 56.1667 48.9453V51.4453" stroke="#E74043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  highlightText?: string;
  buttonText: string;
  onButtonClick: () => void;
  variant?: "success" | "delete";
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  highlightText,
  buttonText,
  onButtonClick,
  variant = "success",
}: SuccessModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-2xl w-full max-w-[400px] mx-4 shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#101827] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center pt-10 pb-8 px-6">
          {/* Badge */}
          <div className="mb-6">
            {variant === "delete" ? <DeleteBadgeIcon /> : <SuccessBadgeIcon />}
          </div>

          {/* Text */}
          <p className="text-[16px] text-[#101827] text-center leading-relaxed mb-8">
            {title.split(highlightText || "").map((part, index, array) => (
              <span key={index}>
                {part}
                {index < array.length - 1 && highlightText && (
                  <span className="font-semibold">{highlightText}</span>
                )}
              </span>
            ))}
          </p>

          {/* Button */}
          <button
            type="button"
            onClick={onButtonClick}
            className={`px-8 py-3 rounded-lg font-medium font-[Outfit] transition-colors ${
              variant === "delete"
                ? "bg-[#E74043] text-white hover:bg-[#d63538]"
                : "bg-[#60988E] text-white hover:bg-[#4A7A70]"
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
