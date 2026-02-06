import React from "react";

// Layout & UI Components
import { SectionLayout } from "../../../layout/SectionLayout";
import { FooterContact } from "./FooterContact";
import { FooterAbout } from "./FooterAbout";
import { FooterLinks } from "./FooterLinks";
import { FooterSocial } from "./FooterSocial";
import { FooterBottom } from "./FooterBottom";

// Hooks
import { useFooter } from "../hooks/useFooter";

/**
 * Footer Component
 * * Responsive Strategy:
 * - Mobile (< 767px): Vertical stack for optimal readability.
 * - Tablet (767px - 990px): 3-column layout; Social section spans full width at the bottom.
 * - Desktop (>= 991px): 4-column side-by-side layout with weighted "About" section (1.5fr).
 */
export const Footer = () => {
  const { isQuickLinksOpen, toggleQuickLinks } = useFooter();

  return (
    <SectionLayout bgColor="bg-[#1a1a1a]">
      <div>
        {/* Main Footer Grid Configuration
          Handles transition from single column (mobile) to multi-column (tablet/desktop)
        */}
        <div className="grid grid-cols-1 min-[767px]:grid-cols-3 min-[991px]:grid-cols-[1fr_1.5fr_1fr_1fr] gap-y-10 gap-x-8 py-8">
          {/* Section: Contact Information */}
          <div className="flex flex-col">
            <FooterContact />
          </div>

          {/* Section: Brand Identity & Narrative */}
          <div className="flex flex-col">
            <FooterAbout />
          </div>

          {/* Section: Navigation & Quick Links (Mobile Accordion) */}
          <div className="flex flex-col">
            <FooterLinks isOpen={isQuickLinksOpen} toggle={toggleQuickLinks} />
          </div>

          {/* Section: Social Media Connectivity
            Spans full width on tablet for balanced alignment; sits in-line on desktop.
          */}
          <div className="col-span-1 min-[767px]:col-span-3 min-[991px]:col-span-1 pt-6 min-[991px]:border-none min-[991px]:pt-0">
            <FooterSocial />
          </div>
        </div>

        {/* Post-Footer: Legal, Copyright, and Credentials */}
        <FooterBottom />
      </div>
    </SectionLayout>
  );
};
