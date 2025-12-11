import { prisma } from "@/lib/prisma";
import {
  PlanSemesterReviewRequest,
  ReviewStatus,
} from "@/generated/prisma/client";
import { sendReviewNotificationEmail } from "@/services/email.service";
import logger from "@/config/logger";

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
          degreePlan: {
            select: {
              id: true,
              userId: true,
            },
          },
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
      requestedAt: "asc",
    },
  });
}

export async function getPendingAdvisorReviews(
  advisorId: string
): Promise<PlanSemesterReviewRequest[]> {
  console.log(
    "[DEBUG] getPendingAdvisorReviews called with advisorId:",
    advisorId
  );

  // First check all requests to see what we have
  const allRequests = await prisma.planSemesterReviewRequest.findMany({
    select: {
      id: true,
      status: true,
      advisorId: true,
      studentId: true,
      planSemesterId: true,
    },
  });
  console.log("[DEBUG] All review requests in DB:", allRequests);

  const results = await prisma.planSemesterReviewRequest.findMany({
    where: {
      advisorId,
      status: "PENDING_ADVISOR",
    },
    include: {
      planSemester: {
        select: {
          id: true,
          degreePlanId: true,
          year: true,
          term: true,
          nth_semestre: true,
          plannedCourses: true,
          degreePlan: {
            select: {
              id: true,
              userId: true,
            },
          },
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
      requestedAt: "asc",
    },
  });

  console.log("[DEBUG] Filtered results:", {
    count: results.length,
    advisorIdUsed: advisorId,
  });

  return results;
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
  // First, validate that the semester has courses
  const planSemester = await prisma.planSemester.findUnique({
    where: { id: data.planSemesterId },
    include: {
      plannedCourses: true,
    },
  });

  if (!planSemester) {
    throw new Error("Plan semester not found");
  }

  if (
    !planSemester.plannedCourses ||
    planSemester.plannedCourses.length === 0
  ) {
    throw new Error(
      "Cannot submit a review request for a semester with no courses"
    );
  }

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

interface BulkMentorReviewData {
  approve: boolean;
  semesterComments: Array<{
    requestId: string;
    comment?: string;
  }>;
  generalRejectionReason?: string;
}

export async function submitBulkMentorReview(
  degreePlanId: string,
  mentorId: string,
  data: BulkMentorReviewData
): Promise<PlanSemesterReviewRequest[]> {
  const requests = await prisma.planSemesterReviewRequest.findMany({
    where: {
      planSemester: {
        degreePlanId,
      },
      mentorId,
      status: "PENDING_MENTOR",
    },
  });

  if (requests.length === 0) {
    throw new Error("No pending mentor reviews found for this degree plan");
  }

  const commentMap = new Map(
    data.semesterComments.map((sc) => [sc.requestId, sc.comment])
  );

  const updatedRequests = await Promise.all(
    requests.map((request) =>
      prisma.planSemesterReviewRequest.update({
        where: { id: request.id },
        data: {
          status: data.approve ? "PENDING_ADVISOR" : "REJECTED",
          mentorComment: commentMap.get(request.id) || undefined,
          rejectionReason: data.approve
            ? undefined
            : data.generalRejectionReason || "Rejected by mentor",
          mentorReviewedAt: new Date(),
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
              name: true,
              email: true,
            },
          },
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          advisor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    )
  );

  if (updatedRequests.length > 0) {
    const firstRequest = updatedRequests[0];
    const comments = data.semesterComments
      .map((sc) => sc.comment)
      .filter((c): c is string => !!c);

    sendReviewNotificationEmail({
      studentEmail: firstRequest.student.email,
      studentName: firstRequest.student.name || "Student",
      reviewerName: firstRequest.mentor?.name || "Your Mentor",
      reviewerRole: "Mentor",
      approved: data.approve,
      rejectionReason: data.generalRejectionReason,
      comments: comments.length > 0 ? comments : undefined,
    }).catch((emailError: any) => {
      logger.warn("Failed to send mentor review email notification:", {
        error: emailError.message || emailError,
        studentEmail: firstRequest.student.email,
      });
    });
  }

  return updatedRequests;
}

interface BulkAdvisorReviewData {
  approve: boolean;
  semesterComments: Array<{
    requestId: string;
    comment: string;
  }>;
  generalRejectionReason?: string;
}

export async function submitBulkAdvisorReview(
  degreePlanId: string,
  advisorId: string,
  data: BulkAdvisorReviewData
): Promise<PlanSemesterReviewRequest[]> {
  console.log("[DEBUG] submitBulkAdvisorReview called with:", {
    degreePlanId,
    advisorId,
    approve: data.approve,
    semesterCommentsCount: data.semesterComments?.length,
  });

  const requests = await prisma.planSemesterReviewRequest.findMany({
    where: {
      planSemester: {
        degreePlanId,
      },
      advisorId,
      status: "PENDING_ADVISOR",
    },
  });

  console.log("[DEBUG] Found requests:", {
    count: requests.length,
    requestIds: requests.map((r) => r.id),
    statuses: requests.map((r) => r.status),
  });

  if (requests.length === 0) {
    // Check if there are any requests for this degree plan at all
    const allRequests = await prisma.planSemesterReviewRequest.findMany({
      where: {
        planSemester: {
          degreePlanId,
        },
      },
      select: {
        id: true,
        status: true,
        advisorId: true,
        mentorId: true,
      },
    });
    console.log("[DEBUG] All requests for this degree plan:", allRequests);
    console.log("[DEBUG] Looking for advisorId:", advisorId);

    // Check if requests are still pending mentor review
    const pendingMentorRequests = allRequests.filter(
      (r) => r.status === "PENDING_MENTOR"
    );
    if (pendingMentorRequests.length > 0) {
      throw new Error(
        "These semesters are still pending mentor review. The mentor must approve first before you can review."
      );
    }

    // Check if requests are already approved or rejected
    const processedRequests = allRequests.filter(
      (r) => r.status === "APPROVED" || r.status === "REJECTED"
    );
    if (processedRequests.length > 0) {
      throw new Error(
        "These semesters have already been reviewed and processed."
      );
    }

    throw new Error("No pending advisor reviews found for this degree plan");
  }

  const commentMap = new Map(
    data.semesterComments.map((sc) => [sc.requestId, sc.comment])
  );

  const updatedRequests = await Promise.all(
    requests.map((request) =>
      prisma.planSemesterReviewRequest.update({
        where: { id: request.id },
        data: {
          status: data.approve ? "APPROVED" : "REJECTED",
          advisorComment: commentMap.get(request.id) || undefined,
          rejectionReason: data.approve
            ? undefined
            : data.generalRejectionReason || "Rejected by advisor",
          advisorReviewedAt: new Date(),
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
              name: true,
              email: true,
            },
          },
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          advisor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    )
  );

  if (updatedRequests.length > 0) {
    const firstRequest = updatedRequests[0];
    const comments = data.semesterComments
      .map((sc) => sc.comment)
      .filter((c): c is string => !!c);

    sendReviewNotificationEmail({
      studentEmail: firstRequest.student.email,
      studentName: firstRequest.student.name || "Student",
      reviewerName: firstRequest.advisor?.name || "Your Advisor",
      reviewerRole: "Advisor",
      approved: data.approve,
      rejectionReason: data.generalRejectionReason,
      comments: comments.length > 0 ? comments : undefined,
    }).catch((emailError: any) => {
      logger.warn("Failed to send advisor review email notification:", {
        error: emailError.message || emailError,
        studentEmail: firstRequest.student.email,
      });
    });
  }

  return updatedRequests;
}

export async function createDegreePlanReview(
  degreePlanId: string,
  studentId: string
): Promise<PlanSemesterReviewRequest[]> {
  const degreePlan = await prisma.degreePlan.findUnique({
    where: { id: degreePlanId },
    include: {
      semesters: true,
      user: {
        include: {
          mentorAssignmentAsStudent: true,
          advisorAssignmentAsStudent: true,
        },
      },
    },
  });

  if (!degreePlan) {
    throw new Error("Degree plan not found");
  }

  if (degreePlan.userId !== studentId) {
    throw new Error("This degree plan does not belong to the specified student");
  }

  if (degreePlan.semesters.length === 0) {
    throw new Error("Cannot request review for an empty degree plan");
  }

  const mentorAssignment = degreePlan.user.mentorAssignmentAsStudent;
  const advisorAssignment = degreePlan.user.advisorAssignmentAsStudent;
  const studentClassification = degreePlan.user.classification;
  const studentRole = degreePlan.user.role;
  const isFYEStudent = degreePlan.user.isFYEStudent;

  if (!advisorAssignment) {
    throw new Error("Student must have an assigned advisor to request a review");
  }

  const isStudentAMentor = studentRole === "MENTOR";
  const isFreshmanFYE = studentClassification === "FRESHMAN" && isFYEStudent;

  if (isFreshmanFYE && !mentorAssignment) {
    throw new Error(
      "FYE FRESHMAN students must have an assigned mentor before requesting a degree plan review"
    );
  }

  const requiresMentorReview =
    !isStudentAMentor &&
    (studentClassification === "FRESHMAN" ||
      studentClassification === "SOPHOMORE") &&
    mentorAssignment;

  const existingRequests = await prisma.planSemesterReviewRequest.findMany({
    where: {
      planSemester: {
        degreePlanId,
      },
      status: {
        in: ["PENDING_MENTOR", "PENDING_ADVISOR"],
      },
    },
  });

  if (existingRequests.length > 0) {
    throw new Error(
      "You already have pending review requests for this degree plan"
    );
  }

  const oldProcessedRequests = await prisma.planSemesterReviewRequest.findMany({
    where: {
      planSemester: {
        degreePlanId,
      },
      status: {
        in: ["APPROVED", "REJECTED"],
      },
    },
  });

  const semesterIdMap = new Map(
    oldProcessedRequests.map((req) => [req.planSemesterId, req])
  );

  const reviewRequests = await Promise.all(
    degreePlan.semesters.map((semester) => {
      const existingRequest = semesterIdMap.get(semester.id);

      if (existingRequest) {
        return prisma.planSemesterReviewRequest.update({
          where: { id: existingRequest.id },
          data: {
            mentorId: requiresMentorReview ? mentorAssignment?.mentorId : null,
            advisorId: advisorAssignment.advisorId,
            status: requiresMentorReview ? "PENDING_MENTOR" : "PENDING_ADVISOR",
            requestedAt: new Date(),
            mentorReviewedAt: null,
            advisorReviewedAt: null,
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
                name: true,
                email: true,
              },
            },
            mentor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            advisor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      } else {
        return prisma.planSemesterReviewRequest.create({
          data: {
            planSemesterId: semester.id,
            studentId,
            mentorId: requiresMentorReview ? mentorAssignment?.mentorId : null,
            advisorId: advisorAssignment.advisorId,
            status: requiresMentorReview ? "PENDING_MENTOR" : "PENDING_ADVISOR",
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
                name: true,
                email: true,
              },
            },
            mentor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            advisor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      }
    })
  );

  return reviewRequests;
}

export async function fixJuniorSeniorReviews(): Promise<any[]> {
  // Find all PENDING_MENTOR requests for JUNIOR and SENIOR students
  const pendingMentorRequests = await prisma.planSemesterReviewRequest.findMany(
    {
      where: {
        status: "PENDING_MENTOR",
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            classification: true,
          },
        },
      },
    }
  );

  // Filter for JUNIOR and SENIOR
  const toUpdate = pendingMentorRequests.filter(
    (req) =>
      req.student.classification === "JUNIOR" ||
      req.student.classification === "SENIOR"
  );

  if (toUpdate.length === 0) {
    return [];
  }

  // Update them to PENDING_ADVISOR and remove mentorId
  const updatedRequests = await prisma.$transaction(
    toUpdate.map((req) =>
      prisma.planSemesterReviewRequest.update({
        where: { id: req.id },
        data: {
          status: "PENDING_ADVISOR",
          mentorId: null,
        },
        include: {
          student: {
            select: {
              name: true,
              classification: true,
            },
          },
        },
      })
    )
  );

  return updatedRequests;
}

interface UpdateCommentData {
  mentorComment?: string;
  advisorComment?: string;
}

export async function updateReviewRequestComment(
  id: string,
  role: "mentor" | "advisor",
  comment: string
): Promise<PlanSemesterReviewRequest> {
  const updateData: UpdateCommentData = {};

  if (role === "mentor") {
    updateData.mentorComment = comment;
  } else {
    updateData.advisorComment = comment;
  }

  return await prisma.planSemesterReviewRequest.update({
    where: { id },
    data: updateData,
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
