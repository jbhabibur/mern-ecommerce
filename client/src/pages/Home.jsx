import { Categories } from "../components/Categories";
import { Hero } from "../components/Hero";
import { NewArrivals } from "../components/NewArrivals";
import { PromoBanner } from "../components/shared/PromoBanner";

import promoBannerPanjabi from "../assets/images/promo/promo-banner-panjabi.jpeg";
import promoBannerFragrance from "../assets/images/promo/promo-banner-fragrance.png";
import { FeatureProducts } from "../components/FeatureProducts";
import { InstagramGallery } from "../components/InstagramGallery";

export const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />
      <PromoBanner image={promoBannerPanjabi} title="Panjabi Collection" />
      <FeatureProducts />
      <PromoBanner image={promoBannerFragrance} title="Fragrance Collection" />
      <InstagramGallery />
    </>
  );
};
