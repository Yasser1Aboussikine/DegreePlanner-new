import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as eligibleCoursesService from "@/services/eligibleCourses.service";
import logger from "../config/logger";

export const getEligibleCoursesForCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const searchQuery = req.query.search as string | undefined;
    const upToSemesterId = req.query.upToSemesterId as string | undefined;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const eligibleCourses =
      await eligibleCoursesService.getEligibleCoursesForStudent(userId, searchQuery, upToSemesterId);

    res.status(200).json({
      success: true,
      data: eligibleCourses,
    });
  } catch (error) {
    logger.error("Error fetching eligible courses for current user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching eligible courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getEligibleCoursesForUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const searchQuery = req.query.search as string | undefined;
    const upToSemesterId = req.query.upToSemesterId as string | undefined;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const eligibleCourses =
      await eligibleCoursesService.getEligibleCoursesForStudent(userId, searchQuery, upToSemesterId);

    res.status(200).json({
      success: true,
      data: eligibleCourses,
    });
  } catch (error) {
    logger.error("Error fetching eligible courses for user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching eligible courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getEligibleCoursesForDegreePlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { degreePlanId } = req.params;
    const searchQuery = req.query.search as string | undefined;

    if (!degreePlanId) {
      res.status(400).json({
        success: false,
        message: "Degree plan ID is required",
      });
      return;
    }

    const eligibleCourses =
      await eligibleCoursesService.getEligibleCoursesForDegreePlan(
        degreePlanId,
        searchQuery
      );

    res.status(200).json({
      success: true,
      data: eligibleCourses,
    });
  } catch (error) {
    logger.error("Error fetching eligible courses for degree plan:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching eligible courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllCourseRelationships = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const relationshipsMap = await eligibleCoursesService.getAllCourseRelationships();

    const relationshipsObject: Record<string, { prerequisites: string[]; dependents: string[] }> = {};
    relationshipsMap.forEach((value, key) => {
      relationshipsObject[key] = value;
    });

    res.status(200).json({
      success: true,
      data: relationshipsObject,
    });
  } catch (error) {
    logger.error("Error fetching course relationships:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching course relationships",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const checkCourseEligibility = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { courseCode } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    if (!courseCode) {
      res.status(400).json({
        success: false,
        message: "Course code is required",
      });
      return;
    }

    const eligibilityCheck =
      await eligibleCoursesService.checkCourseEligibility(userId, courseCode);

    res.status(200).json({
      success: true,
      data: eligibilityCheck,
    });
  } catch (error) {
    logger.error("Error checking course eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Error checking course eligibility",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
