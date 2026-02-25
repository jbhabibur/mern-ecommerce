import React, { useState } from "react";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";

import { AccountDropdown } from "../../../auth/components/AccountDropdown";

export const MobileNavbar = ({
  Logo,
  onMenuClick,
  onSearchClick,
  onUserClick,
  onCartClick,
  totalQuantity,
}) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle dropdown state
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="flex items-center justify-between px-2 py-2 bg-white border-b sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Menu className="w-7 h-7 cursor-pointer" onClick={onMenuClick} />
        <Search onClick={onSearchClick} className="w-6 h-6 cursor-pointer" />
      </div>

      <div className="flex items-center font-bold text-xl tracking-tighter uppercase">
        <a href="/">
          <img src={Logo} alt="Logo" className="h-8 w-auto ml-1" />
        </a>
      </div>

      <div className="flex items-center gap-4">
        {/* Wrapper for dropdown positioning */}
        <div className="relative">
          {isLoggedIn && user ? (
            <div
              onClick={toggleDropdown}
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold uppercase cursor-pointer"
            >
              {user.firstName ? user.firstName[0] : "U"}
            </div>
          ) : (
            <User onClick={onUserClick} className="w-6 h-6 cursor-pointer" />
          )}

          {/* Conditional rendering for the account dropdown */}
          {isLoggedIn && isDropdownOpen && (
            <AccountDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </div>

        <div className="relative cursor-pointer" onClick={onCartClick}>
          <ShoppingBag className="w-6 h-6" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {totalQuantity}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};
