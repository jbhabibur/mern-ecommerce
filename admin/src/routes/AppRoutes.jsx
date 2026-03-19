import { createBrowserRouter, Navigate } from "react-router";

// Auth Features
import { LandingPage } from "../features/auth/LandingPage";
import { LoginPage } from "../features/auth/LoginPage";
import { SetupAdmin } from "../features/auth/SetupAdmin";

// Layouts
import { AdminLayout } from "../layouts/AdminLayout";

// Storefront Content Management
import { CarouselManager } from "../features/storefront/CarouselManager";
import { PromoManager } from "../features/storefront/PromoManager";
import { SocialMediaManager } from "../features/storefront/SocialMediaManager";

// Product & Category Management
import { CategoriesManager } from "../features/storefront/CategoriesManager";
import { AddCategory } from "../components/AddCategory";
import { ProductInventory } from "../features/products/ProductInventory";

// Admin & Dashboard Features
import { Dashboard } from "../features/dashboard/Dashboard";
import { AllOrders } from "../features/orders/AllOrders";
import { InviteAdmin } from "../features/admins/InviteAdmin";
import { StaffList } from "../features/admins/StaffList";

// Settings & Analytics
import { AdminSettings } from "../features/settings/AdminSettings";

import { Analytics } from "../features/analytics/Analytics";
import { ProductPerformance } from "../features/analytics/components/ProductPerformance";

import { CustomerInsights } from "../features/analytics/components/CustomerInsights";

// Protected routes
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  /* --- Public & Setup Routes --- */
  {
    path: "/account/setup-admin",
    element: <SetupAdmin />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  /* --- Protected Admin Routes --- */
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // Redirect /admin to /admin/dashboard by default
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },

      /* --- Core Commerce Routes --- */
      {
        path: "products", // Fixed: removed trailing slash
        element: <ProductInventory />,
      },
      {
        path: "orders", // Fixed: relative path used within parent
        element: <AllOrders />,
      },
      {
        path: "categories",
        element: <CategoriesManager />,
      },
      {
        path: "categories/add",
        element: <AddCategory />,
      },

      /* --- Website CMS Routes --- */
      {
        path: "website/carousel",
        element: <CarouselManager />,
      },
      {
        path: "website/banners",
        element: <PromoManager />,
      },
      {
        path: "website/social",
        element: <SocialMediaManager />,
      },

      /* --- Admin & Staff Management --- */
      {
        path: "admins/invite",
        element: <InviteAdmin />,
      },
      {
        path: "admins/manage",
        element: <StaffList />,
      },

      /* --- Analytics (Nested for Layout support) --- */
      {
        path: "analytics",
        element: <Analytics />,
        children: [
          {
            index: true,
            element: <Navigate to="customers" replace />,
          },
          {
            path: "customers",
            element: <CustomerInsights />,
          },
          { path: "products", element: <ProductPerformance /> },
        ],
      },

      /* --- System Settings --- */
      {
        path: "settings",
        element: <AdminSettings />,
      },
    ],
  },
]);

export default router;
