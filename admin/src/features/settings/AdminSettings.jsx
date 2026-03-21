import React, { useState } from "react";
import {
  Save,
  Truck,
  CreditCard,
  Layout,
  Store,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { hasAccess } from "../../utils/authUtils";

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  // --- Strict Permission Check ---
  const isSuperAdmin = hasAccess("super-admin");

  // State to manage MENSFASHION configurations
  const [settings, setSettings] = useState({
    shopName: "MENSFASHION",
    email: "support@mensfashion.com",
    orderPrefix: "MF-",
    deliveryInside: 80,
    deliveryOutside: 150,
    freeShippingLimit: 3000,
    codEnabled: true,
    bkashNumber: "",
    sslKey: "",
    announcement: "Special Eid Discount - 20% Off!",
    lowStockBadge: true,
  });

  // Handle dynamic input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save logic
  const handleSave = () => {
    if (!isSuperAdmin) return;
    console.log("Updating MENSFASHION Settings:", settings);
    alert("MENSFASHION settings updated successfully!");
  };

  // Unauthorized UI jodi super-admin na hoy
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="bg-red-500/10 p-6 rounded-full mb-6">
          <ShieldAlert size={64} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-theme-front uppercase tracking-tight">
          Access Restricted
        </h2>
        <p className="text-theme-muted mt-2 max-w-md">
          System settings are only accessible by a <strong>Super Admin</strong>.
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General", icon: <Store size={18} /> },
    { id: "shipping", label: "Shipping", icon: <Truck size={18} /> },
    { id: "payment", label: "Payment", icon: <CreditCard size={18} /> },
    { id: "ui", label: "Appearance", icon: <Layout size={18} /> },
  ];

  const inputClass =
    "mt-1 w-full bg-theme-base border border-theme-line p-2.5 rounded-lg focus:outline-none focus:border-theme-act text-theme-front transition-all";

  return (
    <div className="p-4 md:p-8 bg-theme-base min-h-screen text-theme-front font-poppins">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">
              System Settings
            </h1>
            <p className="text-sm text-theme-muted">
              Configure MENSFASHION store operations
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-theme-act hover:opacity-90 text-theme-actfg px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all active:scale-95"
          >
            <Save size={18} /> Save All Changes
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-theme-act text-theme-actfg shadow-md"
                    : "text-theme-muted hover:bg-theme-sub hover:text-theme-front"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Panels */}
          <div className="flex-1 bg-theme-sub border border-theme-line p-6 rounded-xl shadow-sm min-h-[420px]">
            {/* 1. General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-semibold border-b border-theme-line pb-2">
                  Brand Identity
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  <label className="block text-sm font-medium">
                    Shop Name
                    <input
                      name="shopName"
                      type="text"
                      value={settings.shopName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Contact Email
                    <input
                      name="email"
                      type="email"
                      value={settings.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Order ID Prefix
                    <input
                      name="orderPrefix"
                      type="text"
                      value={settings.orderPrefix}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 2. Shipping Settings */}
            {activeTab === "shipping" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-semibold border-b border-theme-line pb-2">
                  Shipping Rates (BDT)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className="block text-sm font-medium">
                    Inside Dhaka
                    <input
                      name="deliveryInside"
                      type="number"
                      value={settings.deliveryInside}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Outside Dhaka
                    <input
                      name="deliveryOutside"
                      type="number"
                      value={settings.deliveryOutside}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium">
                  Free Shipping Threshold
                  <input
                    name="freeShippingLimit"
                    type="number"
                    value={settings.freeShippingLimit}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <div className="p-4 bg-theme-line/20 border border-theme-line rounded-lg flex gap-3 text-theme-muted">
                  <AlertTriangle
                    size={20}
                    className="text-amber-500 shrink-0"
                  />
                  <p className="text-xs leading-relaxed">
                    Courier API credentials should be managed via environment
                    variables for security.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Payment Settings */}
            {activeTab === "payment" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-semibold border-b border-theme-line pb-2">
                  Payment Gateways
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-theme-base rounded-lg border border-theme-line">
                    <span className="font-medium text-sm">
                      Enable Cash on Delivery (COD)
                    </span>
                    <input
                      name="codEnabled"
                      type="checkbox"
                      checked={settings.codEnabled}
                      onChange={handleChange}
                      className="w-5 h-5 accent-theme-act cursor-pointer"
                    />
                  </div>
                  <label className="block text-sm font-medium">
                    Bkash Merchant Number
                    <input
                      name="bkashNumber"
                      type="text"
                      value={settings.bkashNumber}
                      onChange={handleChange}
                      placeholder="017XXXXXXXX"
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    SSLCommerz API Key
                    <input
                      name="sslKey"
                      type="password"
                      value={settings.sslKey}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 4. Appearance Settings */}
            {activeTab === "ui" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-semibold border-b border-theme-line pb-2">
                  Storefront Appearance
                </h3>
                <label className="block text-sm font-medium">
                  Announcement Bar
                  <textarea
                    name="announcement"
                    value={settings.announcement}
                    onChange={handleChange}
                    className={`${inputClass} h-28 resize-none`}
                  />
                </label>
                <div className="flex items-center justify-between p-4 bg-theme-base rounded-lg border border-theme-line">
                  <span className="font-medium text-sm">
                    Low Stock Indicator Badge
                  </span>
                  <input
                    name="lowStockBadge"
                    type="checkbox"
                    checked={settings.lowStockBadge}
                    onChange={handleChange}
                    className="w-5 h-5 accent-theme-act cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
