import React from "react";
import paymentMethodsImage from "../../../assets/images/SSLCOMMERZ-Payment-img.png";

/**
 * FooterBottom Component
 * * Final section of the footer containing:
 * - Payment Gateway Logos (SSLCOMMERZ).
 * - Copyright Information and Branding.
 * - Developer Attribution.
 */
export const FooterBottom = () => {
  return (
    <div className="w-full">
      {/* 01. Payment Compliance Section
          - Displays supported payment methods with transition effects.
      */}
      <div className="py-3 flex justify-center items-center">
        <img
          src={paymentMethodsImage}
          alt="Available Payment Methods"
          className="max-w-[800px] w-full h-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
        />
      </div>

      {/* 02. Copyright & Branding Section
          - Legal credits and authorship attribution.
          - Responsive: Stacks on mobile, inline on desktop.
      */}
      <div className="text-center py-2 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2">
          {/* Main Copyright Notice */}
          <p className="text-[11px] tracking-[0.2em]! uppercase text-white/40 m-0">
            © 2003-2026,{" "}
            <span className="text-white/60 font-medium">MENS FASHION</span>. All
            Rights Reserved.
          </p>

          {/* Visual Divider (Hidden on Mobile) */}
          <span className="hidden md:inline text-white/20">|</span>

          {/* Developer Attribution Link */}
          <p className="text-[10px] uppercase text-white/30 m-0">
            Developed by{" "}
            <span className="hover:text-[#eab308] transition-colors cursor-pointer">
              JBHABIBUR
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
