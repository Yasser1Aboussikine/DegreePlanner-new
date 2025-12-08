import { Router } from "express";
import * as plannedCourseController from "../controllers/plannedCourse.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdminOrAdvisor } from "../middlewares/authorize.middleware";

const plannedCourseRouter: Router = Router();

// All planned course operations require authentication
// Students can only access their own planned courses
// Admin and Advisor can access all planned courses

// Get all planned courses - Admin/Advisor only
plannedCourseRouter.get(
  "/",
  authenticate,
  requireAdminOrAdvisor,
  plannedCourseController.getAllPlannedCourses
);

// Get planned courses by plan semester ID - Students can only get their own
plannedCourseRouter.get(
  "/semester/:planSemesterId",
  authenticate,
  plannedCourseController.getPlannedCoursesByPlanSemesterId
);

// Create planned course - Any authenticated user
plannedCourseRouter.post(
  "/",
  authenticate,
  plannedCourseController.createPlannedCourse
);

// Get dependent courses for a planned course - Students can only get their own
// MUST come before /:id route
plannedCourseRouter.get(
  "/:id/dependents",
  authenticate,
  plannedCourseController.getPlannedCourseDependents
);

// Delete planned course with all dependents - Students can only delete their own
// MUST come before /:id route
plannedCourseRouter.delete(
  "/:id/with-dependents",
  authenticate,
  plannedCourseController.deletePlannedCourseWithDependents
);

// Get planned course by ID - Students can only get their own
plannedCourseRouter.get(
  "/:id",
  authenticate,
  plannedCourseController.getPlannedCourseById
);

// Update planned course - Students can only update their own
plannedCourseRouter.put(
  "/:id",
  authenticate,
  plannedCourseController.updatePlannedCourse
);

// Delete planned course - Students can only delete their own
plannedCourseRouter.delete(
  "/:id",
  authenticate,
  plannedCourseController.deletePlannedCourse
);

export default plannedCourseRouter;
