export function sanitizeVendorPayload(formData: any) {
  const payload = structuredClone(formData);

  // ---------- TAX DETAILS ----------
  if (!payload.taxDetails.gstApplicable) {
    delete payload.taxDetails.gstNumber;
    delete payload.taxDetails.gstRegistrationType;
  }

  if (!payload.taxDetails.msmeApplicable) {
    delete payload.taxDetails.msmeNumber;
    delete payload.taxDetails.msmeType;
    delete payload.taxDetails.msmeClass;
  }

  // ---------- BUSINESS DETAILS ----------
  if (!payload.businessDetails.hasRelationWithAGIHF) {
    delete payload.businessDetails.relationDetails;
  }

  // ---------- DOCUMENT FLAGS ----------
  Object.keys(payload.documentFlags).forEach((key) => {
    if (!payload.documentFlags[key]) {
      delete payload.documentFlags[key];
    }
  });

  // ---------- GENERIC CLEANUP ----------
  const removeEmptyStrings = (obj: any) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "") {
        delete obj[key];
      } else if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        removeEmptyStrings(obj[key]);

        // remove empty objects
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      }
    });
  };

  removeEmptyStrings(payload);

  return payload;
}
