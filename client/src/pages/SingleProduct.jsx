import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Heart,
  Share2,
  Plus,
  Minus,
  Search,
  ChevronLeft,
  ChevronRight,
  Expand,
} from "lucide-react";

import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { ProductLightbox } from "../components/shared/ProductLightbox";
import { ProductPurchaseSection } from "../components/shared/ProductPurchaseSection";
import { ProductExtraInfo } from "../components/shared/ProductExtraInfo";
import { RelatedProducts } from "../components/shared/RelatedProducts";

import { slugToName } from "../utils/formatters";

export const SingleProduct = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const images = [
    "/images/products/shirts/FormalShirts/shirt-fs-blue-door-dobby-310-1-main.jpeg",
    "/images/products/shirts/FormalShirts/shirt-fs-blue-door-dobby-310-1-close.jpeg",
    "/images/products/shirts/FormalShirts/shirt-fs-blue-door-dobby-310-1-back.jpeg",
  ];

  useEffect(() => {
    const getProduct = async () => {
      if (!slug) return;
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/products?slug=${slug}`,
        );
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        if (data.length > 0) {
          // json-server ফিল্টার করলে অ্যারে দেয়, তাই প্রথম ইনডেক্স সেট করছি
          setProduct(data[0]);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [slug]);

  console.log(product);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // State for expansion

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const activeImage = images[currentIndex];

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-8 lg:px-12!">
      <Breadcrumb />
      <div className="">
        <div className="flex flex-col md:flex-row gap-16 relative">
          {/* Left Side: Image Section */}
          <div className="w-full md:w-[60%] flex-shrink">
            <div className="relative w-full max-w-[500px] md:max-w-[1500px] aspect-square overflow-hidden bg-gray-100">
              <img
                src={activeImage}
                alt="Main Product"
                className="w-full h-full object-cover transition-opacity duration-300 cursor-crosshair"
                onClick={() => setIsLightboxOpen(true)} // Open on image click too
              />

              {/* Zoom/Expand Button - Mobile Only */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors md:hidden"
              >
                <Expand size={15} />
              </button>

              {/* Navigation Controls */}
              {/* Navigation Controls */}
              <div className="absolute bottom-2 right-2 flex md:hidden gap-[2px] border-t border-l border-gray-200 shadow-sm">
                <div className="bg-white flex items-center justify-center border-r border-gray-100 text-sm font-medium text-gray-600 min-w-[50px]">
                  {currentIndex + 1} / {images.length}
                </div>
                <button
                  onClick={prevImage}
                  className="p-[6px] bg-white hover:bg-gray-50 transition-colors border-r border-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="p-[6px] bg-white hover:bg-gray-50 transition-colors"
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
                  className={`relative flex-shrink-0 border cursor-pointer transition-all overflow-hidden 
        /* Mobile size */
        w-20 aspect-square 
        /* Tablet/Desktop size - Increased these values */
        md:w-32 lg:w-40 
        ${
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

          {/* RIGHT SIDE: Product Info (Below image on mobile, Right side on desktop) */}
          <div className="w-full md:w-[40%] flex flex-col sticky! top-0">
            {/* Passing the dynamic product data to the section */}
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
