import { formatCourseCode } from "./formatters";

export const normalizeSearchQuery = (query: string): string => {
  return formatCourseCode(query);
};

export const normalizeCourseCodes = (courseCode: string): string => {
  return formatCourseCode(courseCode);
};

export const matchesCourseSearch = (courseCode: string, searchQuery: string): boolean => {
  const normalizedCourseCode = normalizeCourseCodes(courseCode);
  const normalizedQuery = normalizeSearchQuery(searchQuery);

  return normalizedCourseCode.includes(normalizedQuery);
};

export const matchesCourseOrTitle = (
  courseCode: string,
  courseTitle: string,
  searchQuery: string
): boolean => {
  if (!searchQuery.trim()) return true;

  const normalizedQuery = searchQuery.toLowerCase().trim();
  const normalizedCourseCode = formatCourseCode(courseCode);
  const normalizedTitle = courseTitle.toLowerCase().trim();

  return normalizedCourseCode.includes(formatCourseCode(normalizedQuery)) ||
         normalizedTitle.includes(normalizedQuery);
};
