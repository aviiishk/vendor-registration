import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import adminRoutes from "./routes/admin.routes";
import vendorRoutes from "./routes/vendor.routes";
import adminVendorRoutes from "./routes/admin.vendor.routes";

const app = express();

// 🔒 Security
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ✅ CORS (must be before routes)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev (Vite)
      "https://agihf.vercel.app/", // production frontend
    ],
    credentials: true,
  })
);

// ✅ Parse cookies (CRITICAL for admin auth)
app.use(cookieParser());

// Core middleware
app.use(express.json());

// 🚨 Multer routes AFTER cors & parsers
app.use("/api/vendors", vendorRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminVendorRoutes);

app.get("/", (_req, res) => {
  res.send("API running");
});

export default app;
