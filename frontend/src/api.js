const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://flashbackqa-api.onrender.com" : "http://localhost:5000");

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
