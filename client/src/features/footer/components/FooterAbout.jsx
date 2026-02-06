import React from "react";

/**
 * FooterAbout Component
 * * Provides brand identity and corporate narrative.
 * - Standardized heading and typography for cross-column consistency.
 * - Includes a historical brief and a call-to-action (CTA) for deeper engagement.
 */
export const FooterAbout = () => {
  return (
    <div className="font-sans">
      {/* Primary Column Header: Brand Identity */}
      <h2 className="text-[20px]! text-white! font-bold! uppercase tracking-wide">
        About Us
      </h2>

      <div className="text-[15px]! mt-3">
        {/* Narrative Section: Brand Mission and Heritage */}
        <div className="text-white/50">
          <h3 className="font-bold! text-sm! uppercase mb-1">
            Redefining Men’s Fashion in Bangladesh
          </h3>

          <p className="text-sm! leading-5 mt-3">
            Established in 2006 by{" "}
            <span className="text-white font-medium">Habibur Rahman</span>, MENS
            FASHION has been a pioneering force in the Bangladeshi men's fashion
            industry. With a commitment to quality, style, and innovation, we
            have grown to become a beloved brand with 47 outlets across the
            country, offering a wide range of meticulously crafted clothing and
            accessories for men.
          </p>
        </div>

        {/* Actionable Link: Secondary Narrative Navigation */}
        <div className="text-white/50 text-sm! mt-4">
          <p className="m-0">For more about our journey</p>

          <button
            className="link-underline hover:text-white transition-colors font-medium"
            onClick={() => console.log("Navigate to About Page")}
          >
            See more
          </button>
        </div>
      </div>
    </div>
  );
};
