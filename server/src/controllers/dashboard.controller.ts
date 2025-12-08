import { Response } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import * as dashboardService from "@/services/dashboard.service";
import logger from "../config/logger";

export const getStudentDashboardStats = async (
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

    // Only students can access their own dashboard
    if (req.user.role !== "STUDENT") {
      res.status(403).json({
        success: false,
        message: "Only students can access student dashboard",
      });
      return;
    }

    const stats = await dashboardService.getStudentDashboardStats(
      req.user.userId
    );

    if (!stats) {
      res.status(404).json({
        success: false,
        message: "No degree plan found for this student",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Error fetching student dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
