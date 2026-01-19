import { Request, Response } from "express";
import mongoose from "mongoose";
import Vendor from "../models/Vendor";
import { generateVendorCSV } from "../utils/exportCsv";
import { generateVendorPDF } from "../utils/exportPdf";

/* -------------------- CONSTANTS -------------------- */

const ALLOWED_STATUS = ["pending", "approved", "rejected"] as const;

/* -------------------- GET VENDOR BY ID -------------------- */
export const getVendorById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // 🔒 Type narrowing
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const vendor = await Vendor.findById(id)
      .select("-documents.filePath") // hide sensitive paths (consistent with list)
      .lean();

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.json({
      data: vendor,
    });
  } catch (error: any) {
    console.error("Get vendor by ID error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch vendor",
    });
  }
};


/* -------------------- GET ALL VENDORS -------------------- */
export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const status = req.query.status;

    const filter: any = {};

    if (typeof status === "string") {
      if (!ALLOWED_STATUS.includes(status as any)) {
        return res.status(400).json({
          message: "Invalid status filter",
        });
      }
      filter.status = status;
    }

    const [vendors, total] = await Promise.all([
      Vendor.find(filter)
        .select("-documents.filePath")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Vendor.countDocuments(filter),
    ]);

    return res.json({
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Get vendors error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch vendors",
    });
  }
};

/* -------------------- APPROVE VENDOR -------------------- */
export const approveVendor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // 🔒 Type narrowing (FIXES TS ERROR)
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.status !== "pending") {
      return res.status(400).json({
        message: `Vendor is already ${vendor.status}`,
      });
    }

    vendor.status = "approved";
    vendor.adminReview = {
      reviewedBy: "admin", // replace later with req.user.id/email
      reviewedAt: new Date(),
      rejectionReason: undefined,
    };

    await vendor.save();

    return res.json({
      message: "Vendor approved successfully",
    });
  } catch (error: any) {
    console.error("Approve vendor error:", error.message);
    return res.status(500).json({
      message: "Failed to approve vendor",
    });
  }
};

/* -------------------- REJECT VENDOR -------------------- */
export const rejectVendor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    // 🔒 Type narrowing (FIXES TS ERROR)
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
      return res.status(400).json({
        message: "Rejection reason is required (minimum 5 characters)",
      });
    }

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.status !== "pending") {
      return res.status(400).json({
        message: `Vendor is already ${vendor.status}`,
      });
    }

    vendor.status = "rejected";
    vendor.adminReview = {
      reviewedBy: "admin",
      reviewedAt: new Date(),
      rejectionReason: reason.trim(),
    };

    await vendor.save();

    return res.json({
      message: "Vendor rejected successfully",
    });
  } catch (error: any) {
    console.error("Reject vendor error:", error.message);
    return res.status(500).json({
      message: "Failed to reject vendor",
    });
  }
};

/* -------------------- EXPORT CSV -------------------- */
export const exportVendorsCSV = async (_req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find().lean();
    const csv = generateVendorCSV(vendors);

    res.header("Content-Type", "text/csv");
    res.attachment("vendors.csv");
    return res.send(csv);
  } catch (error: any) {
    console.error("CSV export error:", error.message);
    return res.status(500).json({
      message: "Failed to export vendors",
    });
  }
};

/* -------------------- DOWNLOAD VENDOR PDF -------------------- */
export const downloadVendorPDF = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // 🔒 Type narrowing (FIXES TS ERROR)
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const vendor = await Vendor.findById(id).lean();

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    generateVendorPDF(vendor, res);
  } catch (error: any) {
    console.error("PDF generation error:", error.message);
    return res.status(500).json({
      message: "Failed to generate vendor PDF",
    });
  }
};
