import { Request, Response, NextFunction } from "express";
import * as advisorAssignmentService from "@/services/advisorAssignment.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";

export async function getAllAdvisorAssignments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const assignments =
      await advisorAssignmentService.getAllAdvisorAssignments();
    return successResponse(
      res,
      assignments,
      "Advisor assignments retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching advisor assignments:", error);
    return errorResponse(res, "Failed to fetch advisor assignments", 500);
  }
}

export async function getAdvisorAssignmentsByAdvisorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { advisorId } = req.params;
    const assignments =
      await advisorAssignmentService.getAdvisorAssignmentsByAdvisorId(
        advisorId
      );
    return successResponse(
      res,
      assignments,
      "Advisor assignments retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching advisor assignments:", error);
    return errorResponse(res, "Failed to fetch advisor assignments", 500);
  }
}

export async function getAdvisorAssignmentsByStudentId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { studentId } = req.params;
    const assignments =
      await advisorAssignmentService.getAdvisorAssignmentsByStudentId(
        studentId
      );
    return successResponse(
      res,
      assignments,
      "Advisor assignments retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching advisor assignments:", error);
    return errorResponse(res, "Failed to fetch advisor assignments", 500);
  }
}

export async function getStudentsByAdvisorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { advisorId } = req.params;
    const students =
      await advisorAssignmentService.getStudentsByAdvisorId(advisorId);
    return successResponse(res, students, "Students retrieved successfully");
  } catch (error) {
    logger.error("Error fetching students:", error);
    return errorResponse(res, "Failed to fetch students", 500);
  }
}

export async function createAdvisorAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const assignmentData = req.body;
    const assignment =
      await advisorAssignmentService.createAdvisorAssignment(assignmentData);
    return successResponse(
      res,
      assignment,
      "Advisor assignment created successfully",
      201
    );
  } catch (error: any) {
    logger.error("Error creating advisor assignment:", error);
    if (
      error.message === "Advisor assignment already exists for this student"
    ) {
      return errorResponse(res, error.message, 409);
    }
    if (error.code === "P2003") {
      return errorResponse(res, "Advisor or student not found", 404);
    }
    return errorResponse(res, "Failed to create advisor assignment", 500);
  }
}

export async function deleteAdvisorAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await advisorAssignmentService.deleteAdvisorAssignment(id);
    return successResponse(
      res,
      null,
      "Advisor assignment deleted successfully"
    );
  } catch (error: any) {
    logger.error("Error deleting advisor assignment:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Advisor assignment not found", 404);
    }
    return errorResponse(res, "Failed to delete advisor assignment", 500);
  }
}
