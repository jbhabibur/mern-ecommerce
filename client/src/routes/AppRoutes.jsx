import { createBrowserRouter } from "react-router";

import { MainLayout } from "../layout/MainLayout";

import { Home } from "../pages/Home";
import { CategoriesPage } from "../pages/CategoriesPage";
import { ProductOverview } from "../pages/ProductOverview";
import { ViewCart } from "../pages/ViewCart";
import { AllCategories } from "../pages/AllCategories";
import { ContactPage } from "../pages/ContactPage";
import { RegisterPage } from "../pages/RegisterPage";
import { VerifyOTPPage } from "../pages/VerifyOTPPage";
import { LoginPage } from "../pages/LoginPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { UserLayout } from "../layout/UserLayout";

import { AddressBook } from "../features/user/components/AddressBook";
import { AddAddressForm } from "../features/user/components/AddAddressForm";

import { ProtectedRoute } from "./ProtectedRoute";
import { VerifySuccess } from "../pages/VerifySuccess";
import { RecoverPage } from "../pages/RecoverPage";

import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderSuccess } from "../pages/OrderSuccess";

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
        element: <ProductOverview />,
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
      {
        path: "/account/verify-otp",
        element: <VerifyOTPPage />,
      },
      {
        path: "/account/login",
        element: <LoginPage />,
      },
      {
        path: "/account/recover",
        element: <RecoverPage />,
      },
      {
        path: "/account/verify-success",
        element: <VerifySuccess />,
      },

      // --- Password Reset Routes ---

      {
        // This matches /account/reset-password/ANY_TOKEN
        path: "/account/reset-password/:token",
        element: <ResetPasswordPage />,
      },

      // --- Account/User Routes with Sidebar Layout ---
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "address",
            element: <AddressBook />,
          },
          {
            path: "add-new-address",
            element: <AddAddressForm />,
          },
          {
            path: "edit-address/:id",
            element: <AddAddressForm />,
          },
        ],
      },
    ],
  },
  // Checkout route stays outside MainLayout for a clean, distraction-free UI
  {
    path: "/checkouts/cn/:token/*",
    element: <CheckoutPage />,
  },
  {
    path: "/order-success",
    element: <OrderSuccess />, // Header/Footer charai dekhabe
  },
]);

export default router;
