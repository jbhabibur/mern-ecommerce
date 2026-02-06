import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { SocialIcon } from "../../../components/atoms/SocialIcon";

/**
 * FooterSocial Component
 * * Manages brand presence across social media platforms.
 * - Standardized layout to maintain visual symmetry with adjacent columns.
 * - Utilizes reusable Atomic components for icon rendering and hover states.
 */
export const FooterSocial = () => {
  return (
    <div className="font-sans">
      {/* Section Header: Social Connectivity */}
      <h2 className="text-[20px]! text-white! font-bold! uppercase tracking-wide">
        Social
      </h2>

      {/* 01. Icon Repository Container
          - Uses a flex-row layout with consistent spacing for touch targets.
      */}
      <div className="mt-3">
        <div className="flex gap-3">
          <SocialIcon
            href="#"
            icon={<Facebook size={18} fill="currentColor" />}
          />
          <SocialIcon href="#" icon={<Instagram size={18} />} />
          <SocialIcon
            href="#"
            icon={<Youtube size={20} fill="currentColor" />}
          />
        </div>
      </div>
    </div>
  );
};
