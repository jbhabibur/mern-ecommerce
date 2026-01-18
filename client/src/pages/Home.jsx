import { Hero } from "../components/Hero";
import { Categories } from "../components/Categories";
import { NewArrivals } from "../components/NewArrivals";
import { PromoBanner } from "../components/shared/PromoBanner";
import { FeatureProducts } from "../components/FeatureProducts";
import { InstagramGallery } from "../components/InstagramGallery";

const promoBannerPanjabi = "/images/promo/promo-banner-panjabi.jpeg";
const promoBannerFragrance = "/images/promo/promo-banner-fragrance.png";

export const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />

      <PromoBanner image={promoBannerPanjabi} title="Panjabi Collection" />
      <FeatureProducts />

      <PromoBanner image={promoBannerFragrance} title="Fragrance Collection" />
      {/* <InstagramGallery /> */}
    </>
  );
};
