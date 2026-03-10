import React, { useState } from "react";
import { Search, Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export const Header = ({ toggleSidebar }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className="
        h-16 flex items-center justify-between px-4 md:px-6
        sticky top-0 z-40
        backdrop-blur-md
        bg-theme-base/80
        border-b border-theme-line
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg lg:hidden hover:bg-theme-sub transition-colors"
        >
          <Menu size={20} className="text-theme-front" />
        </button>

        {/* Desktop Search */}
        <div className="relative hidden md:block w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
          />

          <input
            type="text"
            placeholder="Search products, orders..."
            className="
              w-full pl-10 pr-3 py-2
              rounded-lg
              border
              text-sm
              outline-none
              bg-theme-sub
              border-theme-line
              text-theme-front
              focus:border-theme-act focus:ring-1 focus:ring-theme-act
              "
          />
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="p-2 md:hidden hover:bg-theme-sub rounded-lg transition-colors"
        >
          <Search size={20} className="text-theme-front" />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-theme-sub transition-colors"
        >
          {isDark ? (
            <Sun size={20} className="text-theme-front" />
          ) : (
            <Moon size={20} className="text-theme-front" />
          )}
        </button>

        {/* NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg hover:bg-theme-sub relative transition-colors"
          >
            <Bell size={20} className="text-theme-front" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-theme-base border border-theme-line rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-theme-line text-sm font-semibold text-theme-front">
                Notifications
              </div>

              <div className="max-h-60 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-theme-sub cursor-pointer">
                  <p className="text-sm font-medium text-theme-front">
                    New order received
                  </p>
                  <p className="text-xs text-theme-muted">2 minutes ago</p>
                </div>

                <div className="px-4 py-3 hover:bg-theme-sub cursor-pointer">
                  <p className="text-sm font-medium text-theme-front">
                    Product stock low
                  </p>
                  <p className="text-xs text-theme-muted">10 minutes ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-theme-line"></div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-theme-front">Admin</p>
            <p className="text-xs text-theme-muted">Administrator</p>
          </div>

          <div className="relative">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              className="w-9 h-9 rounded-full border border-theme-line"
              alt="avatar"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-theme-base rounded-full"></span>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      {mobileSearchOpen && (
        <div className="absolute inset-0 bg-theme-base flex items-center px-4 md:hidden z-50">
          <Search size={20} className="text-theme-muted mr-2" />
          <input
            autoFocus
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-sm text-theme-front"
          />
          <button onClick={() => setMobileSearchOpen(false)}>
            <X size={20} className="text-theme-front" />
          </button>
        </div>
      )}
    </header>
  );
};
