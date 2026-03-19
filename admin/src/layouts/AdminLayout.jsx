import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { useTheme } from "../contexts/ThemeContext";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-theme-base text-theme-front overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        border-r border-theme-line bg-theme-base`}
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </aside>

      {/* Main Section */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          setIsDarkMode={toggleTheme}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-theme-sub">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden
        transition-opacity duration-300
        ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />
    </div>
  );
};
