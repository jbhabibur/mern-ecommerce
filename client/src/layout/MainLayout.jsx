import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { HeaderController } from "../features/header/components/HeaderController";
import { Footer } from "../features/footer/components/Footer";
import { GlobalLoader } from "../components/atoms/GlobalLoader";
import { AuthDrawer } from "../features/auth/components/AuthDrawer";
import { CartDrawer } from "../components/Cart/CartDrawer";
import { BottomNavigation } from "../components/shared/BottomNavigation";

import { useScrollToTop } from "../hooks/useScrollToTop";

/**
 * MainLayout component serves as the primary wrapper for the application.
 * It manages global UI elements like navigation, footers, loaders, and modals.
 */
export const MainLayout = () => {
  // Reset window scroll position on route changes
  useScrollToTop();

  // Access global application and drawer states from Redux
  const { isAppLoading } = useSelector((state) => state.auth);
  const { isOpen: isAuthOpen } = useSelector((state) => state.authDrawer);
  const { isCartOpen } = useSelector((state) => state.cart);

  const isAnyDrawerOpen = isAuthOpen || isCartOpen;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* App-wide loading overlay */}
      {isAppLoading && <GlobalLoader />}

      {/* Main Content Wrapper: 
          Shifts exactly 20px to the left when the drawer is open 
          to create a subtle "partial push" depth effect.
      */}
      <div
        className={`flex flex-col flex-grow transition-transform duration-500 ease-in-out ${
          isAnyDrawerOpen ? "-translate-x-[20px]" : "translate-x-0"
        }`}
      >
        {/* Navigation Header */}
        <HeaderController />

        {/* Main Content Area */}
        <main className="flex-grow pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* --------------- Global Components --------------- */}
      <AuthDrawer />
      <CartDrawer />

      {/* Mobile-only navigation bar */}
      <BottomNavigation />
    </div>
  );
};
