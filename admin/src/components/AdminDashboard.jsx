import React, { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Menu,
  X,
  Sliders,
  ShoppingBag, // New icon for Products
} from "lucide-react";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";
import CarouselManager from "./CarouselManager";
import CategoriesManager from "./CategoriesManager";
import AddProduct from "./AddProduct"; // Import the AddProduct component

/**
 * AdminDashboard Component
 * Handles the navigation and dynamic content rendering for the Admin Panel.
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("list"); // Stores the currently active navigation ID
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  /**
   * Sidebar configuration array for scalability.
   * Add new menu items here to expand the dashboard functionality.
   */
  const menuItems = [
    { id: "list", name: "Category List", icon: <List size={20} /> },
    { id: "add", name: "Add Category", icon: <PlusCircle size={20} /> },
    {
      id: "add-product",
      name: "Add Product",
      icon: <ShoppingBag size={20} />,
    }, // New tab for Product Management
    { id: "carousel", name: "Carousel Control", icon: <Sliders size={20} /> },
    {
      id: "categories",
      name: "Manage Categories",
      icon: <Sliders size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* --- Sidebar Navigation --- */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Branding & Sidebar Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <h1
            className={`${!isSidebarOpen && "hidden"} font-bold text-xl tracking-tight`}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-slate-800 rounded-md transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-4 transition-all ${
                activeTab === item.id
                  ? "bg-blue-600 text-white border-r-4 border-blue-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="min-w-[24px]">{item.icon}</span>
              <span
                className={`${!isSidebarOpen && "hidden"} ml-4 font-medium`}
              >
                {item.name}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* --- Main Content Container --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm h-16 flex justify-between items-center px-6 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-800">
                Administrator
              </span>
              <span className="text-xs text-green-500">Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Viewport Section */}
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === "add" && <AddCategory />}
            {activeTab === "list" && <CategoryList />}
            {activeTab === "carousel" && <CarouselManager />}
            {activeTab === "categories" && <CategoriesManager />}

            {/* --- Product Management Component --- */}
            {activeTab === "add-product" && <AddProduct />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
