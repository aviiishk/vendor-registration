import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ required for httpOnly cookies
});

// 🔥 IMPORTANT: set headers conditionally
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let browser set multipart/form-data with boundary
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export async function apiRequest<T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await axiosInstance({
      url,
      ...options,
    });

    return response.data as T;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "API request failed";

    throw new Error(message);
  }
}
