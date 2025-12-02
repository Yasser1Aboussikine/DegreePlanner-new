import { Router } from "express";
import * as planSemesterController from "../controllers/planSemester.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  requireAdminOrAdvisor,
} from "../middlewares/authorize.middleware";

const planSemesterRouter: Router = Router();

// All plan semester operations require authentication
// Students can only access their own semesters
// Admin and Advisor can access all semesters

// Get all plan semesters - Admin/Advisor only
planSemesterRouter.get(
  "/",
  authenticate,
  requireAdminOrAdvisor,
  planSemesterController.getAllPlanSemesters
);

// Get plan semesters by degree plan ID - Students can only get their own
planSemesterRouter.get(
  "/degree-plan/:degreePlanId",
  authenticate,
  planSemesterController.getPlanSemestersByDegreePlanId
);

// Create plan semester - Any authenticated user
planSemesterRouter.post(
  "/",
  authenticate,
  planSemesterController.createPlanSemester
);

// Get plan semester by ID - Students can only get their own
planSemesterRouter.get(
  "/:id",
  authenticate,
  planSemesterController.getPlanSemesterById
);

// Update plan semester - Students can only update their own
planSemesterRouter.put(
  "/:id",
  authenticate,
  planSemesterController.updatePlanSemester
);

// Delete plan semester - Students can only delete their own
planSemesterRouter.delete(
  "/:id",
  authenticate,
  planSemesterController.deletePlanSemester
);

export default planSemesterRouter;
