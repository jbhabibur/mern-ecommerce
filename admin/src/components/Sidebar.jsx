import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useGetOrdersQuery } from "../redux/service/adminOrderApi";
import {
  LayoutDashboard,
  ShoppingBag,
  Images,
  Settings,
  Package,
  BarChart3,
  LogOut,
  X,
  Image,
  MonitorPlay,
  Layers,
  Users,
  UserPlus,
  ChevronDown,
  UserCheck,
  TrendingUp,
  Activity,
} from "lucide-react";
import { AdminLogo } from "./AdminLogo";

/**
 * SidebarItem Component
 * Manages individual navigation links and sub-menu items with dynamic styling.
 */
const SidebarItem = ({ icon: Icon, label, badge, active, isSubItem }) => {
  return (
    <div
      className={`flex items-center w-full px-4 rounded-lg transition-all duration-200
      ${isSubItem ? "pl-5 py-2" : "py-3"}
      ${
        active
          ? isSubItem
            ? "bg-theme-act/15 text-theme-act font-bold shadow-none" // Subtle highlight for active sub-item
            : "bg-theme-act text-theme-actfg shadow-md scale-[1.02]" // Solid highlight for main item
          : "text-theme-muted hover:bg-theme-sub hover:text-theme-front"
      }`}
    >
      <Icon size={isSubItem ? 14 : 18} />

      <span
        className={`ml-3 flex-1 text-left ${
          isSubItem ? "text-[13px]" : "text-sm font-medium"
        }`}
      >
        {label}
      </span>

      {badge && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            active
              ? "bg-theme-actfg text-theme-act"
              : "bg-theme-act text-theme-actfg"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export const Sidebar = ({ toggleSidebar }) => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to manage the visibility of the Analytics dropdown
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(
    path.includes("/admin/analytics"),
  );

  const { user } = useSelector((state) => state.auth);

  // RTK Query: Fetch real-time order count for the notification badge
  const { data: orderData } = useGetOrdersQuery({ page: 1, limit: 1 });
  const totalOrdersCount = orderData?.totalOrders || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen flex flex-col bg-theme-base border-r border-theme-line">
      {/* Sidebar Header: Brand Logo and Title */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-theme-line">
        <div className="flex items-center gap-3">
          <AdminLogo />
        </div>
        {/* Mobile close button */}
        <button onClick={toggleSidebar} className="lg:hidden text-theme-front">
          <X size={18} />
        </button>
      </div>

      {/* Main Navigation Container */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {/* Section: Core Business Logic */}
        <Link to="/admin/dashboard">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={path === "/admin/dashboard"}
          />
        </Link>

        <Link to="/admin/orders">
          <SidebarItem
            icon={ShoppingBag}
            label="Orders"
            badge={totalOrdersCount > 0 ? totalOrdersCount.toString() : null}
            active={path.startsWith("/admin/orders")}
          />
        </Link>

        <Link to="/admin/products">
          <SidebarItem
            icon={Package}
            label="Products"
            active={path.startsWith("/admin/products")}
          />
        </Link>

        <Link to="/admin/categories">
          <SidebarItem
            icon={Layers}
            label="Categories"
            active={path.startsWith("/admin/categories")}
          />
        </Link>

        {/* Section: Admin & Staff Management */}
        <div className="pt-4 mt-4 border-t border-theme-line">
          <p className="px-4 mb-2 text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-50">
            Admin Management
          </p>
          <Link to="/admin/admins/manage">
            <SidebarItem
              icon={Users}
              label="Staff List"
              active={path === "/admin/admins/manage"}
            />
          </Link>
          <Link to="/admin/admins/invite">
            <SidebarItem
              icon={UserPlus}
              label="Invite Admin"
              active={path === "/admin/admins/invite"}
            />
          </Link>
        </div>

        {/* Section: Website Content Management (CMS) */}
        <div className="pt-4 mt-4 border-t border-theme-line">
          <p className="px-4 mb-2 text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-50">
            Website CMS
          </p>
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

        {/* Section: Analytics & Business Reports */}
        <div className="pt-4 mt-4 border-t border-theme-line">
          <p className="px-4 mb-2 text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-50">
            Reports & Config
          </p>

          {/* Collapsible Analytics Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
              className="w-full flex items-center justify-between outline-none"
            >
              <SidebarItem
                icon={BarChart3}
                label="Analytics"
                active={path.includes("/admin/analytics")}
              />
              <div
                className={`absolute right-4 transition-transform duration-300 ${
                  isAnalyticsOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDown size={14} className="text-theme-muted" />
              </div>
            </button>

            {/* Sub-menu with Vertical Visual Indicator */}
            {isAnalyticsOpen && (
              <div className="mt-1 ml-2 relative space-y-1 animate-in slide-in-from-top-1 duration-300">
                {/* Vertical Line UI */}
                <div className="absolute left-0 top-0 bottom-2 w-[1.5px] bg-theme-line/80 rounded-full"></div>

                {/* Sub-item: Customer Insights */}
                <Link to="/admin/analytics/customers" className="block">
                  <SidebarItem
                    icon={UserCheck}
                    label="Customer Insights"
                    isSubItem={true}
                    active={path === "/admin/analytics/customers"}
                  />
                </Link>

                {/* Sub-item: Product Performance */}
                <Link to="/admin/analytics/products" className="block">
                  <SidebarItem
                    icon={Activity}
                    label="Product Performance"
                    isSubItem={true}
                    active={path === "/admin/analytics/products"}
                  />
                </Link>
              </div>
            )}
          </div>

          <Link to="/admin/settings" className="block mt-1">
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={path === "/admin/settings"}
            />
          </Link>
        </div>
      </nav>

      {/* User Profile Footer: Displays logged-in admin details */}
      <div className="p-4 border-t border-theme-line bg-theme-sub/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                className="w-9 h-9 rounded-full border border-theme-line object-cover"
                alt="admin avatar"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-theme-act text-theme-actfg flex items-center justify-center text-xs font-bold border border-theme-line">
                {user?.firstName?.[0] || "H"}
                {user?.lastName?.[0] || "R"}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-theme-base rounded-full"></span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-theme-front truncate">
              {user?.firstName
                ? `${user.firstName} ${user.lastName}`
                : "Habibur Rahman"}
            </p>
            <p className="text-[10px] text-theme-muted font-bold truncate uppercase tracking-tighter">
              {user?.role || "Super-Admin"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-theme-error/10 hover:text-theme-error transition-all group"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </aside>
  );
};
