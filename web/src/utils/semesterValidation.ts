import type { Term } from "@/store/types";

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

export const getCreditLimit = (term: Term): { type: "courses" | "credits"; limit: number } => {
  switch (term) {
    case "FALL":
    case "SPRING":
      return { type: "courses", limit: 6 };
    case "WINTER":
      return { type: "courses", limit: 1 };
    case "SUMMER":
      return { type: "credits", limit: 10 };
    default:
      return { type: "courses", limit: 6 };
  }
};

export const validateCourseAddition = (
  term: Term,
  currentCourses: { credits?: number | null }[],
  newCourseCredits: number
): { isValid: boolean; message?: string } => {
  const limit = getCreditLimit(term);

  if (limit.type === "courses") {
    if (currentCourses.length >= limit.limit) {
      return {
        isValid: false,
        message: `Cannot add course. ${term} semester has a maximum limit of ${limit.limit} course${limit.limit > 1 ? "s" : ""}. Current: ${currentCourses.length}`,
      };
    }
  } else {
    const currentTotalCredits = currentCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
    if (currentTotalCredits + newCourseCredits > limit.limit) {
      return {
        isValid: false,
        message: `Cannot add course. ${term} semester has a maximum limit of ${limit.limit} credits. Current: ${currentTotalCredits}, Adding: ${newCourseCredits}`,
      };
    }
  }

  return { isValid: true };
};
