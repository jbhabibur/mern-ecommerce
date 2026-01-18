import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks added
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { fetchProducts } from "../redux/slices/productSlice"; // path check korben

import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { ProductLightbox } from "../components/shared/ProductLightbox";
import { ProductPurchaseSection } from "../components/shared/ProductPurchaseSection";
import { ProductExtraInfo } from "../components/shared/ProductExtraInfo";
import { RelatedProducts } from "../components/shared/RelatedProducts";

export const SingleProduct = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Redux স্টোর থেকে সব প্রোডাক্ট এবং স্ট্যাটাস নেওয়া
  const { items: allProducts, status } = useSelector((state) => state.products);

  useEffect(() => {
    const getProductFromApi = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/products?slug=${slug}`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (data.length > 0) {
          setProduct(data[0]);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    // ১. যদি Redux স্টোর খালি থাকে, তবে ফেচ করার জন্য ডিসপ্যাচ করো
    if (status === "idle") {
      dispatch(fetchProducts());
    }

    // ২. Redux এ ডাটা থাকলে সেখান থেকে স্লাগ অনুযায়ী খুঁজে নাও
    if (allProducts.length > 0) {
      const foundProduct = allProducts.find((p) => p.slug === slug);
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
      } else {
        // Redux এ না থাকলে API থেকে নিয়ে আসার চেষ্টা করো
        getProductFromApi();
      }
    } else if (status !== "loading") {
      // যদি Redux লোডিং না থাকে এবং ডাটাও না থাকে
      getProductFromApi();
    }
  }, [slug, allProducts, status, dispatch]);

  // ইমেজ হ্যান্ডলিং: ডাটাবেসে images থাকলে সেটা নিবে, নাহলে স্যাম্পল স্লাইস নিবে
  const images = product?.images || [
    "/images/products/shirts/FormalShirts/shirt-fs-blue-door-dobby-310-1-main.jpeg",
    "/images/products/shirts/FormalShirts/shirt-fs-blue-door-dobby-310-1-close.jpeg",
    "/images/products/shirts/FormalShirts/shirt-fs-blue-door-dobby-310-1-back.jpeg",
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const activeImage = images[currentIndex];

  // লোডিং এবং এরর স্টেট
  if (loading || (status === "loading" && !product)) {
    return (
      <div className="text-center py-20 font-medium">Loading product...</div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 font-medium">Product not found!</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-8 lg:px-12!">
      <Breadcrumb />
      <div>
        <div className="flex flex-col md:flex-row gap-16 relative">
          {/* Left Side: Image Section */}
          <div className="w-full md:w-[60%] flex-shrink">
            <div className="relative w-full max-w-[500px] md:max-w-[1500px] aspect-square overflow-hidden bg-gray-100">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300 cursor-crosshair"
                onClick={() => setIsLightboxOpen(true)}
              />

              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors md:hidden"
              >
                <Expand size={15} />
              </button>

              <div className="absolute bottom-2 right-2 flex md:hidden gap-[2px] border-t border-l border-gray-200 shadow-sm">
                <div className="bg-white flex items-center justify-center border-r border-gray-100 text-sm font-medium text-gray-600 min-w-[50px]">
                  {currentIndex + 1} / {images.length}
                </div>
                <button
                  onClick={prevImage}
                  className="p-[6px] bg-white hover:bg-gray-50 border-r border-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="p-[6px] bg-white hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-4 mt-10 justify-center overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`relative flex-shrink-0 border cursor-pointer transition-all overflow-hidden w-20 md:w-32 lg:w-40 aspect-square ${
                    currentIndex === i
                      ? "border-black border-2"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    className="w-full h-full object-cover"
                  />
                  {currentIndex === i && (
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Product Info */}
          <div className="w-full md:w-[40%] flex flex-col sticky! top-0">
            <ProductPurchaseSection product={product} />
          </div>
        </div>
      </div>

      <ProductExtraInfo product={product} />
      <RelatedProducts />

      {/* --- LIGHTBOX MODAL --- */}
      {isLightboxOpen && (
        <ProductLightbox
          images={images}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onClose={() => setIsLightboxOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};
