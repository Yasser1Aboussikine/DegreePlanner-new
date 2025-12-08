import { Router } from "express";
import * as eligibleCoursesController from "../controllers/eligibleCourses.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  requireAdminOrAdvisorOrMentor,
  authorize,
} from "../middlewares/authorize.middleware";

const eligibleCoursesRouter: Router = Router();

console.log("🔍 Registering eligible courses routes");

eligibleCoursesRouter.get(
  "/me",
  (req, res, next) => {
    console.log("🎯 Hit /me route");
    next();
  },
  authenticate,
  authorize(["STUDENT", "MENTOR"]),
  eligibleCoursesController.getEligibleCoursesForCurrentUser
);

eligibleCoursesRouter.get(
  "/user/:userId",
  authenticate,
  requireAdminOrAdvisorOrMentor,
  eligibleCoursesController.getEligibleCoursesForUser
);

eligibleCoursesRouter.get(
  "/degree-plan/:degreePlanId",
  authenticate,
  requireAdminOrAdvisorOrMentor,
  eligibleCoursesController.getEligibleCoursesForDegreePlan
);

eligibleCoursesRouter.get(
  "/check/:courseCode",
  authenticate,
  authorize(["STUDENT", "MENTOR"]),
  eligibleCoursesController.checkCourseEligibility
);

eligibleCoursesRouter.get(
  "/relationships",
  authenticate,
  authorize(["STUDENT", "MENTOR"]),
  eligibleCoursesController.getAllCourseRelationships
);

export default eligibleCoursesRouter;
