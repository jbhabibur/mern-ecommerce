import React, { useState } from "react";
import { Search, Menu, Moon, Sun, X, LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router";
import { NotificationDropdown } from "../features/notifications/NotificationDropdown";

export const Header = ({ toggleSidebar }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return "AD";
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 backdrop-blur-md bg-theme-base/80 border-b border-theme-line">
      {/* LEFT: Menu & Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg lg:hidden hover:bg-theme-sub"
        >
          <Menu size={20} className="text-theme-front" />
        </button>

        <div className="relative hidden md:block w-full max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border text-sm bg-theme-sub border-theme-line text-theme-front outline-none focus:border-theme-act"
          />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
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

        {/* NOTIFICATIONS COMPONENT */}
        <NotificationDropdown
          isOpen={notificationsOpen}
          setIsOpen={setNotificationsOpen}
        />

        <div className="hidden sm:block w-px h-6 bg-theme-line mx-1"></div>

        {/* PROFILE SECTION */}
        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-theme-front">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : "Admin"}
              </p>
              <p className="text-xs text-theme-muted capitalize">
                {user?.role || "Administrator"}
              </p>
            </div>
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  className="w-9 h-9 rounded-full border border-theme-line object-cover"
                  alt="avatar"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-theme-act text-theme-actfg flex items-center justify-center text-xs font-bold border border-theme-line uppercase">
                  {getInitials()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-theme-base rounded-full"></span>
            </div>
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-theme-base border border-theme-line rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                >
                  <LogOut size={16} /> Logout Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
