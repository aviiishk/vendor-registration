import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { 
      id: string;
      email: string;
      role: "ADMIN" | "SUPER_ADMIN";
     };

    (req as any).adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid session" });
  }
};
