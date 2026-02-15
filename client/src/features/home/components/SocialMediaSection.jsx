import React from "react";
import { SectionLayout } from "../../../layout/SectionLayout";
import { MultiItemCarousel } from "../../../components/shared/MultiItemCarousel";

export const SocialMediaSection = () => {
  return (
    <SectionLayout bgColor="bg-[#FAFAFA] py-5">
      {/* Instagram Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <h2 className="text-lg! font-bold! text-gray-800 uppercase m-0">
            MENS FASHION ON INSTAGRAM
          </h2>
        </div>
      </div>

      <MultiItemCarousel />

      {/* Footer Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-[#222] text-white px-10 py-2.5 text-sm font-bold tracking-widest hover:bg-black transition-all uppercase">
          View Gallery
        </button>
      </div>
    </SectionLayout>
  );
};
