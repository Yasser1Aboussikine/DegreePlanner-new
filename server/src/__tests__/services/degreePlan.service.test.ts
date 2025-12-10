import * as degreePlanService from "../../services/degreePlan.service";
import prisma from "../../config/prisma";

jest.mock("../../config/prisma", () => ({
  __esModule: true,
  default: {
    degreePlan: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    program: {
      findUnique: jest.fn(),
    },
  },
}));

describe("DegreePlan Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDegreePlan = {
    id: "1",
    userId: "user-1",
    programId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("createDegreePlan", () => {
    it("should create a new degree plan", async () => {
      const mockDegreePlanWithRelations = {
        ...mockDegreePlan,
        user: {
          id: "user-1",
          email: "test@example.com",
          name: "Test User",
          role: "STUDENT",
        },
        semesters: [],
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

      (prisma.degreePlan.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.program.findUnique as jest.Mock).mockResolvedValue(mockProgram);
      (prisma.degreePlan.create as jest.Mock).mockResolvedValue(
        mockDegreePlanWithRelations
      );

      const result = await degreePlanService.createDegreePlan({
        userId: "user-1",
      });

      expect(result.userId).toBe("user-1");
      expect(prisma.degreePlan.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
      expect(prisma.degreePlan.create).toHaveBeenCalled();
    });
  });

  describe("getAllDegreePlans", () => {
    it("should return all degree plans", async () => {
      const mockPlans = [mockDegreePlan];
      (prisma.degreePlan.findMany as jest.Mock).mockResolvedValue(mockPlans);

      const result = await degreePlanService.getAllDegreePlans();

      expect(result).toEqual(mockPlans);
    });
  });

  describe("getDegreePlanById", () => {
    it("should return degree plan by id", async () => {
      (prisma.degreePlan.findUnique as jest.Mock).mockResolvedValue(
        mockDegreePlan
      );

      const result = await degreePlanService.getDegreePlanById("1");

      expect(result).toEqual(mockDegreePlan);
    });

    it("should return null if not found", async () => {
      (prisma.degreePlan.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await degreePlanService.getDegreePlanById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("deleteDegreePlan", () => {
    it("should delete a degree plan successfully", async () => {
      (prisma.degreePlan.delete as jest.Mock).mockResolvedValue({ id: "1" });

      const result = await degreePlanService.deleteDegreePlan("1");

      expect(result).toBe(true);
    });

    it("should return false if delete fails", async () => {
      (prisma.degreePlan.delete as jest.Mock).mockRejectedValue(
        new Error("Not found")
      );

      const result = await degreePlanService.deleteDegreePlan("non-existent");

      expect(result).toBe(false);
    });
  });
});
