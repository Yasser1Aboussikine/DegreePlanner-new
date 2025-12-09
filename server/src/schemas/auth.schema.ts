import { Role, Classification } from "@/generated/prisma/enums";
import { z } from "zod";

export const signupSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1).optional(),
  role: z.enum(Role).optional().default(Role.STUDENT),
  major: z.string().optional(),
  minor: z.string().optional(),
  classification: z.enum(Classification).optional(),
  isFYEStudent: z.boolean().optional(),
  joinDate: z.string().or(z.date()).optional(),
  expectedGraduation: z.string().or(z.date()).optional(),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().nonempty("Refresh token is required"),
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  body: z.object({
    role: z.enum(Role),
  }),
});

export const toggleUserStatusSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export const updatePersonalInfoSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.email("Invalid email address").optional(),
  }),
});

export const updateUserClassificationSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  body: z.object({
    classification: z.enum(Classification),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>;
export type UpdatePersonalInfoInput = z.infer<typeof updatePersonalInfoSchema>;
export type UpdateUserClassificationInput = z.infer<typeof updateUserClassificationSchema>;
