import React from "react";
import { Link } from "react-router-dom";
import { SectionLayout } from "../../../layout/SectionLayout";
import { CategorySkeleton } from "../components/CategoriesSectionSkeleton";
import { CategoryError } from "../components/CategoriesSectionError";

import { useCategoriesData } from "../hooks/useCategoriesData";

export const CategoriesSection = () => {
  const { categories, loading, error } = useCategoriesData();

  // Loading State: Skeleton cards
  if (loading) return <CategorySkeleton />;

  // Error handle
  if (error || !categories || categories.length === 0)
    return <CategoryError error={error} />;

  return (
    <SectionLayout bgColor="bg-white">
      {/* SectionLayout er bhetore agei container ebong responsive padding ache,
          tai amra shudhu grid-ta bosiyechi.
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-8 py-10 md:py-8">
        {categories.map((item) => (
          <Link
            key={item._id}
            to={`/categories/${item.slug}`}
            className="group block relative"
          >
            {/* Image Wrapper */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 rounded-sm">
              <img
                src={item.thumbnail} // DB theke thumbnail image fetch korbe
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/35 transition-all duration-300">
                <h2 className="text-white font-bold! text-xs! sm:text-sm md:text-base tracking-[0.2em] uppercase drop-shadow-lg pointer-events-none text-center px-2">
                  {item.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionLayout>
  );
};
