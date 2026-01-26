import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

export const SubMenu = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (slugValue) => {
    if (slugValue) {
      let targetPath;

      // 1. Navigation for the Home page
      // If the slug is "/" or "home", redirect to the root URL.
      if (slugValue === "/" || slugValue === "home") {
        targetPath = "/";
      }

      // 2. Navigation for Special Pages (Standalone Routes)
      // These pages should NOT be prefixed with "/categories/".
      else if (slugValue === "contact" || slugValue === "contact-us") {
        targetPath = "/contact";
      }

      // 3. Additional Special Routes
      // Example: Redirecting to an 'offers' page directly.
      else if (slugValue === "offers") {
        targetPath = "/offers";
      }

      // 4. Default Category Path
      // For any other slug (e.g., "men-top", "accessories"),
      // it routes to the categories section.
      else {
        targetPath = `/categories/${slugValue}`;
      }

      // window.location.href triggers a full browser refresh and navigates to the targetPath.
      window.location.href = targetPath;
    }
  };

  return (
    <div
      className="relative group px-2 py-[10px] cursor-pointer"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Top Level Menu Label */}
      <div
        className="flex items-center gap-1 text-[13px] font-bold uppercase tracking-wider text-white hover:text-gray-300 transition-colors"
        onClick={() => handleNav(item.slug)} // Using item.slug here
      >
        <span className="whitespace-nowrap">{item.label}</span>
        {item.children && <ChevronRight size={14} className="mt-0.5" />}
      </div>

      {/* Dropdown Menu (Level 1) */}
      {item.children && (
        <div
          className={`absolute top-full left-0 min-w-[220px] bg-white text-black shadow-2xl border-t-2 border-black z-50 transition-all duration-300 transform 
          ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"}`}
        >
          <ul className="flex flex-col w-full p-0 m-0 list-none">
            {item.children.map((child, index) => (
              <li
                key={index}
                className="w-full border-b border-gray-100 last:border-0"
              >
                {/* Passing handleNav and the child object containing the slug */}
                <SubMenuChild child={child} onNav={handleNav} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SubMenuChild = ({ child, onNav }) => {
  const [isChildOpen, setIsChildOpen] = useState(false);

  return (
    <div
      className="relative w-full flex"
      onMouseEnter={() => setIsChildOpen(true)}
      onMouseLeave={() => setIsChildOpen(false)}
    >
      <div
        className="flex-1 flex items-center justify-between px-3 py-[14px] font-normal! text-[12px] bg-white text-black uppercase tracking-tight hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
        onClick={() => onNav(child.slug)} // Changed from child.label to child.slug
      >
        <span className="tracking-widest! ">{child.label}</span>
        {child.children && <ChevronRight size={12} className="opacity-70" />}
      </div>

      {/* Side Dropdown (Level 2) */}
      {child.children && (
        <div
          className={`absolute top-0 left-full min-w-[200px] bg-white shadow-xl border-l border-gray-100 transition-all duration-200 transform
          ${isChildOpen ? "opacity-100 translate-x-0 visible" : "opacity-0 -translate-x-2 invisible"}`}
        >
          {child.children.map((subChild, i) => (
            <div
              key={i}
              className="px-3 py-[14px] text-[12px] text-gray-600 uppercase font-normal! hover:bg-gray-100 border-b border-gray-50 last:border-0 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onNav(subChild.slug); // Changed from subChild.label to subChild.slug
              }}
            >
              {subChild.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
