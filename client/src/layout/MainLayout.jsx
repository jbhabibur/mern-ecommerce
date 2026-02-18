import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Layout & Global Components
import { HeaderController } from "../features/header/components/HeaderController";
import { Footer } from "../features/footer/components/Footer";
import { GlobalLoader } from "../components/atoms/GlobalLoader";
import { AuthDrawer } from "../features/auth/components/AuthDrawer";
import { CartDrawer } from "../components/Cart/CartDrawer";
import { BottomNavigation } from "../components/shared/BottomNavigation";
import { StickyPurchaseBar } from "../features/product-details/components/StickyPurchaseBar";

// Hooks
import { useScrollToTop } from "../hooks/useScrollToTop";

/**
 * MainLayout Component
 * Serves as the primary shell for the application, managing global
 * navigation, drawers, loaders, and the conditional Sticky Purchase Bar.
 */
export const MainLayout = () => {
  // Automatically scroll to the top of the page on route changes
  useScrollToTop();

  // --- Redux State Selection ---

  // App-wide loading state
  const { isAppLoading } = useSelector((state) => state.auth);

  // Drawer visibility states
  const { isOpen: isAuthOpen } = useSelector((state) => state.authDrawer);
  const { isCartOpen } = useSelector((state) => state.cart);

  // Product data and scroll visibility controlled via Redux (from ProductOverview)
  const { activeProduct, isStickyVisible } = useSelector(
    (state) => state.products,
  );

  // Helper constant to check if any side drawer is currently active
  const isAnyDrawerOpen = isAuthOpen || isCartOpen;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Global overlay loader */}
      {isAppLoading && <GlobalLoader />}

      {/* Main Content Wrapper: 
          Includes transition logic to shift content when a drawer opens.
      */}
      <div
        className={`flex flex-col flex-grow transition-transform duration-500 ease-in-out ${
          isAnyDrawerOpen ? "-translate-x-[20px]" : "translate-x-0"
        }`}
      >
        <HeaderController />

        {/* Dynamic Route Content */}
        <main className="flex-grow pb-16 md:pb-0">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* --- Global Overlays & Modals --- */}
      <AuthDrawer />
      <CartDrawer />

      {/* Sticky Purchase Bar: 
          Renders only if a product is active and its scroll threshold is met.
          Hidden automatically if a drawer is open to avoid UI overlap.
      */}
      {activeProduct && (
        <StickyPurchaseBar
          product={activeProduct}
          isVisible={isStickyVisible && !isAnyDrawerOpen}
        />
      )}

      {/* Persistent Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
