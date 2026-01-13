import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SocialIcon } from "../components/atoms/SocialIcon";
import paymentMethodsImage from "../assets/images/SSLCOMMERZ-Payment-img.png";

export const Footer = () => {
  // State to manage Quick Links collapse/expand on mobile
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);

  return (
    <footer className="w-full bg-[#1a1a1a] text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-6 lg:px-12">
        {/* 1. Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Contact Us Section - Static */}
          <div className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-wider">
              Contact Us
            </h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <h3 className="text-white font-semibold uppercase">
                Head Office
              </h3>
              <p>
                Ambia Tower (7th Floor), 4/1
                <br />
                Simson Road, Kotwali, Dhaka,
                <br />
                Bangladesh, 1100.
              </p>
              <p>Hotline: +8802-57390880</p>
              <p>
                Email:{" "}
                <span className="hover:text-yellow-500 cursor-pointer transition-colors">
                  info@dorjibari.com.bd
                </span>
              </p>
              <div className="pt-4 font-bold leading-tight">
                To know the{" "}
                <span className="text-yellow-500 italic">
                  all stores location
                </span>
                <br />
                <a href="#" className="text-yellow-500 hover:underline">
                  Click here
                </a>
              </div>
            </div>
          </div>

          {/* About Us Section - Static */}
          <div className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-wider">
              About Us
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>Dorjibari – Redefining Men's Fashion in Bangladesh.</p>
              <p>
                Established in 2008 by{" "}
                <span className="font-bold text-gray-100">
                  Md. Fazlur Rahman
                </span>
                , Dorjibari has been a pioneering force in the fashion industry.
              </p>
              <button className="text-gray-400 hover:text-white underline decoration-gray-600">
                See more
              </button>
            </div>
          </div>

          {/* Quick Links Section - Dynamic (Accordion on Mobile) */}
          <div className="space-y-4 border-b border-gray-800 md:border-none pb-4 md:pb-0">
            {/* Header with toggle for mobile */}
            <div
              className="flex justify-between items-center cursor-pointer md:cursor-default"
              onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
            >
              <h2 className="text-white font-bold text-lg uppercase tracking-wider">
                Quick Links
              </h2>
              <span className="md:hidden text-white">
                {isQuickLinksOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>

            {/* List: Hidden on mobile unless toggled, always visible on desktop */}
            <ul
              className={`${
                isQuickLinksOpen ? "block" : "hidden"
              } md:block space-y-3 text-sm transition-all duration-300`}
            >
              {[
                "About Us",
                "Blog",
                "Privacy Policy",
                "Shipping Policy",
                "Terms & Conditions",
              ].map((link) => (
                <li
                  key={link}
                  className="hover:text-yellow-500 cursor-pointer transition-colors"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Section - Static */}
          <div className="space-y-4">
            <h2 className="text-white font-bold text-lg uppercase tracking-wider">
              Social
            </h2>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={20} />} />
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<Youtube size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
            </div>
          </div>
        </div>

        {/* 2. Payment & Copyright Section */}
        <div className="flex flex-col items-center justify-center space-y-8 pt-10 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={paymentMethodsImage}
              alt="Payment Methods"
              className="w-full max-w-[320px] md:max-w-[600px] h-auto object-contain brightness-90 contrast-125"
            />
          </div>

          <div className="text-center pb-4">
            <p className="text-[10px] md:text-xs text-gray-500 tracking-widest uppercase">
              © 2003-2026, <span className="text-gray-400">Dorjibari</span>. All
              Rights Reserved.
              <span className="block md:inline mt-2 md:mt-0">
                {" "}
                Developed By{" "}
                <span className="text-gray-400 font-semibold">JBHabibur</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
