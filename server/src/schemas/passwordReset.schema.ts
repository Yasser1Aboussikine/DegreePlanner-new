import { z } from "zod";

export const requestPasswordResetSchema = z.object({
  body: z.object({
    emailOrUsername: z.string().min(1, "Email is required"),
  }),
});

export const verifyResetTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  }),
});

export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
export type VerifyResetTokenInput = z.infer<typeof verifyResetTokenSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
