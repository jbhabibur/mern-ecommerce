import Logo from "../../assets/images/logo/logo.avif";
import { MegaMenu } from "../../../components/Header/Desktop/MegaMenu";

import { Search, ShoppingBag } from "lucide-react";

export const StickyHeader = () => {
  return (
    <div className="flex gap-x-3 bg-black">
      <div className="p-2 flex items-center justify-center">
        <img
          className="outline-5 outline-white w-24"
          src={Logo}
          alt="Dorjibari logo"
        />
      </div>
      <div>
        <MegaMenu />
      </div>
      <div className="flex gap-x-3  items-center justify-center">
        <div className="border-l border-[#D1D1D1] h-full flex items-center justify-center px-2">
          <Search className="text-white cursor-pointer transform transition-transform duration-300 hover:scale-125" />
        </div>
        <div className=" border-l border-[#D1D1D1] h-full flex items-center justify-center px-2">
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
};
