import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  ShoppingBag,
  Tag,
  Users,
  ArrowRight,
  LayoutDashboard,
  Layers,
  Image,
  Megaphone,
  Palette,
  BarChart3,
  Settings,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

export const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Sidebar Menu Items for Search Logic
  const menuItems = [
    {
      title: "Dashboard",
      subtitle: "Overview & Metrics",
      icon: LayoutDashboard,
      link: "/admin",
    },
    {
      title: "Orders",
      subtitle: "Manage Sales",
      icon: ShoppingBag,
      link: "/admin/orders",
    },
    {
      title: "Products",
      subtitle: "Inventory List",
      icon: Tag,
      link: "/admin/products",
    },
    {
      title: "Categories",
      subtitle: "Product Groups",
      icon: Layers,
      link: "/admin/categories",
    },
    {
      title: "Staff List",
      subtitle: "Team Members",
      icon: Users,
      link: "/admin/admins/manage",
    },
    {
      title: "Invite Admin",
      subtitle: "Add New Staff",
      icon: UserPlus,
      link: "/admin/admins/invite",
    },
    {
      title: "Hero Carousel",
      subtitle: "Home Banners",
      icon: Image,
      link: "/admin/website/carousel",
    },
    {
      title: "Promo Banners",
      subtitle: "Marketing Slots",
      icon: Megaphone,
      link: "/admin/website/banners",
    },
    {
      title: "Social Gallery",
      subtitle: "Instagram/Social Feed",
      icon: Palette,
      link: "/admin/website/social",
    },
    {
      title: "Customer Insights",
      subtitle: "Analytics & Reports",
      icon: BarChart3,
      link: "/admin/analytics/customers",
    },
    {
      title: "Product Performance",
      subtitle: "Sales Analytics",
      icon: BarChart3,
      link: "/admin/analytics/products",
    },
    {
      title: "Settings",
      subtitle: "System Config",
      icon: Settings,
      link: "/admin/settings",
    },
  ];

  // Filter items based on query
  const filteredResults = menuItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (link) => {
    setQuery("");
    setIsFocused(false);
    navigate(link);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div
        className={`relative group transition-all duration-300 ${isFocused ? "scale-[1.01]" : ""}`}
      >
        <Search
          size={18}
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            isFocused ? "text-theme-act" : "text-theme-muted"
          }`}
        />
        <input
          type="text"
          placeholder="Search menu or sections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm bg-theme-sub border-theme-line text-theme-front outline-none focus:border-theme-act transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-error"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* --- SEARCH DROPDOWN --- */}
      {isFocused && query.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-3 bg-theme-base border border-theme-line rounded-2xl shadow-2xl p-2 z-[60] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          <div className="px-3 py-2 text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] border-b border-theme-line/50 mb-1">
            Menu Results
          </div>

          <div className="space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResultClick(item.link)}
                  className="w-full flex items-center justify-between p-3 hover:bg-theme-sub transition-all rounded-xl group border border-transparent hover:border-theme-line"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-theme-base border border-theme-line rounded-lg group-hover:border-theme-act transition-colors">
                      <item.icon
                        size={16}
                        className="text-theme-muted group-hover:text-theme-act"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-theme-front">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-theme-muted uppercase font-semibold">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-theme-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                  />
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-theme-muted text-xs italic">
                No matching menu item found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
