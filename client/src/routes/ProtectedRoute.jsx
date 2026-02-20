import { useSelector, useDispatch } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setLogout } from "../redux/slices/authSlice";

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoggedIn, token } = useSelector((state) => state.auth);

  // Current path capture koro (e.g., /checkouts/cn/...)
  const currentPath = encodeURIComponent(location.pathname + location.search);
  const loginUrlWithRedirect = `/account/login?return_to=${currentPath}`;

  // 1. Check if the user is logged in via Redux
  if (!isLoggedIn || !token) {
    // Navigate korar somoy query parameter shoho login page-e pathao
    return <Navigate to={loginUrlWithRedirect} replace />;
  }

  // 2. Verify if the token is expired
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setLogout());

      return <Navigate to={loginUrlWithRedirect} replace />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    dispatch(setLogout());
    return <Navigate to={loginUrlWithRedirect} replace />;
  }

  return children;
};
