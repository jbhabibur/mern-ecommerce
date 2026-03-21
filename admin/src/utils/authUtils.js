import { jwtDecode } from "jwt-decode";

/**
 * Decodes the JWT token from localStorage to retrieve user identity and role.
 * @returns {Object|null} The decoded user object or null if no token exists.
 */
export const getAuthUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // Check if the token is expired
    const currentTime = Date.now() / 1000;
    const isExpired = decoded.exp < currentTime;

    return {
      id: decoded.id || decoded._id,
      role: decoded.role,
      email: decoded.email,
      isExpired: isExpired,
    };
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

/**
 * Checks if the current user has any of the required roles.
 * Supports passing multiple roles: hasAccess("super-admin", "manager")
 * * @param {...string} allowedRoles - The roles permitted to perform the action.
 * @returns {boolean}
 */
export const hasAccess = (...allowedRoles) => {
  const user = getAuthUser();

  // If there's no user or the token is expired, deny access
  if (!user || user.isExpired) return false;

  // If no specific roles are required, just being logged in is enough
  if (allowedRoles.length === 0) return true;

  // Check if the user's role is in the list of allowed roles
  return allowedRoles.includes(user.role);
};

/**
 * Specifically checks for Super Admin privileges.
 * (Keeping this as a helper for very common checks)
 */
export const isSuperAdmin = () => {
  return hasAccess("super-admin");
};
