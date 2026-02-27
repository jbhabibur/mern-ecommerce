import { createBrowserRouter } from "react-router";

import { AdminLayout } from "../layouts/AdminLayout";
import { AddProduct } from "../features/products/AddProduct";
import { PromoManager } from "../features/storefront/PromoManager";
import { SocialMediaManager } from "../features/storefront/SocialMediaManager";

import { CategoriesManager } from "../components/CategoriesManager";
import { AddCategory } from "../components/AddCategory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: "products/add",
        element: <AddProduct />,
      },
      {
        path: "/website/banners",
        element: <PromoManager />,
      },
      {
        path: "/website/social",
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
    ],
  },
]);

export default router;
