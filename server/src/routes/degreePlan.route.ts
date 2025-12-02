import { Router } from "express";
import * as degreePlanController from "../controllers/degreePlan.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  requireAdmin,
  requireAdminOrAdvisor,
} from "../middlewares/authorize.middleware";

const degreePlanRouter: Router = Router();

// All degree plan operations require authentication
// Students can only access their own plan
// Admin and Advisor can access all plans

// Get all degree plans - Admin/Advisor only
degreePlanRouter.get(
  "/",
  authenticate,
  requireAdminOrAdvisor,
  degreePlanController.getAllDegreePlans
);

// Get my degree plan - Any authenticated user
degreePlanRouter.get(
  "/me",
  authenticate,
  degreePlanController.getMyDegreePlan
);

// Get degree plan by user ID - Students can only get their own, Admin/Advisor can get any
degreePlanRouter.get(
  "/user/:userId",
  authenticate,
  degreePlanController.getDegreePlanByUserId
);

// Create degree plan - Any authenticated user
degreePlanRouter.post(
  "/",
  authenticate,
  degreePlanController.createDegreePlan
);

// Get degree plan by ID - Students can only get their own, Admin/Advisor can get any
degreePlanRouter.get(
  "/:id",
  authenticate,
  degreePlanController.getDegreePlanById
);

// Update degree plan - Students can only update their own, Admin/Advisor can update any
degreePlanRouter.put(
  "/:id",
  authenticate,
  degreePlanController.updateDegreePlan
);

// Delete degree plan - Students can only delete their own, Admin can delete any
degreePlanRouter.delete(
  "/:id",
  authenticate,
  degreePlanController.deleteDegreePlan
);

export default degreePlanRouter;
