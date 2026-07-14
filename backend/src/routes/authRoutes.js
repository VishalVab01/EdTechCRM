import express from "express";
import { createUser, listUsers, login, me, updateUser } from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", requireAuth, me);
router.get("/users", requireAuth, requireRole("Super Admin"), listUsers);
router.post("/users", requireAuth, requireRole("Super Admin"), createUser);
router.put("/users/:id", requireAuth, requireRole("Super Admin"), updateUser);

export default router;
