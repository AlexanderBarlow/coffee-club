import { POST } from "@/app/api/user/create/route";

// Mock PrismaClient
jest.mock("@prisma/client", () => {
  const mUpsert = jest.fn();
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: { upsert: mUpsert },
    })),
  };
});

describe("Create User API Route", () => {
  it("creates a new user with valid input", async () => {
    const mockUser = {
      id: "test-id",
      email: "test@example.com",
      tier: "BRONZE",
      points: 0,
      isAdmin: false,
    };

    const mockRequest = {
      json: async () => mockUser,
    };

    // Get the upsert mock from the mocked module
    const { PrismaClient } = require("@prisma/client");
    const mockUpsert = PrismaClient.mock.results[0].value.user.upsert;
    mockUpsert.mockResolvedValue(mockUser);

    const res = await POST(mockRequest);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(mockUser);
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { id: "test-id" },
      update: {},
      create: {
        id: "test-id",
        email: "test@example.com",
        tier: "BRONZE",
        points: 0,
        isAdmin: false,
      },
    });
  });

  it("handles errors gracefully", async () => {
    const { PrismaClient } = require("@prisma/client");
    const mockUpsert = PrismaClient.mock.results[0].value.user.upsert;
    mockUpsert.mockRejectedValue(new Error("Database error"));

    const mockRequest = {
      json: async () => ({ id: "bad-id", email: "bad@example.com" }),
    };

    const res = await POST(mockRequest);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Database error");
  });
});
