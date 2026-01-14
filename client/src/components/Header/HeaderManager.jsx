import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import { MainHeader } from "./Desktop/MainHeader";
import { MegaMenu } from "./Desktop/MegaMenu";
import { MobileHeader } from "./Mobile/MobileHeader";
import { StickyHeader } from "./StickyHeader";

export const HeaderManager = () => {
  // Destructure logic from the custom hook
  const { isMobile, showSticky, headerRef } = useHeaderLogic();

  return (
    // Attach the ref here to measure the total header area height
    <div ref={headerRef} className="relative w-full">
      {/* Conditional rendering based on screen size */}
      {isMobile ? (
        <MobileHeader />
      ) : (
        <>
          <MainHeader /> <MegaMenu />
        </>
      )}

      {/* Sticky header appears based on scroll logic */}
      {showSticky && <StickyHeader />}
    </div>
  );
};
