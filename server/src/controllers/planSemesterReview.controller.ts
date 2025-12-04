import { Request, Response, NextFunction } from "express";
import * as reviewService from "@/services/planSemesterReview.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";

export async function getAllReviewRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const requests = await reviewService.getAllReviewRequests();
    return successResponse(
      res,
      requests,
      "Review requests retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching review requests:", error);
    return errorResponse(res, "Failed to fetch review requests", 500);
  }
}

export async function getReviewRequestById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const request = await reviewService.getReviewRequestById(id);

    if (!request) {
      return errorResponse(res, "Review request not found", 404);
    }

    return successResponse(
      res,
      request,
      "Review request retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching review request:", error);
    return errorResponse(res, "Failed to fetch review request", 500);
  }
}

export async function getReviewRequestsByStudentId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { studentId } = req.params;
    const requests =
      await reviewService.getReviewRequestsByStudentId(studentId);
    return successResponse(
      res,
      requests,
      "Review requests retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching review requests:", error);
    return errorResponse(res, "Failed to fetch review requests", 500);
  }
}

export async function getReviewRequestsByMentorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { mentorId } = req.params;
    const requests = await reviewService.getReviewRequestsByMentorId(mentorId);
    return successResponse(
      res,
      requests,
      "Review requests retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching review requests:", error);
    return errorResponse(res, "Failed to fetch review requests", 500);
  }
}

export async function getReviewRequestsByAdvisorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { advisorId } = req.params;
    const requests =
      await reviewService.getReviewRequestsByAdvisorId(advisorId);
    return successResponse(
      res,
      requests,
      "Review requests retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching review requests:", error);
    return errorResponse(res, "Failed to fetch review requests", 500);
  }
}

export async function getPendingMentorReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { mentorId } = req.params;
    const requests = await reviewService.getPendingMentorReviews(mentorId);
    return successResponse(
      res,
      requests,
      "Pending mentor reviews retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching pending mentor reviews:", error);
    return errorResponse(res, "Failed to fetch pending mentor reviews", 500);
  }
}

export async function getPendingAdvisorReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { advisorId } = req.params;
    const requests = await reviewService.getPendingAdvisorReviews(advisorId);
    return successResponse(
      res,
      requests,
      "Pending advisor reviews retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching pending advisor reviews:", error);
    return errorResponse(res, "Failed to fetch pending advisor reviews", 500);
  }
}

export async function createReviewRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const requestData = req.body;
    const request = await reviewService.createReviewRequest(requestData);
    return successResponse(
      res,
      request,
      "Review request created successfully",
      201
    );
  } catch (error: any) {
    logger.error("Error creating review request:", error);
    if (error.code === "P2003") {
      return errorResponse(
        res,
        "Plan semester, student, mentor, or advisor not found",
        404
      );
    }
    return errorResponse(res, "Failed to create review request", 500);
  }
}

export async function submitMentorReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const reviewData = req.body;
    const request = await reviewService.submitMentorReview(id, reviewData);
    return successResponse(
      res,
      request,
      "Mentor review submitted successfully"
    );
  } catch (error: any) {
    logger.error("Error submitting mentor review:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Review request not found", 404);
    }
    return errorResponse(res, "Failed to submit mentor review", 500);
  }
}

export async function submitAdvisorReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const reviewData = req.body;
    const request = await reviewService.submitAdvisorReview(id, reviewData);
    return successResponse(
      res,
      request,
      "Advisor review submitted successfully"
    );
  } catch (error: any) {
    logger.error("Error submitting advisor review:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Review request not found", 404);
    }
    return errorResponse(res, "Failed to submit advisor review", 500);
  }
}

export async function deleteReviewRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await reviewService.deleteReviewRequest(id);
    return successResponse(res, null, "Review request deleted successfully");
  } catch (error: any) {
    logger.error("Error deleting review request:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Review request not found", 404);
    }
    return errorResponse(res, "Failed to delete review request", 500);
  }
}
