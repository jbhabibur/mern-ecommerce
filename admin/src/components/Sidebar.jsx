import React from "react";
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
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, badge, active }) => {
  return (
    <div
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200
      ${
        active
          ? "bg-theme-act text-theme-actfg shadow-sm"
          : "text-theme-muted hover:bg-theme-sub hover:text-theme-front"
      }`}
    >
      <Icon size={18} />

      <span className="ml-3 text-sm font-medium flex-1 text-left">{label}</span>

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

  // Redux logic
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // [ADDED] Fetch Orders Data for Live Badge
  // We fetch page 1 with 1 item just to get the 'totalOrders' count from the response
  const { data: orderData } = useGetOrdersQuery({ page: 1, limit: 1 });
  const totalOrdersCount = orderData?.totalOrders || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen flex flex-col bg-theme-base border-r border-theme-line">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-theme-line">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-theme-act/10 rounded-lg">
            <Package size={20} className="text-theme-act" />
          </div>
          <span className="font-bold text-lg text-theme-front tracking-tight">
            Admin
          </span>
        </div>

        <button onClick={toggleSidebar} className="lg:hidden text-theme-front">
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {/* Dashboard */}
        <Link to="/admin/dashboard">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={path === "/admin/dashboard"}
          />
        </Link>

        {/* Orders [UPDATED] */}
        <Link to="/admin/orders">
          <SidebarItem
            icon={ShoppingBag}
            label="Orders"
            // [UPDATED] badge value is now dynamic
            badge={totalOrdersCount > 0 ? totalOrdersCount.toString() : null}
            active={path.startsWith("/admin/orders")}
          />
        </Link>

        {/* Products */}
        <Link to="/admin/products">
          <SidebarItem
            icon={Package}
            label="Products"
            active={path.startsWith("/admin/products")}
          />
        </Link>

        {/* Categories */}
        <Link to="/admin/categories">
          <SidebarItem
            icon={Layers}
            label="Categories"
            active={path.startsWith("/admin/categories")}
          />
        </Link>

        {/* Admin Management Section */}
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

        {/* Website Controls */}
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

        {/* Settings & Analytics */}
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

      {/* Footer - Dynamic User Info */}
      <div className="p-4 border-t border-theme-line bg-theme-sub/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                className="w-9 h-9 rounded-full border border-theme-line object-cover"
                alt="avatar"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-theme-act text-theme-actfg flex items-center justify-center text-xs font-bold border border-theme-line uppercase">
                {user?.firstName && user?.lastName
                  ? `${user.firstName[0]}${user.lastName[0]}`
                  : "AD"}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-theme-base rounded-full"></span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-theme-front truncate">
              {user?.firstName
                ? `${user.firstName} ${user.lastName}`
                : "Guest Admin"}
            </p>
            <p className="text-[10px] text-theme-muted font-medium truncate uppercase tracking-tighter">
              {user?.role || "Administrator"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-theme-error/10 hover:text-theme-error transition-all group"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </aside>
  );
};
