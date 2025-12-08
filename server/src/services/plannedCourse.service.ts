import {
  PlannedCourse,
  Category,
  User,
  DegreePlan,
  PlanSemester,
} from "@/generated/prisma/client";
import prisma from "../config/prisma";

export interface CreatePlannedCourseInput {
  planSemesterId: string;
  courseCode: string;
  courseTitle?: string;
  credits?: number;
  category?: Category;
}

export interface UpdatePlannedCourseInput {
  courseCode?: string;
  courseTitle?: string;
  credits?: number;
  category?: Category;
}

// Extended PlannedCourse with optional relations
type UserWithoutPassword = Omit<User, "password">;

export interface PlannedCourseExtended extends PlannedCourse {
  planSemester?: PlanSemester & {
    degreePlan?: DegreePlan & {
      user?: Pick<UserWithoutPassword, "id" | "email" | "name" | "role">;
    };
  };
}

export const createPlannedCourse = async (
  data: CreatePlannedCourseInput
): Promise<PlannedCourseExtended> => {
  const existingCourse = await prisma.plannedCourse.findUnique({
    where: {
      planSemesterId_courseCode: {
        planSemesterId: data.planSemesterId,
        courseCode: data.courseCode,
      },
    },
  });

  if (existingCourse) {
    throw new Error("This course is already planned for this semester");
  }

  const plannedCourse = await prisma.plannedCourse.create({
    data: {
      planSemesterId: data.planSemesterId,
      courseCode: data.courseCode,
      courseTitle: data.courseTitle,
      credits: data.credits,
      category: data.category,
    },
    include: {
      planSemester: {
        include: {
          degreePlan: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return plannedCourse;
};

export const getAllPlannedCourses = async (): Promise<
  PlannedCourseExtended[]
> => {
  const plannedCourses = await prisma.plannedCourse.findMany({
    include: {
      planSemester: {
        include: {
          degreePlan: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return plannedCourses;
};

export const getPlannedCourseById = async (
  id: string
): Promise<PlannedCourseExtended | null> => {
  const plannedCourse = await prisma.plannedCourse.findUnique({
    where: { id },
    include: {
      planSemester: {
        include: {
          degreePlan: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return plannedCourse;
};

export const getPlannedCoursesByPlanSemesterId = async (
  planSemesterId: string
): Promise<PlannedCourse[]> => {
  const plannedCourses = await prisma.plannedCourse.findMany({
    where: { planSemesterId },
    orderBy: {
      courseCode: "asc",
    },
  });

  return plannedCourses;
};

export const updatePlannedCourse = async (
  id: string,
  data: UpdatePlannedCourseInput
): Promise<PlannedCourseExtended | null> => {
  const existingCourse = await prisma.plannedCourse.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    return null;
  }

  const plannedCourse = await prisma.plannedCourse.update({
    where: { id },
    data,
    include: {
      planSemester: {
        include: {
          degreePlan: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return plannedCourse;
};

/**
 * Get all dependent courses in the degree plan for a given planned course
 * Returns both direct and indirect dependents that exist in the plan
 */
export const getPlannedCourseDependents = async (
  id: string
): Promise<PlannedCourseExtended[]> => {
  const plannedCourse = await prisma.plannedCourse.findUnique({
    where: { id },
    include: {
      planSemester: {
        include: {
          degreePlan: {
            include: {
              semesters: {
                include: {
                  plannedCourses: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!plannedCourse || !plannedCourse.planSemester?.degreePlan) {
    return [];
  }

  const degreePlan = plannedCourse.planSemester.degreePlan;
  const allPlannedCourses = degreePlan.semesters.flatMap(
    (sem) => sem.plannedCourses
  );

  // Get all dependent courses from Neo4j (direct and indirect)
  const neo4jSession = require("../config/neo4j").getSession();

  try {
    const result = await neo4jSession.run(
      `
      MATCH path = (dependent:Course)-[:REQUIRES*]->(c:Course {course_code: $courseCode})
      RETURN DISTINCT dependent.course_code as dependentCode
      ORDER BY dependent.course_code
      `,
      { courseCode: plannedCourse.courseCode }
    );

    const dependentCodes = result.records.map((record: any) =>
      record.get("dependentCode")
    );

    // Filter to only include courses that are in the degree plan
    const dependentsInPlan = allPlannedCourses.filter((pc) =>
      dependentCodes.includes(pc.courseCode)
    );

    return dependentsInPlan as PlannedCourseExtended[];
  } catch (error) {
    console.error("Error getting dependent courses:", error);
    throw error;
  } finally {
    await neo4jSession.close();
  }
};

export const deletePlannedCourse = async (id: string): Promise<boolean> => {
  try {
    await prisma.plannedCourse.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Delete a planned course along with all its dependents in the degree plan
 */
export const deletePlannedCourseWithDependents = async (
  id: string
): Promise<{ deletedCount: number; deletedCourses: string[] }> => {
  try {
    // First get all dependents
    const dependents = await getPlannedCourseDependents(id);
    const dependentIds = dependents.map((d) => d.id);
    const allIdsToDelete = [id, ...dependentIds];

    // Get course codes for logging
    const plannedCourse = await prisma.plannedCourse.findUnique({
      where: { id },
    });

    const deletedCourses = [
      plannedCourse?.courseCode || "",
      ...dependents.map((d) => d.courseCode),
    ].filter(Boolean);

    // Delete all courses in a transaction
    await prisma.$transaction(
      allIdsToDelete.map((courseId) =>
        prisma.plannedCourse.delete({
          where: { id: courseId },
        })
      )
    );

    return {
      deletedCount: allIdsToDelete.length,
      deletedCourses,
    };
  } catch (error) {
    console.error("Error deleting planned course with dependents:", error);
    throw error;
  }
};
