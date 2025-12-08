import { Response } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import * as plannedCourseService from "@/services/plannedCourse.service";
import * as planSemesterService from "@/services/planSemester.service";
import logger from "../config/logger";

export const createPlannedCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { planSemesterId, courseCode, courseTitle, credits, category } =
      req.body;

    if (!planSemesterId || !courseCode) {
      res.status(400).json({
        success: false,
        message: "planSemesterId and courseCode are required",
      });
      return;
    }

    const planSemester =
      await planSemesterService.getPlanSemesterById(planSemesterId);
    if (!planSemester) {
      res.status(404).json({
        success: false,
        message: "Plan semester not found",
      });
      return;
    }

    if (
      req.user?.role === "STUDENT" &&
      planSemester.degreePlan &&
      req.user.userId !== planSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only add courses to your own plan",
      });
      return;
    }

    const existingCourses = planSemester.plannedCourses || [];
    const currentCourseCount = existingCourses.length;
    const currentTotalCredits = existingCourses.reduce((sum, course) => sum + (course.credits || 0), 0);

    const newCourseCredits = credits || 0;

    if (planSemester.term === "FALL" || planSemester.term === "SPRING") {
      if (currentCourseCount >= 6) {
        res.status(400).json({
          success: false,
          message: `Cannot add course. ${planSemester.term} semester has a maximum limit of 6 courses. Current: ${currentCourseCount}`,
        });
        return;
      }
    } else if (planSemester.term === "WINTER") {
      if (currentCourseCount >= 1) {
        res.status(400).json({
          success: false,
          message: "Cannot add course. WINTER semester has a maximum limit of 1 course.",
        });
        return;
      }
    } else if (planSemester.term === "SUMMER") {
      if (currentTotalCredits + newCourseCredits > 10) {
        res.status(400).json({
          success: false,
          message: `Cannot add course. SUMMER semester has a maximum limit of 10 credits. Current: ${currentTotalCredits}, Adding: ${newCourseCredits}`,
        });
        return;
      }
    }

    const plannedCourse = await plannedCourseService.createPlannedCourse({
      planSemesterId,
      courseCode,
      courseTitle,
      credits,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Planned course created successfully",
      data: plannedCourse,
    });
  } catch (error) {
    logger.error("Error creating planned course:", error);
    res.status(500).json({
      success: false,
      message: "Error creating planned course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllPlannedCourses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const plannedCourses = await plannedCourseService.getAllPlannedCourses();

    res.status(200).json({
      success: true,
      count: plannedCourses.length,
      data: plannedCourses,
    });
  } catch (error) {
    logger.error("Error fetching planned courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching planned courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPlannedCourseById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const plannedCourse = await plannedCourseService.getPlannedCourseById(id);

    if (!plannedCourse) {
      res.status(404).json({
        success: false,
        message: "Planned course not found",
      });
      return;
    }

    // Students can only view their own courses
    if (
      req.user?.role === "STUDENT" &&
      plannedCourse.planSemester &&
      plannedCourse.planSemester.degreePlan &&
      req.user.userId !== plannedCourse.planSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only view your own planned courses",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: plannedCourse,
    });
  } catch (error) {
    logger.error("Error fetching planned course:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching planned course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPlannedCoursesByPlanSemesterId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { planSemesterId } = req.params;

    // Check if plan semester exists
    const planSemester =
      await planSemesterService.getPlanSemesterById(planSemesterId);
    if (!planSemester) {
      res.status(404).json({
        success: false,
        message: "Plan semester not found",
      });
      return;
    }

    // Students can only view their own courses
    if (
      req.user?.role === "STUDENT" &&
      planSemester.degreePlan &&
      req.user.userId !== planSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only view your own planned courses",
      });
      return;
    }

    const plannedCourses =
      await plannedCourseService.getPlannedCoursesByPlanSemesterId(
        planSemesterId
      );

    res.status(200).json({
      success: true,
      count: plannedCourses.length,
      data: plannedCourses,
    });
  } catch (error) {
    logger.error("Error fetching planned courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching planned courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updatePlannedCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingCourse = await plannedCourseService.getPlannedCourseById(id);

    if (!existingCourse) {
      res.status(404).json({
        success: false,
        message: "Planned course not found",
      });
      return;
    }

    // Students can only update their own courses
    if (
      req.user?.role === "STUDENT" &&
      existingCourse.planSemester &&
      existingCourse.planSemester.degreePlan &&
      req.user.userId !== existingCourse.planSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only update your own planned courses",
      });
      return;
    }

    const plannedCourse = await plannedCourseService.updatePlannedCourse(
      id,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "Planned course updated successfully",
      data: plannedCourse,
    });
  } catch (error) {
    logger.error("Error updating planned course:", error);
    res.status(500).json({
      success: false,
      message: "Error updating planned course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPlannedCourseDependents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingCourse = await plannedCourseService.getPlannedCourseById(id);

    if (!existingCourse) {
      res.status(404).json({
        success: false,
        message: "Planned course not found",
      });
      return;
    }

    // Students can only view their own courses
    if (
      req.user?.role === "STUDENT" &&
      existingCourse.planSemester &&
      existingCourse.planSemester.degreePlan &&
      req.user.userId !== existingCourse.planSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only view your own planned courses",
      });
      return;
    }

    const dependents =
      await plannedCourseService.getPlannedCourseDependents(id);

    res.status(200).json({
      success: true,
      count: dependents.length,
      data: dependents,
    });
  } catch (error) {
    logger.error("Error getting planned course dependents:", error);
    res.status(500).json({
      success: false,
      message: "Error getting planned course dependents",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deletePlannedCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingCourse = await plannedCourseService.getPlannedCourseById(id);

    if (!existingCourse) {
      res.status(404).json({
        success: false,
        message: "Planned course not found",
      });
      return;
    }

    // Students can only delete their own courses
    if (
      req.user?.role === "STUDENT" &&
      existingCourse.planSemester &&
      existingCourse.planSemester.degreePlan &&
      req.user.userId !== existingCourse.planSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own planned courses",
      });
      return;
    }

    const deleted = await plannedCourseService.deletePlannedCourse(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Planned course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Planned course deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting planned course:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting planned course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deletePlannedCourseWithDependents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingCourse = await plannedCourseService.getPlannedCourseById(id);

    if (!existingCourse) {
      res.status(404).json({
        success: false,
        message: "Planned course not found",
      });
      return;
    }

    // Students can only delete their own courses
    if (
      req.user?.role === "STUDENT" &&
      existingCourse.planSemester &&
      existingCourse.planSemester.degreePlan &&
      req.user.userId !== existingCourse.planSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own planned courses",
      });
      return;
    }

    const result =
      await plannedCourseService.deletePlannedCourseWithDependents(id);

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} course(s) successfully`,
      data: {
        deletedCount: result.deletedCount,
        deletedCourses: result.deletedCourses,
      },
    });
  } catch (error) {
    logger.error("Error deleting planned course with dependents:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting planned course with dependents",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
