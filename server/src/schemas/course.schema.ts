import { z } from "zod";

// Base course schema (without relationships)
const BaseCourseSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^COURSE_/, "id must start with 'COURSE_' e.g. COURSE_CSC3309")
    .optional(), // Optional for creation, required after

  labels: z.array(z.string()),

  course_code: z
    .string()
    .min(1)
    .regex(
      /^[A-Z]{3}\d{4}$|^[A-Z]{2,4}\d{3,4}$/,
      "course_code must look like CSC3309, ENG1201, MAT2302, etc."
    ),

  course_title: z.string().min(1),

  description: z.string().min(1),

  sch_credits: z.number().int().min(0),

  n_credits: z.number().int().min(0),

  isElective: z.boolean().optional(),
  isMinorElective: z.boolean().optional(),
  isSpecElective: z.boolean().optional(),

  categories: z.array(z.string().min(1)),

  disciplines: z.array(z.string().min(1)),

  // source_ids: z.array(z.string()).optional(),
});

// Course schema with relationships (for fetching)
// Using z.lazy to handle circular references
type CourseType = z.infer<typeof BaseCourseSchema> & {
  prerequisites?: CourseType[];
  dependents?: CourseType[];
};

export const CourseSchema: z.ZodType<CourseType> = BaseCourseSchema.extend({
  prerequisites: z.lazy(() => z.array(CourseSchema)).optional(),
  dependents: z.lazy(() => z.array(CourseSchema)).optional(),
});

// For creating a course (prerequisites and dependents are course codes)
export const CreateCourseInputSchema = BaseCourseSchema.extend({
  prerequisites: z.array(z.string()).optional(),
  dependents: z.array(z.string()).optional(),
});

// Course relationship schema
export const CourseRelationshipSchema = z.object({
  type: z.string(),
  startNode: z.string(),
  endNode: z.string(),
}).catchall(z.any()); // Allow additional properties

// For arrays:
export const CourseArraySchema = z.array(CourseSchema);

// Type exports
export type Course = z.infer<typeof CourseSchema>;
export type CreateCourseInput = z.infer<typeof CreateCourseInputSchema>;
export type CourseRelationship = z.infer<typeof CourseRelationshipSchema>;

// Type aliases for clarity in function signatures
export type CreateCourseDTO = CreateCourseInput;
export type UpdateCourseDTO = Partial<Course>;

// ============================================
// Category Node Schema
// ============================================

export const CategorySchema = z.object({
  id: z.string().min(1).regex(/^CAT_/, "id must start with 'CAT_'"),
  labels: z.array(z.string()),
  name: z.string().min(1),
});

export const CreateCategoryInputSchema = z.object({
  id: z.string().min(1).regex(/^CAT_/, "id must start with 'CAT_'"),
  name: z.string().min(1),
  labels: z.array(z.string()).optional().default(["Category"]),
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>;
export type CreateCategoryDTO = CreateCategoryInput;
export type UpdateCategoryDTO = Partial<Category>;

// ============================================
// Subcategory Node Schema
// ============================================

export const SubcategorySchema = z.object({
  id: z.string().min(1).regex(/^SUB_/, "id must start with 'SUB_'"),
  labels: z.array(z.string()),
  category: z.string().min(1),
  discipline: z.string().min(1),
});

export const CreateSubcategoryInputSchema = z.object({
  id: z.string().min(1).regex(/^SUB_/, "id must start with 'SUB_'"),
  category: z.string().min(1),
  discipline: z.string().min(1),
  labels: z.array(z.string()).optional().default(["Subcategory"]),
});

export type Subcategory = z.infer<typeof SubcategorySchema>;
export type CreateSubcategoryInput = z.infer<typeof CreateSubcategoryInputSchema>;
export type CreateSubcategoryDTO = CreateSubcategoryInput;
export type UpdateSubcategoryDTO = Partial<Subcategory>;

export const RequiresRelationshipSchema = z.object({
  type: z.literal("REQUIRES"),
  startNode: z.string().min(1), // Course ID that requires the prerequisite
  endNode: z.string().min(1), // Prerequisite course ID
});

// HAS_COURSE relationship - subcategory contains course
export const HasCourseRelationshipSchema = z.object({
  type: z.literal("HAS_COURSE"),
  startNode: z.string().min(1), // Subcategory ID
  endNode: z.string().min(1), // Course ID
});

// HAS_SUBCATEGORY relationship - category contains subcategory
export const HasSubcategoryRelationshipSchema = z.object({
  type: z.literal("HAS_SUBCATEGORY"),
  startNode: z.string().min(1), // Category ID
  endNode: z.string().min(1), // Subcategory ID
});

// Union schema for all relationship types
export const GraphRelationshipSchema = z.union([
  RequiresRelationshipSchema,
  HasCourseRelationshipSchema,
  HasSubcategoryRelationshipSchema,
]);

// Relationship type exports
export type RequiresRelationship = z.infer<typeof RequiresRelationshipSchema>;
export type HasCourseRelationship = z.infer<typeof HasCourseRelationshipSchema>;
export type HasSubcategoryRelationship = z.infer<typeof HasSubcategoryRelationshipSchema>;
export type GraphRelationship = z.infer<typeof GraphRelationshipSchema>;

// ============================================
// Graph Data Schemas (for seeding/export)
// ============================================

export const GraphNodeSchema = z.union([
  CourseSchema,
  CategorySchema,
  SubcategorySchema,
]);

export const GraphDataSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  relationships: z.array(GraphRelationshipSchema),
});

export type GraphNode = z.infer<typeof GraphNodeSchema>;
export type GraphData = z.infer<typeof GraphDataSchema>;