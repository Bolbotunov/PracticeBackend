import { Router } from "express";
import { getMe, login, logout, refresh, register } from "#src/controllers/auth.controller.js";
import { validate } from "#src/middleware/validate.js";
import { loginSchema, registerSchema } from "#src/schemas/auth.schema.js";
import { authenticate } from "#src/middleware/auth.js";
import { AUTH } from "#src/lib/paths.js";

const router = Router();
router.post(AUTH.REGISTER, validate(registerSchema), register);
router.post(AUTH.LOGIN, validate(loginSchema), login);
router.post(AUTH.LOGOUT, logout);
router.get(AUTH.ME, authenticate, getMe);
router.post(AUTH.REFRESH, refresh);
export default router;
