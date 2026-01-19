import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVendors, VendorStatus } from "../services/vendors";
import { useNavigate } from "react-router-dom";

const PAGE_LIMIT = 10;

const STATUS_TABS: VendorStatus[] = ["pending", "approved", "rejected"];

const VendorListPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<VendorStatus>("pending");

  const navigate = useNavigate();


  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendors", page, status],
    queryFn: () => fetchVendors(page, PAGE_LIMIT, status),

    // ✅ React Query v5 replacement for keepPreviousData
    placeholderData: (prev) => prev,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900">Vendors</h1>
        <p className="text-sm text-gray-500">
          Review and manage registered vendors
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              status === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center">
                  Loading vendors…
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-red-600">
                  Failed to load vendors
                </td>
              </tr>
            )}

            {data?.data.map((vendor) => (
              <tr key={vendor._id} className="border-t">
                <td className="px-4 py-3 font-semibold text-blue-900">
                  {vendor.entityName}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {Array.isArray(vendor.category)
                    ? vendor.category.join(", ")
                    : vendor.category}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {vendor.email}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      vendor.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : vendor.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vendor.status.toUpperCase()}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {new Date(vendor.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
  <button
    onClick={() => navigate(`/admin/vendors/${vendor._id}`)}
    className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
  >
    Open
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm font-semibold">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>

          <button
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorListPage;
