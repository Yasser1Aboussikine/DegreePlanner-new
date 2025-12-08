import { DegreePlan } from "@/generated/prisma/client";
import prisma from "../config/prisma";

export interface CreateDegreePlanInput {
  userId: string;
}

export interface UpdateDegreePlanInput {
  userId?: string;
}

export const createDegreePlan = async (
  data: CreateDegreePlanInput
): Promise<DegreePlan> => {
  const existingPlan = await prisma.degreePlan.findUnique({
    where: { userId: data.userId },
  });

  if (existingPlan) {
    throw new Error("Degree plan already exists for this user");
  }

  const degreePlan = await prisma.degreePlan.create({
    data: {
      userId: data.userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      semesters: {
        include: {
          plannedCourses: true,
        },
      },
    },
  });

  return degreePlan;
};

export const getAllDegreePlans = async (): Promise<DegreePlan[]> => {
  const degreePlans = await prisma.degreePlan.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          major: true,
          minor: true,
          classification: true,
        },
      },
      program: true,
      semesters: {
        include: {
          plannedCourses: true,
        },
        orderBy: {
          nth_semestre: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return degreePlans;
};

export const getDegreePlanById = async (
  id: string
): Promise<DegreePlan | null> => {
  const degreePlan = await prisma.degreePlan.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          major: true,
          minor: true,
          classification: true,
        },
      },
      program: true,
      semesters: {
        include: {
          plannedCourses: true,
        },
        orderBy: {
          nth_semestre: "asc",
        },
      },
    },
  });

  return degreePlan;
};

export const getDegreePlanByUserId = async (
  userId: string
): Promise<DegreePlan | null> => {
  const degreePlan = await prisma.degreePlan.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          major: true,
          minor: true,
          classification: true,
        },
      },
      program: true,
      semesters: {
        include: {
          plannedCourses: true,
        },
        orderBy: {
          nth_semestre: "asc",
        },
      },
    },
  });

  return degreePlan;
};

export const updateDegreePlan = async (
  id: string,
  data: UpdateDegreePlanInput
): Promise<DegreePlan | null> => {
  const existingPlan = await prisma.degreePlan.findUnique({
    where: { id },
  });

  if (!existingPlan) {
    return null;
  }

  const degreePlan = await prisma.degreePlan.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      semesters: {
        include: {
          plannedCourses: true,
        },
      },
    },
  });

  return degreePlan;
};

export const deleteDegreePlan = async (id: string): Promise<boolean> => {
  try {
    await prisma.degreePlan.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};
