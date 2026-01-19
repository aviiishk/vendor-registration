import { z } from "zod";

export const VendorPayloadSchema = z.object({
  category: z.enum([
    "trader",
    "manufacturer",
    "authorised_dealer",
    "service_provider",
  ]),

  entityName: z.string().min(1),
  email: z.email(),
  website: z.string().optional().or(z.literal("")),

  registeredAddress: z.object({
    address: z.string().min(1),
    pin: z.string().min(1),
    contactNumber: z.string().min(1),
  }),

  communicationAddress: z.object({
    sameAsRegistered: z.boolean(),
    address: z.string().min(1),
    pin: z.string().min(1),
    contactNumber: z.string().min(1),
  }),

  taxDetails: z.object({
    panNumber: z.string().min(10),

    cinNumber: z.string().min(21),

    gstApplicable: z.boolean(),
    gstNumber: z.string().optional(),

    msmeApplicable: z.boolean(),
    msmeNumber: z.string().optional(),
    msmeType: z.enum(["micro", "small", "medium"]).optional(),
    msmeClass: z.enum(["trading", "service", "manufacturing"]).optional(),
  }),

  businessDetails: z.object({
    establishmentType: z.enum([
      "proprietorship",
      "partnership",
      "private_ltd",
      "public_ltd",
      "trust",
      "llp",
      "society",
      "other",
    ]),

    keyProducts: z.array(z.string()).min(1),
    specificProducts: z.array(z.string()).min(1),

    hasRelationWithAGIHF: z.boolean(),
    relationDetails: z.string().optional(),
  }),

  applicant: z.object({
    applicantName: z.string().min(1),
    authorisedPerson: z.string().min(1),
  }),

  documentFlags: z.object({
    hasAuthorizationCertificate: z.boolean().optional(),
    hasTradeLicense: z.boolean().optional(),
    hasItrYear1: z.boolean().optional(),
    hasItrYear2: z.boolean().optional(),
    hasPfRegistration: z.boolean().optional(),
    hasEsicRegistration: z.boolean().optional(),
    hasClraRegistration: z.boolean().optional(),
  }).optional(),
});
