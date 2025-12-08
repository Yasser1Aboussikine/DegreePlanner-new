import { Router } from "express";
import * as mentorAssignmentController from "@/controllers/mentorAssignment.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import * as assignmentSchema from "@/schemas/assignment.schema";

const router: Router = Router();

router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  mentorAssignmentController.getAllMentorAssignments
);

router.get(
  "/mentor/:mentorId",
  authenticate,
  authorize(["ADMIN", "REGISTRAR", "MENTOR"]),
  validate(assignmentSchema.getMentorAssignmentsByMentorIdSchema),
  mentorAssignmentController.getMentorAssignmentsByMentorId
);

router.get(
  "/student/:studentId",
  authenticate,
  validate(assignmentSchema.getMentorAssignmentsByStudentIdSchema),
  mentorAssignmentController.getMentorAssignmentsByStudentId
);

router.get(
  "/mentor/:mentorId/students",
  authenticate,
  authorize(["ADMIN", "REGISTRAR", "MENTOR"]),
  validate(assignmentSchema.getMentorAssignmentsByMentorIdSchema),
  mentorAssignmentController.getStudentsByMentorId
);

router.get(
  "/unassigned-students",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  mentorAssignmentController.getUnassignedStudents
);

router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(assignmentSchema.createMentorAssignmentSchema),
  mentorAssignmentController.createMentorAssignment
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  validate(assignmentSchema.deleteMentorAssignmentSchema),
  mentorAssignmentController.deleteMentorAssignment
);

router.post(
  "/report/:studentId",
  authenticate,
  authorize(["MENTOR"]),
  mentorAssignmentController.reportStudent
);

export default router;
