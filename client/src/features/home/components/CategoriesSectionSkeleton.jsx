import React from "react";
import { SectionLayout } from "../../../layout/SectionLayout";

export const CategorySkeleton = () => {
  return (
    <SectionLayout bgColor="bg-white">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-8 py-10">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="aspect-[4/3] bg-gray-200 animate-pulse rounded-sm shadow-sm"
          />
        ))}
      </div>
    </SectionLayout>
  );
};
