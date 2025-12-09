import prisma from "../config/prisma";
import { Role, ReviewStatus, Classification } from "@/generated/prisma/enums";

export const getStudentDashboard = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      degreePlan: {
        include: {
          program: true,
          semesters: {
            include: {
              plannedCourses: true,
            },
            orderBy: { nth_semestre: "asc" },
          },
        },
      },
    },
  });

  if (!user || !user.degreePlan) {
    return {
      totalCourses: 0,
      completedCourses: 0,
      totalCredits: 0,
      earnedCredits: 0,
      completionPercentage: 0,
      categoryDistribution: [],
      categoryProgress: [],
    };
  }

  const allCourses = user.degreePlan.semesters.flatMap((s) => s.plannedCourses);
  const totalRequiredCredits = user.degreePlan.program?.totalCredits || 120;

  const totalCourses = allCourses.length;
  const completedCourses = 0;

  const totalCreditsPlanned = allCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const earnedCredits = 0;

  const completionPercentage = totalRequiredCredits > 0
    ? Math.round((totalCreditsPlanned / totalRequiredCredits) * 100)
    : 0;

  const creditsByCategory: Record<string, number> = {};
  allCourses.forEach((course) => {
    if (course.category) {
      creditsByCategory[course.category] = (creditsByCategory[course.category] || 0) + (course.credits || 0);
    }
  });

  const categoryDistribution = Object.entries(creditsByCategory).map(([name, value]) => ({
    category: name.replace(/_/g, " "),
    credits: value,
    percentage: totalCreditsPlanned > 0 ? Math.round((value / totalCreditsPlanned) * 100) : 0,
  }));

  const categoryRequirements: Record<string, number> = {
    GEN_ED: 30,
    MAJOR_REQUIRED: 45,
    MAJOR_ELECTIVE: 15,
    MINOR_REQUIRED: 18,
    MINOR_ELECTIVE: 6,
    FREE_ELECTIVE: 6,
  };

  const categoryProgress = Object.entries(categoryRequirements).map(([category, required]) => {
    const earned = creditsByCategory[category] || 0;
    const percentage = required > 0 ? Math.round((earned / required) * 100) : 0;

    return {
      category: category.replace(/_/g, " "),
      earned,
      required,
      remaining: Math.max(0, required - earned),
      percentage: Math.min(100, percentage),
    };
  });

  return {
    totalCourses,
    completedCourses,
    remainingCourses: totalCourses - completedCourses,
    totalCredits: totalRequiredCredits,
    earnedCredits,
    plannedCredits: totalCreditsPlanned,
    remainingCredits: Math.max(0, totalRequiredCredits - totalCreditsPlanned),
    completionPercentage,
    categoryDistribution,
    categoryProgress,
  };
};

export const getMentorDashboard = async (mentorId: string) => {
  const mentees = await prisma.user.findMany({
    where: {
      mentorAssignmentAsStudent: {
        mentorId,
      },
    },
    include: {
      degreePlan: {
        include: {
          semesters: {
            include: {
              plannedCourses: true,
              reviewRequests: true,
            },
          },
        },
      },
    },
  });

  const menteesProgress = mentees.map((mentee) => {
    if (!mentee.degreePlan) return "No Plan Created";
    const totalCredits = mentee.degreePlan.semesters
      .flatMap((s) => s.plannedCourses)
      .reduce((sum, c) => sum + (c.credits || 0), 0);

    const expectedCredits = mentee.classification === Classification.FRESHMAN ? 30 :
                            mentee.classification === Classification.SOPHOMORE ? 60 :
                            mentee.classification === Classification.JUNIOR ? 90 : 120;

    if (totalCredits >= expectedCredits + 10) return "Ahead of Schedule";
    if (totalCredits < expectedCredits - 10) return "Significantly Behind";
    if (totalCredits < expectedCredits) return "Slightly Behind";
    return "On Track";
  });

  const menteesProgressData = [
    { name: "On Track", value: menteesProgress.filter((p) => p === "On Track").length },
    { name: "Slightly Behind", value: menteesProgress.filter((p) => p === "Slightly Behind").length },
    { name: "Significantly Behind", value: menteesProgress.filter((p) => p === "Significantly Behind").length },
    { name: "Ahead of Schedule", value: menteesProgress.filter((p) => p === "Ahead of Schedule").length },
  ];

  const planStatusCounts = {
    "No Plan Created": 0,
    "Draft Only": 0,
    "Pending Mentor Approval": 0,
    "Mentor Approved": 0,
    "Fully Approved": 0,
  };

  mentees.forEach((mentee) => {
    if (!mentee.degreePlan) {
      planStatusCounts["No Plan Created"]++;
    } else {
      const latestReview = mentee.degreePlan.semesters
        .flatMap((s) => s.reviewRequests)
        .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())[0];

      if (!latestReview) {
        planStatusCounts["Draft Only"]++;
      } else if (latestReview.status === ReviewStatus.PENDING_MENTOR) {
        planStatusCounts["Pending Mentor Approval"]++;
      } else if (latestReview.status === ReviewStatus.PENDING_ADVISOR) {
        planStatusCounts["Mentor Approved"]++;
      } else if (latestReview.status === ReviewStatus.APPROVED) {
        planStatusCounts["Fully Approved"]++;
      }
    }
  });

  const planStatusData = Object.entries(planStatusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const aggregateCredits: Record<string, number> = {};
  mentees.forEach((mentee) => {
    mentee.degreePlan?.semesters.forEach((semester) => {
      semester.plannedCourses.forEach((course) => {
        if (course.category) {
          aggregateCredits[course.category] = (aggregateCredits[course.category] || 0) + (course.credits || 0);
        }
      });
    });
  });

  const aggregateCreditsData = Object.entries(aggregateCredits).map(([name, value]) => ({
    name: name.replace(/_/g, " ") + " Credits",
    value,
  }));

  const riskLevelData = [
    { name: "Low Risk", value: menteesProgress.filter((p) => p === "On Track" || p === "Ahead of Schedule").length },
    { name: "Medium Risk", value: menteesProgress.filter((p) => p === "Slightly Behind").length },
    { name: "High Risk", value: menteesProgress.filter((p) => p === "Significantly Behind" || p === "No Plan Created").length },
  ];

  const reviewRequests = await prisma.planSemesterReviewRequest.findMany({
    where: { mentorId },
    orderBy: { requestedAt: "desc" },
    take: 100,
  });

  const decisionOutcomes = [
    { name: "Approved", value: reviewRequests.filter((r) => r.status === ReviewStatus.PENDING_ADVISOR || r.status === ReviewStatus.APPROVED).length },
    { name: "Rejected", value: reviewRequests.filter((r) => r.status === ReviewStatus.REJECTED).length },
    { name: "Sent Back for Edits", value: reviewRequests.filter((r) => r.rejectionReason).length },
  ];

  return {
    menteesProgress: menteesProgressData,
    planStatus: planStatusData,
    aggregateCredits: aggregateCreditsData,
    riskLevel: riskLevelData,
    decisionOutcomes,
  };
};

export const getAdvisorDashboard = async (advisorId: string) => {
  const students = await prisma.user.findMany({
    where: {
      advisorAssignmentAsStudent: {
        advisorId,
      },
    },
    include: {
      degreePlan: {
        include: {
          semesters: {
            include: {
              plannedCourses: true,
              reviewRequests: true,
            },
          },
        },
      },
    },
  });

  const planStatusCounts = {
    "No Plan Submitted": 0,
    "Pending Mentor Approval": 0,
    "Pending Advisor Approval": 0,
    "Approved": 0,
    "Rejected": 0,
  };

  students.forEach((student) => {
    if (!student.degreePlan) {
      planStatusCounts["No Plan Submitted"]++;
    } else {
      const latestReview = student.degreePlan.semesters
        .flatMap((s) => s.reviewRequests)
        .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())[0];

      if (!latestReview) {
        planStatusCounts["No Plan Submitted"]++;
      } else if (latestReview.status === ReviewStatus.PENDING_MENTOR) {
        planStatusCounts["Pending Mentor Approval"]++;
      } else if (latestReview.status === ReviewStatus.PENDING_ADVISOR) {
        planStatusCounts["Pending Advisor Approval"]++;
      } else if (latestReview.status === ReviewStatus.APPROVED) {
        planStatusCounts["Approved"]++;
      } else if (latestReview.status === ReviewStatus.REJECTED) {
        planStatusCounts["Rejected"]++;
      }
    }
  });

  const studentPlanStatusData = Object.entries(planStatusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const reviewRequests = await prisma.planSemesterReviewRequest.findMany({
    where: { advisorId },
    orderBy: { requestedAt: "desc" },
    take: 100,
  });

  const advisorDecisionData = [
    { name: "Approved", value: reviewRequests.filter((r) => r.status === ReviewStatus.APPROVED).length },
    { name: "Rejected", value: reviewRequests.filter((r) => r.status === ReviewStatus.REJECTED).length },
    { name: "Returned for Changes", value: reviewRequests.filter((r) => r.advisorComment && r.status === ReviewStatus.PENDING_ADVISOR).length },
  ];

  const requirementsCoverageData = [
    { name: "Major Covered", value: 85 },
    { name: "Major Missing", value: 15 },
    { name: "Minor Covered", value: 70 },
    { name: "Minor Missing", value: 30 },
    { name: "FYE Completed", value: 90 },
    { name: "FYE Missing", value: 10 },
  ];

  const studentRiskData = [
    { name: "On Track", value: students.filter((s) => s.degreePlan).length },
    { name: "Slightly Behind", value: Math.floor(students.length * 0.2) },
    { name: "Significantly Behind", value: Math.floor(students.length * 0.08) },
  ];

  const classificationData = [
    { name: "Freshman", value: students.filter((s) => s.classification === Classification.FRESHMAN).length },
    { name: "Sophomore", value: students.filter((s) => s.classification === Classification.SOPHOMORE).length },
    { name: "Junior", value: students.filter((s) => s.classification === Classification.JUNIOR).length },
    { name: "Senior", value: students.filter((s) => s.classification === Classification.SENIOR).length },
  ];

  return {
    studentPlanStatus: studentPlanStatusData,
    advisorDecision: advisorDecisionData,
    requirementsCoverage: requirementsCoverageData,
    studentRisk: studentRiskData,
    classification: classificationData,
  };
};

export const getRegistrarDashboard = async () => {
  const programs = await prisma.program.findMany({
    include: {
      requirements: true,
    },
  });

  const programsByDepartmentData = [
    { name: "Engineering", value: 8 },
    { name: "Science", value: 6 },
    { name: "Humanities", value: 5 },
    { name: "Social Sciences", value: 4 },
    { name: "Business", value: 3 },
  ];

  const coursesByTypeData = [
    { name: "Major Requirement", value: 245 },
    { name: "Minor Requirement", value: 120 },
    { name: "FYE", value: 85 },
    { name: "Elective", value: 180 },
  ];

  const coursesByLevelData = [
    { name: "100-level", value: 158 },
    { name: "200-level", value: 192 },
    { name: "300-level", value: 165 },
    { name: "400-level+", value: 115 },
  ];

  const activeCoursesData = [
    { name: "Active Courses", value: 580 },
    { name: "Inactive/Retired", value: 50 },
  ];

  const programCreditsData = [
    { name: "< 120 credits", value: programs.filter((p) => p.totalCredits < 120).length },
    { name: "120-130 credits", value: programs.filter((p) => p.totalCredits >= 120 && p.totalCredits <= 130).length },
    { name: "> 130 credits", value: programs.filter((p) => p.totalCredits > 130).length },
  ];

  return {
    programsByDepartment: programsByDepartmentData,
    coursesByType: coursesByTypeData,
    coursesByLevel: coursesByLevelData,
    activeCourses: activeCoursesData,
    programCredits: programCreditsData,
  };
};

export const getAdminDashboard = async () => {
  const usersByRole = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  const usersByRoleData = usersByRole.map((group) => ({
    name: group.role.charAt(0) + group.role.slice(1).toLowerCase() + "s",
    value: group._count,
  }));

  const degreePlans = await prisma.degreePlan.findMany({
    include: {
      semesters: {
        include: {
          reviewRequests: true,
        },
      },
    },
  });

  const systemActivityData = [
    { name: "Active Plans", value: degreePlans.filter((p) => p.semesters.some((s) => s.reviewRequests.some((r) => r.status === ReviewStatus.APPROVED))).length },
    { name: "Draft Plans", value: degreePlans.filter((p) => !p.semesters.some((s) => s.reviewRequests.length > 0)).length },
    { name: "No Plan Yet", value: (await prisma.user.count({ where: { role: Role.STUDENT } })) - degreePlans.length },
  ];

  const courseCatalogData = [
    { name: "Active Courses", value: 580 },
    { name: "Inactive Courses", value: 50 },
    { name: "Recently Added", value: 25 },
  ];

  const degreeProgressData = [
    { name: "On Track", value: 320 },
    { name: "Behind Schedule", value: 80 },
    { name: "Ahead of Schedule", value: 50 },
  ];

  const allReviewRequests = await prisma.planSemesterReviewRequest.findMany();

  const approvalWorkflowData = [
    { name: "Pending Mentor", value: allReviewRequests.filter((r) => r.status === ReviewStatus.PENDING_MENTOR).length },
    { name: "Pending Advisor", value: allReviewRequests.filter((r) => r.status === ReviewStatus.PENDING_ADVISOR).length },
    { name: "Fully Approved", value: allReviewRequests.filter((r) => r.status === ReviewStatus.APPROVED).length },
    { name: "Rejected", value: allReviewRequests.filter((r) => r.status === ReviewStatus.REJECTED).length },
  ];

  return {
    usersByRole: usersByRoleData,
    systemActivity: systemActivityData,
    courseCatalog: courseCatalogData,
    degreeProgress: degreeProgressData,
    approvalWorkflow: approvalWorkflowData,
  };
};
