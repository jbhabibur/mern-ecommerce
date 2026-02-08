import { usePromos } from "../features/home/hooks/usePromos";
import { PromoBanner } from "../components/shared/PromoBanner";
import { Hero } from "../features/home/components/Hero";
import { CategoriesSection } from "../features/home/components/CategoriesSection";
import { NewArrivalsSection } from "../features/home/components/NewArrivalsSection";
import { FeaturedProductsSection } from "../features/home/components/FeaturedProductsSection";
import { SocialMediaSection } from "../features/home/components/SocialMediaSection";

export const Home = () => {
  const { panjabiSlot, fragranceSlot, loading } = usePromos();

  // Return null or a skeleton loader during initial fetch
  if (loading) return null;

  return (
    <>
      <Hero />
      <CategoriesSection />
      <NewArrivalsSection />

      {/* Render Panjabi Slot (Slot 1) if Active */}
      {panjabiSlot && (
        <PromoBanner
          image={panjabiSlot.image?.url || panjabiSlot.image}
          title={panjabiSlot.title}
          // Pass category link if your PromoBanner supports it
          link={`/category/${panjabiSlot.category?.slug || panjabiSlot.category}`}
        />
      )}

      <FeaturedProductsSection />

      {/* Render Fragrance Slot (Slot 2) if Active */}
      {fragranceSlot && (
        <PromoBanner
          image={fragranceSlot.image?.url || fragranceSlot.image}
          title={fragranceSlot.title}
          link={`/category/${fragranceSlot.category?.slug || fragranceSlot.category}`}
        />
      )}

      <SocialMediaSection />
    </>
  );
};
