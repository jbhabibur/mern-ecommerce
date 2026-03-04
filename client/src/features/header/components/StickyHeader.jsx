import { useState } from "react"; // Added useState
import { createPortal } from "react-dom";
import Logo from "/favicon.png";
import { MainNavigationMenu } from "../../header/components/desktop-view/MainNavigationMenu";
import { Search, ShoppingBag } from "lucide-react";
import { cartActions } from "../../../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { StickySearchOverlay } from "../../search/components/StickySearchOverlay";
import { motion } from "framer-motion";

export const StickyHeader = () => {
  const dispatch = useDispatch();

  // 1. Initialize state for the search overlay
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const headerContent = (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 flex gap-x-3 bg-black"
    >
      <div className="p-2 flex items-center justify-center cursor-pointer">
        <a href="/">
          <img
            className="outline-5 outline-white w-24"
            src={Logo}
            alt="Mensfaashion logo"
          />
        </a>
      </div>

      <div className="flex-1">
        <MainNavigationMenu />
      </div>

      <div className="flex gap-x-3 items-center justify-center">
        <div className="border-l border-[#D1D1D1] h-full flex items-center justify-center px-2">
          {/* 2. Added onClick to trigger the search overlay */}
          <Search
            onClick={() => setIsSearchOpen(true)}
            className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-125"
          />
        </div>

        <div className="border-l border-[#D1D1D1] h-full flex items-center justify-center px-2">
          <div
            onClick={() => dispatch(cartActions.setCartOpen(true))}
            className="relative"
          >
            <ShoppingBag className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-125" />
            <span className="absolute -top-1 -right-1 bg-[#FFE5E8] rounded-full w-4 h-4 flex items-center justify-center text-xs">
              0
            </span>
          </div>
        </div>

        <StickySearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    </motion.div>
  );

  // 3. Ensure your index.html has <div id="header-portal"></div>
  // or it will default to document.body
  const mountNode = document.getElementById("header-portal") || document.body;

  return createPortal(headerContent, mountNode);
};
