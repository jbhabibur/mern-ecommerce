import { createBrowserRouter } from "react-router";

import { AdminLayout } from "../layouts/AdminLayout";
import { AddProduct } from "../features/products/AddProduct";
import { PromoManager } from "../features/storefront/PromoManager";

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
    ],
  },
]);

export default router;
