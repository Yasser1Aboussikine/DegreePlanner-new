import { Response } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import * as planSemesterService from "@/services/planSemester.service";
import * as degreePlanService from "@/services/degreePlan.service";
import logger from "../config/logger";

export const createPlanSemester = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { degreePlanId, year, term, nth_semestre } = req.body;

    if (!degreePlanId || !year || !term || typeof nth_semestre !== "number") {
      res.status(400).json({
        success: false,
        message: "degreePlanId, year, term, and nth_semestre are required",
      });
      return;
    }

    const degreePlan = await degreePlanService.getDegreePlanById(degreePlanId);
    if (!degreePlan) {
      res.status(404).json({
        success: false,
        message: "Degree plan not found",
      });
      return;
    }

    if (req.user?.role === "STUDENT" && req.user.userId !== degreePlan.userId) {
      res.status(403).json({
        success: false,
        message: "You can only create semesters for your own degree plan",
      });
      return;
    }

    const allSemesters = await planSemesterService.getPlanSemestersByDegreePlanId(degreePlanId);

    if (nth_semestre > 1) {
      const previousSemester = allSemesters.find(
        (s) => s.nth_semestre === nth_semestre - 1
      );

      if (!previousSemester) {
        res.status(400).json({
          success: false,
          message: `Cannot create semester ${nth_semestre}. Previous semester does not exist.`,
        });
        return;
      }

      const previousSemesterCourses = (previousSemester as any).plannedCourses || [];
      if (previousSemesterCourses.length === 0) {
        res.status(400).json({
          success: false,
          message: "Cannot create a new semester. The previous semester is empty.",
        });
        return;
      }

      const validTermSequence = planSemesterService.getValidNextTerms(previousSemester.term);
      if (!validTermSequence.includes(term)) {
        res.status(400).json({
          success: false,
          message: `Invalid term sequence. After ${previousSemester.term}, you can only select: ${validTermSequence.join(" or ")}`,
        });
        return;
      }
    }

    const planSemester = await planSemesterService.createPlanSemester({
      degreePlanId,
      year,
      term,
      nth_semestre,
    });

    res.status(201).json({
      success: true,
      message: "Plan semester created successfully",
      data: planSemester,
    });
  } catch (error) {
    logger.error("Error creating plan semester:", error);
    res.status(500).json({
      success: false,
      message: "Error creating plan semester",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllPlanSemesters = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const planSemesters = await planSemesterService.getAllPlanSemesters();

    res.status(200).json({
      success: true,
      count: planSemesters.length,
      data: planSemesters,
    });
  } catch (error) {
    logger.error("Error fetching plan semesters:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching plan semesters",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPlanSemesterById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const planSemester = await planSemesterService.getPlanSemesterById(id);

    if (!planSemester) {
      res.status(404).json({
        success: false,
        message: "Plan semester not found",
      });
      return;
    }

    // Students can only view their own semesters
    if (
      req.user?.role === "STUDENT" &&
      planSemester.degreePlan &&
      req.user.userId !== planSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only view your own plan semesters",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: planSemester,
    });
  } catch (error) {
    logger.error("Error fetching plan semester:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching plan semester",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPlanSemestersByDegreePlanId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { degreePlanId } = req.params;

    // Check if degree plan exists
    const degreePlan = await degreePlanService.getDegreePlanById(degreePlanId);
    if (!degreePlan) {
      res.status(404).json({
        success: false,
        message: "Degree plan not found",
      });
      return;
    }

    // Students can only view their own semesters
    if (req.user?.role === "STUDENT" && req.user.userId !== degreePlan.userId) {
      res.status(403).json({
        success: false,
        message: "You can only view your own plan semesters",
      });
      return;
    }

    const planSemesters =
      await planSemesterService.getPlanSemestersByDegreePlanId(degreePlanId);

    res.status(200).json({
      success: true,
      count: planSemesters.length,
      data: planSemesters,
    });
  } catch (error) {
    logger.error("Error fetching plan semesters:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching plan semesters",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updatePlanSemester = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingSemester = await planSemesterService.getPlanSemesterById(id);

    if (!existingSemester) {
      res.status(404).json({
        success: false,
        message: "Plan semester not found",
      });
      return;
    }

    // Students can only update their own semesters
    if (
      req.user?.role === "STUDENT" &&
      existingSemester.degreePlan &&
      req.user.userId !== existingSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only update your own plan semesters",
      });
      return;
    }

    const planSemester = await planSemesterService.updatePlanSemester(
      id,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "Plan semester updated successfully",
      data: planSemester,
    });
  } catch (error) {
    logger.error("Error updating plan semester:", error);
    res.status(500).json({
      success: false,
      message: "Error updating plan semester",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deletePlanSemester = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingSemester = await planSemesterService.getPlanSemesterById(id);

    if (!existingSemester) {
      res.status(404).json({
        success: false,
        message: "Plan semester not found",
      });
      return;
    }

    // Students can only delete their own semesters
    if (
      req.user?.role === "STUDENT" &&
      existingSemester.degreePlan &&
      req.user.userId !== existingSemester.degreePlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own plan semesters",
      });
      return;
    }

    const deleted = await planSemesterService.deletePlanSemester(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Plan semester not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Plan semester deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting plan semester:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting plan semester",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
