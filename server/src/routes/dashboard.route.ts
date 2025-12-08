import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import * as dashboardController from "@/controllers/dashboard.controller";

const router: Router = Router();

// GET /api/dashboard/student/stats - Get student dashboard statistics
router.get(
  "/student/stats",
  authenticate,
  dashboardController.getStudentDashboardStats
);

export default router;
