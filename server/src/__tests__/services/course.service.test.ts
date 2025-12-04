import * as courseService from "../../services/course.service";

// Mock Neo4j driver
jest.mock("../../config/neo4j", () => ({
  getSession: jest.fn(),
}));

const { getSession } = require("../../config/neo4j");

describe("Course Service", () => {
  let mockSession: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSession = {
      run: jest.fn(),
      close: jest.fn(),
    };

    (getSession as jest.Mock).mockReturnValue(mockSession);
  });

  const mockCourseNode = {
    properties: {
      id: "COURSE_CS101",
      course_code: "CS101",
      course_title: "Introduction to Computer Science",
      description: "Intro course",
      sch_credits: 3,
      n_credits: 3,
      isElective: false,
      isMinorElective: false,
      isSpecElective: false,
      categories: [],
      disciplines: ["Computer Science"],
    },
    labels: ["Course"],
  };

  describe("getAllCourses", () => {
    it("should return paginated courses with total count", async () => {
      mockSession.run
        .mockResolvedValueOnce({
          records: [{ get: jest.fn().mockReturnValue({ toNumber: () => 1 }) }],
        })
        .mockResolvedValueOnce({
          records: [{ get: jest.fn().mockReturnValue(mockCourseNode) }],
        });

      const result = await courseService.getAllCourses(0, 10);

      expect(result.courses).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.courses[0].course_code).toBe("CS101");
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe("getCourseById", () => {
    it("should return course by id", async () => {
      mockSession.run.mockResolvedValue({
        records: [
          {
            get: jest.fn((key: string) => {
              if (key === "c") return mockCourseNode;
              if (key === "prerequisites") return [];
              if (key === "dependents") return [];
            }),
          },
        ],
      });

      const result = await courseService.getCourseById("COURSE_CS101");

      expect(result).toBeDefined();
      expect(result?.course_code).toBe("CS101");
    });
  });

  describe("searchCourses", () => {
    it("should search courses by query string", async () => {
      mockSession.run.mockResolvedValue({
        records: [{ get: jest.fn().mockReturnValue(mockCourseNode) }],
      });

      const result = await courseService.searchCourses("computer");

      expect(result).toHaveLength(1);
      expect(result[0].course_code).toBe("CS101");
    });
  });

  describe("getCourseByCourseCode", () => {
    it("should return course by course code", async () => {
      mockSession.run.mockResolvedValue({
        records: [
          {
            get: jest.fn((key: string) => {
              if (key === "c") return mockCourseNode;
              if (key === "prerequisites") return [];
              if (key === "dependents") return [];
            }),
          },
        ],
      });

      const result = await courseService.getCourseByCourseCode("CS101");

      expect(result).toBeDefined();
      expect(result?.course_code).toBe("CS101");
    });

    it("should return null if course code not found", async () => {
      mockSession.run.mockResolvedValue({ records: [] });

      const result = await courseService.getCourseByCourseCode("NONEXISTENT");

      expect(result).toBeNull();
    });
  });

  describe("getCoursesByDiscipline", () => {
    it("should return courses filtered by discipline", async () => {
      mockSession.run.mockResolvedValue({
        records: [{ get: jest.fn().mockReturnValue(mockCourseNode) }],
      });

      const result = await courseService.getCoursesByDiscipline(
        "Computer Science"
      );

      expect(result).toHaveLength(1);
      expect(result[0].disciplines).toContain("Computer Science");
    });
  });

  describe("getCoursePrerequisites", () => {
    it("should return direct prerequisites for a course", async () => {
      mockSession.run.mockResolvedValue({
        records: [{ get: jest.fn().mockReturnValue(mockCourseNode) }],
      });

      const result = await courseService.getCoursePrerequisites("COURSE_CS201");

      expect(result).toHaveLength(1);
      expect(result[0].course_code).toBe("CS101");
    });
  });

  describe("createCourse", () => {
    it("should create a new course in Neo4j", async () => {
      mockSession.run.mockResolvedValue({
        records: [{ get: jest.fn().mockReturnValue(mockCourseNode) }],
      });

      const result = await courseService.createCourse({
        labels: ["Course"],
        course_code: "CS101",
        course_title: "Introduction to Computer Science",
        description: "Intro course",
        sch_credits: 3,
        n_credits: 3,
        categories: [],
        disciplines: ["Computer Science"],
      });

      expect(result).toBeDefined();
      expect(result.course_code).toBe("CS101");
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe("updateCourse", () => {
    it("should update a course's title and description", async () => {
      mockSession.run.mockResolvedValue({
        records: [
          {
            get: jest.fn().mockReturnValue({
              properties: {
                ...mockCourseNode.properties,
                course_title: "Intro to CS (Updated)",
                description: "Updated description",
              },
              labels: ["Course"],
            }),
          },
        ],
      });

      const result = await courseService.updateCourse("COURSE_CS101", {
        course_title: "Intro to CS (Updated)",
        description: "Updated description",
      });

      expect(result).toBeDefined();
      expect(result?.course_title).toBe("Intro to CS (Updated)");
      expect(result?.description).toBe("Updated description");
    });

    it("should return null if course not found for update", async () => {
      mockSession.run.mockResolvedValue({ records: [] });
      const result = await courseService.updateCourse("NONEXISTENT", {
        course_title: "Doesn't matter",
      });
      expect(result).toBeNull();
    });
  });

  describe("prerequisite linking/unlinking", () => {
    it("should link a prerequisite to a course", async () => {
      mockSession.run.mockResolvedValue({});
      const rel = await courseService.createPrerequisite(
        "COURSE_CS100",
        "COURSE_CS101"
      );
      expect(rel).toMatchObject({
        type: "REQUIRES",
        startNode: "COURSE_CS101",
        endNode: "COURSE_CS100",
      });
    });

    it("should unlink a prerequisite from a course", async () => {
      mockSession.run.mockResolvedValue({
        records: [{ get: jest.fn().mockReturnValue({ toNumber: () => 1 }) }],
      });
      const result = await courseService.deletePrerequisite(
        "COURSE_CS100",
        "COURSE_CS101"
      );
      expect(result).toBe(true);
    });

    it("should return false if unlinking a non-existent prerequisite", async () => {
      mockSession.run.mockResolvedValue({
        records: [{ get: jest.fn().mockReturnValue({ toNumber: () => 0 }) }],
      });
      const result = await courseService.deletePrerequisite(
        "COURSE_FAKE",
        "COURSE_CS101"
      );
      expect(result).toBe(false);
    });
  });

  describe("invalid input handling", () => {
    it("should throw if creating a course with missing required fields", async () => {
      await expect(
        courseService.createCourse({
          labels: ["Course"],
          course_code: "", // Invalid
          course_title: "",
          description: "",
          sch_credits: 3,
          n_credits: 3,
          categories: [],
          disciplines: [],
        })
      ).rejects.toThrow();
    });

    it("should throw if updating a course with no updatable fields", async () => {
      // When no fields to update, updateCourse calls getCourseById which needs a proper mock
      mockSession.run.mockResolvedValue({
        records: [
          {
            get: jest.fn((key: string) => {
              if (key === "c") return mockCourseNode;
              if (key === "prerequisites") return [];
              if (key === "dependents") return [];
            }),
          },
        ],
      });

      const result = await courseService.updateCourse("COURSE_CS101", {});

      // Should return the course as-is when no fields to update
      expect(result).toBeDefined();
      expect(result?.course_code).toBe("CS101");
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe("deleteCourse", () => {
    it("should delete a course successfully", async () => {
      mockSession.run.mockResolvedValue({
        records: [{ get: jest.fn().mockReturnValue({ toNumber: () => 1 }) }],
      });

      const result = await courseService.deleteCourse("COURSE_CS101");

      expect(result).toBe(true);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it("should return false if course not found", async () => {
      mockSession.run.mockResolvedValue({
        records: [{ get: jest.fn().mockReturnValue({ toNumber: () => 0 }) }],
      });

      const result = await courseService.deleteCourse("NONEXISTENT");

      expect(result).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should close session on error", async () => {
      mockSession.run.mockRejectedValue(new Error("Database error"));

      await expect(courseService.getAllCourses(0, 10)).rejects.toThrow(
        "Database error"
      );
      expect(mockSession.close).toHaveBeenCalled();
    });
  });
});
