import { createBrowserRouter, Navigate } from "react-router";

import { LandingPage } from "../features/auth/LandingPage";
import { LoginPage } from "../features/auth/LoginPage";
import { SetupAdmin } from "../features/auth/SetupAdmin";

import { AdminLayout } from "../layouts/AdminLayout";

import { CarouselManager } from "../features/storefront/CarouselManager";
import { PromoManager } from "../features/storefront/PromoManager";
import { SocialMediaManager } from "../features/storefront/SocialMediaManager";

import { CategoriesManager } from "../features/storefront/CategoriesManager";
import { AddCategory } from "../components/AddCategory";

import { Dashboard } from "../features/dashboard/Dashboard";
import { ProductInventory } from "../features/products/ProductInventory";

import { AllOrders } from "../features/orders/AllOrders";
import { InviteAdmin } from "../features/admins/InviteAdmin";
import { StaffList } from "../features/admins/StaffList";

const router = createBrowserRouter([
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

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "products/",
        element: <ProductInventory />,
      },
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
      {
        path: "categories",
        element: <CategoriesManager />,
      },

      {
        path: "categories/add",
        element: <AddCategory />,
      },
      {
        path: "/admin/orders",
        element: <AllOrders />,
      },
      // Invite Admin Route Added
      {
        path: "admins/invite",
        element: <InviteAdmin />,
      },
      {
        path: "admins/manage",
        element: <StaffList />,
      },
    ],
  },
]);

export default router;
