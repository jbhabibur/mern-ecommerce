import React from "react";

/**
 * SectionLayout Component
 * * A structural wrapper for consistent page sectioning.
 * - Manages background colors and horizontal dividers.
 * - Handles centralized content alignment and responsive padding.
 * - Supports custom container constraints via props.
 */
export const SectionLayout = ({
  children,
  bgColor = "bg-white",
  containerClass = "max-w-[75rem]!",
}) => {
  return (
    /* Primary Section Wrapper with dynamic background and subtle top border */
    <section className={`w-full ${bgColor} border-t border-white/5`}>
      {/* Centered Content Container 
          - Manages responsive horizontal padding (px-6 to lg:px-20)
          - Applies layout constraints from containerClass
      */}
      <div className={`container mx-auto px-6 lg:px-20 ${containerClass}`}>
        {children}
      </div>
    </section>
  );
};
