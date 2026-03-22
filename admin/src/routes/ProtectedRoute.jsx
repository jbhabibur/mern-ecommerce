import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeLeft = (decodedToken.exp - currentTime) * 1000; // Time in milliseconds

      if (timeLeft <= 0) {
        // Already expired
        handleLogout();
      } else {
        // Set a timer to auto-redirect exactly when it expires
        const timer = setTimeout(() => {
          console.warn("Token expired! Auto-redirecting...");
          handleLogout();
        }, timeLeft);

        return () => clearTimeout(timer); // Cleanup timer if user leaves the page
      }
    } catch (error) {
      handleLogout();
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  // Initial check for rendering
  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp < Date.now() / 1000) {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/" replace />;
  }

  return children;
};
