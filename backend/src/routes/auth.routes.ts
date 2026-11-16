import { Router } from "express";
import { register } from "#src/controllers/auth.controller.js";
import { validate } from "#src/middleware/validate.js";
import { registerSchema } from "#src/schemas/auth.schema.js";

const router = Router();
router.post("/register", validate(registerSchema), register);

export default router;

