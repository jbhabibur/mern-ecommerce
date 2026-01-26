import { createBrowserRouter } from "react-router";

import { MainLayout } from "../layout/MainLayout";
import { Home } from "../pages/Home";
import { CategoriesPage } from "../pages/CategoriesPage";
import { SingleProduct } from "../pages/SingleProduct";
import { ViewCart } from "../pages/ViewCart";
import { AllCategories } from "../pages/AllCategories";
import { ContactPage } from "../pages/ContactPage";
import { RegisterPage } from "../pages/RegisterPage";

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
      {
        path: "/categories",
        element: <AllCategories />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/account/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
