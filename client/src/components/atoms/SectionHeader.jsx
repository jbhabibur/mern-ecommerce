import React from "react";

/**
 * SectionHeader Component
 * A responsive header with a centered title flanked by horizontal lines,
 * and a "View All" link with a custom underline.
 */
export const SectionHeader = ({ title, linkText }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-2">
      {/* Main Header Row */}
      <div className="flex items-center justify-center w-full">
        <div className="flex-grow h-[2.2px] bg-black"></div>

        {/* Increased horizontal margin (mx) to create the space shown in the image */}
        <h2 className="mx-10 md:mx-20 lg:mx-32 uppercase font-bold! text-[14px]! md:text-[16px]! leading-none! my-0! text-[#232323] flex items-center self-center whitespace-nowrap">
          {title}
        </h2>

        <div className="flex-grow h-[2.2px] bg-black"></div>
      </div>

      {/* Sub-navigation Section */}
      <div className="flex flex-col items-center mt-3">
        <div className="relative group">
          <a
            href="#"
            className="text-[#3c3c3c]! text-sm font-medium transition-colors no-underline!"
          >
            {linkText}
          </a>

          <div className="w-full h-[1.2px] bg-[#3c3c3c]! mt-[2px]"></div>
        </div>
      </div>
    </div>
  );
};
