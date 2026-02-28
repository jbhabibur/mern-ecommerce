import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

// Layout & Global Components
import { HeaderController } from "../features/header/components/HeaderController";
import { Footer } from "../features/footer/components/Footer";
import { GlobalLoader } from "../components/atoms/GlobalLoader";
import { AuthDrawer } from "../features/auth/components/AuthDrawer";
import { CartDrawer } from "../components/Cart/CartDrawer";
import { BottomNavigation } from "../components/shared/BottomNavigation";
import { StickyPurchaseBar } from "../features/product-details/components/StickyPurchaseBar";
import { Preloader } from "../components/loaders/Preloader";
import { SearchTrigger } from "../features/search/components/SearchTrigger";

// Hooks
import { useScrollToTop } from "../hooks/useScrollToTop";
import { usePreloader } from "../hooks/usePreloader";

/**
 * MainLayout Component
 * Manages the global shell. Includes a "Silent Scroll" reset logic
 * using pathname keys and Framer Motion transitions.
 */
export const MainLayout = () => {
  const { pathname } = useLocation();

  // Initialize hooks
  useScrollToTop();
  const { showLoader, handleLoaderComplete } = usePreloader();

  // --- Redux State Selection ---
  const { isAppLoading } = useSelector((state) => state.auth);
  const { isOpen: isAuthOpen } = useSelector((state) => state.authDrawer);
  const { isCartOpen } = useSelector((state) => state.cart);
  const { activeProduct, isStickyVisible } = useSelector(
    (state) => state.products,
  );

  // Helper constant to check if any side drawer is active
  const isAnyDrawerOpen = isAuthOpen || isCartOpen;

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* 1. Entrance Preloader: Higher z-index to mask initial load scroll */}
      <AnimatePresence mode="wait">
        {showLoader && (
          <Preloader key="preloader" onFinish={handleLoaderComplete} />
        )}
      </AnimatePresence>

      {/* 2. Global Overlay Loader: For async state changes */}
      {isAppLoading && <GlobalLoader />}

      {/* 3. Main Content Wrapper: 
          'key={pathname}' triggers a re-render/animation on route change,
          effectively masking the instant scroll jump with a fade.
      */}
      <motion.div
        // key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
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
      </motion.div>

      {/* --- Global Overlays & Modals --- */}

      {/* 1. Auth Drawer */}
      <AuthDrawer />

      {/* 2. Cart Drawer */}
      <CartDrawer />

      {/* 3. Search Drawer */}
      <SearchTrigger />

      {/* Sticky Purchase Bar: Renders only for active products */}
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
