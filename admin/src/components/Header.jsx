import React, { useState } from "react";
import { Search, Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export const Header = ({ toggleSidebar }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Context theke theme and toggle nilam
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 transition-colors duration-300
      bg-theme-base border-b border-theme-line"
    >
      {/* Left Side: Toggle & Desktop Search */}
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg lg:hidden transition-colors
            text-theme-front hover:bg-theme-sub"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Search Bar */}
        <div className="relative max-w-md w-full hidden md:block group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search
              size={18}
              className="text-theme-muted group-focus-within:text-theme-front transition-colors"
            />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border leading-5 transition-all sm:text-sm outline-none font-bold tracking-tight
              bg-theme-sub border-theme-line placeholder-theme-muted text-theme-front 
              focus:bg-theme-base focus:border-theme-front"
            placeholder="SEARCH..."
          />
        </div>

        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="p-2 md:hidden text-theme-front"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-4">
        {/* Theme Toggle Button - Now using Context */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-colors text-theme-front hover:bg-theme-sub"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-full relative transition-colors text-theme-front hover:bg-theme-sub"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-theme-act ring-2 ring-theme-base"></span>
          </button>

          {isNotificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-64 md:w-72 shadow-2xl z-50 border
              bg-theme-base border-theme-line animate-in fade-in zoom-in duration-200"
            >
              <div className="px-4 py-3 border-b border-theme-line font-black text-[10px] uppercase tracking-widest text-theme-front">
                Alerts
              </div>
              <div className="max-h-60 overflow-y-auto">
                <a
                  href="#"
                  className="block px-4 py-3 hover:bg-theme-sub border-b border-theme-line transition-colors"
                >
                  <p className="text-[10px] font-bold text-theme-front uppercase">
                    System Update
                  </p>
                  <p className="text-[9px] text-theme-muted mt-1">2 MINS AGO</p>
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:block h-6 w-px bg-theme-line mx-1"></div>

        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer p-1 group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black uppercase tracking-tighter text-theme-front leading-tight">
              Zayed Khan
            </p>
            <p className="text-[9px] font-bold text-theme-muted uppercase">
              Admin
            </p>
          </div>
          <div className="relative">
            <div className="h-8 w-8 md:h-9 md:w-9 border border-theme-front overflow-hidden grayscale group-hover:grayscale-0 transition-all">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zayed"
                className="h-full w-full object-cover bg-theme-sub"
                alt="Avatar"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 block h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-theme-act border-2 border-theme-base"></span>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 bg-theme-base z-50 flex items-center px-4 md:hidden animate-in slide-in-from-top duration-300">
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none font-bold text-theme-front"
            placeholder="SEARCH..."
          />
          <button onClick={() => setIsMobileSearchOpen(false)}>
            <X size={20} className="text-theme-front" />
          </button>
        </div>
      )}
    </header>
  );
};
