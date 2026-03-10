import React, { useState } from "react";
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
} from "lucide-react";

const SidebarItem = ({
  icon: Icon,
  label,
  children,
  badge,
  active,
  defaultOpen,
}) => {
  const [open, setOpen] = useState(defaultOpen || false);
  const hasSub = children && children.length > 0;

  return (
    <div>
      <button
        onClick={() => hasSub && setOpen(!open)}
        className={`flex items-center w-full px-4 py-3 rounded-lg transition
        ${
          active
            ? "bg-theme-act text-theme-actfg"
            : "text-theme-muted hover:bg-theme-sub hover:text-theme-front"
        }`}
      >
        <Icon size={18} />

        <span className="ml-3 text-sm font-medium flex-1 text-left">
          {label}
        </span>

        {badge && (
          <span className="text-xs bg-theme-act text-theme-actfg px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}

        {hasSub && (
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        )}
      </button>

      {hasSub && open && (
        <div className="ml-6 mt-1 space-y-1 border-l border-theme-line pl-4">
          {children.map((child, i) => (
            <Link
              key={i}
              to={child.href}
              className={`block py-2 text-xs font-medium transition
              ${
                child.isActive
                  ? "text-theme-front"
                  : "text-theme-muted hover:text-theme-front"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ toggleSidebar }) => {
  const location = useLocation();
  const path = location.pathname;

  const isProductsActive =
    path.includes("/products") || path.includes("/categories");
  const isOrdersActive = path.includes("/orders");
  const isCategoryActive = path.includes("/categories");

  return (
    <aside className="w-64 h-screen flex flex-col bg-theme-base border-r border-theme-line">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-theme-line">
        <div className="flex items-center gap-3">
          <Package size={20} />
          <span className="font-bold text-lg text-theme-front">Admin</span>
        </div>

        <button onClick={toggleSidebar} className="lg:hidden text-theme-front">
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <Link to="/admin/dashboard">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={path === "/admin/dashboard"}
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
              href: "/admin/orders",
              isActive: path === "/admin/orders",
            },
            {
              label: "Pending Orders",
              href: "/admin/orders/pending",
              isActive: path === "/admin/orders/pending",
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
              href: "/admin/products",
              isActive: path === "/admin/products",
            },
            {
              label: "Add Product",
              href: "/admin/products/add",
              isActive: path === "/admin/products/add",
            },
          ]}
        </SidebarItem>

        <SidebarItem
          icon={Layers}
          label="Categories"
          active={isCategoryActive}
          defaultOpen={isCategoryActive}
        >
          {[
            {
              label: "Category List",
              href: "/admin/categories",
              isActive: path === "/admin/categories",
            },
            {
              label: "Add Category",
              href: "/admin/categories/add",
              isActive: path === "/admin/categories/add",
            },
          ]}
        </SidebarItem>

        {/* Website Controls */}
        <div className="pt-4 mt-4 border-t border-theme-line">
          <Link to="/admin/website/carousel">
            <SidebarItem
              icon={Image}
              label="Hero Carousel"
              active={path === "/admin/website/carousel"}
            />
          </Link>

          <Link to="/admin/website/banners">
            <SidebarItem
              icon={MonitorPlay}
              label="Promo Banners"
              active={path === "/admin/website/banners"}
            />
          </Link>

          <Link to="/admin/website/social">
            <SidebarItem
              icon={Images}
              label="Social Gallery"
              active={path === "/admin/website/social"}
            />
          </Link>
        </div>

        {/* Settings */}
        <div className="pt-4 mt-4 border-t border-theme-line">
          <Link to="/admin/analytics">
            <SidebarItem
              icon={BarChart3}
              label="Analytics"
              active={path === "/admin/analytics"}
            />
          </Link>

          <Link to="/admin/settings">
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={path === "/admin/settings"}
            />
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-theme-line">
        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=Admin"
            className="w-9 h-9 rounded-full"
          />

          <div className="flex-1">
            <p className="text-sm font-medium text-theme-front">Admin</p>
            <p className="text-xs text-theme-muted">Administrator</p>
          </div>

          <button className="p-2 rounded hover:bg-theme-sub transition-colors">
            <LogOut size={16} className="text-theme-front" />
          </button>
        </div>
      </div>
    </aside>
  );
};
