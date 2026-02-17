import React, { useState, useEffect } from "react";
import { Eye, TrendingUp } from "lucide-react";

export const ViewerCount = () => {
  const [viewerCount, setViewerCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const initial = Math.floor(Math.random() * (45 - 12 + 1)) + 12;
    setViewerCount(initial);
    setIsVisible(true);

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const fluctuation = Math.floor(Math.random() * 5) - 2;
        const nextCount = prev + fluctuation;
        return nextCount > 10 && nextCount < 80 ? nextCount : prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (viewerCount === 0) return null;

  return (
    <div
      className={`flex items-center gap-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 border border-emerald-100 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-emerald-700 tabular-nums">
          {viewerCount} customers are viewing this product
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1 text-gray-400">
        <TrendingUp size={12} />
        <span className="text-[11px] font-medium uppercase tracking-widest">
          High Demand
        </span>
      </div>
    </div>
  );
};
