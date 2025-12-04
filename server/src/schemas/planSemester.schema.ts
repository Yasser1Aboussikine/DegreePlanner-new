import { z } from "zod";

// Enum schemas
export const TermSchema = z.enum(["FALL", "SPRING", "SUMMER", "WINTER"]);

// Full PlanSemester schema (matches Prisma model)
export const PlanSemesterSchema = z.object({
  id: z.cuid(),
  degreePlanId: z.cuid(),
  year: z.number().int().min(2000).max(2100),
  term: TermSchema,
  nth_semestre: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create PlanSemester schema (for creating new plan semesters)
export const CreatePlanSemesterSchema = z.object({
  degreePlanId: z.cuid(),
  year: z.number().int().min(2000).max(2100),
  term: TermSchema,
  nth_semestre: z.number().int().positive(),
});

// Update PlanSemester schema (for updating existing plan semesters)
export const UpdatePlanSemesterSchema = z.object({
  degreePlanId: z.cuid().optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  term: TermSchema.optional(),
  nth_semestre: z.number().int().positive().optional(),
});

// Query params schema (for filtering plan semesters)
export const PlanSemesterQuerySchema = z.object({
  degreePlanId: z.cuid().optional(),
  year: z.number().int().optional(),
  term: TermSchema.optional(),
  nth_semestre: z.number().int().optional(),
});

// Type exports
export type Term = z.infer<typeof TermSchema>;
export type PlanSemester = z.infer<typeof PlanSemesterSchema>;
export type CreatePlanSemesterInput = z.infer<typeof CreatePlanSemesterSchema>;
export type UpdatePlanSemesterInput = z.infer<typeof UpdatePlanSemesterSchema>;
export type PlanSemesterQueryInput = z.infer<typeof PlanSemesterQuerySchema>;
