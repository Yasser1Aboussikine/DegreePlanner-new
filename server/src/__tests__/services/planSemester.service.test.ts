import * as planSemesterService from "../../services/planSemester.service";
import prisma from "../../config/prisma";
import { Term } from "@/generated/prisma/client";

jest.mock("../../config/prisma", () => ({
  __esModule: true,
  default: {
    planSemester: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("PlanSemester Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPlanSemester = {
    id: "1",
    degreePlanId: "plan-1",
    year: 2024,
    term: Term.FALL,
    nth_semestre: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPlanSemesterWithRelations = {
    ...mockPlanSemester,
    degreePlan: {
      id: "plan-1",
      userId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "STUDENT",
      },
    },
    plannedCourses: [],
  };

  describe("createPlanSemester", () => {
    it("should create a new plan semester", async () => {
      (prisma.planSemester.create as jest.Mock).mockResolvedValue(
        mockPlanSemesterWithRelations
      );

      const result = await planSemesterService.createPlanSemester({
        degreePlanId: "plan-1",
        year: 2024,
        term: Term.FALL,
        nth_semestre: 1,
      });

      expect(result).toBeDefined();
      expect(result.degreePlanId).toBe("plan-1");
      expect(result.year).toBe(2024);
      expect(result.term).toBe(Term.FALL);
      expect(prisma.planSemester.create).toHaveBeenCalled();
    });
  });

  describe("getAllPlanSemesters", () => {
    it("should return all plan semesters", async () => {
      const mockSemesters = [mockPlanSemesterWithRelations];
      (prisma.planSemester.findMany as jest.Mock).mockResolvedValue(
        mockSemesters
      );

      const result = await planSemesterService.getAllPlanSemesters();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
      expect(prisma.planSemester.findMany).toHaveBeenCalled();
    });
  });

  describe("getPlanSemesterById", () => {
    it("should return plan semester by id with relations", async () => {
      (prisma.planSemester.findUnique as jest.Mock).mockResolvedValue(
        mockPlanSemesterWithRelations
      );

      const result = await planSemesterService.getPlanSemesterById("1");

      expect(result).toBeDefined();
      expect(result?.id).toBe("1");
      expect(result?.degreePlan).toBeDefined();
      expect(prisma.planSemester.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        include: expect.any(Object),
      });
    });

    it("should return null if plan semester not found", async () => {
      (prisma.planSemester.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await planSemesterService.getPlanSemesterById(
        "non-existent"
      );

      expect(result).toBeNull();
    });
  });

  describe("updatePlanSemester", () => {
    it("should update a plan semester", async () => {
      const updatedSemester = {
        ...mockPlanSemesterWithRelations,
        year: 2025,
      };

      (prisma.planSemester.findUnique as jest.Mock).mockResolvedValue(
        mockPlanSemesterWithRelations
      );
      (prisma.planSemester.update as jest.Mock).mockResolvedValue(
        updatedSemester
      );

      const result = await planSemesterService.updatePlanSemester("1", {
        year: 2025,
      });

      expect(result).toBeDefined();
      expect(result?.year).toBe(2025);
      expect(prisma.planSemester.update).toHaveBeenCalled();
    });

    it("should return null if plan semester does not exist", async () => {
      (prisma.planSemester.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await planSemesterService.updatePlanSemester(
        "non-existent",
        { year: 2025 }
      );

      expect(result).toBeNull();
      expect(prisma.planSemester.update).not.toHaveBeenCalled();
    });
  });

  describe("deletePlanSemester", () => {
    it("should delete a plan semester successfully", async () => {
      (prisma.planSemester.delete as jest.Mock).mockResolvedValue(
        mockPlanSemester
      );

      const result = await planSemesterService.deletePlanSemester("1");

      expect(result).toBe(true);
      expect(prisma.planSemester.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return false if delete fails", async () => {
      (prisma.planSemester.delete as jest.Mock).mockRejectedValue(
        new Error("Not found")
      );

      const result = await planSemesterService.deletePlanSemester(
        "non-existent"
      );

      expect(result).toBe(false);
    });
  });

  describe("getPlanSemestersByDegreePlanId", () => {
    it("should return plan semesters for a specific degree plan", async () => {
      const mockSemesters = [mockPlanSemesterWithRelations];
      (prisma.planSemester.findMany as jest.Mock).mockResolvedValue(
        mockSemesters
      );

      const result = await planSemesterService.getPlanSemestersByDegreePlanId(
        "plan-1"
      );

      expect(result).toHaveLength(1);
      expect(result[0].degreePlanId).toBe("plan-1");
      expect(prisma.planSemester.findMany).toHaveBeenCalledWith({
        where: { degreePlanId: "plan-1" },
        include: {
          plannedCourses: true,
        },
        orderBy: {
          nth_semestre: "asc",
        },
      });
    });
  });
});
