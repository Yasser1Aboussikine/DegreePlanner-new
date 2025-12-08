import { prisma } from "@/lib/prisma";
import { MentorAssignment } from "@/generated/prisma/client";
import * as chatService from "./chat.service";

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
  const student = await prisma.user.findUnique({
    where: { id: data.studentId },
    select: { classification: true, name: true },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  if (
    student.classification !== "FRESHMAN" &&
    student.classification !== "SOPHOMORE"
  ) {
    throw new Error(
      "Only FRESHMAN and SOPHOMORE students can be assigned a mentor"
    );
  }

  const existingAssignment = await prisma.mentorAssignment.findUnique({
    where: {
      studentId: data.studentId,
    },
    include: {
      mentor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (existingAssignment) {
    throw new Error(
      `This student is already assigned to ${
        existingAssignment.mentor.name || "a mentor"
      }. Please unassign them first before creating a new assignment.`
    );
  }

  return await prisma.mentorAssignment
    .create({
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
    })
    .then(async (assignment) => {
      // Add student to mentor's group chat and create direct chat
      try {
        await chatService.addStudentToMentorGroup(
          data.mentorId,
          data.studentId
        );
        await chatService.getOrCreateDirectChat(data.mentorId, data.studentId);
      } catch (error) {
        // Log error but don't fail the assignment creation
        console.error("Failed to create chat threads:", error);
      }
      return assignment;
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

  return assignments.map((assignment: any) => assignment.student);
}

export async function getUnassignedStudents() {
  return await prisma.user.findMany({
    where: {
      role: "STUDENT",
      mentorAssignmentAsStudent: null,
      classification: {
        in: ["FRESHMAN", "SOPHOMORE"],
      },
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });
}
