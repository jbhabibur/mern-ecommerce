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

import { ManageAccount } from "../features/user/components/ManageAccount";
import { OrderTrackingDetails } from "../features/user/components/OrderTrackingDetails";
import { MyOrders } from "../features/user/components/MyOrders";
import { AddressBook } from "../features/user/components/AddressBook";
import { AddAddressForm } from "../features/user/components/AddAddressForm";
import { UserProfile } from "../features/user/components/UserProfile";

import { ProtectedRoute } from "./ProtectedRoute";
import { VerifySuccess } from "../pages/VerifySuccess";
import { RecoverPage } from "../pages/RecoverPage";

import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderSuccess } from "../pages/OrderSuccess";

// Comming soon
import { ComingSoon } from "../components/shared/ComingSoon";

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
            index: true,
            element: <ManageAccount />,
          },
          {
            path: "orders/:id/track",
            element: <OrderTrackingDetails />,
          },
          {
            path: "orders",
            element: <MyOrders />,
          },
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
          {
            path: "profile",
            element: <UserProfile />,
          },
          {
            path: "payment",
            element: <ComingSoon />,
          },
          {
            path: "cancellations",
            element: <ComingSoon />,
          },
          {
            path: "returns",
            element: <ComingSoon />,
          },
          {
            path: "wishlist",
            element: <ComingSoon />,
          },
          {
            path: "reviews",
            element: <ComingSoon />,
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
