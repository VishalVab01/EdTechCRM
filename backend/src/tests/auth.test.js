import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { signUserToken } from "../middleware/auth.js";

test("password hashing and comparison works", async () => {
  const passwordHash = await User.hashPassword("Admin123!");
  const user = new User({ name: "Test Admin", email: "test@example.com", role: "Super Admin", passwordHash });

  assert.equal(await user.comparePassword("Admin123!"), true);
  assert.equal(await user.comparePassword("wrong-password"), false);
});

test("signUserToken creates a verifiable JWT with user role", () => {
  const user = { _id: { toString: () => "507f1f77bcf86cd799439011" }, role: "Finance" };
  const token = signUserToken(user);
  const payload = jwt.verify(token, process.env.JWT_SECRET || "change-this-secret-before-production");

  assert.equal(payload.sub, "507f1f77bcf86cd799439011");
  assert.equal(payload.role, "Finance");
});
