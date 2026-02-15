import { useSelector, useDispatch } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Install using: npm install jwt-decode
import { setLogout } from "../redux/slices/authSlice"; // Ensure the path is correct

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Access auth state from Redux store
  const { isLoggedIn, token } = useSelector((state) => state.auth);

  // 1. Check if the user is logged in via Redux
  if (!isLoggedIn || !token) {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  // 2. Verify if the token is expired
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decoded.exp < currentTime) {
      // Token has expired!
      localStorage.removeItem("token");
      dispatch(setLogout()); // This clears the Redux state and removes "My Account"
      return (
        <Navigate to="/account/login" state={{ from: location }} replace />
      );
    }
  } catch (error) {
    // If decoding fails, treat it as an invalid token
    dispatch(logout());
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  // Render children if token is valid and authenticated
  return children;
};
