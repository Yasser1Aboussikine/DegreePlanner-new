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
    const requests = await reviewService.getReviewRequestsByStudentId(
      studentId
    );
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
    const requests = await reviewService.getReviewRequestsByAdvisorId(
      advisorId
    );
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

    if (error.message?.includes("no courses")) {
      return errorResponse(res, error.message, 400);
    }

    if (error.message?.includes("not found")) {
      return errorResponse(res, error.message, 404);
    }

    if (error.code === "P2003") {
      return errorResponse(
        res,
        "Plan semester, student, mentor, or advisor not found",
        404
      );
    }

    return errorResponse(
      res,
      error.message || "Failed to create review request",
      500
    );
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

export async function createDegreePlanReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { degreePlanId } = req.body;
    const studentId = (req as any).user.userId;

    const reviewRequests = await reviewService.createDegreePlanReview(
      degreePlanId,
      studentId
    );

    return successResponse(
      res,
      reviewRequests,
      "Degree plan review request created successfully",
      201
    );
  } catch (error: any) {
    logger.error("Error creating degree plan review:", error);
    if (
      error.message &&
      (error.message.includes("not found") ||
        error.message.includes("Cannot request review") ||
        error.message.includes("only request review") ||
        error.message.includes("must have an assigned") ||
        error.message.includes("pending review requests"))
    ) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, "Failed to create degree plan review", 500);
  }
}

export async function submitBulkMentorReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { degreePlanId, approve, semesterComments, generalRejectionReason } =
      req.body;
    const mentorId = (req as any).user.userId;

    logger.info("Bulk mentor review request:", {
      degreePlanId,
      mentorId,
      approve,
      semesterCount: semesterComments?.length,
    });

    const reviews = await reviewService.submitBulkMentorReview(
      degreePlanId,
      mentorId,
      {
        approve,
        semesterComments,
        generalRejectionReason,
      }
    );

    return successResponse(
      res,
      reviews,
      approve
        ? "Degree plan approved successfully"
        : "Degree plan rejected successfully"
    );
  } catch (error: any) {
    logger.error("Error submitting bulk mentor review:", error);
    if (error.message && error.message.includes("No pending")) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(
      res,
      error.message || "Failed to submit mentor review",
      500
    );
  }
}

export async function submitBulkAdvisorReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { degreePlanId, approve, semesterComments, generalRejectionReason } =
      req.body;
    const advisorId = (req as any).user.userId;

    logger.info("Bulk advisor review request:", {
      degreePlanId,
      advisorId,
      approve,
      semesterCount: semesterComments?.length,
    });

    const reviews = await reviewService.submitBulkAdvisorReview(
      degreePlanId,
      advisorId,
      {
        approve,
        semesterComments,
        generalRejectionReason,
      }
    );

    return successResponse(
      res,
      reviews,
      approve
        ? "Degree plan approved successfully"
        : "Degree plan rejected successfully"
    );
  } catch (error: any) {
    logger.error("Error submitting bulk advisor review:", error);
    if (error.message && error.message.includes("No pending")) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(
      res,
      error.message || "Failed to submit advisor review",
      500
    );
  }
}

export async function updateReviewRequestComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { role, comment } = req.body;

    if (!role || (role !== "mentor" && role !== "advisor")) {
      return errorResponse(
        res,
        "Invalid role. Must be 'mentor' or 'advisor'",
        400
      );
    }

    const updatedRequest = await reviewService.updateReviewRequestComment(
      id,
      role,
      comment || ""
    );

    return successResponse(res, updatedRequest, "Comment updated successfully");
  } catch (error: any) {
    logger.error("Error updating review request comment:", error);
    return errorResponse(res, error.message || "Failed to update comment", 500);
  }
}

// Temporary endpoint to fix junior/senior reviews
export async function fixJuniorSeniorReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updatedRequests = await reviewService.fixJuniorSeniorReviews();
    return successResponse(
      res,
      updatedRequests,
      `Updated ${updatedRequests.length} review requests for junior/senior students`
    );
  } catch (error: any) {
    logger.error("Error fixing junior/senior reviews:", error);
    return errorResponse(res, error.message || "Failed to fix reviews", 500);
  }
}
