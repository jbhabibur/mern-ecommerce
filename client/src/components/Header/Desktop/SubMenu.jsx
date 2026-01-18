import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

export const SubMenu = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group px-2 py-[10px] cursor-pointer"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Top Level Menu Label */}
      <div className="flex items-center gap-1 text-[13px] font-bold uppercase tracking-wider text-white hover:text-gray-300 transition-colors">
        <span className="whitespace-nowrap">{item.label}</span>
        {item.children && <ChevronRight size={14} className="mt-0.5" />}
      </div>

      {/* Dropdown Menu (Level 1) */}
      {item.children && (
        <div
          className={`absolute top-full left-0 min-w-[220px] bg-white text-black shadow-2xl border-t-2 border-black z-50 transition-all duration-300 transform 
    ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"}`}
        >
          {/* Ensure p-0 so that the hover background extends to the borders */}
          <ul className="flex flex-col w-full p-0 m-0 list-none">
            {item.children.map((child, index) => (
              <li
                key={index}
                className="w-full border-b border-gray-100 last:border-0"
              >
                {/* SubMenuChild now spans the full width of the li */}
                <SubMenuChild child={child} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SubMenuChild = ({ child }) => {
  const [isChildOpen, setIsChildOpen] = useState(false);

  return (
    <div
      className="relative w-full flex" // Use flex to allow internal elements to fill space
      onMouseEnter={() => setIsChildOpen(true)}
      onMouseLeave={() => setIsChildOpen(false)}
    >
      {/* FIX: Added 'flex-1' to take full width/height.
          Removed padding from the parent 'li' to ensure the hover background hits the edges.
      */}
      <div className="flex-1 flex items-center justify-between px-3 py-[14px] font-normal! text-[12px] bg-white text-black uppercase tracking-tight hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer">
        <span className="tracking-widest! ">{child.label}</span>
        {child.children && <ChevronRight size={12} className="opacity-70" />}
      </div>

      {/* Side Dropdown (Level 2) - Appears to the right of Level 1 */}
      {child.children && (
        <div
          className={`absolute top-0 left-full min-w-[200px] bg-white  shadow-xl border-l border-gray-100 transition-all duration-200 transform
          ${isChildOpen ? "opacity-100 translate-x-0 visible" : "opacity-0 -translate-x-2 invisible"}`}
        >
          {child.children.map((subChild, i) => (
            <div
              key={i}
              className="px-3 py-[14px] text-[12px] text-gray-600 uppercase font-normal! hover:bg-gray-100 border-b border-gray-50 last:border-0 transition-colors"
            >
              {subChild.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
