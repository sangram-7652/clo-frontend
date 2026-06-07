import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.clo.co.in/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach Bearer token ───────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale session data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login. Using window.location because we are outside React
      // context here. The current URL is preserved as ?redirect= for post-login.
      const currentPath = window.location.pathname + window.location.search;
      const isLoginPage = currentPath.startsWith("/account/login");
      if (!isLoginPage) {
        window.location.href = `/account/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

