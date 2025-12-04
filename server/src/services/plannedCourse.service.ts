import {
  PlannedCourse,
  PlannedCourseStatus,
  Category,
  User,
  DegreePlan,
  PlanSemester,
} from "@/generated/prisma/client";
import prisma from "../config/prisma";

export interface CreatePlannedCourseInput {
  planSemesterId: string;
  courseCode: string;
  status?: PlannedCourseStatus;
  courseTitle?: string;
  credits?: number;
  category?: Category;
}

export interface UpdatePlannedCourseInput {
  courseCode?: string;
  status?: PlannedCourseStatus;
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
      status: data.status || PlannedCourseStatus.PLANNED,
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

export const getPlannedCoursesByStatus = async (
  status: PlannedCourseStatus
): Promise<PlannedCourseExtended[]> => {
  const plannedCourses = await prisma.plannedCourse.findMany({
    where: { status },
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
