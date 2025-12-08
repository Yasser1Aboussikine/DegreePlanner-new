import { z } from "zod";

export const degreeLevelEnum = z.enum([
  "BACHELOR",
  "MASTER",
  "DOCTORATE",
  "OTHER",
]);

export const categoryEnum = z.enum([
  "GENERAL_EDUCATION",
  "COMPUTER_SCIENCE",
  "MINOR",
  "SPECIALIZATION",
  "ENGINEERING_SCIENCE_MATHS",
  "FREE_ELECTIVES",
]);

export const createProgramSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(20),
    name: z.string().min(1).max(255),
    level: degreeLevelEnum.optional().default("BACHELOR"),
    totalCredits: z.number().int().positive(),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateProgramSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    code: z.string().min(1).max(20).optional(),
    name: z.string().min(1).max(255).optional(),
    level: degreeLevelEnum.optional(),
    totalCredits: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getProgramByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const getProgramByCodeSchema = z.object({
  params: z.object({
    code: z.string(),
  }),
});

export const createProgramRequirementSchema = z.object({
  body: z.object({
    programId: z.string(),
    category: categoryEnum,
    credits: z.number().int().positive(),
  }),
});

export const updateProgramRequirementSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    credits: z.number().int().positive(),
  }),
});

export const getProgramRequirementsSchema = z.object({
  params: z.object({
    programId: z.string(),
  }),
});

export const createProgramWithRequirementsSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(20),
    name: z.string().min(1).max(255),
    level: degreeLevelEnum.optional().default("BACHELOR"),
    totalCredits: z.number().int().positive(),
    isActive: z.boolean().optional().default(true),
    requirements: z.array(
      z.object({
        category: categoryEnum,
        credits: z.number().int().positive(),
      })
    ),
  }),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type GetProgramByIdInput = z.infer<typeof getProgramByIdSchema>;
export type GetProgramByCodeInput = z.infer<typeof getProgramByCodeSchema>;
export type CreateProgramRequirementInput = z.infer<
  typeof createProgramRequirementSchema
>;
export type UpdateProgramRequirementInput = z.infer<
  typeof updateProgramRequirementSchema
>;
export type GetProgramRequirementsInput = z.infer<
  typeof getProgramRequirementsSchema
>;
export type CreateProgramWithRequirementsInput = z.infer<
  typeof createProgramWithRequirementsSchema
>;
