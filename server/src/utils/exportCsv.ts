import { Parser } from "json2csv";

export const generateVendorCSV = (vendors: any[]) => {
  const fields = [
    { label: "Entity Name", value: "entity.name" },
    { label: "Category", value: "entity.category" },
    { label: "Email", value: "entity.email" },
    { label: "Website", value: "entity.website" },

    { label: "Registered Address", value: "registeredAddress.address" },
    { label: "Registered PIN", value: "registeredAddress.pin" },
    { label: "Registered Contact", value: "registeredAddress.contactNumber" },

    { label: "Communication Address", value: "communicationAddress.address" },
    { label: "Communication PIN", value: "communicationAddress.pin" },
    { label: "Communication Contact", value: "communicationAddress.contactNumber" },

    { label: "PAN", value: "taxDetails.pan" },
    { label: "GST Applicable", value: "taxDetails.gstApplicable" },
    { label: "GST Number", value: "taxDetails.gstNumber" },
    { label: "GST Registration Type", value: "taxDetails.gstRegistrationType" },

    { label: "MSME Applicable", value: "taxDetails.msmeApplicable" },
    { label: "MSME Number", value: "taxDetails.msmeNumber" },
    { label: "MSME Type", value: "taxDetails.msmeType" },
    { label: "MSME Class", value: "taxDetails.msmeClass" },

    { label: "CIN", value: "taxDetails.cinNumber" },

    { label: "Establishment Type", value: "businessDetails.establishmentType" },
    {
      label: "Key Products",
      value: (row: any) => row.businessDetails.keyProducts?.join(", "),
    },
    { label: "Specific Products", value: "businessDetails.specificProducts" },

    { label: "Relation With AGIHF", value: "businessDetails.hasRelationWithAGIHF" },
    { label: "Relation Details", value: "businessDetails.relationDetails" },

    { label: "Applicant Name", value: "applicant.name" },
    { label: "Authorised Person", value: "applicant.authorisedPerson" },

    {
      label: "Uploaded Documents",
      value: (row: any) =>
        row.documents
          ?.map((d: any) => `${d.type} (${d.originalName})`)
          .join(" | "),
    },

    { label: "Status", value: "status" },
    { label: "Submitted At", value: "createdAt" },
  ];

  const parser = new Parser({ fields });
  return parser.parse(vendors);
};
