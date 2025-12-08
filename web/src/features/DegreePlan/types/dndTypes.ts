import type { Category } from "@/store/types";

export interface DraggableCourse {
  id: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  category: Category;
  description?: string;
  prerequisites?: string[];
  dependents?: string[];
  isEligible: boolean;
}

export interface SemesterData {
  id: string;
  semesterName: string;
  year: number;
  term: "FALL" | "SPRING" | "SUMMER" | "WINTER";
  courses: DraggableCourse[];
  totalCredits: number;
}

export interface CoursesByCategory {
  [category: string]: DraggableCourse[];
}

export type DragType = "course" | "semester";

export interface DragData {
  type: DragType;
  courseId?: string;
  semesterId?: string;
  sourceSemesterId?: string;
  sourceCategory?: string;
}
