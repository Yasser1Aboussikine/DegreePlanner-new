import { Request, Response, NextFunction } from "express";
import * as mentorAssignmentService from "@/services/mentorAssignment.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";

export async function getAllMentorAssignments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const assignments = await mentorAssignmentService.getAllMentorAssignments();
    return successResponse(
      res,
      assignments,
      "Mentor assignments retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching mentor assignments:", error);
    return errorResponse(res, "Failed to fetch mentor assignments", 500);
  }
}

export async function getMentorAssignmentsByMentorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { mentorId } = req.params;
    const assignments =
      await mentorAssignmentService.getMentorAssignmentsByMentorId(mentorId);
    return successResponse(
      res,
      assignments,
      "Mentor assignments retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching mentor assignments:", error);
    return errorResponse(res, "Failed to fetch mentor assignments", 500);
  }
}

export async function getMentorAssignmentsByStudentId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { studentId } = req.params;
    const assignments =
      await mentorAssignmentService.getMentorAssignmentsByStudentId(studentId);
    return successResponse(
      res,
      assignments,
      "Mentor assignments retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching mentor assignments:", error);
    return errorResponse(res, "Failed to fetch mentor assignments", 500);
  }
}

export async function getStudentsByMentorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { mentorId } = req.params;
    const students =
      await mentorAssignmentService.getStudentsByMentorId(mentorId);
    return successResponse(res, students, "Students retrieved successfully");
  } catch (error) {
    logger.error("Error fetching students:", error);
    return errorResponse(res, "Failed to fetch students", 500);
  }
}

export async function createMentorAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const assignmentData = req.body;
    const assignment =
      await mentorAssignmentService.createMentorAssignment(assignmentData);
    return successResponse(
      res,
      assignment,
      "Mentor assignment created successfully",
      201
    );
  } catch (error: any) {
    logger.error("Error creating mentor assignment:", error);
    if (error.message === "Mentor assignment already exists for this student") {
      return errorResponse(res, error.message, 409);
    }
    if (error.code === "P2003") {
      return errorResponse(res, "Mentor or student not found", 404);
    }
    return errorResponse(res, "Failed to create mentor assignment", 500);
  }
}

export async function deleteMentorAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await mentorAssignmentService.deleteMentorAssignment(id);
    return successResponse(res, null, "Mentor assignment deleted successfully");
  } catch (error: any) {
    logger.error("Error deleting mentor assignment:", error);
    if (error.code === "P2025") {
      return errorResponse(res, "Mentor assignment not found", 404);
    }
    return errorResponse(res, "Failed to delete mentor assignment", 500);
  }
}
