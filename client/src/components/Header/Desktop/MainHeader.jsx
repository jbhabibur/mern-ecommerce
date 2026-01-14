import Logo from "../../../assets/images/logo/logo.avif";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setFocus, setQuery } from "../../../redux/slices/searchSlice";
import { DesktopSearchOverlay } from "../../search/DesktopSearchOverlay"; // নিশ্চিত করুন পাথ ঠিক আছে

export const MainHeader = () => {
  const dispatch = useDispatch();

  return (
    <header className="w-full relative">
      {" "}
      {/* Relative added here */}
      <div className="max-w-[1300px] mx-auto flex items-center justify-between px-8 md:px-16 lg:px-20 py-2">
        {/* Left: Logo */}
        <div className="flex-shrink-0 scale-120">
          <img src={Logo} alt="Dorjibari logo" className="h-10 w-auto" />
        </div>

        {/* Right Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end items-center gap-x-4">
            <Link className="no-underline text-black font-normal text-sm">
              Outlets
            </Link>

            {/* Search Container: এই পুরো ডিভটি হোভার কন্ট্রোল করবে */}
            <div className="relative">
              <div className="w-48 bg-[#FAFAFA] flex items-center border-b border-gray-200 px-3 py-1.5">
                <input
                  onFocus={(e) => {
                    e.stopPropagation();
                    dispatch(setFocus(true));
                  }}
                  // onBlur={() => dispatch(setFocus(false))}
                  onChange={(e) => dispatch(setQuery(e.target.value))}
                  className="outline-none focus:placeholder-transparent w-full bg-transparent"
                  type="search"
                  placeholder="Search"
                />
                <Search className="w-4 h-4 shrink-0 text-gray-500" />
              </div>

              {/* Overlay component renders here */}
              <DesktopSearchOverlay />
            </div>
          </div>

          {/* Cart & Wishlist */}
          <div className="flex gap-x-6 justify-end items-center">
            <div className="flex gap-x-2 cursor-pointer group items-center">
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-sm">Shopping Cart</span>
              <span className="bg-[#FFE5E8] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                0
              </span>
            </div>
            <div className="flex gap-x-2 cursor-pointer items-center group">
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-sm">My Wish List</span>
            </div>
            <span className="text-sm cursor-pointer hover:underline">
              Sign In
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
