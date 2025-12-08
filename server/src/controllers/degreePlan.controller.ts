import { Response } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import * as degreePlanService from "@/services/degreePlan.service";
import logger from "../config/logger";

export const createDegreePlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "userId is required",
      });
      return;
    }

    // Students can only create their own plan
    if (req.user?.role === "STUDENT" && req.user.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "You can only create your own degree plan",
      });
      return;
    }

    const degreePlan = await degreePlanService.createDegreePlan({ userId });

    res.status(201).json({
      success: true,
      message: "Degree plan created successfully",
      data: degreePlan,
    });
  } catch (error) {
    logger.error("Error creating degree plan:", error);
    res.status(500).json({
      success: false,
      message: "Error creating degree plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllDegreePlans = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const degreePlans = await degreePlanService.getAllDegreePlans();

    res.status(200).json({
      success: true,
      count: degreePlans.length,
      data: degreePlans,
    });
  } catch (error) {
    logger.error("Error fetching degree plans:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching degree plans",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getDegreePlanById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const degreePlan = await degreePlanService.getDegreePlanById(id);

    if (!degreePlan) {
      res.status(404).json({
        success: false,
        message: "Degree plan not found",
      });
      return;
    }

    // Students can only view their own plan
    if (req.user?.role === "STUDENT" && req.user.userId !== degreePlan.userId) {
      res.status(403).json({
        success: false,
        message: "You can only view your own degree plan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: degreePlan,
    });
  } catch (error) {
    logger.error("Error fetching degree plan:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching degree plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getMyDegreePlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    let degreePlan = await degreePlanService.getDegreePlanByUserId(
      req.user.userId
    );

    // Auto-create degree plan if it doesn't exist
    if (!degreePlan) {
      logger.info(`Auto-creating degree plan for user ${req.user.userId}`);
      degreePlan = await degreePlanService.createDegreePlan({
        userId: req.user.userId,
      });
    }

    res.status(200).json({
      success: true,
      data: degreePlan,
    });
  } catch (error) {
    logger.error("Error fetching degree plan:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching degree plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getDegreePlanByUserId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const degreePlan = await degreePlanService.getDegreePlanByUserId(userId);

    if (!degreePlan) {
      res.status(404).json({
        success: false,
        message: "Degree plan not found",
      });
      return;
    }

    // Students can only view their own plan
    if (req.user?.role === "STUDENT" && req.user.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "You can only view your own degree plan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: degreePlan,
    });
  } catch (error) {
    logger.error("Error fetching degree plan:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching degree plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateDegreePlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingPlan = await degreePlanService.getDegreePlanById(id);

    if (!existingPlan) {
      res.status(404).json({
        success: false,
        message: "Degree plan not found",
      });
      return;
    }

    // Students can only update their own plan
    if (
      req.user?.role === "STUDENT" &&
      req.user.userId !== existingPlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only update your own degree plan",
      });
      return;
    }

    const degreePlan = await degreePlanService.updateDegreePlan(id, updateData);

    res.status(200).json({
      success: true,
      message: "Degree plan updated successfully",
      data: degreePlan,
    });
  } catch (error) {
    logger.error("Error updating degree plan:", error);
    res.status(500).json({
      success: false,
      message: "Error updating degree plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteDegreePlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingPlan = await degreePlanService.getDegreePlanById(id);

    if (!existingPlan) {
      res.status(404).json({
        success: false,
        message: "Degree plan not found",
      });
      return;
    }

    // Students can only delete their own plan
    if (
      req.user?.role === "STUDENT" &&
      req.user.userId !== existingPlan.userId
    ) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own degree plan",
      });
      return;
    }

    const deleted = await degreePlanService.deleteDegreePlan(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Degree plan not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Degree plan deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting degree plan:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting degree plan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
