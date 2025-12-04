import { z } from "zod";

// Full DegreePlan schema (matches Prisma model)
export const DegreePlanSchema = z.object({
  id: z.cuid(),
  userId: z.cuid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create DegreePlan schema (for creating new degree plans)
export const CreateDegreePlanSchema = z.object({
  userId: z.cuid(),
});

// Update DegreePlan schema (for updating existing degree plans)
export const UpdateDegreePlanSchema = z.object({
  userId: z.cuid().optional(),
});

// Query params schema (for filtering degree plans)
export const DegreePlanQuerySchema = z.object({
  userId: z.cuid().optional(),
});

// Type exports
export type DegreePlan = z.infer<typeof DegreePlanSchema>;
export type CreateDegreePlanInput = z.infer<typeof CreateDegreePlanSchema>;
export type UpdateDegreePlanInput = z.infer<typeof UpdateDegreePlanSchema>;
export type DegreePlanQueryInput = z.infer<typeof DegreePlanQuerySchema>;
