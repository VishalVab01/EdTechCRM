import User from "../models/User.js";

export async function ensureDefaultAdmin() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const email = process.env.ADMIN_EMAIL || "admin@edtechcrm.local";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = process.env.ADMIN_NAME || "Vishal Admin";

  await User.create({
    name,
    email,
    role: "Super Admin",
    passwordHash: await User.hashPassword(password),
  });

  console.log(`Default admin created: ${email}`);
}
