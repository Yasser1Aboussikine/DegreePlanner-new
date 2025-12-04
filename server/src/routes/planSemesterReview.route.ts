import { Router } from "express";
import * as reviewController from "@/controllers/planSemesterReview.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import * as reviewSchema from "@/schemas/planSemesterReview.schema";

const router: Router = Router();

router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "REGISTRAR"]),
  reviewController.getAllReviewRequests
);

router.get("/:id", authenticate, reviewController.getReviewRequestById);

router.get(
  "/student/:studentId",
  authenticate,
  validate(reviewSchema.getReviewRequestsByStudentIdSchema),
  reviewController.getReviewRequestsByStudentId
);

router.get(
  "/mentor/:mentorId",
  authenticate,
  authorize(["ADMIN", "REGISTRAR", "MENTOR"]),
  validate(reviewSchema.getReviewRequestsByMentorIdSchema),
  reviewController.getReviewRequestsByMentorId
);

router.get(
  "/advisor/:advisorId",
  authenticate,
  authorize(["ADMIN", "REGISTRAR", "ADVISOR"]),
  validate(reviewSchema.getReviewRequestsByAdvisorIdSchema),
  reviewController.getReviewRequestsByAdvisorId
);

router.get(
  "/mentor/:mentorId/pending",
  authenticate,
  authorize(["ADMIN", "REGISTRAR", "MENTOR"]),
  validate(reviewSchema.getReviewRequestsByMentorIdSchema),
  reviewController.getPendingMentorReviews
);

router.get(
  "/advisor/:advisorId/pending",
  authenticate,
  authorize(["ADMIN", "REGISTRAR", "ADVISOR"]),
  validate(reviewSchema.getReviewRequestsByAdvisorIdSchema),
  reviewController.getPendingAdvisorReviews
);

router.post(
  "/",
  authenticate,
  validate(reviewSchema.createReviewRequestSchema),
  reviewController.createReviewRequest
);

router.post(
  "/:id/mentor-review",
  authenticate,
  authorize(["ADMIN", "MENTOR"]),
  validate(reviewSchema.submitMentorReviewSchema),
  reviewController.submitMentorReview
);

router.post(
  "/:id/advisor-review",
  authenticate,
  authorize(["ADMIN", "ADVISOR"]),
  validate(reviewSchema.submitAdvisorReviewSchema),
  reviewController.submitAdvisorReview
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN", "STUDENT"]),
  validate(reviewSchema.deleteReviewRequestSchema),
  reviewController.deleteReviewRequest
);

export default router;
