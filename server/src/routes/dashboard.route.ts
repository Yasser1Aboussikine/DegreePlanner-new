import { Router } from "express";
import {
  getStudentDashboardController,
  getMentorDashboardController,
  getAdvisorDashboardController,
  getRegistrarDashboardController,
  getAdminDashboardController,
} from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/student", authenticate, getStudentDashboardController);
router.get("/mentor", authenticate, getMentorDashboardController);
router.get("/advisor", authenticate, getAdvisorDashboardController);
router.get("/registrar", authenticate, getRegistrarDashboardController);
router.get("/admin", authenticate, getAdminDashboardController);

export default router;
