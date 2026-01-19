import { createBrowserRouter } from "react-router";

import { MainLayout } from "../layout/MainLayout";
import { Home } from "../pages/Home";
import { CategoriesPage } from "../pages/CategoriesPage";
import { SingleProduct } from "../pages/SingleProduct";
import { ViewCart } from "../pages/ViewCart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/categories/:categoryName",
        element: <CategoriesPage />,
      },
      {
        path: "/products/:slug",
        element: <SingleProduct />,
      },
      {
        path: "/cart",
        element: <ViewCart />,
      },
    ],
  },
]);

export default router;
