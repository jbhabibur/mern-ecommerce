import React from "react";
import { Home, Search, LayoutGrid, User, ShoppingBag } from "lucide-react";

// Arrow function for the navigation component
export const BottomNavigation = () => {
  // Navigation items array for cleaner mapping
  const navItems = [
    { icon: <Home size={24} />, label: "Home", count: null },
    { icon: <Search size={24} />, label: "Search", count: null },
    { icon: <LayoutGrid size={24} />, label: "Collection", count: null },
    { icon: <User size={24} />, label: "Account", count: null },
    { icon: <ShoppingBag size={24} />, label: "Cart", count: 0 }, // Initial cart count
  ];

  return (
    // Fixed at bottom, visible only on small screens (md:hidden)
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-2 flex justify-between items-center z-50 md:hidden">
      {navItems.map((item, index) => (
        <button
          key={index}
          className="flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors hover:text-blue-600 text-gray-700"
        >
          <div className="relative">
            {item.icon}
            {/* Cart Badge - Only shows if count is defined */}
            {item.count !== null && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {item.count}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium leading-none">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
