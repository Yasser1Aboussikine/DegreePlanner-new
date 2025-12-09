import { Response } from "express";
import {
  getStudentDashboard,
  getMentorDashboard,
  getAdvisorDashboard,
  getRegistrarDashboard,
  getAdminDashboard,
} from "../services/dashboard.service";
import { Role } from "@/generated/prisma/enums";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getStudentDashboardController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.role !== Role.STUDENT) {
      return res.status(403).json({ message: "Only students can access student dashboard" });
    }

    const dashboardData = await getStudentDashboard(userId);

    return res.status(200).json({
      message: "Student dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return res.status(500).json({ message: "Failed to fetch student dashboard" });
  }
};

export const getMentorDashboardController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.role !== Role.MENTOR) {
      return res.status(403).json({ message: "Only mentors can access mentor dashboard" });
    }

    const dashboardData = await getMentorDashboard(userId);

    return res.status(200).json({
      message: "Mentor dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching mentor dashboard:", error);
    return res.status(500).json({ message: "Failed to fetch mentor dashboard" });
  }
};

export const getAdvisorDashboardController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.role !== Role.ADVISOR) {
      return res.status(403).json({ message: "Only advisors can access advisor dashboard" });
    }

    const dashboardData = await getAdvisorDashboard(userId);

    return res.status(200).json({
      message: "Advisor dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching advisor dashboard:", error);
    return res.status(500).json({ message: "Failed to fetch advisor dashboard" });
  }
};

export const getRegistrarDashboardController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.role !== Role.REGISTRAR) {
      return res.status(403).json({ message: "Only registrars can access registrar dashboard" });
    }

    const dashboardData = await getRegistrarDashboard();

    return res.status(200).json({
      message: "Registrar dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching registrar dashboard:", error);
    return res.status(500).json({ message: "Failed to fetch registrar dashboard" });
  }
};

export const getAdminDashboardController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Only admins can access admin dashboard" });
    }

    const dashboardData = await getAdminDashboard();

    return res.status(200).json({
      message: "Admin dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    return res.status(500).json({ message: "Failed to fetch admin dashboard" });
  }
};
