import React from "react";
import { ArrowLeft, Home } from "lucide-react";

export const ErrorState = ({
  code = "404",
  title = "Something went wrong",
  description = "The page you are looking for might have been removed or is temporarily unavailable.",
  onBack = () => window.history.back(),
}) => {
  return (
    /* Full viewport container with fixed positioning to cover all elements */
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-6">
      {/* Ghost typography for background depth */}
      <div className="absolute select-none pointer-events-none opacity-[0.02] font-bold text-[18rem] lg:text-[28rem] leading-none tracking-tighter">
        {code}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* High-end typography with increased letter spacing */}
        <h1 className="text-[11px] font-bold tracking-[0.5em] uppercase text-black mb-4">
          {title}
        </h1>

        <p className="text-[13px] font-light leading-relaxed text-slate-400 mb-12 tracking-wide">
          {description}
        </p>

        {/* Clean, text-based navigation actions */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-black/50 transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>

          <div className="hidden sm:block h-6 w-[1px] bg-slate-100" />

          <a
            href="/"
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-black/50 transition-colors"
          >
            <Home size={14} />
            Home
          </a>
        </div>
      </div>
    </div>
  );
};
