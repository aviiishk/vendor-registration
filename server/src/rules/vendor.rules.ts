export function validateBusinessRules(payload: any) {
  const { taxDetails, businessDetails, documentFlags = {} } = payload;

  /* ---------- GST ---------- */
  if (taxDetails.gstApplicable && !taxDetails.gstNumber) {
    throw new Error("GST number is required when GST is applicable");
  }

  /* ---------- MSME ---------- */
  if (taxDetails.msmeApplicable) {
    if (
      !taxDetails.msmeNumber ||
      !taxDetails.msmeType ||
      !taxDetails.msmeClass
    ) {
      throw new Error(
        "MSME number, type and class are required when MSME is applicable"
      );
    }
  }

  /* ---------- AGIHF RELATION ---------- */
  if (
    businessDetails.hasRelationWithAGIHF &&
    !businessDetails.relationDetails
  ) {
    throw new Error("Relation details are required");
  }

  /* ---------- ITR RULE ---------- */
  if (documentFlags.hasItrYear2 && !documentFlags.hasItrYear1) {
    throw new Error("ITR Year 1 is mandatory when ITR Year 2 is selected");
  }
}
