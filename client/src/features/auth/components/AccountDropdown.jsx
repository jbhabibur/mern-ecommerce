import React from "react";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Package,
  Heart,
  Star,
  XCircle,
  LogOut,
} from "lucide-react";
import { useLogout } from "../../../hooks/useLogout"; // Apnar banano hook

export const AccountDropdown = ({ onClose }) => {
  const logout = useLogout();

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
      label: "My Wishlist & Followed Stores",
      icon: <Heart size={18} />,
      path: "/account/wishlist",
    },
    { label: "My Reviews", icon: <Star size={18} />, path: "/account/reviews" },
    {
      label: "My Returns & Cancellations",
      icon: <XCircle size={18} />,
      path: "/account/returns",
    },
  ];

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded-sm z-50">
      {/* Pointer Arrow */}
      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>

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
          onClick={logout}
          className="w-full flex items-center gap-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-400">
            <LogOut size={18} />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};
