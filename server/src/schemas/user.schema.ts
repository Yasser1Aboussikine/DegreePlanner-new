import { z } from "zod";

// Enum schemas
export const RoleSchema = z.enum([
  "STUDENT",
  "ADMIN",
  "ADVISOR",
  "MENTOR",
  "REGISTRAR",
]);

// Full User schema (matches Prisma model)
export const UserSchema = z.object({
  id: z.cuid(),
  email: z.email("Invalid email address"),
  password: z.string(),
  name: z.string().nullable().optional(),
  role: RoleSchema.default("STUDENT"),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create User schema (for creating new users)
export const CreateUserSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1).optional(),
  role: RoleSchema.optional(),
  isActive: z.boolean().optional(),
});

// Update User schema (for updating existing users)
export const UpdateUserSchema = z.object({
  email: z.email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  name: z.string().nullable().optional(),
  role: RoleSchema.optional(),
  isActive: z.boolean().optional(),
});

// Query params schema (for filtering/searching users)
export const UserQuerySchema = z.object({
  role: RoleSchema.optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(), // for searching by name or email
});

// Type exports
export type Role = z.infer<typeof RoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserQueryInput = z.infer<typeof UserQuerySchema>;
