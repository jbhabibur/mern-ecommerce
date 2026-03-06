import { createBrowserRouter, Navigate } from "react-router";

import { LandingPage } from "../features/auth/LandingPage";
import { LoginPage } from "../features/auth/LoginPage";

import { AdminLayout } from "../layouts/AdminLayout";
import { AddProduct } from "../features/products/AddProduct";
import { PromoManager } from "../features/storefront/PromoManager";
import { SocialMediaManager } from "../features/storefront/SocialMediaManager";

import { CategoriesManager } from "../components/CategoriesManager";
import { AddCategory } from "../components/AddCategory";

import { Dashboard } from "../features/dashboard/Dashboard";
import { ProductInventory } from "../features/products/ProductInventory";

import { AllOrders } from "../features/orders/AllOrders";

const router = createBrowserRouter([
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
        path: "products/add",
        element: <AddProduct />,
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
    ],
  },
]);

export default router;
