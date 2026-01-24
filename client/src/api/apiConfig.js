// Local ebong Production switch korar logic
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Image path handle korar utility
export const getFullImagePath = (path) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;

  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};
