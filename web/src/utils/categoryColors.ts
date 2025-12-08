/**
 * Category Color Mapping Utility
 *
 * Provides consistent, theme-aware colors for course categories.
 * Uses Tailwind's color system with light shades for light mode
 * and dark shades for dark mode.
 *
 * @example
 * ```tsx
 * import { getCategoryBadgeClasses, getCategoryTextClass } from '@/utils/categoryColors';
 *
 * <span className={getCategoryBadgeClasses('COMPUTER_SCIENCE')}>
 *   Computer Science
 * </span>
 * ```
 */

export type CourseCategory =
  | "GENERAL_EDUCATION"
  | "COMPUTER_SCIENCE"
  | "MINOR"
  | "SPECIALIZATION"
  | "ENGINEERING_SCIENCE_MATHS"
  | "FREE_ELECTIVES";

interface CategoryColorScheme {
  /** Background and text colors for badges/pills */
  badge: string;
  /** Text color for headings and labels */
  text: string;
  /** Icon color */
  icon: string;
  /** Border color (optional, for outlined variants) */
  border?: string;
}

/**
 * Category color mapping
 * Each category has colors that work in both light and dark modes
 */
const CATEGORY_COLORS: Record<CourseCategory, CategoryColorScheme> = {
  GENERAL_EDUCATION: {
    badge: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    text: "text-blue-700 dark:text-blue-400",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  COMPUTER_SCIENCE: {
    badge:
      "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  MINOR: {
    badge:
      "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
    text: "text-purple-700 dark:text-purple-400",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  SPECIALIZATION: {
    badge:
      "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
    text: "text-orange-700 dark:text-orange-400",
    icon: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
  },
  ENGINEERING_SCIENCE_MATHS: {
    badge: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-400",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  FREE_ELECTIVES: {
    badge: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    text: "text-slate-700 dark:text-slate-400",
    icon: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
  },
};

/**
 * Get badge/pill classes for a category
 * Returns background and text color classes suitable for badges
 */
export function getCategoryBadgeClasses(
  category: CourseCategory | string
): string {
  const cat = category as CourseCategory;
  return CATEGORY_COLORS[cat]?.badge || CATEGORY_COLORS.FREE_ELECTIVES.badge;
}

/**
 * Get text color class for category headings/labels
 */
export function getCategoryTextClass(
  category: CourseCategory | string
): string {
  const cat = category as CourseCategory;
  return CATEGORY_COLORS[cat]?.text || CATEGORY_COLORS.FREE_ELECTIVES.text;
}

/**
 * Get icon color class for category icons
 */
export function getCategoryIconClass(
  category: CourseCategory | string
): string {
  const cat = category as CourseCategory;
  return CATEGORY_COLORS[cat]?.icon || CATEGORY_COLORS.FREE_ELECTIVES.icon;
}

/**
 * Get border color class for category (useful for outlined variants)
 */
export function getCategoryBorderClass(
  category: CourseCategory | string
): string {
  const cat = category as CourseCategory;
  return (
    CATEGORY_COLORS[cat]?.border || CATEGORY_COLORS.FREE_ELECTIVES.border || ""
  );
}

/**
 * Get all color classes for a category
 */
export function getCategoryColors(
  category: CourseCategory | string
): CategoryColorScheme {
  const cat = category as CourseCategory;
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.FREE_ELECTIVES;
}

/**
 * Term/Semester color mapping
 */
export type Term = "FALL" | "SPRING" | "SUMMER" | "WINTER";

interface TermColorScheme {
  badge: string;
  text: string;
  icon: string;
}

const TERM_COLORS: Record<Term, TermColorScheme> = {
  FALL: {
    badge:
      "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
    text: "text-orange-700 dark:text-orange-400",
    icon: "text-orange-600 dark:text-orange-400",
  },
  SPRING: {
    badge: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
    text: "text-green-700 dark:text-green-400",
    icon: "text-green-600 dark:text-green-400",
  },
  SUMMER: {
    badge:
      "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: "text-yellow-600 dark:text-yellow-400",
  },
  WINTER: {
    badge: "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300",
    text: "text-sky-700 dark:text-sky-400",
    icon: "text-sky-600 dark:text-sky-400",
  },
};

/**
 * Get badge classes for a term/semester
 */
export function getTermBadgeClasses(term: Term | string): string {
  const t = term as Term;
  return TERM_COLORS[t]?.badge || TERM_COLORS.FALL.badge;
}

/**
 * Get text color class for a term
 */
export function getTermTextClass(term: Term | string): string {
  const t = term as Term;
  return TERM_COLORS[t]?.text || TERM_COLORS.FALL.text;
}

/**
 * Get icon color class for a term
 */
export function getTermIconClass(term: Term | string): string {
  const t = term as Term;
  return TERM_COLORS[t]?.icon || TERM_COLORS.FALL.icon;
}

/**
 * Category color mapping for border colors (hex values for inline styles)
 */
const CATEGORY_BORDER_COLORS: Record<CourseCategory, string> = {
  GENERAL_EDUCATION: "#3b82f6",
  COMPUTER_SCIENCE: "#10b981",
  MINOR: "#a855f7",
  SPECIALIZATION: "#f97316",
  ENGINEERING_SCIENCE_MATHS: "#f59e0b",
  FREE_ELECTIVES: "#64748b",
};

/**
 * Get hex color for category border (used for inline styles)
 */
export function getCategoryColor(category: CourseCategory | string): string {
  const cat = category as CourseCategory;
  return CATEGORY_BORDER_COLORS[cat] || CATEGORY_BORDER_COLORS.FREE_ELECTIVES;
}
