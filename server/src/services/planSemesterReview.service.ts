import { prisma } from "@/lib/prisma";
import {
  PlanSemesterReviewRequest,
  ReviewStatus,
} from "@/generated/prisma/client";

export async function getAllReviewRequests(): Promise<
  PlanSemesterReviewRequest[]
> {
  return await prisma.planSemesterReviewRequest.findMany({
    include: {
      planSemester: {
        include: {
          plannedCourses: true,
          degreePlan: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      student: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      advisor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      requestedAt: "desc",
    },
  });
}

export async function getReviewRequestById(
  id: string
): Promise<PlanSemesterReviewRequest | null> {
  return await prisma.planSemesterReviewRequest.findUnique({
    where: { id },
    include: {
      planSemester: {
        include: {
          plannedCourses: true,
          degreePlan: {
            include: {
              user: true,
            },
          },
        },
      },
      student: true,
      mentor: true,
      advisor: true,
    },
  });
}

export async function getReviewRequestsByStudentId(
  studentId: string
): Promise<PlanSemesterReviewRequest[]> {
  return await prisma.planSemesterReviewRequest.findMany({
    where: { studentId },
    include: {
      planSemester: {
        include: {
          plannedCourses: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      advisor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      requestedAt: "desc",
    },
  });
}

export async function getReviewRequestsByMentorId(
  mentorId: string
): Promise<PlanSemesterReviewRequest[]> {
  return await prisma.planSemesterReviewRequest.findMany({
    where: { mentorId },
    include: {
      planSemester: {
        include: {
          plannedCourses: true,
        },
      },
      student: {
        select: {
          id: true,
          email: true,
          name: true,
          major: true,
          minor: true,
          classification: true,
        },
      },
    },
    orderBy: {
      requestedAt: "desc",
    },
  });
}

export async function getReviewRequestsByAdvisorId(
  advisorId: string
): Promise<PlanSemesterReviewRequest[]> {
  return await prisma.planSemesterReviewRequest.findMany({
    where: { advisorId },
    include: {
      planSemester: {
        include: {
          plannedCourses: true,
        },
      },
      student: {
        select: {
          id: true,
          email: true,
          name: true,
          major: true,
          minor: true,
          classification: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      requestedAt: "desc",
    },
  });
}

export async function getPendingMentorReviews(
  mentorId: string
): Promise<PlanSemesterReviewRequest[]> {
  return await prisma.planSemesterReviewRequest.findMany({
    where: {
      mentorId,
      status: "PENDING_MENTOR",
    },
    include: {
      planSemester: {
        include: {
          plannedCourses: true,
        },
      },
      student: {
        select: {
          id: true,
          email: true,
          name: true,
          major: true,
          minor: true,
        },
      },
    },
    orderBy: {
      requestedAt: "asc",
    },
  });
}

export async function getPendingAdvisorReviews(
  advisorId: string
): Promise<PlanSemesterReviewRequest[]> {
  return await prisma.planSemesterReviewRequest.findMany({
    where: {
      advisorId,
      status: "PENDING_ADVISOR",
    },
    include: {
      planSemester: {
        include: {
          plannedCourses: true,
        },
      },
      student: {
        select: {
          id: true,
          email: true,
          name: true,
          major: true,
          minor: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      requestedAt: "asc",
    },
  });
}

interface CreateReviewRequestData {
  planSemesterId: string;
  studentId: string;
  mentorId?: string;
  advisorId?: string;
}

export async function createReviewRequest(
  data: CreateReviewRequestData
): Promise<PlanSemesterReviewRequest> {
  return await prisma.planSemesterReviewRequest.create({
    data: {
      planSemesterId: data.planSemesterId,
      studentId: data.studentId,
      mentorId: data.mentorId,
      advisorId: data.advisorId,
      status: "PENDING_MENTOR",
    },
    include: {
      planSemester: {
        include: {
          plannedCourses: true,
        },
      },
      student: true,
      mentor: true,
      advisor: true,
    },
  });
}

interface MentorReviewData {
  mentorComment?: string;
  approve: boolean;
  rejectionReason?: string;
}

export async function submitMentorReview(
  id: string,
  data: MentorReviewData
): Promise<PlanSemesterReviewRequest> {
  if (data.approve) {
    return await prisma.planSemesterReviewRequest.update({
      where: { id },
      data: {
        status: "PENDING_ADVISOR",
        mentorComment: data.mentorComment,
        mentorReviewedAt: new Date(),
      },
      include: {
        planSemester: true,
        student: true,
        mentor: true,
        advisor: true,
      },
    });
  } else {
    return await prisma.planSemesterReviewRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        mentorComment: data.mentorComment,
        rejectionReason: data.rejectionReason || "Rejected by mentor",
        mentorReviewedAt: new Date(),
      },
      include: {
        planSemester: true,
        student: true,
        mentor: true,
        advisor: true,
      },
    });
  }
}

interface AdvisorReviewData {
  advisorComment?: string;
  approve: boolean;
  rejectionReason?: string;
}

export async function submitAdvisorReview(
  id: string,
  data: AdvisorReviewData
): Promise<PlanSemesterReviewRequest> {
  if (data.approve) {
    return await prisma.planSemesterReviewRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        advisorComment: data.advisorComment,
        advisorReviewedAt: new Date(),
      },
      include: {
        planSemester: true,
        student: true,
        mentor: true,
        advisor: true,
      },
    });
  } else {
    return await prisma.planSemesterReviewRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        advisorComment: data.advisorComment,
        rejectionReason: data.rejectionReason || "Rejected by advisor",
        advisorReviewedAt: new Date(),
      },
      include: {
        planSemester: true,
        student: true,
        mentor: true,
        advisor: true,
      },
    });
  }
}

export async function deleteReviewRequest(
  id: string
): Promise<PlanSemesterReviewRequest> {
  return await prisma.planSemesterReviewRequest.delete({
    where: { id },
  });
}
