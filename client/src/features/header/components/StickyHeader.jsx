import { createPortal } from "react-dom"; // 1. Import createPortal
import Logo from "/favicon.png";
import { MainNavigationMenu } from "../../header/components/desktop-view/MainNavigationMenu";
import { Search, ShoppingBag } from "lucide-react";

export const StickyHeader = () => {
  // 2. Define the content of your header
  const headerContent = (
    <div className="fixed top-0 left-0 w-full z-50 flex gap-x-3 bg-black">
      {/* Added 'fixed top-0' to ensure it actually behaves like a sticky/fixed header */}
      <div className="p-2 flex items-center justify-center">
        <img
          className="outline-5 outline-white w-24"
          src={Logo}
          alt="Mensfaashion logo"
        />
      </div>
      <div className="flex-1">
        {" "}
        {/* Added flex-1 to push icons to the right if needed */}
        <MainNavigationMenu />
      </div>
      <div className="flex gap-x-3 items-center justify-center">
        <div className="border-l border-[#D1D1D1] h-full flex items-center justify-center px-2">
          <Search className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-125" />
        </div>
        <div className="border-l border-[#D1D1D1] h-full flex items-center justify-center px-2">
          <div className="relative">
            <ShoppingBag className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-125" />
            <span className="absolute -top-1 -right-1 bg-[#FFE5E8] rounded-full w-4 h-4 flex items-center justify-center text-xs">
              0
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. Render into a DOM node (ensure <div id="header-portal"></div> exists in your index.html)
  const mountNode = document.getElementById("header-portal") || document.body;

  return createPortal(headerContent, mountNode);
};
