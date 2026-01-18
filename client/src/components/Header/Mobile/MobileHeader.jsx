import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  X,
  User,
  Heart,
  MoveLeft,
  Menu,
  Search,
  ShoppingBag,
} from "lucide-react";
import { MobileMenuItem } from "./MobileMenuItem";
import { setClicked } from "../../../redux/slices/searchSlice";
import Logo from "../../../assets/images/logo/logo.avif";
import { NAVIGATION_DATA_MOBILE } from "../../../constants/navigationData";

export const MobileHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (isDrawerOpen) setActiveSubMenu(null);
  };

  return (
    <>
      {/* --- MOBILE NAVIGATION BAR --- */}
      <nav className="flex items-center justify-between px-2 py-2 bg-white border-b sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Menu className="w-7 h-7 cursor-pointer" onClick={toggleDrawer} />
          <Search
            onClick={() => dispatch(setClicked(true))}
            className="w-6 h-6 cursor-pointer"
          />
        </div>

        <div className="flex items-center font-bold text-xl tracking-tighter uppercase">
          <img src={Logo} alt="Logo" className="h-8 w-auto ml-1" />
        </div>

        <div className="flex items-center gap-4">
          <User className="w-6 h-6 cursor-pointer" />
          <div className="relative">
            <ShoppingBag className="w-6 h-6 cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </div>
        </div>
      </nav>

      {/* --- SLIDING SIDE DRAWER --- */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${isDrawerOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={toggleDrawer}
        />

        <div
          className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col overflow-hidden`} // Added overflow-hidden to contain the slide
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-white z-10">
            {activeSubMenu ? (
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setActiveSubMenu(null)}
              >
                {/* Icon and Text vertical alignment fix */}
                <div className="flex items-center gap-2">
                  <MoveLeft className="w-5 h-5 text-gray-700" />
                  <h2 className="text-[13px]! font-bold! uppercase leading-none mt-2">
                    {activeSubMenu.label}
                  </h2>
                </div>
              </div>
            ) : (
              <h2 className="text-lg font-bold leading-none">Menu</h2>
            )}

            <X
              className="w-6 h-6 cursor-pointer text-gray-700"
              onClick={toggleDrawer}
            />
          </div>

          {/* Navigation Container with Sliding Effect */}
          <div className="relative flex-1 overflow-hidden">
            {/* Main Menu Layer */}
            <div
              className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                activeSubMenu ? "-translate-x-full" : "translate-x-0"
              } overflow-y-auto`}
            >
              {NAVIGATION_DATA_MOBILE.map((item, index) => (
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
              className={`absolute inset-0 transition-transform duration-300 ease-in-out bg-white ${
                activeSubMenu ? "translate-x-0" : "translate-x-full"
              } overflow-y-auto`}
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
    </>
  );
};
