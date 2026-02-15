import { Loader2 } from "lucide-react";

export const GlobalLoader = () => {
  return (
    // Covers the entire screen and stays on top of everything (z-[9999])
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner icon with thin stroke and rotation animation */}
        <Loader2 className="w-8 h-8 animate-spin text-black stroke-[1.5]" />

        {/* Loading text with pulse effect and wide letter spacing */}
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">
          Loading Experience
        </p>
      </div>
    </div>
  );
};
