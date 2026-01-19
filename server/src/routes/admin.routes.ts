import { Router } from "express";
import {
  adminLogin,
  adminMe,
  adminLogout,
} from "../controllers/admin.controller";
import { adminAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", adminLogin);
router.get("/me", adminAuth, adminMe);
router.post("/logout", adminAuth, adminLogout);

export default router;
