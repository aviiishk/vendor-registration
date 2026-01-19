import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  // ✅ SET HTTPONLY COOKIE
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.json({
    id: admin._id,
    email: admin.email,
    role: admin.role ?? "ADMIN",
  });
};
export const adminMe = async (req: Request, res: Response) => {
  const adminId = (req as any).adminId;

  const admin = await Admin.findById(adminId).select("_id email role");
  if (!admin) {
    return res.status(401).json({ message: "Session expired" });
  }

  res.json(admin);
};
export const adminLogout = (_req: Request, res: Response) => {
  res.clearCookie("admin_token", {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
});
  res.json({ message: "Logged out" });
};

