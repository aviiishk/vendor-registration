import { Router } from "express";
import {
  getAllVendors,
  exportVendorsCSV,
  downloadVendorPDF,
  approveVendor,
  rejectVendor,
  getVendorById,
} from "../controllers/admin.vendor.controller";
import { adminAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/vendors", adminAuth, getAllVendors);
router.get("/vendors/:id",adminAuth, getVendorById);
/* ---------- APPROVE / REJECT ---------- */
router.patch("/vendors/:id/approve",adminAuth, approveVendor);
router.patch("/vendors/:id/reject", adminAuth, rejectVendor);
router.get("/vendors/export/csv", adminAuth, exportVendorsCSV);
router.get("/vendors/:id/pdf", adminAuth, downloadVendorPDF);

export default router;
