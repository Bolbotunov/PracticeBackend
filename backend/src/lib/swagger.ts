import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PracticeBackend Auth API",
      version: "1.0.0",
      description: "REST API for authentication and authorization. JWT access/refresh token flow.",
      contact: { name: "PracticeBackend" },
    },
    servers: [{ url: "http://localhost:5000", description: "Development server" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT access token",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string" },
            details: {
              type: "object",
              additionalProperties: { type: "array", items: { type: "string" } },
            },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            password: { type: "string", minLength: 8, maxLength: 16, example: "strongPwd123" },
            name: { type: "string", maxLength: 50, example: "John Doe" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            password: { type: "string", example: "strongPwd123" },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            name: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        RegisterResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "User registered successfully" },
            user: { $ref: "#/components/schemas/UserResponse" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Login successful" },
            user: { $ref: "#/components/schemas/UserResponse" },
            accessToken: { type: "string" },
          },
        },
        RefreshResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
          },
        },
        LogoutResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Logged out successfully" },
          },
        },
      },
    },
    paths: {
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } },
            },
          },
          responses: {
            "201": {
              description: "User registered",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/RegisterResponse" } },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
            "409": {
              description: "Email already exists",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          description: "Returns accessToken and sets HttpOnly cookie with refreshToken",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
            "401": {
              description: "Invalid credentials",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout user",
          description: "Clears HttpOnly refreshToken cookie",
          responses: {
            "200": {
              description: "Logged out",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/LogoutResponse" } },
              },
            },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user profile",
          security: [{ BearerAuth: [] }],
          responses: {
            "200": {
              description: "User data",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { user: { $ref: "#/components/schemas/UserResponse" } },
                  },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
            "404": {
              description: "User not found",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token",
          description: "Uses HttpOnly refreshToken cookie to issue a new access token",
          responses: {
            "200": {
              description: "New access token",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/RefreshResponse" } },
              },
            },
            "401": {
              description: "Missing or invalid refresh token",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
