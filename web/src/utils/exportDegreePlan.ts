import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import type { DegreePlan, User, Term } from "@/store/types";

const formatTerm = (term: Term): string => {
  const termMap: Record<Term, string> = {
    FALL: "Fall",
    SPRING: "Spring",
    SUMMER: "Summer",
    WINTER: "Winter",
  };
  return termMap[term];
};

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9]/g, "_");
};

const generateFilename = (studentName: string): string => {
  const date = new Date().toISOString().split("T")[0];
  const sanitizedName = sanitizeFilename(studentName);
  return `DegreePlan_${sanitizedName}_${date}.docx`;
};

const padArray = <T>(arr: T[], length: number, fillValue: T): T[] => {
  const result = [...arr];
  while (result.length < length) {
    result.push(fillValue);
  }
  return result;
};

export const exportDegreePlanToWord = async (
  degreePlan: DegreePlan,
  user: User
): Promise<void> => {
  try {
    const templateUrl = "/templates/template.docx";
    const response = await fetch(templateUrl);

    if (!response.ok) {
      throw new Error("Failed to load template file");
    }

    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const sortedSemesters = [...(degreePlan.semesters || [])].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const termOrder: Record<Term, number> = {
        SPRING: 0,
        SUMMER: 1,
        FALL: 2,
        WINTER: 3,
      };
      return termOrder[a.term] - termOrder[b.term];
    });

    // Group semesters into sets of 3 for the 3-column layout
    const semesterGroups = [];
    for (let i = 0; i < sortedSemesters.length; i += 3) {
      semesterGroups.push(sortedSemesters.slice(i, i + 3));
    }

    const tableGroups = semesterGroups.map((group) => {
      const semester1 = group[0];
      const semester2 = group[1];
      const semester3 = group[2];

      const sem1Courses =
        semester1?.plannedCourses.map((c) => ({
          courseId: c.courseCode,
          courseTitle: c.courseTitle || "",
          sch: String(c.credits || 0),
        })) || [];

      const sem2Courses =
        semester2?.plannedCourses.map((c) => ({
          courseId: c.courseCode,
          courseTitle: c.courseTitle || "",
          sch: String(c.credits || 0),
        })) || [];

      const sem3Courses =
        semester3?.plannedCourses.map((c) => ({
          courseId: c.courseCode,
          courseTitle: c.courseTitle || "",
          sch: String(c.credits || 0),
        })) || [];

      const maxCourses = Math.max(
        sem1Courses.length,
        sem2Courses.length,
        sem3Courses.length,
        1
      );

      const paddedSem1 = padArray(sem1Courses, maxCourses, {
        courseId: "",
        courseTitle: "",
        sch: "",
      });
      const paddedSem2 = padArray(sem2Courses, maxCourses, {
        courseId: "",
        courseTitle: "",
        sch: "",
      });
      const paddedSem3 = padArray(sem3Courses, maxCourses, {
        courseId: "",
        courseTitle: "",
        sch: "",
      });

      // Determine the academic year for this group
      const academicYear = semester1
        ? `${semester1.year}/${semester1.year + 1}`
        : semester2
        ? `${semester2.year}/${semester2.year + 1}`
        : semester3
        ? `${semester3.year}/${semester3.year + 1}`
        : "";

      const rows: any[] = [];
      for (let i = 0; i < maxCourses; i++) {
        rows.push({
          year: i === 0 ? academicYear : "",
          sem1CourseId: paddedSem1[i].courseId,
          sem1CourseTitle: paddedSem1[i].courseTitle,
          sem1Sch: paddedSem1[i].sch,
          sem1Header:
            i === 0 && semester1
              ? `${formatTerm(semester1.term)} ${semester1.year}`
              : "",
          sem2CourseId: paddedSem2[i].courseId,
          sem2CourseTitle: paddedSem2[i].courseTitle,
          sem2Sch: paddedSem2[i].sch,
          sem2Header:
            i === 0 && semester2
              ? `${formatTerm(semester2.term)} ${semester2.year}`
              : "",
          sem3CourseId: paddedSem3[i].courseId,
          sem3CourseTitle: paddedSem3[i].courseTitle,
          sem3Sch: paddedSem3[i].sch,
          sem3Header:
            i === 0 && semester3
              ? `${formatTerm(semester3.term)} ${semester3.year}`
              : "",
        });
      }

      return {
        year: academicYear,
        semester1: semester1
          ? `${formatTerm(semester1.term)} ${semester1.year}`
          : "",
        semester2: semester2
          ? `${formatTerm(semester2.term)} ${semester2.year}`
          : "",
        semester3: semester3
          ? `${formatTerm(semester3.term)} ${semester3.year}`
          : "",
        rows,
      };
    });

    const data = {
      name: user.name || "Unknown Student",
      studentId: user.id,
      major: user.major || "CS",
      school: "SSE",
      tableGroups,
    };

    doc.render(data);

    const output = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const filename = generateFilename(user.name || "Student");
    saveAs(output, filename);
  } catch (error) {
    console.error("Error exporting degree plan:", error);
    throw new Error(
      error instanceof Error
        ? `Export failed: ${error.message}`
        : "Failed to export degree plan"
    );
  }
};
