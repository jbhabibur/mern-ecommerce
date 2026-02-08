import React from "react";

/**
 * FooterLinks Component
 * * Renders an interactive link directory with accordion functionality for mobile.
 * - Desktop: Static list of navigational links.
 * - Mobile: Expandable accordion with custom animated state indicators.
 */
export const FooterLinks = ({ isOpen, toggle }) => {
  const links = [
    "About Us",
    "Blog",
    "Privacy Policy",
    "Shipping Policy",
    "Terms & Conditions",
  ];

  return (
    <div className="font-sans">
      {/* 01. Section Header & Accordion Trigger 
          - Directly uses the toggle from useFooter (which handles the width check).
      */}
      <div
        className="relative flex justify-between items-center cursor-pointer min-[767px]:cursor-default"
        onClick={toggle}
      >
        <h2 className="text-[20px]! text-white! font-bold! uppercase tracking-wide">
          Quick Links
        </h2>

        {/* 02. Responsive Toggle Indicator
            - Custom CSS-based Plus/Minus animation for fluid state transitions.
        */}
        <div className="min-[767px]:hidden relative flex items-center justify-center w-5 h-5 text-white/50">
          {/* Vertical Segment (Disappears on Expand) */}
          <span
            className={`absolute w-[2px] h-full bg-current transition-all duration-300 ease-in-out ${
              isOpen
                ? "rotate-90 opacity-0 scale-0"
                : "rotate-0 opacity-100 scale-100"
            }`}
          />
          {/* Horizontal Segment (Rotates on Expand) */}
          <span
            className={`absolute h-[2px] w-full bg-current transition-all duration-300 ease-in-out ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {/* Decorative Divider: Mobile Only */}
        <div className="w-full h-0.5 bg-white absolute left-0 bottom-0 min-[767px]:hidden" />
      </div>

      {/* 03. Navigation Link List
          - Visibility controlled by 'isOpen' state on mobile and forced 'block' on desktop.
      */}
      <div className={`${isOpen ? "block" : "hidden"} min-[767px]:block mt-3`}>
        <ul className="list-none p-0 space-y-2">
          {links.map((link) => (
            <li key={link}>
              <button
                className="text-white/50 hover:text-white text-sm! transition-colors duration-300 text-left link-underline"
                onClick={() => console.log(`Navigating to ${link}`)}
              >
                {link}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
