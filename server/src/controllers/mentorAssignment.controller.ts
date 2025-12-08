import { Request, Response, NextFunction } from "express";
import * as mentorAssignmentService from "@/services/mentorAssignment.service";
import * as emailService from "@/services/email.service";
import * as authService from "@/services/auth.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import logger from "@/config/logger";
import { AuthRequest } from "@/middlewares/auth.middleware";

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
    const students = await mentorAssignmentService.getStudentsByMentorId(
      mentorId
    );
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
    const assignment = await mentorAssignmentService.createMentorAssignment(
      assignmentData
    );
    return successResponse(
      res,
      assignment,
      "Mentor assignment created successfully",
      201
    );
  } catch (error: any) {
    logger.error("Error creating mentor assignment:", error);
    if (
      error.message &&
      (error.message.includes("already assigned to") ||
        error.message.includes("FRESHMAN") ||
        error.message.includes("SOPHOMORE"))
    ) {
      return errorResponse(res, error.message, 409);
    }
    if (error.message && error.message.includes("not found")) {
      return errorResponse(res, error.message, 404);
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

export async function getUnassignedStudents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const students = await mentorAssignmentService.getUnassignedStudents();
    return successResponse(
      res,
      students,
      "Unassigned students retrieved successfully"
    );
  } catch (error) {
    logger.error("Error fetching unassigned students:", error);
    return errorResponse(res, "Failed to fetch unassigned students", 500);
  }
}

export async function reportStudent(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { studentId } = req.params;
    const { reason } = req.body;
    const mentorId = req.user?.userId;

    if (!mentorId) {
      return errorResponse(res, "Mentor ID not found", 401);
    }

    if (!reason || reason.trim().length === 0) {
      return errorResponse(res, "Report reason is required", 400);
    }

    // Verify the mentor is assigned to this student
    const assignments =
      await mentorAssignmentService.getMentorAssignmentsByStudentId(studentId);

    const isAssigned = assignments.some(
      (assignment) => assignment.mentorId === mentorId
    );

    if (!isAssigned) {
      return errorResponse(
        res,
        "You are not assigned as a mentor to this student",
        403
      );
    }

    // Get student and mentor details
    const students = await mentorAssignmentService.getStudentsByMentorId(
      mentorId
    );
    const student = students.find((s) => s.id === studentId);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    const mentor = await authService.getUserById(mentorId);

    if (!mentor) {
      return errorResponse(res, "Mentor details not found", 404);
    }

    // Send email to admin
    try {
      logger.info("Attempting to send student report email", {
        studentName: student.name || student.email,
        studentEmail: student.email,
        mentorName: mentor.name || mentor.email,
        mentorEmail: mentor.email,
        adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      });

      await emailService.sendStudentReportEmail({
        studentName: student.name || student.email,
        studentEmail: student.email,
        mentorName: mentor.name || mentor.email,
        mentorEmail: mentor.email,
        reason: reason.trim(),
      });

      logger.info("Student report email sent successfully");

      return successResponse(
        res,
        null,
        "Student report submitted successfully. Admin has been notified."
      );
    } catch (emailError: any) {
      logger.error("Failed to send student report email:", {
        error: emailError.message,
        stack: emailError.stack,
        studentId,
        mentorId,
      });
      return successResponse(
        res,
        null,
        "Report recorded but email notification failed. Please contact admin directly."
      );
    }
  } catch (error: any) {
    logger.error("Error reporting student:", error);
    return errorResponse(res, "Failed to report student", 500);
  }
}
