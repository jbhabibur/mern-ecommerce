import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRelatedProducts } from "../../features/product-details/hooks/useRelatedProducts";

// Redux
import { useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

import "swiper/css";
import "swiper/css/navigation";

export const YouMayAlsoLike = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isCartOpen } = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.items);
  const { data, isLoading, isError } = useRelatedProducts();

  // 1. Get the raw products or an empty array
  const rawProducts = data || [];

  // 2. Filter out products that exist in cartItems
  const freshProducts = rawProducts.filter(
    (product) => !cartItems.some((cartItem) => cartItem.id === product._id),
  );

  if (isLoading)
    return <div className="h-24 bg-gray-50 animate-pulse rounded-md" />;
  if (isError || freshProducts.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold! text-gray-800 text-sm! uppercase tracking-wide">
          You May Also Like
        </h3>
        <div className="flex gap-2">
          <button className="related-prev w-6 h-6 flex items-center justify-center border rounded-full! hover:bg-black hover:text-white transition-all text-[10px]">
            ❮
          </button>
          <button className="related-next w-6 h-6 flex items-center justify-center border rounded-full! hover:bg-black hover:text-white transition-all text-[10px]">
            ❯
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".related-prev",
          nextEl: ".related-next",
        }}
        spaceBetween={12}
        slidesPerView={1}
        loop={freshProducts.length > 1}
      >
        {freshProducts.map((product) => {
          // Find primary image or fallback to the first image in the array
          const primaryImage =
            product.images?.find((img) => img.isPrimary)?.url ||
            product.images?.[0]?.url;

          return (
            <SwiperSlide key={product._id || product.id}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  dispatch(cartActions.setCartOpen(!isCartOpen));
                  navigate(`/products/${product.slug}`);
                }}
                className="flex gap-3  p-2 rounded-sm  group cursor-pointer"
              >
                {/* Product Image */}
                <div className="w-24 h-24 shrink-0 overflow-hidden shadow-sm">
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-gray-700 truncate leading-tight">
                    {product.name}{" "}
                    {/* Changed from product.title to product.name based on log */}
                  </p>
                  <p className="text-xs font-bold mt-1">
                    Tk {product.price?.toLocaleString()}
                  </p>
                  <button
                    className="text-[9px] font-bold underline uppercase mt-1 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Quick Add logic
                    }}
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
