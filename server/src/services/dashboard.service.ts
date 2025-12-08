import prisma from "../config/prisma";
import { Category } from "@/generated/prisma/client";

export interface CategoryStats {
  name: string;
  planned: number;
  required: number;
  color: string;
}

export interface SemesterStats {
  total: number;
}

export interface CreditStats {
  planned: number;
  total: number;
}

export interface DashboardStats {
  categoryProgress: CategoryStats[];
  semesterStats: SemesterStats;
  totalCredits: CreditStats;
  overallProgress: number;
  creditProgress: number;
  creditsData: Array<{ name: string; value: number; color: string }>;
}

const categoryColors: Record<Category, string> = {
  COMPUTER_SCIENCE: "#3b82f6",
  GENERAL_EDUCATION: "#10b981",
  ENGINEERING_SCIENCE_MATHS: "#f59e0b",
  SPECIALIZATION: "#8b5cf6",
  MINOR: "#ec4899",
  FREE_ELECTIVES: "#6b7280",
};

export const getStudentDashboardStats = async (
  userId: string
): Promise<DashboardStats | null> => {
  // Get degree plan with all related data
  const degreePlan = await prisma.degreePlan.findUnique({
    where: { userId },
    include: {
      program: {
        include: {
          requirements: true,
        },
      },
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

  if (!degreePlan) {
    return null;
  }

  // Initialize stats
  const categoryMap = new Map<Category, { planned: number }>();

  // Get program requirements for each category (credits required per category)
  const requirementsMap = new Map<Category, number>();
  if (degreePlan.program?.requirements) {
    degreePlan.program.requirements.forEach((req) => {
      requirementsMap.set(req.category, req.credits);
    });
  }

  let plannedCredits = 0;

  // Process semesters and courses
  degreePlan.semesters.forEach((semester) => {
    semester.plannedCourses.forEach((course) => {
      const category = (course.category || "FREE_ELECTIVES") as Category;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { planned: 0 });
      }

      const stats = categoryMap.get(category)!;

      // Count all courses as planned (they exist in the degree plan)
      stats.planned += 1;
      plannedCredits += course.credits || 0;
    });
  });

  // Convert category map to array with program requirements
  const categoryProgress: CategoryStats[] = Array.from(
    categoryMap.entries()
  ).map(([category, stats]) => ({
    name: category.replace(/_/g, " "),
    planned: stats.planned,
    required: requirementsMap.get(category) || stats.planned, // Use requirement if available, otherwise use planned count
    color: categoryColors[category],
  }));

  // Calculate semester stats
  const semesterStats: SemesterStats = {
    total: degreePlan.semesters.length,
  };

  // Calculate credit stats
  const totalCreditsRequired = degreePlan.program?.totalCredits || 120;
  const totalCredits: CreditStats = {
    planned: plannedCredits,
    total: totalCreditsRequired,
  };

  // Calculate progress percentages (based on planned courses vs required)
  const totalCoursesPlanned = Array.from(categoryMap.values()).reduce(
    (sum, stats) => sum + stats.planned,
    0
  );
  const totalCoursesRequired =
    Array.from(requirementsMap.values()).reduce(
      (sum, credits) => sum + credits,
      0
    ) || totalCoursesPlanned;

  const overallProgress =
    totalCoursesRequired > 0
      ? (totalCoursesPlanned / totalCoursesRequired) * 100
      : 0;

  const creditProgress = (plannedCredits / totalCreditsRequired) * 100;

  // Prepare chart data
  const creditsData = [
    {
      name: "Planned",
      value: plannedCredits,
      color: "#3b82f6",
    },
    {
      name: "Remaining",
      value: Math.max(0, totalCreditsRequired - plannedCredits),
      color: "#e5e7eb",
    },
  ];

  return {
    categoryProgress,
    semesterStats,
    totalCredits,
    overallProgress,
    creditProgress,
    creditsData,
  };
};
