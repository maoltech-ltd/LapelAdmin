import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://lapel-admin-1.onrender.com';
// Lapel (the main backend) serves the admin API under /api/v1/{device}/admin/**.
// To roll back to the old Lapel-Admin backend, point this at it and revert the /admin path prefix.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';

export const PERMISSION_DENIED_MESSAGE = "You don't have permission to perform this action.";
// Fired on every 403 so a single global notice (PermissionDeniedNotice) can show it.
export const PERMISSION_DENIED_EVENT = 'lapel:permission-denied';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // You can get token from localStorage or cookies
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors globally
    // A 401 from login/password-reset means bad credentials, not an expired session:
    // keep the user on the page and surface the server's message instead of reloading.
    const isPublicAuthCall = /\/admin\/admins\/(login|password-reset)/.test(error.config?.url || '');
    if (error.response?.status === 401 && isPublicAuthCall) {
      const data = error.response.data;
      if (data && typeof data === 'object' && typeof data.message === 'string' && data.message.trim()) {
        error.message = data.message;
      }
    } else if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // The API enforces per-role permissions (@PreAuthorize). Don't log the admin
      // out; surface a readable message instead of "Request failed with status code 403".
      // Slices read `error.message`, pages read `response.data.message` — set both.
      const data = error.response.data;
      const serverMessage =
        data && typeof data === 'object' && typeof data.message === 'string' && data.message.trim()
          ? data.message
          : '';
      const message = serverMessage || PERMISSION_DENIED_MESSAGE;
      error.message = message;
      if (data && typeof data === 'object') {
        data.message = message;
      } else {
        error.response.data = { code: 403, success: false, message };
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(PERMISSION_DENIED_EVENT, { detail: { message } }));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;