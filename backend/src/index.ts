import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import authRoutes from "#src/routes/auth.routes.js";
import { errorHandler } from "#src/middleware/errorHandler.js";
import { env } from "#src/lib/env.js";
import { swaggerSpec } from "#src/lib/swagger.js";
import { AUTH } from "#src/lib/paths.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use(AUTH.BASE, authRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

export default app;
