import React from "react";
import { Home, Search, LayoutGrid, User, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openAuthDrawer } from "../../redux/slices/authDrawerSlice";
import { cartActions } from "../../redux/slices/cartSlice";

export const BottomNavigation = () => {
  const dispatch = useDispatch();

  // 1. Get cart count from Redux state
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const { isCartOpen } = useSelector((state) => state.cart);

  // 2. Handle navigation item clicks
  const handleItemClick = (label) => {
    if (label === "Account") {
      dispatch(openAuthDrawer());
    }

    if (label === "Cart") {
      dispatch(cartActions.setCartOpen(!isCartOpen));
    }
    // You can add other navigation logic here (e.g., using useNavigate)
  };

  const navItems = [
    { icon: <Home size={24} />, label: "Home", count: null },
    { icon: <Search size={24} />, label: "Search", count: null },
    { icon: <LayoutGrid size={24} />, label: "Collection", count: null },
    { icon: <User size={24} />, label: "Account", count: null },
    { icon: <ShoppingBag size={24} />, label: "Cart", count: totalQuantity }, // Dynamic count from Redux
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-2 flex justify-between items-center z-50 md:hidden">
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={() => handleItemClick(item.label)} // Click event handler
          className="flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors hover:text-black text-gray-700"
        >
          <div className="relative">
            {item.icon}

            {/* Cart Badge - Only shows if label is 'Cart' and count is greater than 0 */}
            {item.label === "Cart" && item.count > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {item.count}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium leading-none">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
