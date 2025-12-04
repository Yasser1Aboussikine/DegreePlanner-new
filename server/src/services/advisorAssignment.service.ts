import { prisma } from "@/lib/prisma";
import { AdvisorAssignment } from "@/generated/prisma/client";

export async function getAllAdvisorAssignments(): Promise<AdvisorAssignment[]> {
  return await prisma.advisorAssignment.findMany({
    include: {
      advisor: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      student: {
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdvisorAssignmentsByAdvisorId(
  advisorId: string
): Promise<AdvisorAssignment[]> {
  return await prisma.advisorAssignment.findMany({
    where: { advisorId },
    include: {
      student: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          major: true,
          minor: true,
          classification: true,
          joinDate: true,
          expectedGraduation: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdvisorAssignmentsByStudentId(
  studentId: string
): Promise<AdvisorAssignment[]> {
  return await prisma.advisorAssignment.findMany({
    where: { studentId },
    include: {
      advisor: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdvisorAssignmentById(
  id: string
): Promise<AdvisorAssignment | null> {
  return await prisma.advisorAssignment.findUnique({
    where: { id },
    include: {
      advisor: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      student: {
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
    },
  });
}

interface CreateAdvisorAssignmentData {
  advisorId: string;
  studentId: string;
}

export async function createAdvisorAssignment(
  data: CreateAdvisorAssignmentData
): Promise<AdvisorAssignment> {
  const existingAssignment = await prisma.advisorAssignment.findUnique({
    where: {
      advisorId_studentId: {
        advisorId: data.advisorId,
        studentId: data.studentId,
      },
    },
  });

  if (existingAssignment) {
    throw new Error("Advisor assignment already exists for this student");
  }

  return await prisma.advisorAssignment.create({
    data: {
      advisorId: data.advisorId,
      studentId: data.studentId,
    },
    include: {
      advisor: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      student: {
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
    },
  });
}

export async function deleteAdvisorAssignment(
  id: string
): Promise<AdvisorAssignment> {
  return await prisma.advisorAssignment.delete({
    where: { id },
  });
}

export async function deleteAdvisorAssignmentByAdvisorAndStudent(
  advisorId: string,
  studentId: string
): Promise<AdvisorAssignment> {
  return await prisma.advisorAssignment.delete({
    where: {
      advisorId_studentId: {
        advisorId,
        studentId,
      },
    },
  });
}

export async function getStudentsByAdvisorId(advisorId: string) {
  const assignments = await prisma.advisorAssignment.findMany({
    where: { advisorId },
    include: {
      student: {
        select: {
          id: true,
          email: true,
          name: true,
          major: true,
          minor: true,
          classification: true,
          joinDate: true,
          expectedGraduation: true,
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

  return assignments.map((assignment) => assignment.student);
}
