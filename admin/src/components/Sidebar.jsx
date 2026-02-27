// import React, { useState, useEffect } from "react";
// import { useLocation, Link } from "react-router-dom";
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   Images,
//   Settings,
//   ChevronRight,
//   Package,
//   BarChart3,
//   LogOut,
//   X,
//   Image,
//   MonitorPlay,
//   Layers,
// } from "lucide-react";

// const SidebarItem = ({
//   icon: Icon,
//   label,
//   children,
//   badge,
//   active,
//   defaultOpen,
// }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen || false);
//   const hasSubmenu = children && children.length > 0;

//   useEffect(() => {
//     if (defaultOpen) setIsOpen(true);
//   }, [defaultOpen]);

//   return (
//     <div className="w-full">
//       <button
//         onClick={() => hasSubmenu && setIsOpen(!isOpen)}
//         className={`w-full flex items-center px-4 py-3 transition-all duration-200 group
//           ${
//             active && !hasSubmenu
//               ? "bg-theme-act text-theme-actfg font-black"
//               : "text-theme-muted hover:bg-theme-sub hover:text-theme-front"
//           }
//         `}
//       >
//         <Icon
//           size={20}
//           className={`${active ? "text-theme-actfg" : "text-theme-muted group-hover:text-theme-front"}`}
//         />
//         <span className="ml-3 font-bold text-[10px] uppercase tracking-widest flex-1 text-left">
//           {label}
//         </span>

//         {badge && (
//           <span className="bg-theme-act text-theme-actfg text-[10px] px-1.5 py-0.5 font-black mr-2 border border-theme-line">
//             {badge}
//           </span>
//         )}

//         {hasSubmenu && (
//           <ChevronRight
//             size={14}
//             className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
//           />
//         )}
//       </button>

//       {hasSubmenu && (
//         <div
//           className={`overflow-hidden transition-all duration-300 ${
//             isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="ml-4 border-l-2 border-theme-line pl-4 my-1 space-y-1">
//             {children.map((child, index) => (
//               <Link
//                 key={index}
//                 to={child.href}
//                 className={`block py-2 text-[11px] font-bold uppercase tracking-tighter transition-colors ${
//                   child.isActive
//                     ? "text-theme-front border-r-2 border-theme-act"
//                     : "text-theme-muted hover:text-theme-front"
//                 }`}
//               >
//                 {child.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Added 'toggleSidebar' as a prop
// export const Sidebar = ({ isDarkMode, toggleSidebar }) => {
//   const location = useLocation();
//   const path = location.pathname;

//   const isProductsActive =
//     path.includes("/products") || path.includes("/categories");
//   const isOrdersActive = path.includes("/orders");

//   return (
//     <aside className="w-full h-screen flex flex-col transition-colors duration-300 bg-theme-base border-r border-theme-line">
//       {/* Brand Section with ADMIN Logo and Close Button */}
//       <div className="flex items-center justify-between px-6 py-8 border-b border-theme-line mb-4">
//         <div className="flex items-center gap-3">
//           <div className="h-8 w-8 bg-theme-act flex items-center justify-center">
//             <Package className="text-theme-actfg" size={18} />
//           </div>
//           <span className="text-theme-front font-black text-xl tracking-tighter uppercase">
//             ADMIN
//           </span>
//         </div>

//         {/* Cross Button: Only visible on screens smaller than 'lg' */}
//         <button
//           onClick={toggleSidebar}
//           className="lg:hidden p-1.5 rounded-md hover:bg-theme-sub text-theme-muted hover:text-theme-front transition-colors"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar px-2">
//         <p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em] px-4 mt-4 mb-2">
//           Primary
//         </p>

//         <Link to="/dashboard">
//           <SidebarItem
//             icon={LayoutDashboard}
//             label="Dashboard"
//             active={path === "/dashboard"}
//           />
//         </Link>

//         <SidebarItem
//           icon={ShoppingBag}
//           label="Orders"
//           badge="12"
//           active={isOrdersActive}
//           defaultOpen={isOrdersActive}
//         >
//           {[
//             {
//               label: "All Orders",
//               href: "/orders",
//               isActive: path === "/orders",
//             },
//             {
//               label: "Pending",
//               href: "/orders/pending",
//               isActive: path === "/orders/pending",
//             },
//           ]}
//         </SidebarItem>

//         <SidebarItem
//           icon={Package}
//           label="Products"
//           active={isProductsActive}
//           defaultOpen={isProductsActive}
//         >
//           {[
//             {
//               label: "Inventory",
//               href: "/products",
//               isActive: path === "/products",
//             },
//             {
//               label: "Add Product",
//               href: "/products/add",
//               isActive: path === "/products/add",
//             },
//             {
//               label: "Categories",
//               href: "/categories",
//               isActive: path === "/categories",
//             },
//           ]}
//         </SidebarItem>

//         <Link to="/customers">
//           <SidebarItem
//             icon={Images}
//             label="Customers"
//             active={path === "/customers"}
//           />
//         </Link>

//         {/* --- CONTENT MANAGEMENT SECTION --- */}
//         <div className="pt-4 mt-4 border-t border-theme-line">
//           <p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em] px-4 mb-2">
//             Content Management
//           </p>

//           {/* Hero Carousel */}
//           <Link to="/website/carousel">
//             <SidebarItem
//               icon={Image}
//               label="Hero Carousel"
//               active={path === "/website/carousel"}
//             />
//           </Link>

//           {/* Featured Categories */}
//           <Link to="/website/categories">
//             <SidebarItem
//               icon={Layers}
//               label="Home Categories"
//               active={path === "/website/categories"}
//             />
//           </Link>

//           {/* Promo Banners */}
//           <Link to="/website/banners">
//             <SidebarItem
//               icon={MonitorPlay}
//               label="Promo Banners"
//               active={path === "/website/banners"}
//             />
//           </Link>

//           {/* Social Gallery: Added for Instagram images */}
//           <Link to="/website/social">
//             <SidebarItem
//               icon={Images} // Apni chaile 'Instagram' icon import kore ekhane dite paren
//               label="Social Gallery"
//               active={path === "/website/social"}
//             />
//           </Link>
//         </div>

//         <div className="pt-4 mt-4 border-t border-theme-line">
//           <p className="text-[9px] font-black text-theme-muted uppercase tracking-[0.2em] px-4 mb-2">
//             System
//           </p>
//           <SidebarItem
//             icon={BarChart3}
//             label="Analytics"
//             active={path === "/analytics"}
//           />
//           <SidebarItem
//             icon={Settings}
//             label="Settings"
//             active={path === "/settings"}
//           />
//         </div>
//       </nav>

//       {/* Footer Profile */}
//       <div className="mt-auto p-4 border-t border-theme-line bg-theme-sub">
//         <div className="flex items-center group">
//           <div className="h-9 w-9 border border-theme-line grayscale overflow-hidden">
//             <img
//               src={`https://ui-avatars.com/api/?name=Admin&background=${isDarkMode ? "fff" : "000"}&color=${isDarkMode ? "000" : "fff"}`}
//               alt="User"
//               className="h-full w-full object-cover"
//             />
//           </div>
//           <div className="ml-3 flex-1 overflow-hidden">
//             <p className="text-[11px] font-black text-theme-front uppercase tracking-tighter truncate">
//               Zayed Khan
//             </p>
//             <p className="text-[9px] font-bold text-theme-muted uppercase truncate">
//               Administrator
//             </p>
//           </div>
//           <button className="text-theme-muted hover:text-theme-front transition-colors">
//             <LogOut size={16} />
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Images,
  Settings,
  ChevronRight,
  Package,
  BarChart3,
  LogOut,
  X,
  Image,
  MonitorPlay,
  Layers,
  FolderPlus,
  List,
} from "lucide-react";

const SidebarItem = ({
  icon: Icon,
  label,
  children,
  badge,
  active,
  defaultOpen,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  const hasSubmenu = children && children.length > 0;

  useEffect(() => {
    if (defaultOpen) setIsOpen(true);
  }, [defaultOpen]);

  return (
    <div className="w-full">
      <button
        onClick={() => hasSubmenu && setIsOpen(!isOpen)}
        className={`relative w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
        ${
          active && !hasSubmenu
            ? "bg-theme-act/10 text-theme-front"
            : "text-theme-muted hover:bg-theme-sub hover:text-theme-front"
        }`}
      >
        {/* Active Left Bar */}
        {active && !hasSubmenu && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-theme-act rounded-r-full"></span>
        )}

        <Icon
          size={18}
          className={`transition-colors ${
            active
              ? "text-theme-act"
              : "text-theme-muted group-hover:text-theme-front"
          }`}
        />

        <span className="ml-3 text-[11px] font-semibold uppercase tracking-wider flex-1 text-left">
          {label}
        </span>

        {badge && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-theme-act text-theme-actfg font-bold">
            {badge}
          </span>
        )}

        {hasSubmenu && (
          <ChevronRight
            size={14}
            className={`ml-2 transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        )}
      </button>

      {hasSubmenu && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="ml-6 mt-1 space-y-1 border-l border-theme-line pl-4">
            {children.map((child, index) => (
              <Link
                key={index}
                to={child.href}
                className={`block py-2 text-[11px] font-medium uppercase tracking-wide transition-all
                ${
                  child.isActive
                    ? "text-theme-act border-r-2 border-theme-act pr-2"
                    : "text-theme-muted hover:text-theme-front"
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ isDarkMode, toggleSidebar }) => {
  const location = useLocation();
  const path = location.pathname;

  const isProductsActive =
    path.includes("/products") || path.includes("/categories");
  const isOrdersActive = path.includes("/orders");
  const isCategoryActive = path.includes("/categories");

  return (
    <aside className="w-full h-screen flex flex-col bg-theme-base border-r border-theme-line backdrop-blur-lg">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-theme-line">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-theme-act flex items-center justify-center shadow-md">
            <Package className="text-theme-actfg" size={18} />
          </div>
          <span className="text-theme-front font-extrabold text-lg tracking-tight uppercase">
            Admin Panel
          </span>
        </div>

        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-theme-sub transition"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
        <Link to="/dashboard">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={path === "/dashboard"}
          />
        </Link>

        <SidebarItem
          icon={ShoppingBag}
          label="Orders"
          badge="12"
          active={isOrdersActive}
          defaultOpen={isOrdersActive}
        >
          {[
            {
              label: "All Orders",
              href: "/orders",
              isActive: path === "/orders",
            },
            {
              label: "Pending Orders",
              href: "/orders/pending",
              isActive: path === "/orders/pending",
            },
          ]}
        </SidebarItem>

        <SidebarItem
          icon={Package}
          label="Products"
          active={isProductsActive}
          defaultOpen={isProductsActive}
        >
          {[
            {
              label: "Inventory",
              href: "/products",
              isActive: path === "/products",
            },
            {
              label: "Add Product",
              href: "/products/add",
              isActive: path === "/products/add",
            },
          ]}
        </SidebarItem>

        {/* ✅ NEW: Categories Add + List */}
        <SidebarItem
          icon={Layers}
          label="Categories"
          active={isCategoryActive}
          defaultOpen={isCategoryActive}
        >
          {[
            {
              label: "Category List",
              href: "/categories",
              isActive: path === "/categories",
            },
            {
              label: "Add Category",
              href: "/categories/add",
              isActive: path === "/categories/add",
            },
          ]}
        </SidebarItem>

        <div className="pt-4 mt-4 border-t border-theme-line">
          <Link to="/website/carousel">
            <SidebarItem
              icon={Image}
              label="Hero Carousel"
              active={path === "/website/carousel"}
            />
          </Link>

          <Link to="/website/categories">
            <SidebarItem
              icon={Layers}
              label="Home Categories"
              active={path === "/website/categories"}
            />
          </Link>

          <Link to="/website/banners">
            <SidebarItem
              icon={MonitorPlay}
              label="Promo Banners"
              active={path === "/website/banners"}
            />
          </Link>

          <Link to="/website/social">
            <SidebarItem
              icon={Images}
              label="Social Gallery"
              active={path === "/website/social"}
            />
          </Link>
        </div>

        <div className="pt-4 mt-4 border-t border-theme-line">
          <SidebarItem
            icon={BarChart3}
            label="Analytics"
            active={path === "/analytics"}
          />
          <SidebarItem
            icon={Settings}
            label="Settings"
            active={path === "/settings"}
          />
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-theme-line bg-theme-sub">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-xl overflow-hidden border border-theme-line">
            <img
              src={`https://ui-avatars.com/api/?name=Admin&background=${
                isDarkMode ? "fff" : "000"
              }&color=${isDarkMode ? "000" : "fff"}`}
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-[12px] font-semibold text-theme-front truncate">
              Zayed Khan
            </p>
            <p className="text-[10px] text-theme-muted">Administrator</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-theme-base transition">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
