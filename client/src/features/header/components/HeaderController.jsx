import { UtilityHeader } from "./desktop-view/UtilityHeader";
import { MainNavigationMenu } from "./desktop-view/MainNavigationMenu";
import { useHeaderController } from "../hooks/useHeaderController";
import { MobileHeader } from "./mobile-view/MobileHeader";

export const HeaderController = () => {
  const { isMobile, showSticky, headerRef } = useHeaderController();
  return (
    <div>
      {isMobile ? (
        <MobileHeader />
      ) : (
        <>
          <UtilityHeader />
          <MainNavigationMenu />
        </>
      )}
    </div>
  );
};
