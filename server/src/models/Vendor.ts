import mongoose from "mongoose";

/* -------------------- DOCUMENT SCHEMA -------------------- */
/**
 * NOTE:
 * - A document itself is OPTIONAL
 * - BUT if a document exists, all its fields are REQUIRED
 */
const documentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: [
        "PAN_CARD",
        "CANCELLED_CHEQUE",
        "DECLARATION_FORM",
        "GST_CERTIFICATE",
        "MSME_CERTIFICATE",
        "AUTHORIZATION_CERTIFICATE",
        "TRADE_LICENSE",
        "ITR_YEAR_1",
        "ITR_YEAR_2",
        "PF_REGISTRATION",
        "ESIC_REGISTRATION",
        "CLRA_REGISTRATION",
      ],
      required: true,
    },

    fileUrl: {
      type: String,
      required: true, // Cloudinary secure_url
    },

    publicId: {
      type: String,
      required: true, // Cloudinary public_id (for delete)
    },

    originalName: {
      type: String,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);


/* -------------------- VENDOR SCHEMA -------------------- */
const vendorSchema = new mongoose.Schema(
  {
    /* ---------- BASIC DETAILS ---------- */
    category: {
      type: [String],
      enum: ["trader", "manufacturer", "authorised_dealer", "service_provider"],
      required: true,
    },
    entityName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },

    /* ---------- REGISTERED ADDRESS ---------- */
    registeredAddress: {
      address: { type: String, required: true },
      pin: { type: String, required: true },
      contactNumber: { type: String, required: true },
    },

    /* ---------- COMMUNICATION ADDRESS ---------- */
    communicationAddress: {
      sameAsRegistered: { type: Boolean, default: false },
      address: { type: String, required: true },
      pin: { type: String, required: true },
      contactNumber: { type: String, required: true },
    },

    /* ---------- TAX DETAILS ---------- */
    taxDetails: {
      panNumber: {
        type: String,
        required: true,
      },
      cinNumber: {
        type: String,
        required: true,
      },
      gstApplicable: {
        type: Boolean,
        required: true,
      },
      gstRegistrationType: {
        type: String,
        enum: ["registered", "composite", "unregistered","exempt"],
        // required only if gstApplicable === true
      },
      gstNumber: {
        type: String,
        // required only if gstApplicable === true
      },
      msmeApplicable: {
        type: Boolean,
        required: true,
      },
      msmeNumber: {
        type: String,
        // required only if msmeApplicable === true
      },
      msmeType: {
        type: String,
        enum: ["micro", "small", "medium"],
      },
      msmeClass: {
        type: String,
        // required only if msmeApplicable === true
        enum: ["trading", "service", "manufacturing"],
      },
    },

    /* ---------- BUSINESS DETAILS ---------- */
    businessDetails: {
      establishmentType: {
        type: String,
        enum: [
          "proprietorship",
          "partnership",
          "private_ltd",
          "public_ltd",
          "trust",
          "llp",
          "society",
          "other",
        ],
        required: true,
      },
      keyProducts: {
        type: [String],
        required: true,
      },
      specificProducts: {
        type: [String],
        required: true,
      },
      hasRelationWithAGIHF: {
        type: Boolean,
        required: true,
      },
      relationDetails: {
        type: String,
        // required only if hasRelationWithAGIHF === true
      },
    },

    /* ---------- APPLICANT DETAILS ---------- */
    applicant: {
      applicantName: {
        type: String,
        required: true,
      },
      authorisedPerson: {
        type: String,
        required: true,
      },
    },

    /* ---------- DOCUMENT INTENT FLAGS ---------- */
    /**
     * These indicate what the vendor CLAIMS to have.
     * Actual proof is stored in documents[]
     */
    documentFlags: {
      hasAuthorizationCertificate: { type: Boolean, default: false },
      hasTradeLicense: { type: Boolean, default: false },
      hasItrYear1: { type: Boolean, default: false },
      hasItrYear2: { type: Boolean, default: false },
      hasPfRegistration: { type: Boolean, default: false },
      hasEsicRegistration: { type: Boolean, default: false },
      hasClraRegistration: { type: Boolean, default: false },
    },

    /* ---------- DOCUMENTS ---------- */
    /**
     * Documents are OPTIONAL.
     * Validation of required documents happens in controller.
     */
    documents: {
      type: [documentSchema],
      default: [],
    },
    /* ---------- ADMIN REVIEW ---------- */
adminReview: {
  reviewedBy: {
    type: String, // later can be ObjectId
  },
  reviewedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
},


    /* ---------- WORKFLOW STATUS ---------- */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
