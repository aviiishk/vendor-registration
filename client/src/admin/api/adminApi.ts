import { apiRequest } from "@/services/api";

export type AdminUser = {
  id: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
};

export function adminLogin(payload: {
  email: string;
  password: string;
}) {
  return apiRequest<AdminUser>("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: payload,
  });
}

export function getAdminMe() {
  return apiRequest<AdminUser>("/api/admin/me", {
    method: "GET",
  });
}

export function adminLogout() {
  return apiRequest<{ message: string }>("/api/admin/logout", {
    method: "POST",
  });
}
