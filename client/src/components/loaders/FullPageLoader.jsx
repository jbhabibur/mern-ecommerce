import React from "react";

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl">
      {/* Modern Loading Text */}
      <div className="mt-10 flex flex-col items-center gap-2">
        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-800 antialiased">
          Loading
        </span>

        {/* Minimalist Progress Line */}
        <div className="relative h-[2px] w-16 bg-gray-200 overflow-hidden rounded-full">
          <div className="absolute h-full w-1/2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
        </div>
      </div>

      {/* Inline Style for Custom Animation */}
      <style>{`
  @keyframes loading {
    0% {
      left: -50%;
    }
    100% {
      left: 100%;
    }
  }
`}</style>
    </div>
  );
};
