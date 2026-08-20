"use client";

import { useEffect } from "react";
import RecaptchaWidget from "./RecaptchaWidget";

interface RecaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
  title?: string;
  description?: string;
}

export default function RecaptchaModal({
  isOpen,
  onClose,
  onVerify,
  title = "Security Verification",
  description = "Please complete this quick verification to submit your request.",
}: RecaptchaModalProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm bg-[#faf7f2] border border-[#ede7db] rounded-3xl shadow-2xl p-6 sm:p-7 text-center transform transition-all animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b6b5e] hover:text-[#1e3323] transition-colors p-2 rounded-full hover:bg-[#ede7db]/60 text-lg leading-none"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header with security shield badge */}
        <div className="w-12 h-12 rounded-2xl bg-[#1e3323] text-[#c4a86b] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>

        <h3
          className="text-xl font-bold text-[#1e3323] tracking-tight mb-2 uppercase"
          style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
        >
          {title}
        </h3>

        <p
          className="text-xs text-[#6b6b5e] leading-relaxed mb-6 font-medium"
          style={{ fontFamily: "'Nexa Bold', 'Nexa', sans-serif" }}
        >
          {description}
        </p>

        {/* Captcha Container */}
        <div className="flex justify-center items-center my-2 min-h-[78px] overflow-x-auto py-1">
          <RecaptchaWidget
            onVerify={onVerify}
            onExpire={() => {}}
          />
        </div>

        <div className="mt-5 pt-3 border-t border-[#ede7db]/80 flex justify-between items-center text-[11px] text-[#6b6b5e]">
          <span className="font-medium">Protected by reCAPTCHA</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#1e3323] hover:text-[#c4a86b] font-bold uppercase transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
