import { UtilityHeader } from "./desktop-view/UtilityHeader";
import { MainNavigationMenu } from "./desktop-view/MainNavigationMenu";
import { useHeaderController } from "../hooks/useHeaderController";
import { MobileHeader } from "./mobile-view/MobileHeader";
import { StickyHeader } from "./StickyHeader";
import { AnimatePresence } from "framer-motion";

export const HeaderController = () => {
  const { isMobile, showSticky, headerRef } = useHeaderController();

  return (
    <header>
      {isMobile ? (
        <MobileHeader />
      ) : (
        <>
          {/* This div is the reference point. 
              Once it leaves the viewport and user scrolls up, StickyHeader appears.
          */}
          <div ref={headerRef} className={showSticky ? "hidden" : "block"}>
            <UtilityHeader />
            <MainNavigationMenu />
          </div>

          <AnimatePresence>{showSticky && <StickyHeader />}</AnimatePresence>
        </>
      )}
    </header>
  );
};
