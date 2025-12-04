import { Router } from "express";
import * as advisorAssignmentController from "@/controllers/advisorAssignment.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import * as assignmentSchema from "@/schemas/assignment.schema";

const router: Router = Router();

router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  advisorAssignmentController.getAllAdvisorAssignments
);

router.get(
  "/advisor/:advisorId",
  authenticate,
  authorize(["ADMIN", "REGISTRAR", "ADVISOR"]),
  validate(assignmentSchema.getAdvisorAssignmentsByAdvisorIdSchema),
  advisorAssignmentController.getAdvisorAssignmentsByAdvisorId
);

router.get(
  "/student/:studentId",
  authenticate,
  validate(assignmentSchema.getAdvisorAssignmentsByStudentIdSchema),
  advisorAssignmentController.getAdvisorAssignmentsByStudentId
);

router.get(
  "/advisor/:advisorId/students",
  authenticate,
  authorize(["ADMIN", "REGISTRAR", "ADVISOR"]),
  validate(assignmentSchema.getAdvisorAssignmentsByAdvisorIdSchema),
  advisorAssignmentController.getStudentsByAdvisorId
);

router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(assignmentSchema.createAdvisorAssignmentSchema),
  advisorAssignmentController.createAdvisorAssignment
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(assignmentSchema.deleteAdvisorAssignmentSchema),
  advisorAssignmentController.deleteAdvisorAssignment
);

export default router;
