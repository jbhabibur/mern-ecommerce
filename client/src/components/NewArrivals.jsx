import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { SectionHeader } from "./atoms/SectionHeader";
import { ProductCard } from "./shared/ProductCard";
import { PrimaryButton } from "./atoms/PrimaryButton";

export const NewArrivals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);
  const [visibleCount, setVisibleCount] = useState(8); // Desktop load more state

  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // প্রথমবার লোডিংয়ের জন্য
  const [isMoreLoading, setIsMoreLoading] = useState(false); // বাটনের জন্য

  useEffect(() => {
    // Function to fetch data from the local server
    const fetchProducts = async () => {
      try {
        // Ensure your json-server is running on this port
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();

        // Filter products to show only those marked as 'isNewArrival'
        const newArrivals = data.filter((item) => item.isNewArrival === true);
        setProducts(newArrivals);

        setInitialLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setInitialLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalProducts = products.length;

  // Desktop Load More handler
  const handleLoadMore = () => {
    setIsMoreLoading(true); // শুধু বাটনের লোডিং ট্রু হবে
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsMoreLoading(false);
    }, 3000);
  };

  // Show loading state while data is being fetched
  // প্রথমবার ডেটা আসার সময় শুধু এটা দেখাবে
  if (initialLoading) {
    return <div className="text-center py-10 font-medium">Loading...</div>;
  }

  return (
    <div>
      <div className="max-w-[1240px] mx-auto py-2 px-4 md:px-6">
        <SectionHeader title="New Arrivals" linkText="View All" />
      </div>
      <div className="max-w-[1240px] mx-auto py-2 px-0 lg:px-6!">
        {/* --- Desktop Grid Layout --- */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-8">
            {products.slice(0, visibleCount).map((product) => (
              <a
                key={product.id}
                href={`/products/${product.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="no-underline! text-current! block!"
              >
                <ProductCard product={product} />
              </a>
            ))}
          </div>

          {visibleCount < totalProducts && (
            <div className="mt-20 flex items-center justify-center">
              <PrimaryButton
                label="Show More"
                onClick={handleLoadMore}
                hasLoad={isMoreLoading}
              />
            </div>
          )}
        </div>

        {/* --- Mobile & Tablet Swiper (Limited to 8 products) --- */}
        <div className="lg:hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={2}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            onBreakpoint={(swiper) =>
              setSlidesPerView(swiper.params.slidesPerView)
            }
            breakpoints={{
              768: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
          >
            {/* Mobile এ আমরা slice(0, 8) ব্যবহার করছি যাতে ৮টির বেশি না দেখায় */}
            {products.slice(0, 8).map((product) => (
              <SwiperSlide key={product.id}>
                <a
                  key={product.id}
                  href={`/products/${product.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="no-underline! text-current! block!"
                >
                  <ProductCard product={product} />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-between mt-10 px-3">
            <div className="text-sm font-medium text-gray-600">
              {Math.min(currentIndex + slidesPerView, 8)} / 8
            </div>

            <div className="flex gap-4">
              <button className="custom-prev p-3 border border-gray-400 rounded-full hover:bg-black hover:text-white transition disabled:opacity-30">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="custom-next p-3 border border-gray-400 rounded-full hover:bg-black hover:text-white transition disabled:opacity-30">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
