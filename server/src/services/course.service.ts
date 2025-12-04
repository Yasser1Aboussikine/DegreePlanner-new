import { getSession } from "../config/neo4j";
import {
  Course,
  CreateCourseDTO,
  UpdateCourseDTO,
  CourseRelationship,
} from "../schemas/course.schema";
import logger from "../config/logger";
import convertNeo4jIntegexrs from "../helpers/convertNeo4jIntegers";
import neo4j from "neo4j-driver";

/**
 * Get all courses with pagination and filtering
 */
export async function getAllCourses(
  skip: number = 0,
  limit: number = 10,
  search?: string,
  discipline?: string,
  labels?: string[],
  isElective?: boolean
): Promise<{ courses: Course[]; total: number }> {
  const session = getSession();

  try {
    // Build dynamic WHERE clause based on filters
    const whereClauses: string[] = [];
    const params: Record<string, any> = {
      skip: neo4j.int(Math.floor(skip)),
      limit: neo4j.int(Math.floor(limit)),
    };

    if (search) {
      whereClauses.push(
        "(c.course_code CONTAINS $search OR c.course_title CONTAINS $search OR c.description CONTAINS $search)"
      );
      params.search = search;
    }

    if (discipline) {
      whereClauses.push("$discipline IN c.disciplines");
      params.discipline = discipline;
    }

    if (labels && labels.length > 0) {
      whereClauses.push("ANY(label IN labels(c) WHERE label IN $labels)");
      params.labels = labels;
    }

    if (isElective !== undefined) {
      whereClauses.push("c.isElective = $isElective");
      params.isElective = isElective;
    }

    const whereClause =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Get total count
    const countResult = await session.run(
      `
      MATCH (c:Course)
      ${whereClause}
      RETURN count(c) as total
      `,
      params
    );

    const total = countResult.records[0]?.get("total").toNumber() || 0;

    // Get paginated courses
    const result = await session.run(
      `
      MATCH (c:Course)
      ${whereClause}
      RETURN c
      ORDER BY c.course_code
      SKIP $skip
      LIMIT $limit
      `,
      params
    );

    const courses: Course[] = result.records.map((record) => {
      const node = record.get("c");
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
      };
    });

    return { courses, total };
  } catch (error) {
    logger.error("Error in getAllCourses:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Search courses by query (course code, title, or description)
 */
export async function searchCourses(query: string): Promise<Course[]> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (c:Course)
      WHERE c.course_code CONTAINS $query
         OR c.course_title CONTAINS $query
         OR c.description CONTAINS $query
      RETURN c
      ORDER BY c.course_code
      LIMIT 50
      `,
      { query }
    );

    return result.records.map((record) => {
      const node = record.get("c");
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
      };
    });
  } catch (error) {
    logger.error("Error in searchCourses:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get a course by its ID (with prerequisites and dependents)
 */
export async function getCourseById(id: string): Promise<Course | null> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (c:Course {id: $id})
      OPTIONAL MATCH (c)-[:REQUIRES]->(prereq:Course)
      OPTIONAL MATCH (dependent:Course)-[:REQUIRES]->(c)
      RETURN c,
             collect(DISTINCT prereq) as prerequisites,
             collect(DISTINCT dependent) as dependents
      `,
      { id }
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    const node = record.get("c");
    const prerequisites = record.get("prerequisites");
    const dependents = record.get("dependents");

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
      prerequisites: prerequisites
        .filter((p: any) => p !== null)
        .map((p: any) => ({
          id: p.properties.id,
          labels: p.labels,
          course_code: p.properties.course_code,
          course_title: p.properties.course_title,
          description: p.properties.description,
          sch_credits: p.properties.sch_credits,
          n_credits: p.properties.n_credits,
          isElective: p.properties.isElective,
          isMinorElective: p.properties.isMinorElective,
          isSpecElective: p.properties.isSpecElective,
          categories: p.properties.categories || [],
          disciplines: p.properties.disciplines || [],
        })),
      dependents: dependents
        .filter((d: any) => d !== null)
        .map((d: any) => ({
          id: d.properties.id,
          labels: d.labels,
          course_code: d.properties.course_code,
          course_title: d.properties.course_title,
          description: d.properties.description,
          sch_credits: d.properties.sch_credits,
          n_credits: d.properties.n_credits,
          isElective: d.properties.isElective,
          isMinorElective: d.properties.isMinorElective,
          isSpecElective: d.properties.isSpecElective,
          categories: d.properties.categories || [],
          disciplines: d.properties.disciplines || [],
        })),
    };
  } catch (error) {
    logger.error("Error in getCourseById:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get a course by course code (e.g., "CSC3301")
 */
export async function getCourseByCourseCode(
  courseCode: string
): Promise<Course | null> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (c:Course {course_code: $courseCode})
      OPTIONAL MATCH (c)-[:REQUIRES]->(prereq:Course)
      OPTIONAL MATCH (dependent:Course)-[:REQUIRES]->(c)
      RETURN c,
             collect(DISTINCT prereq) as prerequisites,
             collect(DISTINCT dependent) as dependents
      `,
      { courseCode }
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    const node = record.get("c");
    const prerequisites = record.get("prerequisites");
    const dependents = record.get("dependents");

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
      prerequisites: prerequisites
        .filter((p: any) => p !== null)
        .map((p: any) => ({
          id: p.properties.id,
          labels: p.labels,
          course_code: p.properties.course_code,
          course_title: p.properties.course_title,
          description: p.properties.description,
          sch_credits: p.properties.sch_credits,
          n_credits: p.properties.n_credits,
          isElective: p.properties.isElective,
          isMinorElective: p.properties.isMinorElective,
          isSpecElective: p.properties.isSpecElective,
          categories: p.properties.categories || [],
          disciplines: p.properties.disciplines || [],
        })),
      dependents: dependents
        .filter((d: any) => d !== null)
        .map((d: any) => ({
          id: d.properties.id,
          labels: d.labels,
          course_code: d.properties.course_code,
          course_title: d.properties.course_title,
          description: d.properties.description,
          sch_credits: d.properties.sch_credits,
          n_credits: d.properties.n_credits,
          isElective: d.properties.isElective,
          isMinorElective: d.properties.isMinorElective,
          isSpecElective: d.properties.isSpecElective,
          categories: d.properties.categories || [],
          disciplines: d.properties.disciplines || [],
        })),
    };
  } catch (error) {
    logger.error("Error in getCourseByCourseCode:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get all courses with a specific label
 */
export async function getCoursesByLabel(label: string): Promise<Course[]> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (c:${label})
      RETURN c
      ORDER BY c.course_code
      `,
      { label }
    );

    return result.records.map((record) => {
      const node = record.get("c");
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
      };
    });
  } catch (error) {
    logger.error("Error in getCoursesByLabel:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get all courses with a specific discipline
 */
export async function getCoursesByDiscipline(
  discipline: string
): Promise<Course[]> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (c:Course)
      WHERE $discipline IN c.disciplines
      RETURN c
      ORDER BY c.course_code
      `,
      { discipline }
    );

    return result.records.map((record) => {
      const node = record.get("c");
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
      };
    });
  } catch (error) {
    logger.error("Error in getCoursesByDiscipline:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Create a new course
 */
export async function createCourse(
  courseData: CreateCourseDTO
): Promise<Course> {
  const session = getSession();

  try {
    // Generate ID if not provided
    const id =
      courseData.id || `COURSE_${courseData.course_code.toUpperCase()}`;

    // Create the course node
    const result = await session.run(
      `
      CREATE (c:Course {
        id: $id,
        course_code: $course_code,
        course_title: $course_title,
        description: $description,
        sch_credits: $sch_credits,
        n_credits: $n_credits,
        isElective: $isElective,
        isMinorElective: $isMinorElective,
        isSpecElective: $isSpecElective,
        categories: $categories,
        disciplines: $disciplines
      })
      RETURN c
      `,
      {
        id,
        course_code: courseData.course_code,
        course_title: courseData.course_title,
        description: courseData.description,
        sch_credits: courseData.sch_credits,
        n_credits: courseData.n_credits,
        isElective: courseData.isElective ?? false,
        isMinorElective: courseData.isMinorElective ?? false,
        isSpecElective: courseData.isSpecElective ?? false,
        categories: courseData.categories,
        disciplines: courseData.disciplines,
      }
    );

    const node = result.records[0].get("c");

    // Create prerequisite relationships if provided
    if (courseData.prerequisites && courseData.prerequisites.length > 0) {
      for (const prereqCode of courseData.prerequisites) {
        await session.run(
          `
          MATCH (course:Course {id: $courseId})
          MATCH (prereq:Course {course_code: $prereqCode})
          CREATE (course)-[:REQUIRES]->(prereq)
          `,
          { courseId: id, prereqCode }
        );
      }
    }

    // Create dependent relationships if provided
    if (courseData.dependents && courseData.dependents.length > 0) {
      for (const depCode of courseData.dependents) {
        await session.run(
          `
          MATCH (course:Course {id: $courseId})
          MATCH (dependent:Course {course_code: $depCode})
          CREATE (dependent)-[:REQUIRES]->(course)
          `,
          { courseId: id, depCode }
        );
      }
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
    };
  } catch (error) {
    logger.error("Error in createCourse:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Update a course
 */
export async function updateCourse(
  id: string,
  updateData: UpdateCourseDTO
): Promise<Course | null> {
  const session = getSession();

  try {
    // Build SET clause dynamically
    const setClause = Object.keys(updateData)
      .filter(
        (key) =>
          key !== "id" &&
          key !== "labels" &&
          key !== "prerequisites" &&
          key !== "dependents"
      )
      .map((key) => `c.${key} = $${key}`)
      .join(", ");

    if (!setClause) {
      // Nothing to update
      return getCourseById(id);
    }

    const result = await session.run(
      `
      MATCH (c:Course {id: $id})
      SET ${setClause}
      RETURN c
      `,
      { id, ...updateData }
    );

    if (result.records.length === 0) {
      return null;
    }

    const node = result.records[0].get("c");

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
    };
  } catch (error) {
    logger.error("Error in updateCourse:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Delete a course
 */
export async function deleteCourse(id: string): Promise<boolean> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (c:Course {id: $id})
      DETACH DELETE c
      RETURN count(c) as deleted
      `,
      { id }
    );

    const deleted = result.records[0].get("deleted").toNumber();
    return deleted > 0;
  } catch (error) {
    logger.error("Error in deleteCourse:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get direct prerequisites for a course
 */
export async function getCoursePrerequisites(id: string): Promise<Course[]> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (c:Course {id: $id})-[:REQUIRES]->(prereq:Course)
      RETURN prereq
      ORDER BY prereq.course_code
      `,
      { id }
    );

    return result.records.map((record) => {
      const node = record.get("prereq");
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
      };
    });
  } catch (error) {
    logger.error("Error in getCoursePrerequisites:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get direct dependents for a course (courses that require this course)
 */
export async function getCourseDependents(id: string): Promise<Course[]> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (dependent:Course)-[:REQUIRES]->(c:Course {id: $id})
      RETURN dependent
      ORDER BY dependent.course_code
      `,
      { id }
    );

    return result.records.map((record) => {
      const node = record.get("dependent");
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
      };
    });
  } catch (error) {
    logger.error("Error in getCourseDependents:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get full prerequisite chain for a course (recursive)
 */
export async function getPrerequisiteChain(id: string): Promise<Course[]> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH path = (c:Course {id: $id})-[:REQUIRES*]->(prereq:Course)
      RETURN DISTINCT prereq
      ORDER BY prereq.course_code
      `,
      { id }
    );

    return result.records.map((record) => {
      const node = record.get("prereq");
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
      };
    });
  } catch (error) {
    logger.error("Error in getPrerequisiteChain:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get full dependent chain for a course (recursive)
 */
export async function getDependentChain(id: string): Promise<Course[]> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH path = (dependent:Course)-[:REQUIRES*]->(c:Course {id: $id})
      RETURN DISTINCT dependent
      ORDER BY dependent.course_code
      `,
      { id }
    );

    return result.records.map((record) => {
      const node = record.get("dependent");
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
      };
    });
  } catch (error) {
    logger.error("Error in getDependentChain:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Create a prerequisite relationship
 */
export async function createPrerequisite(
  prerequisiteId: string,
  courseId: string
): Promise<CourseRelationship> {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (course:Course {id: $courseId})
      MATCH (prereq:Course {id: $prerequisiteId})
      CREATE (course)-[:REQUIRES]->(prereq)
      `,
      { courseId, prerequisiteId }
    );

    return {
      type: "REQUIRES",
      startNode: courseId,
      endNode: prerequisiteId,
    };
  } catch (error) {
    logger.error("Error in createPrerequisite:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Delete a prerequisite relationship
 */
export async function deletePrerequisite(
  prerequisiteId: string,
  courseId: string
): Promise<boolean> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (course:Course {id: $courseId})-[r:REQUIRES]->(prereq:Course {id: $prerequisiteId})
      DELETE r
      RETURN count(r) as deleted
      `,
      { courseId, prerequisiteId }
    );

    const deleted = result.records[0]?.get("deleted").toNumber() || 0;
    return deleted > 0;
  } catch (error) {
    logger.error("Error in deletePrerequisite:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Check if adding a prerequisite would create a circular dependency
 */
export async function wouldCreateCircularDependency(
  prerequisiteId: string,
  courseId: string
): Promise<boolean> {
  const session = getSession();

  try {
    // Check if prerequisite already depends on course (directly or indirectly)
    const result = await session.run(
      `
      MATCH (prereq:Course {id: $prerequisiteId})
      MATCH (course:Course {id: $courseId})
      RETURN EXISTS((prereq)-[:REQUIRES*]->(course)) as wouldCreateCycle
      `,
      { prerequisiteId, courseId }
    );

    return result.records[0].get("wouldCreateCycle");
  } catch (error) {
    logger.error("Error in wouldCreateCircularDependency:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get all unique node labels in the database
 */
export async function getAllNodeLabels(): Promise<string[]> {
  const session = getSession();

  try {
    const result = await session.run(`
      CALL db.labels()
      YIELD label
      RETURN label
      ORDER BY label
    `);

    return result.records.map((record) => record.get("label"));
  } catch (error) {
    logger.error("Error in getAllNodeLabels:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get all unique disciplines
 */
export async function getAllDisciplines(): Promise<string[]> {
  const session = getSession();

  try {
    const result = await session.run(`
      MATCH (c:Course)
      UNWIND c.disciplines as discipline
      RETURN DISTINCT discipline
      ORDER BY discipline
    `);

    return result.records.map((record) => record.get("discipline"));
  } catch (error) {
    logger.error("Error in getAllDisciplines:", error);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Get disciplines by label
 */
export async function getDisciplinesByLabel(label: string): Promise<string[]> {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (c:${label})
      UNWIND c.disciplines as discipline
      RETURN DISTINCT discipline
      ORDER BY discipline
      `,
      { label }
    );

    return result.records.map((record) => record.get("discipline"));
  } catch (error) {
    logger.error("Error in getDisciplinesByLabel:", error);
    throw error;
  } finally {
    await session.close();
  }
}
