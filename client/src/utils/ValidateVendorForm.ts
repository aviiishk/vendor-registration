type FilesMap = Record<string, File | undefined>;

export function validateVendorForm(
  formData: any,
  files: FilesMap
): string[] {
  const errors: string[] = [];

  /* ---------- BASIC ---------- */
  if (!formData.entityName.trim()) {
    errors.push("Entity name is required");
  }

  if (!formData.email.trim()) {
    errors.push("Email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.push("Invalid email format");
  }

  /* ---------- REGISTERED ADDRESS ---------- */
  if (!formData.registeredAddress.address.trim()) {
    errors.push("Registered address is required");
  }

  if (!/^\d{6}$/.test(formData.registeredAddress.pin)) {
    errors.push("Registered address PIN must be 6 digits");
  }

  if (!/^[6-9]\d{9}$/.test(formData.registeredAddress.contactNumber)) {
    errors.push("Registered contact number is invalid");
  }

  /* ---------- TAX ---------- */
  const { taxDetails } = formData;

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(taxDetails.panNumber)) {
    errors.push("Invalid PAN number");
  }

  if (taxDetails.gstApplicable) {
    if (!taxDetails.gstNumber?.trim()) {
      errors.push("GST number is required");
    }

    if (!files.GST_CERTIFICATE) {
      errors.push("GST Certificate file is required");
    }
  }

  if (taxDetails.msmeApplicable) {
    if (
      !taxDetails.msmeNumber ||
      !taxDetails.msmeType ||
      !taxDetails.msmeClass
    ) {
      errors.push("All MSME details are required");
    }

    if (!files.MSME_CERTIFICATE) {
      errors.push("MSME Certificate file is required");
    }
  }

  /* ---------- BUSINESS ---------- */
  const { businessDetails } = formData;

  if (!businessDetails.establishmentType) {
    errors.push("Type of establishment is required");
  }

  if (!businessDetails.keyProducts?.length) {
    errors.push("At least one key product is required");
  }

  if (!businessDetails.specificProducts?.length) {
    errors.push("At least one specific product is required");
  }

  if (
    businessDetails.hasRelationWithAGIHF &&
    !businessDetails.relationDetails?.trim()
  ) {
    errors.push("Relation details are required");
  }

  /* ---------- DOCUMENT FLAGS (INTENT-BASED) ---------- */
  const flags = formData.documentFlags ?? {};

  // ITR dependency rule
  if (flags.hasItrYear2 && !flags.hasItrYear1) {
    errors.push("ITR Year 1 is required when ITR Year 2 is selected");
  }

  // ITR files (only if checked)
  if (flags.hasItrYear1 && !files.ITR_YEAR_1) {
    errors.push("ITR Year 1 file is required");
  }

  if (flags.hasItrYear2 && !files.ITR_YEAR_2) {
    errors.push("ITR Year 2 file is required");
  }

  // Optional documents (only if checked)
  if (flags.hasAuthorizationCertificate && !files.AUTHORIZATION_CERTIFICATE) {
    errors.push("Authorization Certificate file is required");
  }

  if (flags.hasTradeLicense && !files.TRADE_LICENSE) {
    errors.push("Trade License file is required");
  }

  if (flags.hasPfRegistration && !files.PF_REGISTRATION) {
    errors.push("PF Registration file is required");
  }

  if (flags.hasEsicRegistration && !files.ESIC_REGISTRATION) {
    errors.push("ESIC Registration file is required");
  }

  if (flags.hasClraRegistration && !files.CLRA_REGISTRATION) {
    errors.push("CLRA Registration file is required");
  }

  /* ---------- ALWAYS REQUIRED FILES ---------- */
  const ALWAYS_REQUIRED_FILES = [
    "PAN_CARD",
    "CANCELLED_CHEQUE",
    "DECLARATION_FORM",
  ] as const;

  ALWAYS_REQUIRED_FILES.forEach((key) => {
    if (!files[key]) {
      errors.push(`${key.replace(/_/g, " ")} file is required`);
    }
  });

  return errors;
}
