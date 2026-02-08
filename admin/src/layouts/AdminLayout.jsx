import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { useTheme } from "../contexts/ThemeContext";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    // "transition-all" ba "duration" shob bad dewa hoyeche
    <div className="flex h-screen overflow-hidden bg-theme-base">
      {/* SIDEBAR CONTAINER */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform 
          lg:relative lg:translate-x-0 
          ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          border-r border-theme-line bg-theme-base`}
      >
        <Sidebar isDarkMode={isDarkMode} />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          setIsDarkMode={toggleTheme}
        />

        {/* Background color change-o ekhon instant hobe */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 bg-theme-sub">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};
