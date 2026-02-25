import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Package,
  Heart,
  Star,
  XCircle,
  LogOut,
} from "lucide-react";
import { useLogout } from "../../../hooks/useLogout";

export const AccountDropdown = ({ onClose, isOpen }) => {
  const logout = useLogout();
  const [isMounted, setIsMounted] = useState(false);

  // Trigger animation after the component mounts to handle the slide effect
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isOpen]);

  const menuItems = [
    {
      label: "Manage My Account",
      icon: <UserCircle size={18} />,
      path: "/account",
    },
    {
      label: "My Orders",
      icon: <Package size={18} />,
      path: "/account/orders",
    },
    {
      label: "My Wishlist",
      icon: <Heart size={18} />,
      path: "/account/wishlist",
    },

    {
      label: "My Returns",
      icon: <XCircle size={18} />,
      path: "/account/returns",
    },
    {
      label: "My Cancellations",
      icon: <XCircle size={18} />,
      path: "/account/cancellations",
    },
    { label: "My Reviews", icon: <Star size={18} />, path: "/account/reviews" },
  ];

  return (
    <>
      {/* Mobile Backdrop: Closes the menu when clicking outside on mobile */}
      <div
        className={`fixed inset-0 bg-black/5 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`
          /* Position Logic: Absolute for Desktop, Fixed for Mobile */
          absolute md:right-0 z-50 bg-white border border-gray-200 shadow-lg transition-all duration-300 ease-in-out
          
          /* Mobile Specific: Top Slide-down & Full Width */
          max-md:fixed max-md:top-[52px] max-md:left-0 max-md:right-0 max-md:border-x-0 max-md:w-full
          ${isMounted ? "max-md:translate-y-0 max-md:opacity-100" : "max-md:-translate-y-5 max-md:opacity-0"}
          
          /* Desktop Specific: Original Box UI */
          md:mt-2 md:w-72 md:rounded-sm md:opacity-100 md:translate-y-0
        `}
      >
        {/* Pointer Arrow: Visible only on Desktop */}
        <div className="hidden md:block absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>

        <div className="relative bg-white py-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-gray-700! hover:bg-gray-50 transition-colors no-underline!"
            >
              <span className="text-gray-400">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <hr className="my-1 border-gray-100" />

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-400">
              <LogOut size={18} />
            </span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
