/**
 * API CONFIGURATION
 * Handles environment-specific Backend URL switching (Local vs Production).
 */
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ASSET PATH NORMALIZER
 * Converts relative database paths into absolute asset URLs.
 * @param {string} path
 */
export const getFullImagePath = (path) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;

  // Prevent double-slashes by trimming leading "/"
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};
