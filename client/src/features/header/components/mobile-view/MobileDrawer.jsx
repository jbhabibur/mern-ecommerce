import React, { useEffect } from "react";
import { X, MoveLeft } from "lucide-react";
import { MobileMenuItem } from "./MobileMenuItem";
import { createPortal } from "react-dom";

export const MobileDrawer = ({
  isOpen,
  onClose,
  activeSubMenu,
  setActiveSubMenu,
  navigationData,
}) => {
  // Logic to handle scroll locking
  useEffect(() => {
    if (isOpen) {
      // Get the current scroll position
      const scrollY = window.scrollY;

      // Fix the body position to prevent ANY scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Retrieve the scroll position from the inline style
      const scrollY = document.body.style.top;

      // Reset styles
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // Restore scroll position so user doesn't jump to top
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNav = (slugValue) => {
    if (!slugValue) return;
    onClose();

    const slugs = {
      "/": "/",
      home: "/",
      contact: "/contact",
      "contact-us": "/contact",
      offers: "/offers",
      login: "/account/login",
      register: "/account/register",
      wishlist: "/wishlist",
    };

    const targetPath = slugs[slugValue] || `/categories/${slugValue}`;

    setTimeout(() => {
      window.location.href = targetPath;
    }, 300);
  };

  const handleItemClick = (item) => {
    if (item.children && item.children.length > 0) {
      setActiveSubMenu(item);
    } else {
      handleNav(item.slug);
    }
  };

  const drawerContent = (
    <div
      className={`fixed inset-0 z-[999] transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Overlay: touch-none is key for mobile */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 touch-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white z-10 border-b border-gray-50">
          {activeSubMenu ? (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveSubMenu(null)}
            >
              <MoveLeft className="w-5 h-5 text-gray-700" />
              <h2 className="text-[13px]! m-0 font-bold uppercase">
                {activeSubMenu.label}
              </h2>
            </div>
          ) : (
            <h2 className="text-lg font-bold">Menu</h2>
          )}
          <X className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>

        {/* Content Area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Main Menu */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ${activeSubMenu ? "-translate-x-full" : "translate-x-0"} overflow-y-auto`}
          >
            {navigationData.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleItemClick(item)}
                className="cursor-pointer border-b border-gray-50"
              >
                <MobileMenuItem {...item} />
              </div>
            ))}
          </div>

          {/* Sub Menu */}
          <div
            className={`absolute inset-0 transition-transform duration-300 bg-white ${activeSubMenu ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}
          >
            {activeSubMenu && (
              <div
                onClick={() => handleNav(activeSubMenu.slug)}
                className="cursor-pointer border-b border-gray-100 bg-gray-50/50"
              >
                <div className="px-4 py-4 text-[13px] font-semibold uppercase">
                  Go To {activeSubMenu.label}
                </div>
              </div>
            )}
            {activeSubMenu?.children?.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleItemClick(item)}
                className="cursor-pointer border-b border-gray-50"
              >
                <MobileMenuItem {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
