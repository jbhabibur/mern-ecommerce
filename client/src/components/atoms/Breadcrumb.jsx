import React from "react";
import { ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export const Breadcrumb = () => {
  const location = useLocation();

  // Split the URL path into an array (e.g., /products/shirt -> ['products', 'shirt'])
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="w-full py-2 bg-white border-b border-gray-100 overflow-hidden ">
      {/* The 'mask-image' creates the fade-out effect on the right side.
        Everything from 0% to 80% is solid, then it fades to transparent at 100%.
      */}
      <div
        className="w-full px-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 85%, transparent 100%)",
          maskImage: "linear-gradient(to right, black 85%, transparent 100%)",
        }}
      >
        <ol className="flex items-center whitespace-nowrap text-sm md:text-base text-gray-500 font-medium p-0 m-0">
          {/* Home Link */}
          <li className="flex items-center shrink-0">
            <Link
              to="/"
              className="text-[#232323]! no-underline! hover:text-black transition-colors"
            >
              Home
            </Link>
            {pathnames.length > 0 && (
              <ChevronRight className="w-4 h-4 mx-1.5 text-black" />
            )}
          </li>

          {/* Dynamic Segments */}
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;

            // Formatting: replaces dashes/underscores with spaces
            const displayName = value.replace(/-/g, " ").replace(/_/g, " ");

            return (
              <li key={to} className="flex items-center shrink-0">
                {last ? (
                  // Active Page: Removed 'truncate' and 'max-w' to prevent dots
                  <span className="text-[#999999]! capitalize">
                    {displayName}
                  </span>
                ) : (
                  // Clickable parent links
                  <>
                    <Link
                      to={to}
                      className="text-[#999999]! no-underline! hover:text-black transition-colors capitalize"
                    >
                      {displayName}
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1.5 text-black" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
