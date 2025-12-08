import { getSession } from "../config/neo4j";
import prisma from "../config/prisma";
import logger from "../config/logger";
import { Course } from "../schemas/course.schema";

export interface EligibleCourse extends Course {
  isEligible: boolean;
  reasonIneligible?: string;
  missingPrerequisites?: string[];
  prerequisiteCodes?: string[];
  dependentCodes?: string[];
}

export async function getEligibleCoursesForStudent(
  userId: string,
  searchQuery?: string,
  upToSemesterId?: string
): Promise<EligibleCourse[]> {
  const neo4jSession = getSession();

  try {
    let degreePlan = await prisma.degreePlan.findUnique({
      where: { userId },
      include: {
        semesters: {
          include: {
            plannedCourses: true,
          },
          orderBy: {
            nth_semestre: "asc",
          },
        },
      },
    });

    // Auto-create degree plan if it doesn't exist
    if (!degreePlan) {
      logger.info(`Auto-creating degree plan for user ${userId}`);
      degreePlan = await prisma.degreePlan.create({
        data: {
          userId: userId,
        },
        include: {
          semesters: {
            include: {
              plannedCourses: true,
            },
            orderBy: {
              nth_semestre: "asc",
            },
          },
        },
      });
    }

    let semestersToConsider = degreePlan.semesters;

    if (upToSemesterId) {
      const semesterIndex = degreePlan.semesters.findIndex(
        (sem) => sem.id === upToSemesterId
      );
      if (semesterIndex !== -1) {
        semestersToConsider = degreePlan.semesters.slice(0, semesterIndex);
      }
    }

    const completedCourseCodes = semestersToConsider
      .flatMap((semester) => semester.plannedCourses)
      .map((course) => course.courseCode);

    const plannedCourseCodes = degreePlan.semesters
      .flatMap((semester) => semester.plannedCourses)
      .map((course) => course.courseCode);

    const searchFilter = searchQuery
      ? `WHERE toLower(c.course_code) CONTAINS toLower($searchQuery) OR toLower(c.course_title) CONTAINS toLower($searchQuery)`
      : "";

    const result = await neo4jSession.run(
      `
      MATCH (c:Course)
      ${searchFilter}
      OPTIONAL MATCH (c)-[:REQUIRES]->(prereq:Course)
      OPTIONAL MATCH (dependent:Course)-[:REQUIRES]->(c)
      WITH c,
           collect(DISTINCT prereq.course_code) as prerequisiteCodes,
           collect(DISTINCT dependent.course_code) as dependentCodes
      RETURN c,
             [code IN prerequisiteCodes WHERE code IS NOT NULL] as prerequisiteCodes,
             [code IN dependentCodes WHERE code IS NOT NULL] as dependentCodes
      ORDER BY c.course_code
      `,
      { searchQuery: searchQuery || "" }
    );

    const eligibleCourses: EligibleCourse[] = result.records
      .map((record) => {
        const node = record.get("c");
        const prerequisiteCodes: string[] = record
          .get("prerequisiteCodes")
          .filter((code: string | null) => code !== null && code !== undefined);
        const dependentCodes: string[] = record
          .get("dependentCodes")
          .filter((code: string | null) => code !== null && code !== undefined);

        const missingPrerequisites = prerequisiteCodes.filter(
          (prereqCode) =>
            prereqCode && !completedCourseCodes.includes(prereqCode)
        );

        const isAlreadyPlanned = plannedCourseCodes.includes(
          node.properties.course_code
        );

        let isEligible = true;
        let reasonIneligible: string | undefined;

        if (isAlreadyPlanned) {
          isEligible = false;
          reasonIneligible = "Course is already in your degree plan";
        } else if (missingPrerequisites.length > 0) {
          isEligible = false;
          reasonIneligible = `Missing prerequisites: ${missingPrerequisites.join(", ")}`;
        }

        return {
          id: node.properties.id,
          labels: node.labels,
          course_code: node.properties.course_code,
          course_title: node.properties.course_title,
          description: node.properties.description,
          sch_credits: node.properties.sch_credits,
          n_credits: node.properties.n_credits,
          isElective: node.properties.isElective,
          isMinorElective: node.properties.isMinorElective,
          isSpecElective: node.properties.isSpecElective,
          categories: node.properties.categories || [],
          disciplines: node.properties.disciplines || [],
          isEligible,
          reasonIneligible,
          missingPrerequisites:
            missingPrerequisites.length > 0 ? missingPrerequisites : undefined,
          prerequisiteCodes,
          dependentCodes,
        };
      })
      .filter((course) => course.isEligible);

    return eligibleCourses;
  } catch (error) {
    logger.error("Error in getEligibleCoursesForStudent:", error);
    throw error;
  } finally {
    await neo4jSession.close();
  }
}

export async function getEligibleCoursesForDegreePlan(
  degreePlanId: string,
  searchQuery?: string
): Promise<EligibleCourse[]> {
  const neo4jSession = getSession();

  try {
    const degreePlan = await prisma.degreePlan.findUnique({
      where: { id: degreePlanId },
      include: {
        semesters: {
          include: {
            plannedCourses: true,
          },
          orderBy: {
            nth_semestre: "asc",
          },
        },
      },
    });

    if (!degreePlan) {
      throw new Error("Degree plan not found");
    }

    const completedCourseCodes = degreePlan.semesters
      .flatMap((semester) => semester.plannedCourses)
      .map((course) => course.courseCode);

    const plannedCourseCodes = degreePlan.semesters
      .flatMap((semester) => semester.plannedCourses)
      .map((course) => course.courseCode);

    const searchFilter = searchQuery
      ? `WHERE toLower(c.course_code) CONTAINS toLower($searchQuery) OR toLower(c.course_title) CONTAINS toLower($searchQuery)`
      : "";

    const result = await neo4jSession.run(
      `
      MATCH (c:Course)
      ${searchFilter}
      OPTIONAL MATCH (c)-[:REQUIRES]->(prereq:Course)
      OPTIONAL MATCH (dependent:Course)-[:REQUIRES]->(c)
      WITH c,
           collect(DISTINCT prereq.course_code) as prerequisiteCodes,
           collect(DISTINCT dependent.course_code) as dependentCodes
      RETURN c,
             [code IN prerequisiteCodes WHERE code IS NOT NULL] as prerequisiteCodes,
             [code IN dependentCodes WHERE code IS NOT NULL] as dependentCodes
      ORDER BY c.course_code
      `,
      { searchQuery: searchQuery || "" }
    );

    const eligibleCourses: EligibleCourse[] = result.records
      .map((record) => {
        const node = record.get("c");
        const prerequisiteCodes: string[] = record
          .get("prerequisiteCodes")
          .filter((code: string | null) => code !== null && code !== undefined);
        const dependentCodes: string[] = record
          .get("dependentCodes")
          .filter((code: string | null) => code !== null && code !== undefined);

        const missingPrerequisites = prerequisiteCodes.filter(
          (prereqCode) =>
            prereqCode && !completedCourseCodes.includes(prereqCode)
        );

        const isAlreadyPlanned = plannedCourseCodes.includes(
          node.properties.course_code
        );

        let isEligible = true;
        let reasonIneligible: string | undefined;

        if (isAlreadyPlanned) {
          isEligible = false;
          reasonIneligible = "Course is already in your degree plan";
        } else if (missingPrerequisites.length > 0) {
          isEligible = false;
          reasonIneligible = `Missing prerequisites: ${missingPrerequisites.join(", ")}`;
        }

        return {
          id: node.properties.id,
          labels: node.labels,
          course_code: node.properties.course_code,
          course_title: node.properties.course_title,
          description: node.properties.description,
          sch_credits: node.properties.sch_credits,
          n_credits: node.properties.n_credits,
          isElective: node.properties.isElective,
          isMinorElective: node.properties.isMinorElective,
          isSpecElective: node.properties.isSpecElective,
          categories: node.properties.categories || [],
          disciplines: node.properties.disciplines || [],
          isEligible,
          reasonIneligible,
          missingPrerequisites:
            missingPrerequisites.length > 0 ? missingPrerequisites : undefined,
          prerequisiteCodes,
          dependentCodes,
        };
      })
      .filter((course) => course.isEligible);

    return eligibleCourses;
  } catch (error) {
    logger.error("Error in getEligibleCoursesForDegreePlan:", error);
    throw error;
  } finally {
    await neo4jSession.close();
  }
}

export async function getAllCourseRelationships(): Promise<
  Map<string, { prerequisites: string[]; dependents: string[] }>
> {
  const neo4jSession = getSession();

  try {
    const result = await neo4jSession.run(
      `
      MATCH (c:Course)
      OPTIONAL MATCH (c)-[:REQUIRES]->(prereq:Course)
      OPTIONAL MATCH (dependent:Course)-[:REQUIRES]->(c)
      WITH c,
           collect(DISTINCT prereq.course_code) as prerequisiteCodes,
           collect(DISTINCT dependent.course_code) as dependentCodes
      RETURN c.course_code as courseCode,
             [code IN prerequisiteCodes WHERE code IS NOT NULL] as prerequisiteCodes,
             [code IN dependentCodes WHERE code IS NOT NULL] as dependentCodes
      `
    );

    const relationshipsMap = new Map<
      string,
      { prerequisites: string[]; dependents: string[] }
    >();

    result.records.forEach((record) => {
      const courseCode = record.get("courseCode");
      const prerequisites = record
        .get("prerequisiteCodes")
        .filter((code: string | null) => code !== null && code !== undefined);
      const dependents = record
        .get("dependentCodes")
        .filter((code: string | null) => code !== null && code !== undefined);

      relationshipsMap.set(courseCode, {
        prerequisites,
        dependents,
      });
    });

    return relationshipsMap;
  } catch (error) {
    logger.error("Error in getAllCourseRelationships:", error);
    throw error;
  } finally {
    await neo4jSession.close();
  }
}

export async function checkCourseEligibility(
  userId: string,
  courseCode: string
): Promise<{
  isEligible: boolean;
  reasonIneligible?: string;
  missingPrerequisites?: string[];
}> {
  const neo4jSession = getSession();

  try {
    const degreePlan = await prisma.degreePlan.findUnique({
      where: { userId },
      include: {
        semesters: {
          include: {
            plannedCourses: true,
          },
        },
      },
    });

    if (!degreePlan) {
      throw new Error("Degree plan not found for user");
    }

    const completedCourseCodes = degreePlan.semesters
      .flatMap((semester) => semester.plannedCourses)
      .map((course) => course.courseCode);

    const plannedCourseCodes = degreePlan.semesters
      .flatMap((semester) => semester.plannedCourses)
      .map((course) => course.courseCode);

    const result = await neo4jSession.run(
      `
      MATCH (c:Course {course_code: $courseCode})
      OPTIONAL MATCH (c)-[:REQUIRES]->(prereq:Course)
      RETURN c,
             collect(DISTINCT prereq.course_code) as prerequisiteCodes
      `,
      { courseCode }
    );

    if (result.records.length === 0) {
      return {
        isEligible: false,
        reasonIneligible: "Course not found",
      };
    }

    const record = result.records[0];
    const prerequisiteCodes: string[] = record.get("prerequisiteCodes");

    const missingPrerequisites = prerequisiteCodes.filter(
      (prereqCode) => !completedCourseCodes.includes(prereqCode)
    );

    const isAlreadyPlanned = plannedCourseCodes.includes(courseCode);

    if (isAlreadyPlanned) {
      return {
        isEligible: false,
        reasonIneligible: "Course is already in your degree plan",
      };
    }

    if (missingPrerequisites.length > 0) {
      return {
        isEligible: false,
        reasonIneligible: `Missing prerequisites: ${missingPrerequisites.join(", ")}`,
        missingPrerequisites,
      };
    }

    return {
      isEligible: true,
    };
  } catch (error) {
    logger.error("Error in checkCourseEligibility:", error);
    throw error;
  } finally {
    await neo4jSession.close();
  }
}
