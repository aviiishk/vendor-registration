import { apiRequest } from "@/services/api";
import { VendorDetail } from "../types/vendor";

export type VendorStatus = "pending" | "approved" | "rejected";

export interface Vendor {
  _id: string;
  entityName: string;
  category: string; // handled safely in UI
  email: string;
  status: VendorStatus;
  createdAt: string;
}

export interface VendorResponse {
  data: Vendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function fetchVendors(
  page: number,
  limit: number,
  status?: VendorStatus
): Promise<VendorResponse> {
  return apiRequest<VendorResponse>("/api/admin/vendors", {
    method: "GET",
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
    },
  });
}


export async function fetchVendorById(id: string): Promise<VendorDetail> {
  const response = await apiRequest<{ data: VendorDetail }>(
    `/api/admin/vendors/${id}`,
    { method: "GET" }
  );

  return response.data; // 🔥 unwrap here
}


