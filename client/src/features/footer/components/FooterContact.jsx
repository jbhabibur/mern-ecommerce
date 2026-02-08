import React from "react";

/**
 * FooterContact Component
 * * Manages corporate communication channels and physical presence data.
 * - Displays standardized head office address and contact credentials.
 * - Provides an entry point for the store locator interface.
 */
export const FooterContact = () => (
  <div className="font-sans">
    {/* Section Header: Primary Contact Entry */}
    <h2 className="text-[20px]! text-white! font-bold! uppercase tracking-wide">
      Contact Us
    </h2>

    <div className="text-[15px]! mt-3">
      {/* 01. Corporate Headquarters Information */}
      <div className="text-white/50">
        <h3 className="font-bold! text-sm! uppercase mb-1">Head Office</h3>

        <address className="not-italic text-sm! leading-5">
          Ambia Tower (7th Floor), 4/1 Simson Road, Kotwali, Dhaka, Bangladesh,
          1100.
          <br />
          Hotline: +8802-57390880
          <br />
          Email: info@mensfashion.com.bd
        </address>
      </div>

      {/* 02. Interactive Store Locator CTA */}
      <div className="text-white/50 text-sm!">
        <p className="m-0">To know the all stores location</p>

        <button className="link-underline hover:text-white transition-colors font-medium">
          Click here
        </button>
      </div>
    </div>
  </div>
);
