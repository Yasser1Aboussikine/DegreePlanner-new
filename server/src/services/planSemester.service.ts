import {
  PlanSemester,
  Term,
  User,
  DegreePlan,
  PlannedCourse,
} from "@/generated/prisma/client";
import prisma from "../config/prisma";

export interface CreatePlanSemesterInput {
  degreePlanId: string;
  year: number;
  term: Term;
  nth_semestre: number;
}

export interface UpdatePlanSemesterInput {
  year?: number;
  term?: Term;
  nth_semestre?: number;
}

// Extended PlanSemester with optional relations
type UserWithoutPassword = Omit<User, "password">;

export interface PlanSemesterExtended extends PlanSemester {
  degreePlan?: DegreePlan & {
    user?: Pick<UserWithoutPassword, "id" | "email" | "name" | "role">;
  };
  plannedCourses?: PlannedCourse[];
}

export const createPlanSemester = async (
  data: CreatePlanSemesterInput
): Promise<PlanSemesterExtended> => {
  // Check for duplicate semester (same degree plan, year, and term)
  const existingSemester = await prisma.planSemester.findFirst({
    where: {
      degreePlanId: data.degreePlanId,
      year: data.year,
      term: data.term,
    },
  });

  if (existingSemester) {
    throw new Error(
      `A semester for ${data.term} ${data.year} already exists in this degree plan`
    );
  }

  const planSemester = await prisma.planSemester.create({
    data: {
      degreePlanId: data.degreePlanId,
      year: data.year,
      term: data.term,
      nth_semestre: data.nth_semestre,
    },
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
      plannedCourses: true,
    },
  });

  return planSemester;
};

export const getAllPlanSemesters = async (): Promise<
  PlanSemesterExtended[]
> => {
  const planSemesters = await prisma.planSemester.findMany({
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
      plannedCourses: true,
    },
    orderBy: {
      nth_semestre: "asc",
    },
  });

  return planSemesters;
};

export const getPlanSemesterById = async (
  id: string
): Promise<PlanSemesterExtended | null> => {
  const planSemester = await prisma.planSemester.findUnique({
    where: { id },
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
      plannedCourses: true,
    },
  });

  return planSemester;
};

export const getPlanSemestersByDegreePlanId = async (
  degreePlanId: string
): Promise<PlanSemester[]> => {
  const planSemesters = await prisma.planSemester.findMany({
    where: { degreePlanId },
    include: {
      plannedCourses: true,
    },
    orderBy: {
      nth_semestre: "asc",
    },
  });

  return planSemesters;
};

export const updatePlanSemester = async (
  id: string,
  data: UpdatePlanSemesterInput
): Promise<PlanSemesterExtended | null> => {
  const existingSemester = await prisma.planSemester.findUnique({
    where: { id },
  });

  if (!existingSemester) {
    return null;
  }

  const planSemester = await prisma.planSemester.update({
    where: { id },
    data,
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
      plannedCourses: true,
    },
  });

  return planSemester;
};

export const deletePlanSemester = async (id: string): Promise<boolean> => {
  try {
    await prisma.planSemester.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getValidNextTerms = (currentTerm: Term): Term[] => {
  switch (currentTerm) {
    case "FALL":
      return ["WINTER", "SPRING"];
    case "SPRING":
      return ["SUMMER", "FALL"];
    case "WINTER":
      return ["SPRING"];
    case "SUMMER":
      return ["FALL"];
    default:
      return [];
  }
};
