import bcrypt from "bcryptjs";
import Admin from "../models/Admin";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL as string;
  const password = process.env.ADMIN_PASSWORD as string;

  if (!email || !password) {
    console.warn("Admin env vars not set");
    return;
  }

  const exists = await Admin.findOne({ email });
  if (exists) return;

  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.create({
    email,
    password: hashedPassword,
  });

  console.log("Admin user seeded");
};

export default seedAdmin;
