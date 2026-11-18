import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { prisma } from "../lib/prisma.js";
import { AUTH } from "../lib/paths.js";
import app from "#src/index.js";

const TEST_EMAIL = "vitest_user@example.com";
const TEST_PASSWORD = "superpassword123";

const ERROR_ALREADY_EXISTS = /already exists/i;
const ERROR_INVALID_CREDENTIALS = /Invalid email or password/i;
const ERROR_VALIDATION = "Validation failed";

function parseCookies(response: request.Response): string[] {
  const cookies = response.headers["set-cookie"];
  if (!cookies) return [];
  return Array.isArray(cookies) ? cookies : [cookies];
}

function findCookie(cookies: string[], prefix: string): string | undefined {
  return cookies.find((cookie: string) => cookie.startsWith(prefix));
}

describe("Auth API Full Flow", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  });

  describe(`POST ${AUTH.BASE}${AUTH.REGISTER}`, () => {
    it("должен успешно регистрировать нового пользователя", async () => {
      const response = await request(app).post(`${AUTH.BASE}${AUTH.REGISTER}`).send({
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
      const response = await request(app).post(`${AUTH.BASE}${AUTH.REGISTER}`).send({
        email: TEST_EMAIL,
        password: "anotherpassword",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toMatch(ERROR_ALREADY_EXISTS);
    });

    it("должен возвращать 400, если данные невалидны (Zod)", async () => {
      const response = await request(app).post(`${AUTH.BASE}${AUTH.REGISTER}`).send({
        email: "not-an-email",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(ERROR_VALIDATION);
    });
  });

  describe(`POST ${AUTH.BASE}${AUTH.LOGIN}`, () => {
    it("должен успешно логинить пользователя и возвращать accessToken + куку", async () => {
      const response = await request(app).post(`${AUTH.BASE}${AUTH.LOGIN}`).send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");

      const cookies = parseCookies(response);
      expect(cookies.length).toBeGreaterThan(0);
      expect(cookies[0]).toContain("refreshToken=");
      expect(cookies[0]).toContain("HttpOnly");
    });

    it("должен возвращать 401 Unauthorized при неверном пароле", async () => {
      const response = await request(app).post(`${AUTH.BASE}${AUTH.LOGIN}`).send({
        email: TEST_EMAIL,
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(ERROR_INVALID_CREDENTIALS);
    });

    it("должен возвращать 401 Unauthorized при неверном email", async () => {
      const response = await request(app).post(`${AUTH.BASE}${AUTH.LOGIN}`).send({
        email: "nonexistent@example.com",
        password: TEST_PASSWORD,
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(ERROR_INVALID_CREDENTIALS);
    });
  });

  describe("Protected Routes and Session Management", () => {
    let accessToken: string | undefined;
    let refreshTokenCookie: string | undefined;

    beforeAll(async () => {
      const response = await request(app).post(`${AUTH.BASE}${AUTH.LOGIN}`).send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      accessToken = response.body.accessToken;

      const cookies = parseCookies(response);
      refreshTokenCookie = findCookie(cookies, "refreshToken=");
    });

    describe(`GET ${AUTH.BASE}${AUTH.ME}`, () => {
      it("должен возвращать 401, если токен не передан", async () => {
        const response = await request(app).get(`${AUTH.BASE}${AUTH.ME}`);

        expect(response.status).toBe(401);
      });

      it("должен возвращать данные пользователя, если передан валидный токен", async () => {
        expect(accessToken).toBeDefined();

        const response = await request(app)
          .get(`${AUTH.BASE}${AUTH.ME}`)
          .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe(TEST_EMAIL);
        expect(response.body.user).not.toHaveProperty("passwordHash");
      });

      it("должен возвращать 401, если передан невалидный токен", async () => {
        const response = await request(app)
          .get(`${AUTH.BASE}${AUTH.ME}`)
          .set("Authorization", "Bearer invalid_token_12345");

        expect(response.status).toBe(401);
      });
    });

    describe(`POST ${AUTH.BASE}${AUTH.REFRESH}`, () => {
      it("должен выдавать новый accessToken, если есть валидная кука refreshToken", async () => {
        expect(refreshTokenCookie).toBeDefined();

        const response = await request(app)
          .post(`${AUTH.BASE}${AUTH.REFRESH}`)
          .set("Cookie", [refreshTokenCookie!]);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(typeof response.body.accessToken).toBe("string");
      });

      it("должен возвращать 401, если куки refreshToken нет", async () => {
        const response = await request(app).post(`${AUTH.BASE}${AUTH.REFRESH}`);

        expect(response.status).toBe(401);
      });

      it("должен возвращать 401, если кука refreshToken невалидна", async () => {
        const response = await request(app)
          .post(`${AUTH.BASE}${AUTH.REFRESH}`)
          .set("Cookie", ["refreshToken=invalid_cookie_value"]);

        expect(response.status).toBe(401);
      });
    });

    describe(`POST ${AUTH.BASE}${AUTH.LOGOUT}`, () => {
      it("должен очищать куку refreshToken", async () => {
        expect(refreshTokenCookie).toBeDefined();

        const response = await request(app)
          .post(`${AUTH.BASE}${AUTH.LOGOUT}`)
          .set("Cookie", [refreshTokenCookie!]);

        expect(response.status).toBe(200);

        const cookies = parseCookies(response);
        const clearedCookie = findCookie(cookies, "refreshToken=");

        expect(clearedCookie).toBeDefined();
        expect(clearedCookie).toContain("refreshToken=;");
        expect(clearedCookie).toContain("Expires=Thu, 01 Jan 1970");
      });
    });
  });
});
