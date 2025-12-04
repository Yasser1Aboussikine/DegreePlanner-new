import { prisma } from "@/lib/prisma";
import { MentorAssignment } from "@/generated/prisma/client";

export async function getAllMentorAssignments(): Promise<MentorAssignment[]> {
  return await prisma.mentorAssignment.findMany({
    include: {
      mentor: {
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

export async function getMentorAssignmentsByMentorId(
  mentorId: string
): Promise<MentorAssignment[]> {
  return await prisma.mentorAssignment.findMany({
    where: { mentorId },
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

export async function getMentorAssignmentsByStudentId(
  studentId: string
): Promise<MentorAssignment[]> {
  return await prisma.mentorAssignment.findMany({
    where: { studentId },
    include: {
      mentor: {
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

export async function getMentorAssignmentById(
  id: string
): Promise<MentorAssignment | null> {
  return await prisma.mentorAssignment.findUnique({
    where: { id },
    include: {
      mentor: {
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

interface CreateMentorAssignmentData {
  mentorId: string;
  studentId: string;
}

export async function createMentorAssignment(
  data: CreateMentorAssignmentData
): Promise<MentorAssignment> {
  const existingAssignment = await prisma.mentorAssignment.findUnique({
    where: {
      mentorId_studentId: {
        mentorId: data.mentorId,
        studentId: data.studentId,
      },
    },
  });

  if (existingAssignment) {
    throw new Error("Mentor assignment already exists for this student");
  }

  return await prisma.mentorAssignment.create({
    data: {
      mentorId: data.mentorId,
      studentId: data.studentId,
    },
    include: {
      mentor: {
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

export async function deleteMentorAssignment(
  id: string
): Promise<MentorAssignment> {
  return await prisma.mentorAssignment.delete({
    where: { id },
  });
}

export async function deleteMentorAssignmentByMentorAndStudent(
  mentorId: string,
  studentId: string
): Promise<MentorAssignment> {
  return await prisma.mentorAssignment.delete({
    where: {
      mentorId_studentId: {
        mentorId,
        studentId,
      },
    },
  });
}

export async function getStudentsByMentorId(mentorId: string) {
  const assignments = await prisma.mentorAssignment.findMany({
    where: { mentorId },
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
