import { z } from "zod";

export const createMentorAssignmentSchema = z.object({
  body: z.object({
    mentorId: z.string(),
    studentId: z.string(),
  }),
});

export const getMentorAssignmentsByMentorIdSchema = z.object({
  params: z.object({
    mentorId: z.string(), 
  }),
});

export const getMentorAssignmentsByStudentIdSchema = z.object({
  params: z.object({
    studentId: z.string(),
  }),
});

export const deleteMentorAssignmentSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const createAdvisorAssignmentSchema = z.object({
  body: z.object({
    advisorId: z.string(),
    studentId: z.string(),
  }),
});

export const getAdvisorAssignmentsByAdvisorIdSchema = z.object({
  params: z.object({
    advisorId: z.string(),
  }),
});

export const getAdvisorAssignmentsByStudentIdSchema = z.object({
  params: z.object({
    studentId: z.string(),
  }),
});

export const deleteAdvisorAssignmentSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type CreateMentorAssignmentInput = z.infer<
  typeof createMentorAssignmentSchema
>;
export type GetMentorAssignmentsByMentorIdInput = z.infer<
  typeof getMentorAssignmentsByMentorIdSchema
>;
export type GetMentorAssignmentsByStudentIdInput = z.infer<
  typeof getMentorAssignmentsByStudentIdSchema
>;
export type DeleteMentorAssignmentInput = z.infer<
  typeof deleteMentorAssignmentSchema
>;
export type CreateAdvisorAssignmentInput = z.infer<
  typeof createAdvisorAssignmentSchema
>;
export type GetAdvisorAssignmentsByAdvisorIdInput = z.infer<
  typeof getAdvisorAssignmentsByAdvisorIdSchema
>;
export type GetAdvisorAssignmentsByStudentIdInput = z.infer<
  typeof getAdvisorAssignmentsByStudentIdSchema
>;
export type DeleteAdvisorAssignmentInput = z.infer<
  typeof deleteAdvisorAssignmentSchema
>;
