import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { prisma } from "../lib/prisma.js";
import app from "#src/index.js";

const TEST_EMAIL = "vitest_user@example.com";
const TEST_PASSWORD = "superpassword123";

describe("Auth API", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: TEST_EMAIL },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: TEST_EMAIL },
    });
    await prisma.$disconnect();
  });

  describe("POST /auth/register", () => {
    it("должен успешно регистрировать нового пользователя", async () => {
      const response = await request(app).post("/auth/register").send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: "Test User",
      });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(TEST_EMAIL);
      expect(response.body.user).not.toHaveProperty("passwordHash");
    });

    it("должен возвращать 409 Conflict, если email уже занят", async () => {
      const response = await request(app).post("/auth/register").send({
        email: TEST_EMAIL,
        password: "anotherpassword",
      });
      expect(response.status).toBe(409);
      expect(response.body.error).toMatch(/already exists/i);
    });

    it("должен возвращать 400, если данные невалидны (Zod)", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "not-an-email",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation failed");
    });
  });

  describe("POST /auth/login", () => {
    it("должен успешно логинить пользователя и возвращать accessToken + куку", async () => {
      const response = await request(app).post("/auth/login").send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");

      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain("refreshToken=");
      expect(cookies[0]).toContain("HttpOnly");
    });

    it("должен возвращать 401 Unauthorized при неверном пароле", async () => {
      const response = await request(app).post("/auth/login").send({
        email: TEST_EMAIL,
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(/Invalid email or password/i);
    });
  });
});
