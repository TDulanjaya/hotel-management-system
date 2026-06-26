"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlidePanel({
  isOpen,
  onClose,
  title,
  children,
}: SlidePanelProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling on the main body when panel is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Prevent hydration mismatch by only rendering on client
  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-[#101827]/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide Panel */}
      <div
        className={`relative flex h-full w-full flex-col bg-[#f7f4ee] shadow-2xl transition-transform duration-300 ease-in-out md:w-[480px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slide-panel-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d8b328]/30 bg-white px-6 py-5 shadow-sm">
          <h2 id="slide-panel-title" className="text-xl font-extrabold text-[#101827]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#d8b328] focus:outline-none focus:ring-2 focus:ring-[#d8b328]"
            aria-label="Close panel"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
