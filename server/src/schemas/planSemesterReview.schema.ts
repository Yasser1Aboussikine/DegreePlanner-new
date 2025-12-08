import { z } from "zod";

export const createReviewRequestSchema = z.object({
  body: z.object({
    planSemesterId: z.string(),
    studentId: z.string(),
    mentorId: z.string().optional(),
    advisorId: z.string().optional(),
  }),
});

export const getReviewRequestsByStudentIdSchema = z.object({
  params: z.object({
    studentId: z.string(),
  }),
});

export const getReviewRequestsByMentorIdSchema = z.object({
  params: z.object({
    mentorId: z.string(),
  }),
});

export const getReviewRequestsByAdvisorIdSchema = z.object({
  params: z.object({
    advisorId: z.string(),
  }),
});

export const submitMentorReviewSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    mentorComment: z.string().optional(),
    approve: z.boolean(),
    rejectionReason: z.string().optional(),
  }),
});

export const submitAdvisorReviewSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    advisorComment: z.string().optional(),
    approve: z.boolean(),
    rejectionReason: z.string().optional(),
  }),
});

export const deleteReviewRequestSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type CreateReviewRequestInput = z.infer<
  typeof createReviewRequestSchema
>;
export type GetReviewRequestsByStudentIdInput = z.infer<
  typeof getReviewRequestsByStudentIdSchema
>;
export type GetReviewRequestsByMentorIdInput = z.infer<
  typeof getReviewRequestsByMentorIdSchema
>;
export type GetReviewRequestsByAdvisorIdInput = z.infer<
  typeof getReviewRequestsByAdvisorIdSchema
>;
export type SubmitMentorReviewInput = z.infer<typeof submitMentorReviewSchema>;
export type SubmitAdvisorReviewInput = z.infer<
  typeof submitAdvisorReviewSchema
>;
export type DeleteReviewRequestInput = z.infer<
  typeof deleteReviewRequestSchema
>;

export const createDegreePlanReviewSchema = z.object({
  body: z.object({
    degreePlanId: z.string(),
  }),
});

export type CreateDegreePlanReviewInput = z.infer<
  typeof createDegreePlanReviewSchema
>;

export const submitBulkMentorReviewSchema = z.object({
  body: z.object({
    degreePlanId: z.string(),
    approve: z.boolean(),
    semesterComments: z.array(
      z.object({
        requestId: z.string(),
        comment: z.string().optional(),
      })
    ),
    generalRejectionReason: z.string().optional(),
  }),
});

export const submitBulkAdvisorReviewSchema = z.object({
  body: z.object({
    degreePlanId: z.string(),
    approve: z.boolean(),
    semesterComments: z.array(
      z.object({
        requestId: z.string(),
        comment: z.string().optional(),
      })
    ),
    generalRejectionReason: z.string().optional(),
  }),
});

export type SubmitBulkMentorReviewInput = z.infer<
  typeof submitBulkMentorReviewSchema
>;
export type SubmitBulkAdvisorReviewInput = z.infer<
  typeof submitBulkAdvisorReviewSchema
>;
