import React, { useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useOrderNotifications } from "./hooks/useOrderNotifications";

export const NotificationDropdown = ({ isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);
  const { notifications, markAllRead } = useOrderNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-theme-sub relative transition-colors"
      >
        <Bell size={20} className="text-theme-front" />
        {/* Shows badge if there's at least one unread notification */}
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-theme-base animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-theme-base border border-theme-line rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-3 border-b border-theme-line flex justify-between items-center bg-theme-sub/20">
            <span className="text-sm font-semibold text-theme-front">
              Notifications
            </span>
            <button
              onClick={markAllRead}
              className="text-xs text-theme-act hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 hover:bg-theme-sub cursor-pointer transition-colors border-b border-theme-line last:border-0 ${
                    !item.read ? "bg-theme-act/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p
                      className={`text-sm text-theme-front ${!item.read ? "font-bold" : "font-medium"}`}
                    >
                      {item.message}
                    </p>
                    {!item.read && (
                      <span className="w-2.5 h-2.5 bg-theme-act rounded-full mt-1.5"></span>
                    )}
                  </div>

                  {item.amount && (
                    <p className="text-xs text-green-600 font-semibold mt-0.5">
                      Total: ৳{item.amount}
                    </p>
                  )}

                  <p className="text-[10px] text-theme-muted mt-1 uppercase tracking-wider">
                    {item.time}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center text-theme-muted text-sm">
                No notifications found
              </div>
            )}
          </div>

          <button className="w-full py-2 text-xs text-theme-muted bg-theme-sub/50 hover:text-theme-front transition-colors">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};
