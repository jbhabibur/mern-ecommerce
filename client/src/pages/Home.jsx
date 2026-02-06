import { PromoBanner } from "../components/shared/PromoBanner";
import { FeatureProducts } from "../components/FeatureProducts";
import { InstagramGallery } from "../components/InstagramGallery";
import { Hero } from "../features/home/components/Hero";
import { CategoriesSection } from "../features/home/components/CategoriesSection";
import { NewArrivalsSection } from "../features/home/components/NewArrivalsSection";

const promoBannerPanjabi = "/images/promo/promo-banner-panjabi.jpeg";
const promoBannerFragrance = "/images/promo/promo-banner-fragrance.png";

export const Home = () => {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <NewArrivalsSection />

      <PromoBanner image={promoBannerPanjabi} title="Panjabi Collection" />
      <FeatureProducts />

      <PromoBanner image={promoBannerFragrance} title="Fragrance Collection" />
      {/* <InstagramGallery /> */}
    </>
  );
};
