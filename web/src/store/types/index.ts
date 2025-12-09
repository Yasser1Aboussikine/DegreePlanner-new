// User & Auth Types
export type Role = "STUDENT" | "ADMIN" | "ADVISOR" | "MENTOR" | "REGISTRAR";
export type Classification =
  | "FRESHMAN"
  | "SOPHOMORE"
  | "JUNIOR"
  | "SENIOR"
  | "OTHER";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  isActive: boolean;
  emailVerifiedAt?: Date | null;
  major?: string | null;
  minor?: string | null;
  classification?: Classification | null;
  isFYEStudent?: boolean;
  joinDate?: Date | null;
  expectedGraduation?: Date | null;
  transcriptUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  mentorAssignmentCount?: number;
  advisorAssignmentCount?: number;
}

export interface SignupInput {
  email: string;
  password: string;
  name: string;
  major?: string;
  minor?: string;
  classification: Classification;
  isFYEStudent?: boolean;
  joinDate: string;
  expectedGraduation: string;
  transcriptFile?: File;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface AuthResponse {
  data: { user: User; accessToken: string; refreshToken: string };
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

export interface EligibleCourse extends Course {
  isEligible: boolean;
  reasonIneligible?: string;
  missingPrerequisites?: string[];
  prerequisiteCodes?: string[];
  dependentCodes?: string[];
}

// Degree Plan Types
export type DegreeLevel = "BACHELOR" | "MASTER" | "DOCTORATE" | "OTHER";

export interface Program {
  id: string;
  code: string;
  name: string;
  level: DegreeLevel;
  totalCredits: number;
  isActive: boolean;
  requirements?: ProgramRequirement[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProgramRequirement {
  id: string;
  programId: string;
  category: Category;
  credits: number;
  program?: Program;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProgramInput {
  code: string;
  name: string;
  level?: DegreeLevel;
  totalCredits: number;
  isActive?: boolean;
}

export interface UpdateProgramInput extends Partial<CreateProgramInput> {}

export interface CreateProgramWithRequirementsInput extends CreateProgramInput {
  requirements: Array<{ category: Category; credits: number }>;
}

export interface DegreePlan {
  id: string;
  userId: string;
  programId?: string | null;
  program?: Program | null;
  semesters?: PlanSemesterWithCourses[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlanSemesterWithCourses extends PlanSemester {
  plannedCourses: PlannedCourse[];
}

export interface PlanSemesterWithRelations extends PlanSemester {
  degreePlan?: {
    id: string;
    userId: string;
  };
  plannedCourses?: PlannedCourse[];
}

export interface CreateDegreePlanInput {
  userId: string;
  programId?: string;
}

export interface UpdateDegreePlanInput {
  userId?: string;
  programId?: string | null;
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

export interface PlannedCourse {
  id: string;
  planSemesterId: string;
  courseCode: string;
  courseTitle?: string | null;
  credits?: number | null;
  category?: Category | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePlannedCourseInput {
  planSemesterId: string;
  courseCode: string;
  courseTitle?: string;
  credits?: number;
  category?: Category;
}

export interface UpdatePlannedCourseInput {
  planSemesterId?: string;
  courseCode?: string;
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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Assignment Types
export interface MentorAssignment {
  id: string;
  mentorId: string;
  studentId: string;
  mentor?: Partial<User>;
  student?: Partial<User>;
  createdAt?: Date;
}

export interface AdvisorAssignment {
  id: string;
  advisorId: string;
  studentId: string;
  advisor?: Partial<User>;
  student?: Partial<User>;
  createdAt?: Date;
}

export interface CreateMentorAssignmentInput {
  mentorId: string;
  studentId: string;
}

export interface CreateAdvisorAssignmentInput {
  advisorId: string;
  studentId: string;
}

// Review Request Types
export type ReviewStatus =
  | "PENDING_MENTOR"
  | "PENDING_ADVISOR"
  | "APPROVED"
  | "REJECTED";

export interface PlanSemesterReviewRequest {
  id: string;
  planSemesterId: string;
  studentId: string;
  mentorId?: string | null;
  advisorId?: string | null;
  status: ReviewStatus;
  requestedAt: Date;
  mentorReviewedAt?: Date | null;
  advisorReviewedAt?: Date | null;
  mentorComment?: string | null;
  advisorComment?: string | null;
  rejectionReason?: string | null;
  planSemester?: PlanSemesterWithRelations;
  student?: Partial<User>;
  mentor?: Partial<User> | null;
  advisor?: Partial<User> | null;
}

export interface CreateReviewRequestInput {
  planSemesterId: string;
  studentId: string;
  mentorId?: string;
  advisorId?: string;
}

export interface SubmitMentorReviewInput {
  mentorComment?: string;
  approve: boolean;
  rejectionReason?: string;
}

export interface SubmitAdvisorReviewInput {
  advisorComment?: string;
  approve: boolean;
  rejectionReason?: string;
}
