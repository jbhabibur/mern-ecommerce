import React from "react";
import { ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { SectionLayout } from "../../layout/SectionLayout";

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="w-full bg-white overflow-hidden py-6">
      <div
        className="w-full px-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 85%, transparent 100%)",
          maskImage: "linear-gradient(to right, black 85%, transparent 100%)",
        }}
      >
        <ol className="flex items-center whitespace-nowrap text-xs! md:text-base text-gray-500 font-medium p-0 m-0">
          <li className="flex items-center shrink-0">
            <Link
              to="/"
              className="text-[#999999]! no-underline! hover:text-black! transition-colors"
            >
              Home
            </Link>
            {pathnames.length > 0 && (
              <ChevronRight className="w-4 h-4 mx-1.5 text-[#999999]" />
            )}
          </li>

          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const displayName = value.replace(/-/g, " ").replace(/_/g, " ");

            return (
              <li key={to} className="flex items-center shrink-0">
                {last ? (
                  <span className="text-[#999999]! capitalize">
                    {displayName}
                  </span>
                ) : (
                  <>
                    <Link
                      to={to}
                      className="text-[#999999]! no-underline! hover:text-black! transition-colors capitalize"
                    >
                      {displayName}
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1.5 text-[#999999]" />
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
