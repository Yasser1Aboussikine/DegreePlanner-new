import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const personalInfoSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const academicInfoSchema = z.object({
  major: z.string().optional().default("Computer Science"),
  minor: z.string().optional(),
  classification: z.enum(
    ["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR", "OTHER"],
    {
      error: () => ({ message: "Please select your classification" }),
    }
  ),
  isFYEStudent: z.boolean().default(false),
  joinDate: z.string().min(1, "Please select your join date"),
  expectedGraduation: z
    .string()
    .min(1, "Please select your expected graduation date"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  major: z.string().optional().default("Computer Science"),
  minor: z.string().optional(),
  classification: z.enum(
    ["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR", "OTHER"],
    {
      error: () => ({ message: "Please select your classification" }),
    }
  ),
  isFYEStudent: z.boolean().optional().default(false),
  joinDate: z.string().min(1, "Please select your join date"),
  expectedGraduation: z
    .string()
    .min(1, "Please select your expected graduation date"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AcademicInfoFormData = z.infer<typeof academicInfoSchema>;
export type SignUpFormData = z.input<typeof signUpSchema>;
