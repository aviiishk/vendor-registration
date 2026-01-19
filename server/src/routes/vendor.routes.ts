import { Router } from "express";
import { registerVendor } from "../controllers/vendor.controller";
import { uploadVendorDocuments } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/register",
  uploadVendorDocuments,
  (err: any, _req: any, res: any, _next: any) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
  },
  registerVendor
);

export default router;
