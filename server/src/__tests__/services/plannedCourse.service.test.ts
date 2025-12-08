import * as plannedCourseService from "../../services/plannedCourse.service";
import prisma from "../../config/prisma";
import { Term, Category } from "@/generated/prisma/client";

jest.mock("../../config/prisma", () => ({
  __esModule: true,
  default: {
    plannedCourse: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("PlannedCourse Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPlannedCourse = {
    id: "1",
    planSemesterId: "semester-1",
    courseCode: "CS101",
    courseTitle: "Introduction to Computer Science",
    credits: 3,
    category: Category.COMPUTER_SCIENCE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPlannedCourseWithRelations = {
    ...mockPlannedCourse,
    planSemester: {
      id: "semester-1",
      degreePlanId: "plan-1",
      year: 2024,
      term: Term.FALL,
      nth_semestre: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    },
  };

  describe("createPlannedCourse", () => {
    it("should create a new planned course", async () => {
      (prisma.plannedCourse.create as jest.Mock).mockResolvedValue(
        mockPlannedCourseWithRelations
      );

      const result = await plannedCourseService.createPlannedCourse({
        planSemesterId: "semester-1",
        courseCode: "CS101",
        courseTitle: "Introduction to Computer Science",
        credits: 3,
        category: Category.COMPUTER_SCIENCE,
      });

      expect(result).toBeDefined();
      expect(result.courseCode).toBe("CS101");
      expect(prisma.plannedCourse.create).toHaveBeenCalled();
    });
  });

  describe("getAllPlannedCourses", () => {
    it("should return all planned courses", async () => {
      const mockCourses = [mockPlannedCourseWithRelations];
      (prisma.plannedCourse.findMany as jest.Mock).mockResolvedValue(
        mockCourses
      );

      const result = await plannedCourseService.getAllPlannedCourses();

      expect(result).toHaveLength(1);
      expect(result[0].courseCode).toBe("CS101");
      expect(prisma.plannedCourse.findMany).toHaveBeenCalled();
    });
  });

  describe("getPlannedCourseById", () => {
    it("should return planned course by id with relations", async () => {
      (prisma.plannedCourse.findUnique as jest.Mock).mockResolvedValue(
        mockPlannedCourseWithRelations
      );

      const result = await plannedCourseService.getPlannedCourseById("1");

      expect(result).toBeDefined();
      expect(result?.id).toBe("1");
      expect(result?.planSemester).toBeDefined();
      expect(prisma.plannedCourse.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        include: expect.any(Object),
      });
    });

    it("should return null if planned course not found", async () => {
      (prisma.plannedCourse.findUnique as jest.Mock).mockResolvedValue(null);

      const result =
        await plannedCourseService.getPlannedCourseById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("updatePlannedCourse", () => {
    it("should update a planned course", async () => {
      const updatedCourse = {
        ...mockPlannedCourseWithRelations,
        courseTitle: "Intro to CS",
      };

      (prisma.plannedCourse.findUnique as jest.Mock).mockResolvedValue(
        mockPlannedCourseWithRelations
      );
      (prisma.plannedCourse.update as jest.Mock).mockResolvedValue(
        updatedCourse
      );

      const result = await plannedCourseService.updatePlannedCourse("1", {
        courseTitle: "Intro to CS",
      });

      expect(result).toBeDefined();
      expect(result?.courseTitle).toBe("Intro to CS");
      expect(prisma.plannedCourse.update).toHaveBeenCalled();
    });

    it("should return null if planned course does not exist", async () => {
      (prisma.plannedCourse.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await plannedCourseService.updatePlannedCourse(
        "non-existent",
        {
          courseTitle: "Updated Title",
        }
      );

      expect(result).toBeNull();
      expect(prisma.plannedCourse.update).not.toHaveBeenCalled();
    });
  });

  describe("deletePlannedCourse", () => {
    it("should delete a planned course successfully", async () => {
      (prisma.plannedCourse.delete as jest.Mock).mockResolvedValue(
        mockPlannedCourse
      );

      const result = await plannedCourseService.deletePlannedCourse("1");

      expect(result).toBe(true);
      expect(prisma.plannedCourse.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return false if delete fails", async () => {
      (prisma.plannedCourse.delete as jest.Mock).mockRejectedValue(
        new Error("Not found")
      );

      const result =
        await plannedCourseService.deletePlannedCourse("non-existent");

      expect(result).toBe(false);
    });
  });

  describe("getPlannedCoursesByPlanSemesterId", () => {
    it("should return planned courses for a specific plan semester", async () => {
      const mockCourses = [mockPlannedCourseWithRelations];
      (prisma.plannedCourse.findMany as jest.Mock).mockResolvedValue(
        mockCourses
      );

      const result =
        await plannedCourseService.getPlannedCoursesByPlanSemesterId(
          "semester-1"
        );

      expect(result).toHaveLength(1);
      expect(result[0].planSemesterId).toBe("semester-1");
      expect(prisma.plannedCourse.findMany).toHaveBeenCalledWith({
        where: { planSemesterId: "semester-1" },
        orderBy: {
          courseCode: "asc",
        },
      });
    });
  });
});
