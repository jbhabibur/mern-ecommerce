import React from "react";
import { Menu, Search, User, ShoppingBag } from "lucide-react";

export const MobileNavbar = ({
  Logo,
  onMenuClick,
  onSearchClick,
  onUserClick,
  onCartClick,
  totalQuantity,
}) => (
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
      <User onClick={onUserClick} className="w-6 h-6 cursor-pointer" />
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
