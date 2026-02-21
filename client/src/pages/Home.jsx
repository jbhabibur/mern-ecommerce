import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

// Import hooks
import { useHeroData } from "../features/home/hooks/useHeroData";
import { useCategoriesData } from "../features/home/hooks/useCategoriesData";
import { useNewArrivals } from "../features/home/hooks/useNewArrivals";
import { usePromos } from "../features/home/hooks/usePromos";
import { useFeturedProductsData } from "../features/home/hooks/useFeturedProductsData";

// Import components
import { PromoBanner } from "../components/shared/PromoBanner";
import { Hero } from "../features/home/components/Hero";
import { CategoriesSection } from "../features/home/components/CategoriesSection";
import { NewArrivalsSection } from "../features/home/components/NewArrivalsSection";
import { FeaturedProductsSection } from "../features/home/components/FeaturedProductsSection";
import { SocialMediaSection } from "../features/home/components/SocialMediaSection";
import { Toast } from "../components/atoms/Toast";

/**
 * Home Component
 * Handles data fetching for home sections and renders the landing page content.
 * Note: Preloader logic is managed globally at the Layout level.
 */
export const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Toast State ---
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // --- Effect: Handle Toast from Navigation State ---
  useEffect(() => {
    if (location.state?.showToast) {
      setToast({
        show: true,
        message: location.state.toastMsg,
        type: location.state.toastType || "success",
      });

      // CLEANUP: State clear kora jate refresh korle abar Toast na ashe
      const newState = { ...location.state };
      delete newState.showToast;
      delete newState.toastMsg;
      delete newState.toastType;
      navigate(location.pathname, { replace: true, state: newState });
    }
  }, [location, navigate]);

  const handleCloseToast = () => setToast((prev) => ({ ...prev, show: false }));

  // --- Data Fetching ---
  // We maintain the hooks here to ensure data starts loading as soon as Home mounts
  useHeroData(5000);
  useCategoriesData();
  useNewArrivals();
  useFeturedProductsData();

  const { panjabiSlot, fragranceSlot } = usePromos();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="animate-in fade-in duration-1000"
    >
      {/* Toast logic with AnimatePresence for exit animations */}
      <AnimatePresence mode="wait">
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
      </AnimatePresence>

      <Hero />

      <CategoriesSection />

      <NewArrivalsSection />

      {/* Conditional Promo Slot 1: Panjabi */}
      {panjabiSlot && (
        <PromoBanner
          image={panjabiSlot.image?.url || panjabiSlot.image}
          title={panjabiSlot.title}
          link={`/category/${panjabiSlot.category?.slug || panjabiSlot.category}`}
        />
      )}

      <FeaturedProductsSection />

      {/* Conditional Promo Slot 2: Fragrance */}
      {fragranceSlot && (
        <PromoBanner
          image={fragranceSlot.image?.url || fragranceSlot.image}
          title={fragranceSlot.title}
          link={`/category/${fragranceSlot.category?.slug || fragranceSlot.category}`}
        />
      )}

      <SocialMediaSection />
    </motion.main>
  );
};
