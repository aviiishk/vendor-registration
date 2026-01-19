export const DOCUMENTS = [
  {
    label: "PAN Card",
    flagKey: null, // always required
    fieldName: "panCard",
    backendType: "PAN_CARD",
    required: true,
  },
  {
    label: "Cancelled Cheque",
    flagKey: null,
    fieldName: "cancelledCheque",
    backendType: "CANCELLED_CHEQUE",
    required: true,
  },
  {
    label: "Authorization / Dealership Certificate",
    flagKey: "hasAuthorizationCertificate",
    fieldName: "authorizationCertificate",
    backendType: "AUTHORIZATION_CERTIFICATE",
  },
  {
    label: "Trade License",
    flagKey: "hasTradeLicense",
    fieldName: "tradeLicense",
    backendType: "TRADE_LICENSE",
  },
  {
    label: "Year-1 ITR Returns File",
    flagKey: "hasItrYear1",
    fieldName: "itrYear1",
    backendType: "ITR_YEAR_1",
  },
  {
    label: "Year-2 ITR Returns File",
    flagKey: "hasItrYear2",
    fieldName: "itrYear2",
    backendType: "ITR_YEAR_2",
  },
  {
    label: "PF Registration",
    flagKey: "hasPfRegistration",
    fieldName: "pfRegistration",
    backendType: "PF_REGISTRATION",
  },
  {
    label: "ESIC Registration",
    flagKey: "hasEsicRegistration",
    fieldName: "esicRegistration",
    backendType: "ESIC_REGISTRATION",
  },
  {
    label: "CLRA Registration",
    flagKey: "hasClraRegistration",
    fieldName: "clraRegistration",
    backendType: "CLRA_REGISTRATION",
  },
];
