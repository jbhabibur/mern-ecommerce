import { createBrowserRouter } from "react-router";

import { MainLayout } from "../layout/MainLayout";
import { Home } from "../pages/Home";
import { CategoriesPage } from "../pages/CategoriesPage";

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
    ],
  },
]);

export default router;
