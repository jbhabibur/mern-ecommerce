import { useSelector, useDispatch } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setLogout } from "../redux/slices/authSlice";

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoggedIn, token, user } = useSelector((state) => state.auth);

  // Capture current path for redirect after login
  const currentPath = encodeURIComponent(location.pathname + location.search);
  const loginUrlWithRedirect = `/account/login?return_to=${currentPath}`;

  // 1. Check authentication status
  // Validates if the user is logged in via manual token or social profile
  const isAuthenticated = isLoggedIn && (token || user?.id || user?._id);

  if (!isAuthenticated) {
    return <Navigate to={loginUrlWithRedirect} replace />;
  }

  // 2. Token Expiration Check
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Clear storage and state if token expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(setLogout());

        return <Navigate to={loginUrlWithRedirect} replace />;
      }
    } catch (error) {
      // If token is invalid but social user data exists, allow access
      // Otherwise, force logout
      if (!user?.id && !user?._id) {
        localStorage.removeItem("token");
        dispatch(setLogout());
        return <Navigate to={loginUrlWithRedirect} replace />;
      }
    }
  }

  return children;
};
