import React, { useEffect } from "react";
import { X, MoveLeft } from "lucide-react";
import { MobileMenuItem } from "./MobileMenuItem";

export const MobileDrawer = ({
  isOpen,
  onClose,
  activeSubMenu,
  setActiveSubMenu,
  navigationData,
}) => {
  // Lock body scroll when the drawer is open to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup to remove scroll lock when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  /**
   * Handles navigation based on the slug value provided.
   * Maps specific slugs to direct paths or defaults to the categories route.
   */
  const handleNav = (slugValue) => {
    if (!slugValue) return;

    // Close drawer immediately for better UX
    onClose();

    let targetPath;
    if (slugValue === "/" || slugValue === "home") {
      targetPath = "/";
    } else if (slugValue === "contact" || slugValue === "contact-us") {
      targetPath = "/contact";
    } else if (slugValue === "offers") {
      targetPath = "/offers";
    } else if (slugValue === "login") {
      targetPath = "/account/login";
    } else if (slugValue === "register") {
      targetPath = "/account/register";
    } else if (slugValue === "wishlist") {
      targetPath = "/wishlist";
    } else {
      targetPath = `/categories/${slugValue}`;
    }

    // Delay navigation slightly to allow drawer closing animation to finish
    setTimeout(() => {
      window.location.href = targetPath;
    }, 300);
  };

  /**
   * Decides whether to open a sub-menu or navigate directly
   * depending on if the item has children.
   */
  const handleItemClick = (item) => {
    if (item.children && item.children.length > 0) {
      setActiveSubMenu(item);
    } else {
      handleNav(item.slug);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}
    >
      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col overflow-hidden`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between px-4 py-3 bg-white z-10 border-b border-gray-50">
          {activeSubMenu ? (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveSubMenu(null)}
            >
              <div className="flex items-center gap-2">
                <MoveLeft className="w-5 h-5 text-gray-700" />
                <h2 className="text-[13px]! m-0 font-bold uppercase tracking-wide">
                  {activeSubMenu.label}
                </h2>
              </div>
            </div>
          ) : (
            <h2 className="text-lg font-bold">Menu</h2>
          )}
          <X
            className="w-6 h-6 cursor-pointer text-gray-700"
            onClick={onClose}
          />
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* Main Menu Layer (Top Level) */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ease-in-out ${activeSubMenu ? "-translate-x-full" : "translate-x-0"} overflow-y-auto`}
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

          {/* Sub-Menu Layer (Second Level) */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ease-in-out bg-white ${activeSubMenu ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}
          >
            {/* Clickable Parent Item to visit the main category page */}
            {activeSubMenu && (
              <div
                onClick={() => handleNav(activeSubMenu.slug)}
                className="cursor-pointer border-b border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors"
              >
                <div className="px-4 py-4 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-gray-900 uppercase tracking-tight">
                    Go To {activeSubMenu.label}
                  </span>
                </div>
              </div>
            )}

            {/* Sub-Menu Children Listing */}
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
};
