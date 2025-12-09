export function formatCategoryName(name: string): string {
  if (!name) return "";

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatSubcategoryName(name: string): string {
  if (!name) return "";

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatAreaName(name: string): string {
  if (!name) return "";

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatDisciplineName(name: string): string {
  if (!name) return "";

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatLabel(label: string): string {
  if (!label) return "";

  return label
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const formatCourseCode = (courseCode: string): string => {
  if (!courseCode) return "";

  return courseCode
    .replace(/\s+/g, "")
    .toLowerCase();
};
