import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClicked } from "../../../redux/slices/searchSlice";
import { cartActions } from "../../../redux/slices/cartSlice";
import { openAuthDrawer } from "../../../redux/slices/authDrawerSlice";
import { NAVIGATION_DATA_MOBILE } from "../../../constants/navigationData";
import Logo from "../../../assets/images/logo/logo.avif";

import { MobileNavbar } from "./MobileNavbar";
import { MobileDrawer } from "./MobileDrawer";

export const MobileHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const dispatch = useDispatch();

  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (isDrawerOpen) setActiveSubMenu(null);
  };

  return (
    <>
      <MobileNavbar
        Logo={Logo}
        onMenuClick={toggleDrawer}
        onSearchClick={() => dispatch(setClicked(true))}
        onUserClick={() => dispatch(openAuthDrawer())}
        onCartClick={() => dispatch(cartActions.setCartOpen(true))}
        totalQuantity={totalQuantity}
      />

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        activeSubMenu={activeSubMenu}
        setActiveSubMenu={setActiveSubMenu}
        navigationData={NAVIGATION_DATA_MOBILE}
      />
    </>
  );
};
