import { z } from "zod";

// Enum schemas
export const CategorySchema = z.enum([
  "GENERAL_EDUCATION",
  "COMPUTER_SCIENCE",
  "MINOR",
  "SPECIALIZATION",
  "ENGINEERING_SCIENCE_MATHS",
  "FREE_ELECTIVES",
]);

export const PlannedCourseStatusSchema = z.enum([
  "PLANNED",
  "COMPLETED",
  "DROPPED",
]);

// Full PlannedCourse schema (matches Prisma model)
export const PlannedCourseSchema = z.object({
  id: z.string().cuid(),
  planSemesterId: z.string().cuid(),
  courseCode: z.string().min(1, "Course code is required"),
  status: PlannedCourseStatusSchema.default("PLANNED"),
  courseTitle: z.string().nullable().optional(),
  credits: z.number().int().positive().nullable().optional(),
  category: CategorySchema.nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create PlannedCourse schema (for creating new planned courses)
export const CreatePlannedCourseSchema = z.object({
  planSemesterId: z.string().cuid(),
  courseCode: z.string().min(1, "Course code is required"),
  status: PlannedCourseStatusSchema.optional(),
  courseTitle: z.string().optional(),
  credits: z.number().int().positive().optional(),
  category: CategorySchema.optional(),
});

// Update PlannedCourse schema (for updating existing planned courses)
export const UpdatePlannedCourseSchema = z.object({
  planSemesterId: z.string().cuid().optional(),
  courseCode: z.string().min(1, "Course code is required").optional(),
  status: PlannedCourseStatusSchema.optional(),
  courseTitle: z.string().nullable().optional(),
  credits: z.number().int().positive().nullable().optional(),
  category: CategorySchema.nullable().optional(),
});

// Query params schema (for filtering planned courses)
export const PlannedCourseQuerySchema = z.object({
  planSemesterId: z.string().cuid().optional(),
  courseCode: z.string().optional(),
  status: PlannedCourseStatusSchema.optional(),
  category: CategorySchema.optional(),
});

// Batch operations schemas
export const BulkCreatePlannedCoursesSchema = z.object({
  courses: z.array(CreatePlannedCourseSchema).min(1, "At least one course is required"),
});

export const UpdateCourseStatusSchema = z.object({
  status: PlannedCourseStatusSchema,
});

// Type exports
export type Category = z.infer<typeof CategorySchema>;
export type PlannedCourseStatus = z.infer<typeof PlannedCourseStatusSchema>;
export type PlannedCourse = z.infer<typeof PlannedCourseSchema>;
export type CreatePlannedCourseInput = z.infer<typeof CreatePlannedCourseSchema>;
export type UpdatePlannedCourseInput = z.infer<typeof UpdatePlannedCourseSchema>;
export type PlannedCourseQueryInput = z.infer<typeof PlannedCourseQuerySchema>;
export type BulkCreatePlannedCoursesInput = z.infer<typeof BulkCreatePlannedCoursesSchema>;
export type UpdateCourseStatusInput = z.infer<typeof UpdateCourseStatusSchema>;
