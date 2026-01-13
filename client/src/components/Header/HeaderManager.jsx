import React from "react";
import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import { MainHeader } from "./Desktop/MainHeader";
import { MegaMenu } from "./Desktop/MegaMenu";
import { MobileHeader } from "./Mobile/MobileHeader";
import { StickyHeader } from "./StickyHeader";

export const HeaderManager = () => {
  // Destructure logic from the custom hook
  const { isMobile, showSticky, headerRef } = useHeaderLogic();

  return (
    // If mobile is active, we make sure the wrapper itself is sticky
    <div
      ref={headerRef}
      className={`w-full ${
        isMobile ? "sticky top-0 z-[999] bg-white" : "relative"
      }`}
    >
      {/* Logic: If mobile, render MobileHeader inside the sticky container.
          If desktop, render MainHeader and MegaMenu normally.
      */}
      {isMobile ? (
        <MobileHeader />
      ) : (
        <>
          <MainHeader />
          <MegaMenu />
        </>
      )}

      {/* StickyHeader is usually for desktop scroll effects. 
          We disable it on mobile to prevent conflicts.
      */}
      {showSticky && !isMobile && <StickyHeader />}
    </div>
  );
};
