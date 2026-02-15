import React from "react";

export const HeroSkeleton = () => {
  const headerHeight = "125px";

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-200 animate-pulse h-[400px] sm:h-[500px] lg:h-[var(--dynamic-height)]"
      style={{ "--dynamic-height": `calc(100vh - ${headerHeight})` }}
    >
      {/* Background Simulation */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
        style={{ backgroundSize: "200% 100%" }}
      ></div>

      {/* Content Center Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        {/* Title Skeleton */}
        <div className="h-10 md:h-16 bg-gray-300 rounded-md w-2/3 md:w-1/2 lg:w-1/3"></div>

        {/* Sub-line Skeleton */}
        <div className="h-1 bg-gray-300 w-16 md:w-24"></div>
      </div>

      {/* Dots Skeleton */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className={`bg-gray-300 rounded-full ${i === 0 ? "w-10 h-1.5" : "w-2 h-2"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};
