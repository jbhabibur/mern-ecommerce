import { createBrowserRouter } from "react-router";

import { AdminLayout } from "../layouts/AdminLayout";
import { AddProduct } from "../features/products/AddProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: "products/add",
        element: <AddProduct />,
      },
    ],
  },
]);

export default router;
