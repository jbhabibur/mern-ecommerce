import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import { MainHeader } from "./Desktop/MainHeader";
import { MegaMenu } from "./Desktop/MegaMenu";
import { MobileHeader } from "./Mobile/MobileHeader";
import { StickyHeader } from "./StickyHeader";

export const HeaderManager = () => {
  // Destructure logic from the custom hook
  const { isMobile, showSticky, headerRef } = useHeaderLogic();

  return (
<<<<<<< HEAD
    // Attach the ref here to measure the total header area height
    <div ref={headerRef} className="relative w-full">
      {/* Conditional rendering based on screen size */}
=======
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
>>>>>>> feature/dynamic-categories
      {isMobile ? (
        <MobileHeader />
      ) : (
        <>
<<<<<<< HEAD
          <MainHeader /> <MegaMenu />
        </>
      )}

      {/* Sticky header appears based on scroll logic */}
      {showSticky && <StickyHeader />}
=======
          <MainHeader />
          <MegaMenu />
        </>
      )}

      {/* StickyHeader is usually for desktop scroll effects. 
          We disable it on mobile to prevent conflicts.
      */}
      {showSticky && !isMobile && <StickyHeader />}
>>>>>>> feature/dynamic-categories
    </div>
  );
};
