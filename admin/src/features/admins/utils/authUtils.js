import { jwtDecode } from "jwt-decode";

/**
 * Decodes the JWT token from localStorage to retrieve user identity and role.
 * @returns {Object|null} The decoded user object or null if no token exists/is invalid.
 */
export const getAuthUser = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // Return a structured object based on your JWT payload
    return {
      id: decoded.id || decoded._id,
      role: decoded.role,
      email: decoded.email,
      // You can add an expiration check here
      isExpired: decoded.exp < Date.now() / 1000,
    };
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

/**
 * Specifically checks if the current user has Super Admin privileges.
 * @returns {boolean}
 */
export const isSuperAdmin = () => {
  const user = getAuthUser();
  return user?.role === "super-admin" && !user?.isExpired;
};
