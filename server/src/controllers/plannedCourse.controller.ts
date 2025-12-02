import { Response } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import * as plannedCourseService from "@/services/plannedCourse.service";
import * as planSemesterService from "@/services/planSemester.service";
import { PlannedCourseStatus } from "@/generated/prisma/client";
import logger from "../config/logger";

export const createPlannedCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      planSemesterId,
      courseCode,
      status,
      courseTitle,
      credits,
      category,
    } = req.body;

    if (!planSemesterId || !courseCode) {
      res.status(400).json({
        success: false,
        message: "planSemesterId and courseCode are required",
      });
      return;
    }

    // Check if plan semester exists
    const planSemester = await planSemesterService.getPlanSemesterById(
      planSemesterId
    );
    if (!planSemester) {
      res.status(404).json({
        success: false,
        message: "Plan semester not found",
      });
      return;
    }

    // Students can only create courses for their own plan
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

    const plannedCourse = await plannedCourseService.createPlannedCourse({
      planSemesterId,
      courseCode,
      status,
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
    const planSemester = await planSemesterService.getPlanSemesterById(
      planSemesterId
    );
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

export const getPlannedCoursesByStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.params;
    const plannedCourses = await plannedCourseService.getPlannedCoursesByStatus(
      status as PlannedCourseStatus
    );

    res.status(200).json({
      success: true,
      count: plannedCourses.length,
      data: plannedCourses,
    });
  } catch (error) {
    logger.error("Error fetching planned courses by status:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching planned courses by status",
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
