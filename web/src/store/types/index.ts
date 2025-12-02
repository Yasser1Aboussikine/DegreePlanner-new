// User & Auth Types
export type Role = "STUDENT" | "ADMIN" | "ADVISOR" | "MENTOR" | "REGISTRAR";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SignupInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Course Types
export interface Course {
  id: string;
  labels: string[];
  course_code: string;
  course_title: string;
  description: string;
  sch_credits: number;
  n_credits: number;
  isElective?: boolean;
  isMinorElective?: boolean;
  isSpecElective?: boolean;
  categories: string[];
  disciplines: string[];
  prerequisites?: Course[];
  dependents?: Course[];
}

export interface CreateCourseInput {
  id?: string;
  labels: string[];
  course_code: string;
  course_title: string;
  description: string;
  sch_credits: number;
  n_credits: number;
  isElective?: boolean;
  isMinorElective?: boolean;
  isSpecElective?: boolean;
  categories: string[];
  disciplines: string[];
  prerequisites?: string[];
  dependents?: string[];
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {}

export interface CourseRelationship {
  type: string;
  startNode: string;
  endNode: string;
  [key: string]: any;
}

// Degree Plan Types
export interface DegreePlan {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDegreePlanInput {
  userId: string;
}

export interface UpdateDegreePlanInput {
  userId?: string;
}

// Plan Semester Types
export type Term = "FALL" | "SPRING" | "SUMMER" | "WINTER";

export interface PlanSemester {
  id: string;
  degreePlanId: string;
  year: number;
  term: Term;
  nth_semestre: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePlanSemesterInput {
  degreePlanId: string;
  year: number;
  term: Term;
  nth_semestre: number;
}

export interface UpdatePlanSemesterInput {
  degreePlanId?: string;
  year?: number;
  term?: Term;
  nth_semestre?: number;
}

// Planned Course Types
export type Category =
  | "GENERAL_EDUCATION"
  | "COMPUTER_SCIENCE"
  | "MINOR"
  | "SPECIALIZATION"
  | "ENGINEERING_SCIENCE_MATHS"
  | "FREE_ELECTIVES";

export type PlannedCourseStatus = "PLANNED" | "COMPLETED" | "DROPPED";

export interface PlannedCourse {
  id: string;
  planSemesterId: string;
  courseCode: string;
  status: PlannedCourseStatus;
  courseTitle?: string | null;
  credits?: number | null;
  category?: Category | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePlannedCourseInput {
  planSemesterId: string;
  courseCode: string;
  status?: PlannedCourseStatus;
  courseTitle?: string;
  credits?: number;
  category?: Category;
}

export interface UpdatePlannedCourseInput {
  planSemesterId?: string;
  courseCode?: string;
  status?: PlannedCourseStatus;
  courseTitle?: string | null;
  credits?: number | null;
  category?: Category | null;
}

// API Response Types
export interface ApiError {
  message: string;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
