import User, { USER_ROLES } from "../models/User.js";
import { signUserToken } from "../middleware/auth.js";

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
  };
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.active) return res.status(401).json({ message: "Invalid email or password" });

    const matches = await user.comparePassword(password);
    if (!matches) return res.status(401).json({ message: "Invalid email or password" });

    res.json({ token: signUserToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    if (role && !USER_ROLES.includes(role)) return res.status(400).json({ message: `Role must be one of: ${USER_ROLES.join(", ")}` });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "A user with this email already exists" });

    const user = await User.create({
      name,
      email,
      role: role || "Counsellor",
      passwordHash: await User.hashPassword(password),
    });

    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { name, role, active, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (role && !USER_ROLES.includes(role)) return res.status(400).json({ message: `Role must be one of: ${USER_ROLES.join(", ")}` });

    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof active === "boolean") user.active = active;
    if (password) {
      if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
      user.passwordHash = await User.hashPassword(password);
    }

    await user.save();
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}
