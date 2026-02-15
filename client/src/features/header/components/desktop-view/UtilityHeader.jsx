import { useState } from "react";
import Logo from "../../../../assets/logo.svg";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFocus, setQuery } from "../../../../redux/slices/searchSlice";

import { DesktopSearchOverlay } from "../../../../components/search/DesktopSearchOverlay";
import { cartActions } from "../../../../redux/slices/cartSlice";
import { openAuthDrawer } from "../../../../redux/slices/authDrawerSlice";

// --- IMPORT HOOKS ---
import { useLogout } from "../../../../hooks/useLogout";
import { AccountDropdown } from "../../../auth/components/AccountDropdown";
import { SectionLayout } from "../../../../layout/SectionLayout";

export const UtilityHeader = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const logout = useLogout();

  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  return (
    <SectionLayout>
      <header className="w-full relative px-2">
        <div className="flex items-center justify-between py-2">
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

              <div className="relative">
                <div className="w-48 bg-[#FAFAFA] flex items-center border-b border-gray-200 px-3 py-1.5">
                  <input
                    onFocus={(e) => {
                      e.stopPropagation();
                      dispatch(setFocus(true));
                    }}
                    onChange={(e) => dispatch(setQuery(e.target.value))}
                    className="outline-none focus:placeholder-transparent w-full bg-transparent"
                    type="search"
                    placeholder="Search"
                  />
                  <Search className="w-4 h-4 shrink-0 text-gray-500" />
                </div>
                <DesktopSearchOverlay />
              </div>
            </div>

            {/* Bottom row: Cart, wishlist, and authentication */}
            <div className="flex gap-x-6 justify-end items-center">
              <div
                onClick={() => dispatch(cartActions.setCartOpen(true))}
                className="flex gap-x-2 cursor-pointer group items-center"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-sm">Shopping Cart</span>
                <span className="bg-[#FFE5E8] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {totalQuantity}
                </span>
              </div>

              <div className="flex gap-x-2 cursor-pointer items-center group">
                <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-sm">My Wish List</span>
              </div>

              <span className="flex gap-x-1 text-sm">
                <span className="cursor-pointer link-underline">
                  {isLoggedIn ? (
                    <span onClick={logout}>Log out</span>
                  ) : (
                    <span onClick={() => dispatch(openAuthDrawer())}>
                      Sign In
                    </span>
                  )}
                </span>

                <span>{isLoggedIn ? "/" : "or"}</span>

                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      className="no-underline! text-black! link-underline bg-transparent border-none cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      My Account
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 z-10">
                        <AccountDropdown
                          onClose={() => setIsDropdownOpen(false)}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    className="no-underline! text-black! link-underline"
                    href="/account/register"
                  >
                    Create an Account
                  </a>
                )}
              </span>
            </div>
          </div>
        </div>
      </header>
    </SectionLayout>
  );
};
