import React, { useState } from "react";
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

// Redux কানেকশন
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../redux/slices/cartSlice";

export const MobileHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const dispatch = useDispatch();

  // ১. রিডাক্স স্টোর থেকে কার্ট কাউন্ট নেওয়া
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

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

          {/* ২. কার্ট আইকন লজিক: ক্লিক করলে ড্রয়ার ওপেন হবে */}
          <div
            className="relative cursor-pointer"
            onClick={() => dispatch(cartActions.setCartOpen(true))}
          >
            <ShoppingBag className="w-6 h-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalQuantity}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* --- SLIDING SIDE DRAWER (Menu) --- */}
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
          } flex flex-col overflow-hidden`}
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

            <X
              className="w-6 h-6 cursor-pointer text-gray-700"
              onClick={toggleDrawer}
            />
          </div>

          {/* Navigation Container */}
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
