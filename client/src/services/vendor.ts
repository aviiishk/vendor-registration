import { apiRequest } from "./api";

export async function registerVendor(
  payload: FormData
): Promise<{ message: string }> {
  return apiRequest("/api/vendors/register", {
    method: "POST",
    data: payload,
  });
}
