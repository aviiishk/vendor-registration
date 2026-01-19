export function validateDocuments(
  uploadedDocs: string[],
  taxDetails: any,
  documentFlags: any
) {
  const required = [
    "PAN_CARD",
    "CANCELLED_CHEQUE",
    "DECLARATION_FORM",
  ];

  if (taxDetails.gstApplicable) {
    required.push("GST_CERTIFICATE");
  }

  if (taxDetails.msmeApplicable) {
    required.push("MSME_CERTIFICATE");
  }

  if (documentFlags.hasItrYear1) {
    required.push("ITR_YEAR_1");
  }

  if (documentFlags.hasItrYear2) {
    required.push("ITR_YEAR_1", "ITR_YEAR_2");
  }

  const missing = required.filter(
    (doc) => !uploadedDocs.includes(doc)
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required documents: ${missing.join(", ")}`
    );
  }
}
