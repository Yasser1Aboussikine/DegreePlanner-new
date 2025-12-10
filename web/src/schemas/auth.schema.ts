import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const personalInfoSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const academicInfoSchema = z
  .object({
    major: z.string().optional().default("Computer Science"),
    minor: z.string().optional(),
    classification: z.enum(
      ["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR", "OTHER"],
      {
        message: "Please select your classification",
      }
    ),
    isFYEStudent: z.boolean().default(false),
    joinDate: z.string().min(1, "Join date is required"),
    expectedGraduation: z
      .string()
      .min(1, "Expected graduation date is required"),
  })
  .refine(
    (data) => {
      if (!data.joinDate || !data.expectedGraduation) return true;
      const joinDate = new Date(data.joinDate);
      const gradDate = new Date(data.expectedGraduation);
      return gradDate > joinDate;
    },
    {
      message: "Expected graduation date must be after join date",
      path: ["expectedGraduation"],
    }
  );

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    major: z.string().optional().default("Computer Science"),
    minor: z.string().optional(),
    classification: z.enum(
      ["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR", "OTHER"],
      {
        message: "Please select your classification",
      }
    ),
    isFYEStudent: z.boolean().optional().default(false),
    joinDate: z.string().min(1, "Join date is required"),
    expectedGraduation: z
      .string()
      .min(1, "Expected graduation date is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (!data.joinDate || !data.expectedGraduation) return true;
      const joinDate = new Date(data.joinDate);
      const gradDate = new Date(data.expectedGraduation);
      return gradDate > joinDate;
    },
    {
      message: "Expected graduation date must be after join date",
      path: ["expectedGraduation"],
    }
  );

export type SignInFormData = z.infer<typeof signInSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AcademicInfoFormData = z.infer<typeof academicInfoSchema>;
export type SignUpFormData = z.input<typeof signUpSchema>;
