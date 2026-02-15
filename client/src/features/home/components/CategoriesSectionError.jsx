import React from "react";
import { SectionLayout } from "../../../layout/SectionLayout";

export const CategoryError = ({ error = "Failed to load categories" }) => {
  return (
    <SectionLayout bgColor="bg-white">
      <div className="py-10 text-center">
        <p className="text-gray-400 italic text-sm">{error}</p>
      </div>
    </SectionLayout>
  );
};
