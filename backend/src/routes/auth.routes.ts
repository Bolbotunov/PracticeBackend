import { Router } from "express";
import { getMe, login, logout, refresh, register } from "#src/controllers/auth.controller.js";
import { validate } from "#src/middleware/validate.js";
import { loginSchema, registerSchema } from "#src/schemas/auth.schema.js";
import { authenticate } from "#src/middleware/auth.js";

const router = Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.post("/refresh", refresh);
export default router;
