import Logo from "../../../assets/images/logo/logo.avif";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFocus, setQuery } from "../../../redux/slices/searchSlice";
import { DesktopSearchOverlay } from "../../search/DesktopSearchOverlay";
import { cartActions } from "../../../redux/slices/cartSlice";
import { openAuthDrawer } from "../../../redux/slices/authDrawerSlice";

export const MainHeader = () => {
  const dispatch = useDispatch();

  // Read total cart item quantity from Redux state
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  return (
    <header className="w-full relative">
      {/* `relative` is required for positioning child overlays properly */}
      <div className="max-w-[1300px] mx-auto flex items-center justify-between px-8 md:px-16 lg:px-20 py-2">
        {/* Left section: Brand logo */}
        <div className="flex-shrink-0 scale-120">
          <a href="/">
            <img src={Logo} alt="Dorjibari logo" className="h-10 w-auto" />
          </a>
        </div>

        {/* Right section: Search, cart, wishlist, and auth actions */}
        <div className="flex flex-col space-y-4">
          {/* Top row: Outlet link and search bar */}
          <div className="flex justify-end items-center gap-x-4">
            <Link className="no-underline text-black font-normal text-sm">
              Outlets
            </Link>

            {/* Search container: controls hover & overlay behavior */}
            <div className="relative">
              <div className="w-48 bg-[#FAFAFA] flex items-center border-b border-gray-200 px-3 py-1.5">
                <input
                  onFocus={(e) => {
                    e.stopPropagation();
                    dispatch(setFocus(true)); // Activate search overlay
                  }}
                  // onBlur={() => dispatch(setFocus(false))}
                  onChange={(e) => dispatch(setQuery(e.target.value))} // Update search query
                  className="outline-none focus:placeholder-transparent w-full bg-transparent"
                  type="search"
                  placeholder="Search"
                />
                <Search className="w-4 h-4 shrink-0 text-gray-500" />
              </div>

              {/* Desktop search result overlay */}
              <DesktopSearchOverlay />
            </div>
          </div>

          {/* Bottom row: Cart, wishlist, and authentication */}
          <div className="flex gap-x-6 justify-end items-center">
            {/* Shopping cart button */}
            <div
              onClick={() => dispatch(cartActions.setCartOpen(true))}
              className="flex gap-x-2 cursor-pointer group items-center"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-sm">Shopping Cart</span>

              {/* Show quantity badge (always visible) */}
              <span className="bg-[#FFE5E8] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                {totalQuantity}
              </span>
            </div>

            {/* Wishlist button */}
            <div className="flex gap-x-2 cursor-pointer items-center group">
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-sm">My Wish List</span>
            </div>

            {/* Authentication actions */}
            <span className="flex gap-x-1 text-sm">
              <span
                onClick={() => dispatch(openAuthDrawer())}
                className="cursor-pointer"
              >
                Sign In
              </span>
              <span>or</span>
              <a
                className="no-underline! text-black!"
                href={"/account/register"}
              >
                Create an Account
              </a>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
