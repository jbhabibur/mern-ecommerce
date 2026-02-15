// Environment-based API URL logic
export const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Safe image path utility
export const getFullImagePath = (path) => {
  // Handle non-string or empty inputs
  if (!path || typeof path !== "string") return "/placeholder.jpg";

  if (path.startsWith("http")) return path;

  // Normalize path by removing leading slash
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};
