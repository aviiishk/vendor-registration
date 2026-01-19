import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

import path from "path";

/* ---------- CLOUDINARY STORAGE ---------- */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: `vendor-documents/temp`,
      resource_type: isPdf ? "raw" : "image",
      public_id: `${Date.now()}-${file.fieldname}`,
    };
  },
});


/* ---------- FILE FILTER ---------- */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  // DECLARATION_FORM must be PDF only
  if (
    file.fieldname === "DECLARATION_FORM" &&
    file.mimetype !== "application/pdf"
  ) {
    return cb(
      new Error("DECLARATION_FORM must be uploaded as a PDF file")
    );
  }

  // Allowed types for all other documents
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only PDF, JPG, and PNG files are allowed")
    );
  }

  cb(null, true);
};

/* ---------- MULTER INSTANCE ---------- */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB
  },
});

/* ---------- STRICT FIELD CONFIG (RECOMMENDED) ---------- */
export const uploadVendorDocuments = upload.fields([
  { name: "PAN_CARD", maxCount: 1 },
  { name: "CANCELLED_CHEQUE", maxCount: 1 },
  { name: "DECLARATION_FORM", maxCount: 1 },

  { name: "GST_CERTIFICATE", maxCount: 1 },
  { name: "MSME_CERTIFICATE", maxCount: 1 },

  { name: "AUTHORIZATION_CERTIFICATE", maxCount: 1 },
  { name: "TRADE_LICENSE", maxCount: 1 },
  { name: "ITR_YEAR_1", maxCount: 1 },
  { name: "ITR_YEAR_2", maxCount: 1 },
  { name: "PF_REGISTRATION", maxCount: 1 },
  { name: "ESIC_REGISTRATION", maxCount: 1 },
  { name: "CLRA_REGISTRATION", maxCount: 1 },
]);
