import React from "react";
import { X, MoveLeft } from "lucide-react";
import { MobileMenuItem } from "./MobileMenuItem";

export const MobileDrawer = ({
  isOpen,
  onClose,
  activeSubMenu,
  setActiveSubMenu,
  navigationData,
}) => (
  <div
    className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}
  >
    <div
      className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    />

    <div
      className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col overflow-hidden`}
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white z-10 border-b border-gray-50">
        {activeSubMenu ? (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveSubMenu(null)}
          >
            <div className="flex items-center gap-2">
              <MoveLeft className="w-5 h-5 text-gray-700" />
              <h2 className="text-[13px] font-bold uppercase tracking-wide">
                {activeSubMenu.label}
              </h2>
            </div>
          </div>
        ) : (
          <h2 className="text-lg font-bold leading-none">Menu</h2>
        )}
        <X className="w-6 h-6 cursor-pointer text-gray-700" onClick={onClose} />
      </div>

      <div className="relative flex-1 overflow-hidden">
        {/* Main Menu Layer */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out ${activeSubMenu ? "-translate-x-full" : "translate-x-0"} overflow-y-auto`}
        >
          {navigationData.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => item.children && setActiveSubMenu(item)}
              className="cursor-pointer border-b border-gray-50"
            >
              <MobileMenuItem {...item} />
            </div>
          ))}
        </div>

        {/* Sub-Menu Layer */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-in-out bg-white ${activeSubMenu ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}
        >
          {activeSubMenu?.children?.map((item, index) => (
            <div
              key={item.id || index}
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
