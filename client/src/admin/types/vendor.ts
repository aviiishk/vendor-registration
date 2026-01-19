export type VendorStatus = "pending" | "approved" | "rejected";

export type Vendor = {
  _id: string;
  entityName: string;
  category: string[] | string;
  email: string;
  status: VendorStatus;
  createdAt: string;
};

export type VendorResponse = {
  data: Vendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
export type VendorDocumentType =
  | "PAN_CARD"
  | "CANCELLED_CHEQUE"
  | "DECLARATION_FORM"
  | "GST_CERTIFICATE"
  | "MSME_CERTIFICATE"
  | "AUTHORIZATION_CERTIFICATE"
  | "TRADE_LICENSE"
  | "ITR_YEAR_1"
  | "ITR_YEAR_2"
  | "PF_REGISTRATION"
  | "ESIC_REGISTRATION"
  | "CLRA_REGISTRATION";

export type VendorDocument = {
  documentType: VendorDocumentType;
  filePath: string;
  originalName: string;
  uploadedAt: string;
};

export type VendorDetail = {
  _id: string;

  /* ---------- BASIC ---------- */
  category: string[];
  entityName: string;
  email: string;
  website?: string;

  /* ---------- REGISTERED ADDRESS ---------- */
  registeredAddress: {
    address: string;
    pin: string;
    contactNumber: string;
  };

  /* ---------- COMMUNICATION ADDRESS ---------- */
  communicationAddress: {
    sameAsRegistered: boolean;
    address: string;
    pin: string;
    contactNumber: string;
  };

  /* ---------- TAX DETAILS ---------- */
  taxDetails: {
    panNumber: string;
    cinNumber: string;
    gstApplicable: boolean;
    gstRegistrationType?: "registered" | "composite" | "unregistered" | "exempt";
    gstNumber?: string;
    msmeApplicable: boolean;
    msmeNumber?: string;
    msmeType?: "micro" | "small" | "medium";
    msmeClass?: "trading" | "service" | "manufacturing";
  };

  /* ---------- BUSINESS DETAILS ---------- */
  businessDetails: {
    establishmentType:
      | "proprietorship"
      | "partnership"
      | "private_ltd"
      | "public_ltd"
      | "trust"
      | "llp"
      | "society"
      | "other";
    keyProducts: string[];
    specificProducts: string[];
    hasRelationWithAGIHF: boolean;
    relationDetails?: string;
  };

  /* ---------- APPLICANT ---------- */
  applicant: {
    applicantName: string;
    authorisedPerson: string;
  };

  /* ---------- DOCUMENT FLAGS ---------- */
  documentFlags: {
    hasAuthorizationCertificate: boolean;
    hasTradeLicense: boolean;
    hasItrYear1: boolean;
    hasItrYear2: boolean;
    hasPfRegistration: boolean;
    hasEsicRegistration: boolean;
    hasClraRegistration: boolean;
  };

  /* ---------- DOCUMENTS ---------- */
  documents: VendorDocument[];

  /* ---------- ADMIN REVIEW ---------- */
  adminReview?: {
    reviewedBy?: string;
    reviewedAt?: string;
    rejectionReason?: string;
  };

  /* ---------- WORKFLOW ---------- */
  status: VendorStatus;
  createdAt: string;
  updatedAt: string;
};
