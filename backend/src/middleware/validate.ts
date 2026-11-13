import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError, z } from "zod";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: z.flattenError(error).fieldErrors,
        });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
