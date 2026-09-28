import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ProjectInquiryForm } from "./ProjectInquiryForm";

export function InquiryModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Open modal on custom event trigger
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("loni:open-inquiry", handler);
    return () => window.removeEventListener("loni:open-inquiry", handler);
  }, []);

  // Lock scroll when modal is open
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

  // Handle escape key press to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6 lg:p-8 bg-brand/40 backdrop-blur-md animate-[fadeIn_.25s_ease]"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-7xl bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-brand/10 overflow-hidden max-h-[92vh] md:max-h-[88vh] flex flex-col scale-95 opacity-0 animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 rounded-full p-2.5 bg-white/95 backdrop-blur-sm border border-brand/10 hover:bg-white text-brand shadow-sm transition-all duration-200 hover:scale-105"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" strokeWidth={1.8} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 w-full scroll-smooth">
          <ProjectInquiryForm isModal={true} onClose={() => setIsOpen(false)} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
