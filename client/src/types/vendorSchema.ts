import { z } from "zod";

/**
 * Frontend Vendor Schema (UX validation)
 * Mirrors backend Vendor model
 */

export const vendorSchema = z.object({
  entity: z.object({
    category: z.string().min(1, "Category is required"),
    name: z.string().min(2, "Entity name is required"),
    email: z.string().email("Invalid email"),
    website: z.string().url().optional().or(z.literal("")),
  }),

  registeredAddress: z.object({
    address: z.string().min(5, "Address is required"),
    pin: z.string().min(4, "PIN is required"),
    contactNumber: z.string().min(10, "Contact number is required"),
  }),

  communicationAddress: z.object({
    sameAsRegistered: z.boolean(),
    address: z.string().optional(),
    pin: z.string().optional(),
    contactNumber: z.string().optional(),
  }),

  taxDetails: z.object({
    pan: z.string().min(10, "PAN is required"),

    gstApplicable: z.boolean(),
    gstNumber: z.string().optional(),
    gstRegistrationType: z.string().optional(),

    msmeApplicable: z.boolean(),
    msmeNumber: z.string().optional(),
    msmeType: z.string().optional(),
    msmeClass: z.string().optional(),

    cinNumber: z.string().optional(),
  }),

  businessDetails: z.object({
    establishmentType: z.string().min(1, "Establishment type is required"),
    keyProducts: z.array(z.string()).min(1, "At least one product required"),
    specificProducts: z.string().optional(),
    hasRelationWithAGIHF: z.boolean(),
    relationDetails: z.string().optional(),
  }),

  applicant: z.object({
    name: z.string().min(2, "Applicant name is required"),
    authorisedPerson: z.string().min(2, "Authorised person is required"),
  }),
});

export type VendorFormValues = z.infer<typeof vendorSchema>;
