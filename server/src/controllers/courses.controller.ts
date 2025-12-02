import { Request, Response } from "express";
import * as courseService from "@/services/course.service";
import { CreateCourseDTO, UpdateCourseDTO } from "@/schemas/course.schema";
import logger from "../config/logger";

export const getAllCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Parse filter parameters
    const search = req.query.search as string | undefined;
    const discipline = req.query.discipline as string | undefined;
    const labels = req.query.labels as string | undefined;
    const isElective = req.query.isElective === "true";

    // Get paginated courses and total count
    const { courses, total } = await courseService.getAllCourses(
      skip,
      limit,
      search,
      discipline,
      labels ? labels.split(",") : undefined,
      isElective
    );

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    logger.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const searchCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required',
      });
      return;
    }

    const courses = await courseService.searchCourses(q);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    logger.error("Error searching courses:", error);
    res.status(500).json({
      success: false,
      message: "Error searching courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCourseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const course = await courseService.getCourseById(id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    logger.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCoursesByLabel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const label: string = req.params.label as string;
    const courses = await courseService.getCoursesByLabel(label);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    logger.error("Error fetching courses by label:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses by label",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCoursesByDiscipline = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const discipline: string = req.params.discipline as string;
    const courses = await courseService.getCoursesByDiscipline(discipline);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    logger.error("Error fetching courses by discipline:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses by discipline",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCourseByCourseCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courseCode: string = req.params.course_code as string;
    const course = await courseService.getCourseByCourseCode(courseCode);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    logger.error("Error fetching course by code:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching course by code",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courseData: CreateCourseDTO = req.body;

    // Validate required fields
    if (
      !courseData.course_code ||
      !courseData.course_title ||
      !courseData.description ||
      typeof courseData.sch_credits !== 'number' ||
      typeof courseData.n_credits !== 'number'
    ) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: course_code, course_title, description, sch_credits, n_credits",
      });
      return;
    }

    // Validate arrays
    if (!courseData.categories || courseData.categories.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one category is required",
      });
      return;
    }

    if (!courseData.disciplines || courseData.disciplines.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one discipline is required",
      });
      return;
    }

    // Labels default to ["Course"] if not provided
    if (!courseData.labels || courseData.labels.length === 0) {
      courseData.labels = ["Course"];
    }

    const newCourse = await courseService.createCourse(courseData);

    // Fetch prerequisites and dependents for the created course
    if (!newCourse.id) {
      throw new Error("Created course is missing an id");
    }
    const [prerequisites, dependents] = await Promise.all([
      courseService.getCoursePrerequisites(String(newCourse.id)),
      courseService.getCourseDependents(String(newCourse.id)),
    ]);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: {
        ...newCourse,
        prerequisites,
        dependents,
      },
    });
  } catch (error) {
    logger.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const updateData: UpdateCourseDTO = req.body;

    const updatedCourse = await courseService.updateCourse(id, updateData);

    if (!updatedCourse) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    logger.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const deleted = await courseService.deleteCourse(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCoursePrerequisites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    logger.info(
      `[${new Date().toISOString()}] Fetching prerequisites for course: ${id}`
    );
    const prerequisites = await courseService.getCoursePrerequisites(id);

    res.status(200).json({
      success: true,
      count: prerequisites.length,
      data: prerequisites,
    });
  } catch (error) {
    logger.error("Error fetching prerequisites:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching prerequisites",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCourseDependents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const dependents = await courseService.getCourseDependents(id);

    res.status(200).json({
      success: true,
      count: dependents.length,
      data: dependents,
    });
  } catch (error) {
    logger.error("Error fetching dependents:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dependents",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPrerequisiteChain = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const prerequisites = await courseService.getPrerequisiteChain(id);

    res.status(200).json({
      success: true,
      count: prerequisites.length,
      data: prerequisites,
    });
  } catch (error) {
    logger.error("Error fetching prerequisite chain:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching prerequisite chain",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getDependentChain = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const dependents = await courseService.getDependentChain(id);

    res.status(200).json({
      success: true,
      count: dependents.length,
      data: dependents,
    });
  } catch (error) {
    logger.error("Error fetching dependent chain:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dependent chain",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const addPrerequisite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const { prerequisiteId } = req.body;

    if (!prerequisiteId) {
      res.status(400).json({
        success: false,
        message: "prerequisiteId is required",
      });
      return;
    }

    const wouldCreateCircle = await courseService.wouldCreateCircularDependency(
      prerequisiteId,
      id
    );

    if (wouldCreateCircle) {
      res.status(400).json({
        success: false,
        message: "Cannot add prerequisite: would create a circular dependency",
      });
      return;
    }

    const relationship = await courseService.createPrerequisite(
      prerequisiteId,
      id
    );

    res.status(201).json({
      success: true,
      message: "Prerequisite added successfully",
      data: relationship,
    });
  } catch (error) {
    logger.error("Error adding prerequisite:", error);
    res.status(500).json({
      success: false,
      message: "Error adding prerequisite",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const removePrerequisite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.id as string;
    const prerequisiteId: string = req.params.prerequisiteId as string;
    const deleted = await courseService.deletePrerequisite(prerequisiteId, id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Prerequisite relationship not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Prerequisite removed successfully",
    });
  } catch (error) {
    logger.error("Error removing prerequisite:", error);
    res.status(500).json({
      success: false,
      message: "Error removing prerequisite",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllNodeLabels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const labels = await courseService.getAllNodeLabels();

    res.status(200).json({
      success: true,
      data: labels,
    });
  } catch (error) {
    logger.error("Error fetching node labels:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching node labels",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// export const getAllDisciplines = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const disciplines = await courseService.getAllDisciplines();

//     res.status(200).json({
//       success: true,
//       data: disciplines,
//     });
//   } catch (error) {
//     logger.error("Error fetching disciplines:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching disciplines",
//       error: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// };

// export const getDisciplinesByLabel = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { label } = req.params;

//     if (!label) {
//       res.status(400).json({
//         success: false,
//         message: "Label parameter is required",
//       });
//       return;
//     }

//     const disciplines = await courseService.getDisciplinesByLabel(label);

//     res.status(200).json({
//       success: true,
//       data: disciplines,
//     });
//   } catch (error) {
//     logger.error("Error fetching disciplines by label:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching disciplines by label",
//       error: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// };
