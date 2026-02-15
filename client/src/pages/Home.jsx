import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Import hooks
import { useHeroData } from "../features/home/hooks/useHeroData";
import { useCategoriesData } from "../features/home/hooks/useCategoriesData";
import { useNewArrivals } from "../features/home/hooks/useNewArrivals";
import { usePromos } from "../features/home/hooks/usePromos";
import { useFeturedProductsData } from "../features/home/hooks/useFeturedProductsData";

// Import components
import { Preloader } from "../components/loaders/Preloader";
import { PromoBanner } from "../components/shared/PromoBanner";
import { Hero } from "../features/home/components/Hero";
import { CategoriesSection } from "../features/home/components/CategoriesSection";
import { NewArrivalsSection } from "../features/home/components/NewArrivalsSection";
import { FeaturedProductsSection } from "../features/home/components/FeaturedProductsSection";
import { SocialMediaSection } from "../features/home/components/SocialMediaSection";

export const Home = () => {
  const ONE_HOUR = 1 * 60 * 60 * 1000;

  // 1. Synchronously check localStorage to determine if we should show the loader
  // This prevents the main content from rendering briefly before the useEffect runs
  const [showLoader, setShowLoader] = useState(() => {
    const lastSeen = localStorage.getItem("last_preloader_time");
    const now = Date.now();

    if (!lastSeen || now - parseInt(lastSeen) > ONE_HOUR) {
      return true; // Show loader for first time or if 1 hour has passed
    }
    return false; // Skip loader if user returns within 1 hour
  });

  // If we aren't showing the loader, minTimeReached is true by default
  const [minTimeReached, setMinTimeReached] = useState(!showLoader);

  // Fetching data
  const { loading: heroLoading } = useHeroData(5000);
  const { loading: categoriesLoading } = useCategoriesData();
  const { loading: arrivalsLoading } = useNewArrivals();
  const { panjabiSlot, fragranceSlot, loading: promosLoading } = usePromos();
  const { loading: featuredLoading } = useFeturedProductsData();

  const isGlobalLoading =
    heroLoading ||
    categoriesLoading ||
    arrivalsLoading ||
    promosLoading ||
    featuredLoading;

  // 2. Logic to handle the preloader timer and timestamp update
  useEffect(() => {
    if (showLoader) {
      // Set the new timestamp only when the loader is actually displayed
      localStorage.setItem("last_preloader_time", Date.now().toString());

      // Start the artificial delay (5.5 seconds)
      const timer = setTimeout(() => {
        setMinTimeReached(true);
      }, 5500);

      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  // 3. Logic to hide the loader once both data and timer are ready
  useEffect(() => {
    if (minTimeReached && !isGlobalLoading) {
      setShowLoader(false);
    }
  }, [minTimeReached, isGlobalLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && <Preloader key="preloader" />}
      </AnimatePresence>

      {/* 4. Render content only when the loader is finished */}
      {!showLoader && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="animate-in fade-in duration-1000"
        >
          <Hero />
          <CategoriesSection />
          <NewArrivalsSection />

          {panjabiSlot && (
            <PromoBanner
              image={panjabiSlot.image?.url || panjabiSlot.image}
              title={panjabiSlot.title}
              link={`/category/${panjabiSlot.category?.slug || panjabiSlot.category}`}
            />
          )}

          <FeaturedProductsSection />

          {fragranceSlot && (
            <PromoBanner
              image={fragranceSlot.image?.url || fragranceSlot.image}
              title={fragranceSlot.title}
              link={`/category/${fragranceSlot.category?.slug || fragranceSlot.category}`}
            />
          )}

          <SocialMediaSection />
        </motion.main>
      )}
    </>
  );
};
