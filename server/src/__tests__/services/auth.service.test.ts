import * as authService from "../../services/auth.service";
import prisma from "../../config/prisma";
import * as passwordUtil from "../../utils/password";
import * as jwtUtil from "../../utils/jwt";
import { Role } from "@/generated/prisma/enums";

// Mock dependencies
jest.mock("../../config/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    program: {
      findUnique: jest.fn(),
    },
    degreePlan: {
      create: jest.fn(),
    },
  },
}));

jest.mock("../../utils/password");
jest.mock("../../utils/jwt");

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should create a new user successfully", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        password: "hashedPassword",
        role: Role.STUDENT,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockProgram = {
        id: "program-1",
        code: "BSCSC",
        name: "Bachelor of Science in Computer Science",
        level: "BACHELOR",
        totalCredits: 136,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockDegreePlan = {
        id: "plan-1",
        userId: "1",
        programId: "program-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = "mock-access-token";
      const mockRefreshToken = "mock-refresh-token";

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (passwordUtil.hashPassword as jest.Mock).mockResolvedValue(
        "hashedPassword"
      );
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.program.findUnique as jest.Mock).mockResolvedValue(mockProgram);
      (prisma.degreePlan.create as jest.Mock).mockResolvedValue(mockDegreePlan);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue(mockToken);
      (jwtUtil.generateRefreshToken as jest.Mock).mockReturnValue(
        mockRefreshToken
      );

      const result = await authService.signup({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        role: Role.STUDENT,
      });

      expect(result.user).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      expect(result.accessToken).toBe(mockToken);
      expect(result.refreshToken).toBe(mockRefreshToken);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith("password123");
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it("should throw error if user already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
      });

      await expect(
        authService.signup({
          email: "test@example.com",
          password: "password123",
          name: "Test User",
          role: Role.STUDENT,
        })
      ).rejects.toThrow("User already exists");
    });
  });

  describe("login", () => {
    it("should login user with correct credentials", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        password: "hashedPassword",
        role: Role.STUDENT,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = "mock-access-token";
      const mockRefreshToken = "mock-refresh-token";

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue(mockToken);
      (jwtUtil.generateRefreshToken as jest.Mock).mockReturnValue(
        mockRefreshToken
      );

      const result = await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.user).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      expect(result.accessToken).toBe(mockToken);
      expect(result.refreshToken).toBe(mockRefreshToken);
    });

    it("should throw error for invalid credentials", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({
          email: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error for wrong password", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        role: Role.STUDENT,
        isActive: true,
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
