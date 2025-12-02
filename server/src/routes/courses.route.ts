import { Router } from "express";
import * as coursesController from "../controllers/courses.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  requireAdmin,
  requireAdminOrAdvisor,
} from "../middlewares/authorize.middleware";

const coursesRouter: Router = Router();

// Collection routes - Public or student accessible
coursesRouter.get("/", coursesController.getAllCourses);
coursesRouter.get("/labels", coursesController.getAllNodeLabels);
// coursesRouter.get("/disciplines", coursesController.getAllDisciplines);
// coursesRouter.get(
//   "/disciplines/:label",
//   coursesController.getDisciplinesByLabel
// );
coursesRouter.get("/search", coursesController.searchCourses);

// Create course - Only ADMIN can create courses
coursesRouter.post(
  "/",
  authenticate,
  requireAdmin,
  coursesController.createCourse
);

// Filters
coursesRouter.get("/label/:label", coursesController.getCoursesByLabel);
coursesRouter.get(
  "/discipline/:discipline",
  coursesController.getCoursesByDiscipline
);
coursesRouter.get(
  "/code/:course_code",
  coursesController.getCourseByCourseCode
);

// Single resource
coursesRouter.get("/:id", coursesController.getCourseById);
// Update and delete - Only ADMIN can modify courses
coursesRouter.put(
  "/:id",
  authenticate,
  requireAdmin,
  coursesController.updateCourse
);
coursesRouter.delete(
  "/:id",
  authenticate,
  requireAdmin,
  coursesController.deleteCourse
);

// Prerequisite / dependent relationships - Read operations are public
coursesRouter.get(
  "/:id/prerequisites",
  coursesController.getCoursePrerequisites
);
coursesRouter.get("/:id/dependents", coursesController.getCourseDependents);
coursesRouter.get(
  "/:id/prerequisite-chain",
  coursesController.getPrerequisiteChain
);
coursesRouter.get("/:id/dependent-chain", coursesController.getDependentChain);

// Modify prerequisites - Only ADMIN or ADVISOR can modify course relationships
coursesRouter.post(
  "/:id/prerequisites",
  authenticate,
  requireAdminOrAdvisor,
  coursesController.addPrerequisite
);
coursesRouter.delete(
  "/:id/prerequisites/:prerequisiteId",
  authenticate,
  requireAdminOrAdvisor,
  coursesController.removePrerequisite
);

export default coursesRouter;
