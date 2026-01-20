import React from "react";

export const CategoriesPageBanner = ({ banner }) => {
  // 1. If no banner image path exists, do not render the component
  if (!banner || banner.trim() === "") return null;

  // 2. Handle the Backend URL properly
  // We ensure there is only one slash between the domain and the path
  const baseUrl = "http://localhost:5000";

  // Remove leading slash from the banner string if it exists to avoid double slashes
  const cleanPath = banner.startsWith("/") ? banner.substring(1) : banner;

  const fullBannerUrl = banner.startsWith("http")
    ? banner
    : `${baseUrl}/${cleanPath}`;

  return (
    <div className="w-full mb-6 relative cursor-pointer overflow-hidden group shadow-sm">
      <div className="aspect-[21/9] md:aspect-[25/11] w-full bg-gray-200 animate-pulse-slow">
        <img
          src={fullBannerUrl}
          alt="Category Banner"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          // 3. Error Handling: If image fails to load, hide the broken icon
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.style.display = "none";
          }}
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
    </div>
  );
};
