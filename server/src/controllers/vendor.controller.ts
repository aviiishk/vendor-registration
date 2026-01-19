import { Request, Response } from "express";
import Vendor from "../models/Vendor";
import { cleanupCloudinaryFiles } from "../utils/cloudinaryCleanup";
import { moveToVendorFolder } from "../utils/cloudinaryMove";

export const registerVendor = async (req: Request, res: Response) => {
  console.log("req.files:", req.files);

  let files: Express.Multer.File[] = [];
  let vendor: any = null;

  try {
    /* ---------- 1. Validate payload ---------- */
    if (!req.body.data) {
      return res.status(400).json({ message: "Vendor data missing" });
    }

    const parsedData = JSON.parse(req.body.data);

    /* ---------- 2. Extract files ---------- */
    if (Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files && typeof req.files === "object") {
      files = Object.values(
        req.files as Record<string, Express.Multer.File[]>
      ).flat();
    } else {
      return res.status(400).json({
        message: "Supporting documents are required",
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        message: "Supporting documents are required",
      });
    }

    /* ---------- 3. File-level validation ---------- */
    files.forEach((file) => {
      if (
        file.fieldname === "DECLARATION_FORM" &&
        file.mimetype !== "application/pdf"
      ) {
        throw new Error("DECLARATION_FORM must be a PDF");
      }
    });

    /* ---------- 4. Required document rules ---------- */
    const uploadedDocs = files.map((file) => file.fieldname);

    const REQUIRED_ALWAYS = [
      "PAN_CARD",
      "CANCELLED_CHEQUE",
      "DECLARATION_FORM",
    ];

    const missingAlways = REQUIRED_ALWAYS.filter(
      (doc) => !uploadedDocs.includes(doc)
    );

    if (missingAlways.length > 0) {
      return res.status(400).json({
        message: "Required documents missing",
        missingDocuments: missingAlways,
      });
    }

    if (
      parsedData.taxDetails?.gstApplicable &&
      !uploadedDocs.includes("GST_CERTIFICATE")
    ) {
      return res.status(400).json({
        message: "GST Certificate is required when GST is applicable",
      });
    }

    if (
      parsedData.taxDetails?.msmeApplicable &&
      !uploadedDocs.includes("MSME_CERTIFICATE")
    ) {
      return res.status(400).json({
        message: "MSME Certificate is required when MSME is applicable",
      });
    }

    /* ---------- 5. Conditional field validations ---------- */
    const { taxDetails, businessDetails } = parsedData;

    if (taxDetails?.gstApplicable && !taxDetails?.gstNumber) {
      return res.status(400).json({ message: "GST number is required" });
    }

    if (taxDetails?.msmeApplicable) {
      const { msmeNumber, msmeType, msmeClass } = taxDetails;

      if (!msmeNumber || !msmeType || !msmeClass) {
        return res.status(400).json({
          message: "MSME number, type, and class are required",
        });
      }
    }

    if (
      businessDetails?.hasRelationWithAGIHF &&
      !businessDetails?.relationDetails
    ) {
      return res.status(400).json({
        message: "Relation details are required when AGIHF relation exists",
      });
    }

    /* ---------- 6. PAN duplicate check ---------- */
    const existingVendor = await Vendor.findOne({
      "taxDetails.panNumber": parsedData.taxDetails.panNumber,
    });

    if (existingVendor) {
      await cleanupCloudinaryFiles(files);
      return res.status(409).json({
        message: "Vendor with this PAN already exists",
      });
    }

    /* ---------- 7. Create vendor FIRST (no documents) ---------- */
    vendor = await Vendor.create({
      ...parsedData,
      documents: [],
    });

    /* ---------- 8. Move files to vendor folder ---------- */
    const documents = await moveToVendorFolder(
      files,
      vendor._id.toString()
    );

    /* ---------- 9. Save final documents ---------- */
    vendor.documents = documents;
    await vendor.save();

    return res.status(201).json({
      message: "Vendor registered successfully",
    });
  } catch (error: any) {
    console.error("Vendor registration error:", error.message);

    // Cleanup Cloudinary files
    if (files.length > 0) {
      await cleanupCloudinaryFiles(files);
    }

    // Cleanup partially created vendor
    if (vendor) {
      await Vendor.findByIdAndDelete(vendor._id);
    }

    return res.status(400).json({
      message: error.message || "Invalid vendor data",
    });
  }
};
