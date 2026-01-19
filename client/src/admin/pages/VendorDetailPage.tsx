import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchVendorById } from "../services/vendors";

const VendorDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: vendor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => fetchVendorById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <p className="text-gray-600">Loading vendor…</p>;
  }

  if (isError || !vendor) {
    return <p className="text-red-600">Failed to load vendor</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900">
          {vendor.entityName}
        </h1>
        <p className="text-sm text-gray-500">{vendor.email}</p>
      </div>

      {/* Status */}
      <div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
            vendor.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : vendor.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {vendor.status?.toUpperCase()}
        </span>
      </div>

      {/* Basic Details */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold text-gray-800">
          Basic Details
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium">
              {Array.isArray(vendor.category)
                ? vendor.category.join(", ")
                : vendor.category}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Website</p>
            <p className="font-medium">
              {vendor.website || "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Registered Address */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold text-gray-800">
          Registered Address
        </h2>

        <p className="text-sm">
          {vendor.registeredAddress.address}
        </p>
        <p className="text-sm text-gray-600">
          PIN: {vendor.registeredAddress.pin}
        </p>
        <p className="text-sm text-gray-600">
          Contact: {vendor.registeredAddress.contactNumber}
        </p>
      </section>

      {/* Applicant */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold text-gray-800">
          Applicant Details
        </h2>

        <p className="text-sm">
          <strong>Name:</strong> {vendor.applicant.applicantName}
        </p>
        <p className="text-sm">
          <strong>Authorised Person:</strong>{" "}
          {vendor.applicant.authorisedPerson}
        </p>
      </section>

      {/* Documents */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold text-gray-800">
          Uploaded Documents
        </h2>

        {vendor.documents.length === 0 ? (
          <p className="text-sm text-gray-500">
            No documents uploaded
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {vendor.documents.map((doc, index) => (
              <li
                key={index}
                className="flex items-center justify-between"
              >
                <span>{doc.documentType}</span>
                <a
                  href={doc.filePath}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Admin Review (optional display) */}
      {vendor.adminReview && (
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 font-semibold text-gray-800">
            Admin Review
          </h2>

          <p className="text-sm">
            <strong>Reviewed By:</strong>{" "}
            {vendor.adminReview.reviewedBy || "—"}
          </p>

          {vendor.adminReview.rejectionReason && (
            <p className="text-sm text-red-600">
              <strong>Rejection Reason:</strong>{" "}
              {vendor.adminReview.rejectionReason}
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default VendorDetailPage;
