"use client";
import { useEffect } from "react";

export default function SlidePanel({
  open, onClose, title, subtitle, icon, children
}: {
  open: boolean; onClose: () => void;
  title: string; subtitle?: string;
  icon?: React.ReactNode; children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[201] w-full max-w-2xl overflow-y-auto bg-[#fbf9f5] shadow-2xl animate-slideInPanel">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-6 py-4">
          <div className="flex items-center gap-3">
            {icon && <div className="rounded-xl bg-[#d4af37]/15 p-2 text-[#735c00]">{icon}</div>}
            <div>
              <h2 className="text-lg font-bold text-[#1b1c1a]">{title}</h2>
              {subtitle && <p className="text-xs text-[#7f7663]">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl border border-[#d0c5af] p-2 text-[#7f7663] transition hover:bg-[#ece9e2] hover:text-[#1b1c1a]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
      <style>{`@keyframes slideInPanel { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slideInPanel { animation: slideInPanel 0.3s ease-out; }`}</style>
    </>
  );
}
