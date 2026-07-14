import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-before-production";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) return res.status(401).json({ message: "Authentication required" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).select("-passwordHash");

    if (!user || !user.active) return res.status(401).json({ message: "User is inactive or no longer exists" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
}

export function signUserToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "8h" });
}
