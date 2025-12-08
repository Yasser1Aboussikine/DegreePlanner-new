export const normalizeSearchQuery = (query: string): string => {
  return query
    .replace(/\s+/g, '')
    .toUpperCase()
    .trim();
};

export const normalizeCourseCodes = (courseCode: string): string => {
  return courseCode
    .replace(/\s+/g, '')
    .toUpperCase()
    .trim();
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
  const normalizedCourseCode = normalizeCourseCodes(courseCode).toLowerCase();
  const normalizedTitle = courseTitle.toLowerCase().trim();

  return normalizedCourseCode.includes(normalizedQuery.replace(/\s+/g, '')) ||
         normalizedTitle.includes(normalizedQuery);
};
