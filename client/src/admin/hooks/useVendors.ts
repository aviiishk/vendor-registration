import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchVendors, VendorStatus } from "../services/vendors";

export function useVendors(
  page: number,
  limit: number,
  status?: VendorStatus
) {
  return useQuery({
    queryKey: ["vendors", page, limit, status],
    queryFn: () => fetchVendors(page, limit, status),
    placeholderData: keepPreviousData,
  });
}
